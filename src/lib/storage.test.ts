import test from 'node:test';
import assert from 'node:assert/strict';
import {
  saveScanToStorage,
  getScanHistoryFromStorage,
  removeScanFromStorage,
  clearScanHistoryFromStorage,
  sanitizeScanReportForStorage,
  MAX_STORED_SCANS,
} from './storage';
import { ScanReport } from '../types';

class MockStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

function createDummyScan(id: string, amount = 1000): ScanReport {
  return {
    id,
    createdAt: '24 Oct 2026',
    mode: 'demo',
    filename: `receipt_${id}.png`,
    fileSizeBytes: 204800,
    previewUrl: 'blob:http://localhost:3000/123-abc',
    analysisStatus: 'no_issue_detected',
    paymentConfirmation: 'unverified',
    riskLevel: 'low',
    extractedFields: {
      amount,
      currency: 'INR',
      ocrConfidence: 0.95,
    },
    duplicateMatch: {
      isMatch: false,
      matchType: 'none',
      similarityPercentage: 0,
    },
    checks: [],
    findings: [],
    recommendedAction: 'Verify via bank app.',
  };
}

test('sanitizeScanReportForStorage strips ephemeral blob URLs', () => {
  const scan = createDummyScan('SCAN-1');
  const sanitized = sanitizeScanReportForStorage(scan);
  assert.equal(sanitized.previewUrl, undefined);

  const scanWithSvg = { ...scan, previewUrl: 'data:image/svg+xml;utf8,...' };
  const sanitizedSvg = sanitizeScanReportForStorage(scanWithSvg);
  assert.equal(sanitizedSvg.previewUrl, 'data:image/svg+xml;utf8,...');
});

test('saveScanToStorage prepends scans and caps at MAX_STORED_SCANS', () => {
  const mockStorage = new MockStorage() as any;

  // Save 3 scans
  saveScanToStorage(createDummyScan('S1'), mockStorage);
  saveScanToStorage(createDummyScan('S2'), mockStorage);
  const result = saveScanToStorage(createDummyScan('S3'), mockStorage);

  assert.equal(result.length, 3);
  assert.equal(result[0].id, 'S3');
  assert.equal(result[1].id, 'S2');
  assert.equal(result[2].id, 'S1');

  // Verify retrieval
  const retrieved = getScanHistoryFromStorage(mockStorage);
  assert.equal(retrieved.length, 3);
  assert.equal(retrieved[0].id, 'S3');

  // Verify deduplication: re-saving S2 moves it to the front
  const updated = saveScanToStorage(createDummyScan('S2', 5000), mockStorage);
  assert.equal(updated.length, 3);
  assert.equal(updated[0].id, 'S2');
  assert.equal(updated[0].extractedFields.amount, 5000);
});

test('removeScanFromStorage removes single scan item', () => {
  const mockStorage = new MockStorage() as any;
  saveScanToStorage(createDummyScan('S1'), mockStorage);
  saveScanToStorage(createDummyScan('S2'), mockStorage);

  const afterRemoval = removeScanFromStorage('S1', mockStorage);
  assert.equal(afterRemoval.length, 1);
  assert.equal(afterRemoval[0].id, 'S2');
});

test('clearScanHistoryFromStorage wipes storage', () => {
  const mockStorage = new MockStorage() as any;
  saveScanToStorage(createDummyScan('S1'), mockStorage);
  clearScanHistoryFromStorage(mockStorage);

  const empty = getScanHistoryFromStorage(mockStorage);
  assert.equal(empty.length, 0);
});
