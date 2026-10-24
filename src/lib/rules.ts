import { Finding, DuplicateMatchInfo, RiskLevel, AnalysisStatus } from '../types';

/**
 * Format a number into standard Indian Rupee format (₹xx,xx,xxx.xx)
 */
export function formatINR(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `₹${formatted}`;
}

/**
 * Safely parse an amount string into a non-negative number. Returns null if invalid or negative.
 */
export function parseAmount(input: string | number): number | null {
  if (typeof input === 'number') {
    return input >= 0 ? input : null;
  }
  if (!input) return null;
  const clean = input.replace(/[₹,\s]/g, '').trim();
  const val = parseFloat(clean);
  if (isNaN(val) || val < 0) {
    return null;
  }
  return Math.round(val * 100) / 100;
}

/**
 * Validate image file size and MIME type before processing
 */
export function validateImageFile(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file format (${ext || 'unknown'}). Please upload a PNG, JPG, or JPEG image.`,
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes).',
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds maximum allowed limit of 10 MB.`,
    };
  }

  return { valid: true };
}

/**
 * Compare extracted amount against expected order amount
 */
export function compareAmount(
  extracted?: number | null,
  expected?: number | null
): { match: boolean; difference: number; message: string } {
  if (expected === undefined || expected === null || isNaN(expected)) {
    return { match: true, difference: 0, message: 'No expected order amount provided for comparison.' };
  }
  if (extracted === undefined || extracted === null || isNaN(extracted)) {
    return { match: false, difference: expected, message: 'Could not extract amount from the receipt image.' };
  }

  const diff = Math.abs(extracted - expected);
  // Allow 0.01 tolerance for floating point rounding
  if (diff < 0.05) {
    return {
      match: true,
      difference: 0,
      message: `Amount matches expected order (${formatINR(expected)}).`,
    };
  }

  return {
    match: false,
    difference: diff,
    message: `Amount mismatch: Receipt indicates ${formatINR(extracted)} but expected ${formatINR(expected)} (difference of ${formatINR(diff)}).`,
  };
}

/**
 * Compare extracted recipient name / UPI handle against expected merchant details
 */
export function compareRecipient(
  extracted?: string | null,
  expected?: string | null
): { match: boolean; message: string } {
  if (!expected || !expected.trim()) {
    return { match: true, message: 'No expected recipient specified for comparison.' };
  }
  if (!extracted || !extracted.trim()) {
    return { match: false, message: 'Recipient name/UPI could not be read clearly from the screenshot.' };
  }

  const cleanExtracted = extracted.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanExpected = expected.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (cleanExtracted.includes(cleanExpected) || cleanExpected.includes(cleanExtracted)) {
    return {
      match: true,
      message: `Recipient matches expected store handle: "${expected}".`,
    };
  }

  return {
    match: false,
    message: `Recipient mismatch: Receipt shows "${extracted}" which does not match expected store "${expected}".`,
  };
}

/**
 * Calculate overall risk level based on duplicate signals, mismatches, and severity of findings
 */
export function calculateRiskLevel(
  findings: Finding[],
  duplicate: DuplicateMatchInfo,
  amountMismatch: boolean
): RiskLevel {
  // If exact duplicate or critical amount mismatch with multiple danger findings
  if (duplicate.matchType === 'exact') {
    return 'critical';
  }

  const hasDanger = findings.some((f) => f.severity === 'danger');
  const warningCount = findings.filter((f) => f.severity === 'warning').length;

  if (amountMismatch && hasDanger) {
    return 'critical';
  }

  if (amountMismatch || hasDanger || duplicate.matchType === 'similar') {
    return 'high';
  }

  if (warningCount >= 2) {
    return 'medium';
  }

  if (warningCount === 1) {
    return 'low';
  }

  return 'low';
}

/**
 * Determine high level analysis status from risk level
 */
export function determineAnalysisStatus(riskLevel: RiskLevel, findingsCount: number): AnalysisStatus {
  if (riskLevel === 'critical' || riskLevel === 'high') {
    return 'high_concern';
  }
  if (riskLevel === 'medium' || findingsCount > 0) {
    return 'needs_review';
  }
  return 'no_issue_detected';
}

/**
 * Validate merchant order creation fields
 */
export function validateOrderForm(
  orderNumber: string,
  amount: number | null,
  recipient: string
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!orderNumber || !orderNumber.trim()) {
    errors.orderNumber = 'Order number is required (e.g. ORD-9821).';
  } else if (orderNumber.trim().length < 3) {
    errors.orderNumber = 'Order number must be at least 3 characters.';
  }

  if (amount === null || isNaN(amount) || amount <= 0) {
    errors.amount = 'Please enter a valid positive expected amount in INR.';
  }

  if (!recipient || !recipient.trim()) {
    errors.recipient = 'Expected recipient or UPI ID is required (e.g. merchant@icici).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
