import {
  ScanReport,
  OrderContext,
  Finding,
  VerificationCheck,
  DuplicateMatchInfo,
  ExtractedFields,
} from '../../types';
import {
  formatINR,
  compareAmount,
  compareRecipient,
  calculateRiskLevel,
  determineAnalysisStatus,
} from '../rules';
import { DEMO_PRESETS, SEED_SCANS } from './mockData';

export async function simulateAnalysis(
  file: File,
  previewUrl: string,
  context?: OrderContext,
  presetId?: string
): Promise<ScanReport> {
  // If user selected a preset, return customized preset report with user context applied
  if (presetId) {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const activeContext: OrderContext = {
        orderId: context?.orderId || preset.context.orderId,
        expectedAmount: context?.expectedAmount ?? preset.context.expectedAmount,
        expectedRecipient: context?.expectedRecipient || preset.context.expectedRecipient,
        expectedReference: context?.expectedReference || preset.context.expectedReference,
      };

      // Recalculate amount & recipient checks if user altered context
      const findings: Finding[] = [...preset.findings];
      const checks: VerificationCheck[] = [...preset.checks];

      if (activeContext.expectedAmount !== undefined && activeContext.expectedAmount !== null) {
        const amtComp = compareAmount(preset.mockExtracted.amount, activeContext.expectedAmount);
        const existingIdx = findings.findIndex((f) => f.category === 'amount_mismatch');
        if (!amtComp.match) {
          const finding: Finding = {
            id: `f-amt-${Date.now()}`,
            category: 'amount_mismatch',
            severity: 'danger',
            title: 'Order Amount Mismatch',
            explanation: amtComp.message,
            evidenceDescription: `Extracted: ${formatINR(preset.mockExtracted.amount)} vs Expected: ${formatINR(activeContext.expectedAmount)}`,
            recommendedAction: 'Verify the expected order value before confirming fulfillment.',
          };
          if (existingIdx >= 0) findings[existingIdx] = finding;
          else findings.push(finding);
        } else if (existingIdx >= 0) {
          findings.splice(existingIdx, 1);
        }
      }

      const riskLevel = calculateRiskLevel(
        findings,
        preset.duplicateInfo,
        findings.some((f) => f.category === 'amount_mismatch')
      );
      const analysisStatus = determineAnalysisStatus(riskLevel, findings.length);

      return {
        id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        mode: 'demo',
        filename: file.name || preset.filename,
        fileSizeBytes: file.size || 256000,
        previewUrl,
        analysisStatus,
        paymentConfirmation: 'unverified',
        riskLevel,
        extractedFields: preset.mockExtracted,
        contextProvided: activeContext,
        duplicateMatch: preset.duplicateInfo,
        checks,
        findings,
        recommendedAction: preset.recommendedAction,
        perceptualHash: 'd4f2a9c1e8b7036a',
      };
    }
  }

  // Generic custom upload simulated analysis
  // Extract or synthesize realistic details based on file name or context
  const targetAmount = context?.expectedAmount && context.expectedAmount > 0
    ? context.expectedAmount
    : 1450.00;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const randomUtr = `429${Math.floor(100000000 + Math.random() * 900000000)}`;
  const recipientName = context?.expectedRecipient
    ? context.expectedRecipient.split('@')[0].toUpperCase()
    : 'CleanStore Merchant';
  const recipientUpi = context?.expectedRecipient || 'cleanstore@icici';

  const extracted: ExtractedFields = {
    amount: targetAmount,
    currency: 'INR',
    formattedAmount: formatINR(targetAmount),
    date: dateStr,
    time: timeStr,
    referenceNumber: randomUtr,
    recipientName,
    recipientUpiId: recipientUpi,
    paymentApp: 'Google Pay',
    ocrConfidence: 0.96,
    rawText: `Paid to ${recipientName}\n${formatINR(targetAmount)}\nUPI Ref: ${randomUtr}\nDate: ${dateStr}, ${timeStr}`,
  };

  const duplicateMatch: DuplicateMatchInfo = {
    isMatch: false,
    matchType: 'none',
    similarityPercentage: 0,
  };

  const checks: VerificationCheck[] = [
    {
      id: 'c1',
      name: 'File Integrity & Metadata',
      description: 'Checks image encoding and EXIF timestamps',
      status: 'passed',
      details: `Valid image file (${(file.size / 1024).toFixed(0)} KB).`,
    },
    {
      id: 'c2',
      name: 'OCR Field Extraction',
      description: 'Detects amount, date, UTR reference and payee',
      status: 'passed',
      details: `Extracted ${formatINR(targetAmount)}, UTR ${randomUtr}.`,
    },
    {
      id: 'c3',
      name: 'Exact File Fingerprint',
      description: 'SHA-256 binary hash collision check',
      status: 'passed',
      details: 'No identical binary file recorded in CleanCheck registry.',
    },
    {
      id: 'c4',
      name: 'Perceptual Image Hash',
      description: 'DCT-based visual similarity comparison',
      status: 'passed',
      details: 'Visual fingerprint distance is within safe unique margin (> 24).',
    },
    {
      id: 'c5',
      name: 'Order Context Matching',
      description: 'Cross-checks extracted sum against order total',
      status: context?.expectedAmount ? 'passed' : 'skipped',
      details: context?.expectedAmount
        ? `Receipt amount matches expected ${formatINR(context.expectedAmount)}.`
        : 'No expected order amount was provided for cross-referencing.',
    },
  ];

  const findings: Finding[] = [];

  // Check recipient match if provided
  if (context?.expectedRecipient) {
    const recComp = compareRecipient(extracted.recipientUpiId, context.expectedRecipient);
    if (!recComp.match) {
      findings.push({
        id: 'f-rec-1',
        category: 'recipient_mismatch',
        severity: 'danger',
        title: 'Recipient Mismatch',
        explanation: recComp.message,
        evidenceDescription: `Extracted: ${extracted.recipientUpiId} vs Expected: ${context.expectedRecipient}`,
        recommendedAction: 'Verify store account. Recipient handles do not align.',
      });
    }
  }

  const riskLevel = calculateRiskLevel(findings, duplicateMatch, false);
  const analysisStatus = determineAnalysisStatus(riskLevel, findings.length);

  return {
    id: `SCAN-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: `${dateStr} ${timeStr}`,
    mode: 'demo',
    filename: file.name,
    fileSizeBytes: file.size,
    previewUrl,
    analysisStatus,
    paymentConfirmation: 'unverified',
    riskLevel,
    extractedFields: extracted,
    contextProvided: context,
    duplicateMatch,
    checks,
    findings,
    recommendedAction: findings.length === 0
      ? 'No immediate visual or duplicate issues detected. Verify via your bank/UPI business account before order fulfillment.'
      : 'Review flagged warnings before taking action.',
    perceptualHash: 'c7b41982ea01f92c',
  };
}
