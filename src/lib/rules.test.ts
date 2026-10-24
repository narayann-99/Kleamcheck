import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  parseAmount,
  validateImageFile,
  compareAmount,
  compareRecipient,
  calculateRiskLevel,
  validateOrderForm,
  determineAnalysisStatus,
} from './rules';
import { Finding, DuplicateMatchInfo } from '../types';

test('formatINR formats currency in Indian numbering system', () => {
  const result = formatINR(2450);
  assert.match(result, /2,450\.00/);
  assert.ok(result.includes('₹') || result.includes('INR'));

  const zeroResult = formatINR(0);
  assert.match(zeroResult, /0\.00/);

  const largeResult = formatINR(105432.5);
  assert.match(largeResult, /1,05,432\.50/);
});

test('parseAmount parses and strips symbols properly', () => {
  assert.equal(parseAmount('₹2,450.00'), 2450);
  assert.equal(parseAmount(' 1500 '), 1500);
  assert.equal(parseAmount(450.75), 450.75);
  assert.equal(parseAmount('-500'), null);
  assert.equal(parseAmount('invalid'), null);
});

test('validateImageFile checks extensions and sizes', () => {
  const validPng = validateImageFile({ name: 'receipt.png', size: 1024 * 1024, type: 'image/png' });
  assert.equal(validPng.valid, true);

  const invalidPdf = validateImageFile({ name: 'document.pdf', size: 1024, type: 'application/pdf' });
  assert.equal(invalidPdf.valid, false);
  assert.ok(invalidPdf.error?.includes('Unsupported file format'));

  const oversized = validateImageFile({ name: 'big.jpg', size: 15 * 1024 * 1024, type: 'image/jpeg' });
  assert.equal(oversized.valid, false);
  assert.ok(oversized.error?.includes('exceeds maximum allowed limit'));
});

test('compareAmount detects exact match and discrepancies', () => {
  const match = compareAmount(2450.00, 2450.00);
  assert.equal(match.match, true);
  assert.equal(match.difference, 0);

  const mismatch = compareAmount(2100.00, 2450.00);
  assert.equal(mismatch.match, false);
  assert.equal(mismatch.difference, 350.00);
});

test('compareRecipient detects matching store handles', () => {
  const match = compareRecipient('Apex Boutique / apexshop@icici', 'apexshop@icici');
  assert.equal(match.match, true);

  const mismatch = compareRecipient('Unknown Seller / someoneelse@upi', 'apexshop@icici');
  assert.equal(mismatch.match, false);
});

test('calculateRiskLevel handles duplicates and finding severities', () => {
  const exactDup: DuplicateMatchInfo = {
    isMatch: true,
    matchType: 'exact',
    similarityPercentage: 100,
  };
  assert.equal(calculateRiskLevel([], exactDup, false), 'critical');

  const findings: Finding[] = [
    {
      id: 'f1',
      category: 'amount_mismatch',
      severity: 'danger',
      title: 'Amount Mismatch',
      explanation: 'Mismatch',
      evidenceDescription: 'Evidence',
      recommendedAction: 'Action',
    },
  ];
  const noDup: DuplicateMatchInfo = { isMatch: false, matchType: 'none', similarityPercentage: 0 };
  assert.equal(calculateRiskLevel(findings, noDup, true), 'critical');
});

test('validateOrderForm validates required merchant inputs', () => {
  const invalid = validateOrderForm('', null, '');
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.orderNumber);
  assert.ok(invalid.errors.amount);
  assert.ok(invalid.errors.recipient);

  const valid = validateOrderForm('ORD-5542', 1850, 'crafts@oksbi');
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});
