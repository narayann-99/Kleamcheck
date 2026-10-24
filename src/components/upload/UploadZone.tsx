import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, AlertCircle, Check } from 'lucide-react';
import { validateImageFile } from '../../lib/rules';

interface UploadZoneProps {
  onImageSelected: (file: File, previewUrl: string, dimensions?: { width: number; height: number }) => void;
  onClear: () => void;
  selectedFile: File | null;
  previewUrl: string | null;
  dimensions?: { width: number; height: number };
  disabled?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onImageSelected,
  onClear,
  selectedFile,
  previewUrl,
  dimensions,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = useCallback(
    (file: File) => {
      setErrorMessage(null);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid file.');
        return;
      }

      setIsValidating(true);
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        setIsValidating(false);
        onImageSelected(file, objectUrl, { width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        setIsValidating(false);
        URL.revokeObjectURL(objectUrl);
        setErrorMessage('Unable to decode image. The file appears to be corrupted or is not a valid image.');
      };

      img.src = objectUrl;
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [disabled, processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
    // reset input so the same file can be re-selected if replaced
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
        id="screenshot-upload-input"
        aria-label="Upload payment receipt image"
      />

      {/* Upload Zone / Drop Zone */}
      {!selectedFile ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
            isDragOver
              ? 'border-orange-600 bg-orange-50/50 scale-[1.005]'
              : 'border-slate-300 hover:border-orange-400 bg-white hover:bg-slate-50/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center mx-auto text-orange-600 mb-4 shadow-2xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Drop your screenshot here
          </h3>
          <p className="text-sm text-slate-500 mb-3">
            Drag and drop or <span className="text-orange-600 font-medium underline underline-offset-2">browse your device</span>
          </p>

          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            <span>Supports PNG, JPG or JPEG</span>
            <span>•</span>
            <span>Max 10 MB</span>
          </div>

          {isValidating && (
            <p className="text-xs text-orange-600 font-medium mt-3 animate-pulse">
              Validating image integrity...
            </p>
          )}
        </div>
      ) : (
        /* Image Preview State */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Thumbnail Preview */}
            <div className="relative w-full sm:w-36 h-48 sm:h-36 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Payment screenshot preview"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
              <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow-xs">
                <Check className="w-3 h-3" />
              </div>
            </div>

            {/* File Details & Controls */}
            <div className="flex-1 w-full flex flex-col justify-between self-stretch">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatFileSize(selectedFile.size)}
                      {dimensions && ` • ${dimensions.width} × ${dimensions.height} px`}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Decoded
                  </span>
                </div>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Ready for perceptual hash & OCR extraction.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace Screenshot
                </button>
                <button
                  type="button"
                  onClick={onClear}
                  disabled={disabled}
                  className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state alert */}
      {errorMessage && (
        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Upload failed: </span>
            {errorMessage}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-rose-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
