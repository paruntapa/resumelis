"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// import { BACKEND_URL, CLOUDFLARE_URL } from "@/app/config";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function UploadModal({
  handleUpload,
  uploadProgress,
  isUploading,
}: {
  handleUpload: (files: File[]) => void;
  uploadProgress: number;
  isUploading: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length) await handleUpload(files);
  }, []);

  return (
    <Card className="w-full rounded-none border-none mx-auto shadow-none">
      <CardHeader className="border-b pb-4 px-0">
        <CardTitle className="md:text-xl text-lg font-semibold text-emerald-500">
          Upload Resume
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Supports PDF/Docs Resume upload
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 px-0">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 h-100 transition-all",
            isDragging
              ? "border-emerald-500 bg-emerald-100"
              : "border-muted-foreground hover:border-emerald-400",
            isUploading && "pointer-events-none opacity-80"
          )}
        >
          <CloudUploadIcon className="w-16 h-16 text-neutral-400" />

          {isUploading ? (
            <div className="w-full max-w-sm space-y-3 text-center">
              <Progress value={uploadProgress} className="h-2 w-full" />
              <p className="text-xs text-neutral-500">
                {uploadProgress < 50 ? "Preparing files..." : "Uploading..."}
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-neutral-500">
                <span className="font-medium">Drag and drop files here</span> or
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "application/pdf"; // Allow only PDF files
                  input.multiple = false; // Allow only one file at a time
                  input.onchange = async () => {
                    if (input.files?.length) {
                      const file = input.files[0];

                      // Ensure only PDFs are uploaded
                      if (file.type !== "application/pdf") {
                        toast.error("Only PDF files are supported.");
                        return;
                      }

                      await handleUpload([file]);
                    }
                  };
                  input.click();
                }}
              >
                Browse Files
              </Button>
              <p className="text-xs text-neutral-500">Supported format: PDF</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CloudUploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}
