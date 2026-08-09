"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { cn } from "~/lib/utils";

type FileUploadProps = {
  /** Current file URL, "" when none. */
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
};

/**
 * Click-or-drop upload zone that POSTs to /api/upload (admin-only) and hands
 * the stored file's URL back through onChange. Shows a preview when the
 * current value looks like an image.
 */
export function FileUpload({
  value,
  onChange,
  accept = "image/*",
  maxSizeMB = 8,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const upload = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Files must be ${maxSizeMB} MB or smaller.`);
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Upload failed.");
      }
      onChange(data.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) void upload(file);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          // Allow re-selecting the same file after a failed upload.
          e.target.value = "";
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "border-ink/20 hover:border-ink block w-full border border-dashed p-4 text-left transition disabled:opacity-60",
          dragging && "border-ink bg-ink/5",
        )}
      >
        {value ? (
          <span className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin
                preview of an arbitrary just-uploaded URL; next/image needs
                every host allowlisted. */}
            <img
              src={value}
              alt=""
              className="border-ink/10 h-16 w-24 shrink-0 border object-cover"
            />
            <span className="font-inclusive text-ink/60 text-[0.6rem] tracking-[0.15em] uppercase">
              {uploading ? "Uploading…" : "Click or drop to replace"}
            </span>
          </span>
        ) : (
          <span className="font-inclusive text-ink/60 block py-4 text-center text-[0.6rem] tracking-[0.15em] uppercase">
            {uploading ? "Uploading…" : "Click or drop a file to upload"}
          </span>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="font-inclusive text-ink/40 hover:text-flame mt-2 text-[0.6rem] tracking-[0.15em] uppercase transition"
        >
          Remove
        </button>
      )}
    </div>
  );
}
