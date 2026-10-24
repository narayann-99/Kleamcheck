# CleanCheck

> **“Verify the payment. Not just the screenshot.”**  
> *A screenshot isn't proof. Check the evidence.*

CleanCheck is a payment-evidence intelligence SaaS platform designed for individuals and merchants. It analyzes submitted payment screenshots, identifies suspicious inconsistencies, flags duplicate or visually similar receipts via perceptual hashing, and cross-references extracted details against expected order values.

---

## 📌 Architecture & Tech Stack

- **Framework**: React 19 SPA with Vite
- **Styling**: Tailwind CSS (v4) with semantic fintech palette (Indigo, Slate, Emerald, Amber, Rose)
- **Icons**: Lucide React
- **Type Safety**: TypeScript with strict typing
- **Testing**: Node.js built-in test runner (`node:test`, `node:assert/strict`) via `npx tsx --test`
- **Backend Readiness**: Python FastAPI abstraction layer with FormData image payloads and typed request/response models.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

The application runs on `http://localhost:3000`.

### 3. Build & Type Checking

```bash
npm run lint    # Type check via tsc --noEmit
npm run build   # Vite production build
```

### 4. Running Unit Tests

Run the pure rules and verification unit tests:

```bash
npx --yes tsx --test src/lib/rules.test.ts
```

---

## 🧭 Routes & Features

| Route | Description |
|---|---|
| `/` | **Landing Page**: Explains the screenshot fraud problem, 3-step workflow, feature cards, individual/merchant paths, mandatory trust disclosure, and interactive hero report preview. |
| `/check` | **Screenshot Checker**: Drag-and-drop / file browser upload zone, real file validation, image decode check, optional order context form (INR ₹ amount, order ID, payee handle), 4 instant test presets, animated progress steps, and comprehensive evidence report. |
| `/merchant` | **Merchant Overview**: Key metric cards (total scans, flagged receipts, duplicates, orders in review), risk review queue, recent scan activity ledger. |
| `/merchant/orders` | **Orders & Matching Queue**: Search and filter orders by status, Create Order modal with instant in-memory session persistence, link to scan evidence. |
| `/merchant/scans` | **Scan History & Audit**: Search by UTR or order ID, filter by category (duplicates, amount mismatches, recipient mismatches) and inspection drawer. |
| `/merchant/settings` | **Merchant Settings**: Store profile, settlement UPI handle, review notification toggles, integration status indicator, and privacy standards. |

---

## 📡 API Contract (FastAPI Integration)

The frontend communicates with a future Python FastAPI backend using `VITE_API_BASE_URL`.

### Endpoint: `POST /api/v1/scans/analyze`

**Request**: `multipart/form-data`
- `file`: Binary image (PNG, JPG, JPEG)
- `order_id`: Optional string
- `expected_amount`: Optional float
- `expected_recipient`: Optional string
- `expected_reference`: Optional string

**Response**:
```json
{
  "id": "SCAN-8491",
  "createdAt": "24 Oct 2026, 10:18 AM",
  "mode": "live",
  "filename": "gpay_receipt.png",
  "fileSizeBytes": 342100,
  "analysisStatus": "no_issue_detected",
  "paymentConfirmation": "unverified",
  "riskLevel": "low",
  "extractedFields": {
    "amount": 2450.00,
    "currency": "INR",
    "formattedAmount": "₹2,450.00",
    "date": "24 Oct 2026",
    "referenceNumber": "429812904812",
    "recipientUpiId": "cleanstore@icici",
    "paymentApp": "Google Pay",
    "ocrConfidence": 0.98
  },
  "duplicateMatch": {
    "isMatch": false,
    "matchType": "none",
    "similarityPercentage": 0
  },
  "checks": [],
  "findings": [],
  "recommendedAction": "Verify via banking app before shipping."
}
```

---

## 🔒 Security & Privacy Notice

- **No Remote Retention**: In demo mode, screenshots are decoded client-side in browser memory via temporary object URLs and revoked immediately upon cleanup.
- **No Secret Leakage**: No API keys or credentials exposed in browser client code.
- **Truth in Advertising**: CleanCheck explicitly marks payment confirmation as **Unverified** in this MVP. Independent payment confirmation requires an authorized payment-provider integration.
