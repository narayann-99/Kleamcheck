import { ScanReport } from '../types';

export const LOCAL_STORAGE_SCANS_KEY = 'cleancheck_recent_scans';
export const MAX_STORED_SCANS = 20;

/**
 * Sanitize a ScanReport before saving to localStorage.
 * Ephemeral blob: URLs become invalid across sessions, so we replace them
 * with null or safe fallback placeholders.
 */
export function sanitizeScanReportForStorage(report: ScanReport): ScanReport {
  return {
    ...report,
    previewUrl: report.previewUrl?.startsWith('blob:') ? undefined : report.previewUrl,
  };
}

/**
 * Retrieve saved scan history from localStorage safely.
 */
export function getScanHistoryFromStorage(storage = typeof window !== 'undefined' ? window.localStorage : null): ScanReport[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(LOCAL_STORAGE_SCANS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn('Failed to parse scan history from localStorage:', err);
    return [];
  }
}

/**
 * Add or update a scan report in localStorage.
 * Keeps the most recent scans up to MAX_STORED_SCANS.
 */
export function saveScanToStorage(
  report: ScanReport,
  storage = typeof window !== 'undefined' ? window.localStorage : null
): ScanReport[] {
  if (!storage) return [];
  try {
    const current = getScanHistoryFromStorage(storage);
    const sanitized = sanitizeScanReportForStorage(report);

    // Filter out if scan already exists (deduplicate by id)
    const filtered = current.filter((item) => item.id !== report.id);

    // Prepend new scan at the start
    const updated = [sanitized, ...filtered].slice(0, MAX_STORED_SCANS);

    storage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save scan to localStorage (quota or disabled):', err);
    return getScanHistoryFromStorage(storage);
  }
}

/**
 * Remove a specific scan report by ID.
 */
export function removeScanFromStorage(
  scanId: string,
  storage = typeof window !== 'undefined' ? window.localStorage : null
): ScanReport[] {
  if (!storage) return [];
  try {
    const current = getScanHistoryFromStorage(storage);
    const updated = current.filter((item) => item.id !== scanId);
    storage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to remove scan from localStorage:', err);
    return getScanHistoryFromStorage(storage);
  }
}

/**
 * Clear all scan history from localStorage.
 */
export function clearScanHistoryFromStorage(storage = typeof window !== 'undefined' ? window.localStorage : null): void {
  if (!storage) return;
  try {
    storage.removeItem(LOCAL_STORAGE_SCANS_KEY);
  } catch (err) {
    console.warn('Failed to clear scan history from localStorage:', err);
  }
}
