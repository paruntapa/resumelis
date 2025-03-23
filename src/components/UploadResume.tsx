"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadModal } from "@/components/ui/upload";
import { useEffect, useState } from "react";
import axios from "axios";
// import { BACKEND_URL, CLOUDFLARE_URL } from "@/app/config";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon } from "lucide-react";
import { BACKEND_URL } from '@/app/config';
interface UploadedFile {
    name: string;
    status: "uploaded" | "failed";
    timestamp: Date;
  }
const UploadResume = () => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [zipUrl, setZipUrl] = useState("");
    const [zipKey, setZipKey] = useState("");
    const [previewFiles, setPreviewFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleUpload = async (files: File[]) => {
      if (files.length > 1) {
        toast.error("Only one resume can be uploaded at a time.");
        return;
      }
    
      const file = files[0];
    
      // Validate file type
      if (!["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
        toast.error("Only PDF and DOCX files are supported.");
        return;
      }
    
      setIsUploading(true);
      setUploadProgress(0);
    
      try {
        // Get pre-signed URL from backend
        const res = await axios.get(`${BACKEND_URL}/pre-signed-url`, {
          params: { fileName: file.name, fileType: file.type },
        });
    
        const { url, key } = res.data;
  
        console.log(url, key, file);
        // Upload file to S3 using pre-signed URL
        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total!));
          },
        });
    
        toast.success("Resume uploaded successfully!");

        const parseRes = await axios.get(`${BACKEND_URL}/parse-resume`, {
          params: { key },
        });
    
        console.log("Extracted Text:", parseRes.data.text);
    
        // // Optional: Store extracted text in state
        // setExtractedText(parseRes.data.text);
    
        // // Store uploaded file reference (optional)
        // setUploadedFiles((prev) => [
        //   ...prev,
        //   {
        //     name: file.name,
        //     status: "uploaded" as const,
        //     timestamp: new Date(),
        //     url: `${process.env.AWS_S3_BUCKET_URL}/${key}`, // Optional: Store S3 file URL
        //   },
        // ]);
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload resume. Please try again.");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };
    

    const handleRemoveFile = (indexToRemove: number) => {
        setUploadedFiles((prev) => {
          const newFiles = prev.filter((_, index) => index !== indexToRemove);
          if (newFiles.length === 0) {
            setZipUrl("");
            setZipKey("");
          }
          return newFiles;
        });
      };
  return (
        <Card className="h-full border-none shadow-none ">
        <CardContent className="p-0">
            <motion.div
            className="grid gap-6"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1,
                },
                },
            }}
            >
            <div className="space-y-2">
                  <UploadModal
                    handleUpload={handleUpload}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                  />
                  <AnimatePresence>
                    {uploadedFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="my-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Uploaded Files ({uploadedFiles.length})
                          </p>
                          {uploadedFiles.length > 1 && (
                            <button
                              onClick={() => {
                                setUploadedFiles([]);
                                setZipUrl("");
                                setZipKey("");
                              }}
                              className="text-xs text-red-500 cursor-pointer bg-red-500/20 border border-red-500/60 px-3 py-1 rounded-lg font-semibold hover:text-red-600 transition-colors"
                            >
                              Remove all
                            </button>
                          )}
                        </div>
                        <div className="max-h-32 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                          <AnimatePresence>
                            {uploadedFiles.map((file, index) => (
                              <motion.div
                                key={`${file.name}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between text-sm p-2 rounded-md 
                                           bg-neutral-50 dark:bg-neutral-900 group hover:bg-neutral-100 
                                           dark:hover:bg-neutral-800 transition-colors"
                              >
                                <div className="flex items-center space-x-2">
                                  <motion.svg
                                    className="w-4 h-4 text-green-500 flex-shrink-0"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    <path d="M5 13l4 4L19 7" />
                                  </motion.svg>
                                  <span
                                    className="truncate max-w-[200px]"
                                    title={file.name}
                                  >
                                    {file.name}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-neutral-500">
                                    {new Date(
                                      file.timestamp
                                    ).toLocaleTimeString()}
                                  </span>
                                  <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="p-1 rounded-full hover:bg-neutral-200 cursor-pointer dark:hover:bg-neutral-700 
                                               text-neutral-400 hover:text-red-500 transition-all
                                               opacity-0 group-hover:opacity-100 focus:opacity-100
                                               focus:outline-none focus:ring-2 focus:ring-red-500/20"
                                    title="Remove file"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </motion.div>
            </CardContent>
          </Card>
  )
}

export default UploadResume