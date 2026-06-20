"use client";

import { useRef, useState } from "react";
import { readImageFile } from "@/lib/profile-images";

interface ImageUploadFieldProps {
  label: string;
  description: string;
  imageUrl: string | null;
  fallbackLabel: string;
  optional?: boolean;
  disabled?: boolean;
  onUpload: (dataUrl: string) => void;
  onRemove?: () => void;
  previewClassName?: string;
}

export function ImageUploadField({
  label,
  description,
  imageUrl,
  fallbackLabel,
  optional = false,
  disabled = false,
  onUpload,
  onRemove,
  previewClassName = "w-14 h-14 rounded-full",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    try {
      const dataUrl = await readImageFile(file);
      onUpload(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload image.");
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <div
        className={`${previewClassName} border border-white/10 overflow-hidden bg-gradient-to-tr from-indigo-500 to-sky-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          fallbackLabel
        )}
      </div>

      <div className="space-y-2 min-w-0 flex-1">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-white">
            {label}
            {optional && <span className="text-white/35 font-normal"> (optional)</span>}
          </div>
          <div className="text-[10px] text-white/40">{description}</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled}
            onChange={handleFileChange}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-[10px] text-white/70 hover:text-white font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Upload Image
          </button>
          {imageUrl && onRemove && (
            <button
              type="button"
              disabled={disabled}
              onClick={onRemove}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/45 hover:text-white hover:bg-white/5 font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>

        {error && <p className="text-[10px] text-rose-400">{error}</p>}
      </div>
    </div>
  );
}
