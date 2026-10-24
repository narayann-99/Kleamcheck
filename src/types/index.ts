export type AnalysisStatus = 
  | 'analyzing'
  | 'no_issue_detected'
  | 'needs_review'
  | 'high_concern'
  | 'unable_to_analyze';

export type PaymentConfirmationStatus = 'unverified';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type FindingCategory =
  | 'exact_duplicate'
  | 'similar_image'
  | 'amount_mismatch'
  | 'recipient_mismatch'
  | 'reference_reuse'
  | 'low_ocr_confidence'
  | 'missing_field'
  | 'manual_review';

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  explanation: string;
  evidenceDescription: string;
  recommendedAction: string;
}

export interface ExtractedFields {
  amount?: number;
  currency?: string;
  formattedAmount?: string;
  date?: string;
  time?: string;
  referenceNumber?: string; // UTR or Txn ID
  recipientName?: string;
  recipientUpiId?: string;
  senderName?: string;
  senderUpiId?: string;
  paymentApp?: 'Google Pay' | 'PhonePe' | 'Paytm' | 'BHIM' | 'Amazon Pay' | 'Unknown UPI';
  ocrConfidence: number; // 0.0 to 1.0
  rawText?: string;
}

export interface VerificationCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'failed' | 'skipped';
  details: string;
}

export interface DuplicateMatchInfo {
  isMatch: boolean;
  matchType: 'none' | 'exact' | 'similar';
  similarityPercentage: number;
  previousScanId?: string;
  previousTimestamp?: string;
  previousOrderId?: string;
  hammingDistance?: number;
}

export interface OrderContext {
  expectedAmount?: number;
  orderId?: string;
  expectedReference?: string;
  expectedRecipient?: string;
}

export interface ScanReport {
  id: string;
  createdAt: string;
  mode: 'demo' | 'live';
  filename: string;
  fileSizeBytes: number;
  imageDimensions?: { width: number; height: number };
  previewUrl?: string;
  analysisStatus: AnalysisStatus;
  paymentConfirmation: PaymentConfirmationStatus;
  riskLevel: RiskLevel;
  extractedFields: ExtractedFields;
  contextProvided?: OrderContext;
  duplicateMatch: DuplicateMatchInfo;
  checks: VerificationCheck[];
  findings: Finding[];
  recommendedAction: string;
  perceptualHash?: string;
}

export interface MerchantOrder {
  id: string;
  orderNumber: string;
  customerName?: string;
  expectedAmount: number;
  expectedRecipient: string;
  createdAt: string;
  status: 'pending' | 'evidence_submitted' | 'matched' | 'flagged';
  scanId?: string;
  notes?: string;
}

export interface MerchantStats {
  totalScans: number;
  flaggedReceipts: number;
  possibleDuplicates: number;
  ordersAwaitingReview: number;
}

export interface DemoPreset {
  id: string;
  title: string;
  badge: string;
  badgeType: 'clean' | 'warning' | 'danger';
  filename: string;
  description: string;
  context: OrderContext;
  mockExtracted: ExtractedFields;
  duplicateInfo: DuplicateMatchInfo;
  riskLevel: RiskLevel;
  status: AnalysisStatus;
  findings: Finding[];
  checks: VerificationCheck[];
  recommendedAction: string;
  imageMockColor: string;
}
