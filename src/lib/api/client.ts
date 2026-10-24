import { ScanReport, MerchantOrder, OrderContext, MerchantStats } from '../../types';
import { simulateAnalysis } from '../demo/demoEngine';
import { SEED_ORDERS, SEED_SCANS, SEED_MERCHANT_STATS } from '../demo/mockData';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

// Session-level in-memory store for newly created orders in frontend phase
let sessionOrders: MerchantOrder[] = [...SEED_ORDERS];
let sessionScans: ScanReport[] = [...SEED_SCANS];

export interface AnalyzeOptions {
  file: File;
  previewUrl: string;
  context?: OrderContext;
  presetId?: string;
  forceDemo?: boolean;
}

export async function analyzeScreenshot(options: AnalyzeOptions): Promise<ScanReport> {
  const { file, previewUrl, context, presetId, forceDemo } = options;

  // Use demo engine if no API base URL is configured or demo mode is explicit
  if (!API_BASE_URL || forceDemo || presetId) {
    // Artificial small delay to simulate processing steps
    await new Promise((resolve) => setTimeout(resolve, 800));
    const report = await simulateAnalysis(file, previewUrl, context, presetId);
    sessionScans.unshift(report);
    return report;
  }

  // Real backend call when VITE_API_BASE_URL is provided
  const formData = new FormData();
  formData.append('file', file);
  if (context?.orderId) formData.append('order_id', context.orderId);
  if (context?.expectedAmount) formData.append('expected_amount', String(context.expectedAmount));
  if (context?.expectedRecipient) formData.append('expected_recipient', context.expectedRecipient);
  if (context?.expectedReference) formData.append('expected_reference', context.expectedReference);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${API_BASE_URL}/api/v1/scans/analyze`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `Server returned status ${response.status}`;
      try {
        const json = JSON.parse(errText);
        if (json.detail) errMsg = json.detail;
      } catch {
        // use status text
      }
      throw new Error(errMsg);
    }

    const data = await response.json();
    return data as ScanReport;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Analysis request timed out after 20 seconds. Please check your network connection.');
    }
    throw new Error(`Connection to analysis backend failed (${API_BASE_URL}): ${err.message || err}`);
  }
}

export async function getOrders(): Promise<MerchantOrder[]> {
  if (!API_BASE_URL) {
    return [...sessionOrders];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/orders`);
    if (!res.ok) throw new Error(`Failed to load orders: ${res.statusText}`);
    return await res.json();
  } catch {
    return [...sessionOrders];
  }
}

export async function createOrder(data: {
  orderNumber: string;
  expectedAmount: number;
  expectedRecipient: string;
  customerName?: string;
  notes?: string;
}): Promise<MerchantOrder> {
  if (!API_BASE_URL) {
    const newOrder: MerchantOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: data.orderNumber.toUpperCase(),
      customerName: data.customerName || 'Customer',
      expectedAmount: data.expectedAmount,
      expectedRecipient: data.expectedRecipient,
      createdAt: 'Just now',
      status: 'pending',
      notes: data.notes || '',
    };
    sessionOrders.unshift(newOrder);
    return newOrder;
  }

  const res = await fetch(`${API_BASE_URL}/api/v1/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Order creation failed: ${err}`);
  }

  return await res.json();
}

export async function getScanHistory(): Promise<ScanReport[]> {
  if (!API_BASE_URL) {
    return [...sessionScans];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/scans`);
    if (!res.ok) throw new Error(`Failed to load scans: ${res.statusText}`);
    return await res.json();
  } catch {
    return [...sessionScans];
  }
}

export async function getMerchantStats(): Promise<MerchantStats> {
  return {
    ...SEED_MERCHANT_STATS,
    totalScans: sessionScans.length + 140,
    ordersAwaitingReview: sessionOrders.filter((o) => o.status === 'evidence_submitted' || o.status === 'pending').length,
    flaggedReceipts: sessionOrders.filter((o) => o.status === 'flagged').length + 15,
  };
}
