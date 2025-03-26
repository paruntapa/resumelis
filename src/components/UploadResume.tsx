"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadModal } from "@/components/ui/upload";
import { useEffect, useState } from "react";
import axios from "axios";
// import { BACKEND_URL, CLOUDFLARE_URL } from "@/app/config";
import toast, { Toaster } from "react-hot-toast";
import { motion} from "framer-motion";
import { BACKEND_URL } from "@/app/config";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { JobCard } from "./JobCard";

interface UploadedFile {
  name: string;
  status: "uploaded" | "failed";
  timestamp: Date;
}
const UploadResume = () => {
  const [jobListings, setJobListings] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("loggedInUser")) {
      router.push("/login");
    }
  }, []);

  const handleUpload = async (files: File[]) => {
    if (files.length > 1) {
      toast.error("Only one resume can be uploaded at a time.", {
        position: "top-center",
      });
      return;
    }

    const file = files[0];

    if (
      ![
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
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
          setUploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total!)
          );
        },
      });

      const token = localStorage.getItem("loggedInUser"); // or sessionStorage.getItem("token")
      console.log("JWT Token:", token);
      const parseRes = await axios.get(`${BACKEND_URL}/parse-resume`, {
        params: { key },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(parseRes.status === 200) {
        toast.success("Resume uploaded successfully!", {
          position: "top-center"
        });
        setIsFetching(false);
      } else {
        toast.error("Failed to parse resume. Please try again.");
      }

    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleJobs = async () => {

    const token = localStorage.getItem("loggedInUser"); 
    
    console.log("JWT Token:", token);
    
    const res = await axios.get(`${BACKEND_URL}/user-job-listings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Job Listings:", res.data.jobListings);
    setJobListings(res.data.jobListings);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center pt-4 md:px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
    <Toaster/>
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <div>
            <h1 className="md:text-2xl text-xl font-semibold">
              Your Relevant Job Hunter.
            </h1>
            <p className="md:text-sm text-xs text-muted-foreground">
              Get Jobs Recommendations
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
                </div>
              </motion.div>
            </CardContent>
          </Card>

          <Card className="h-full  border-l-0 md:border-l  border-r-0 border-t-0 border-b-0 shadow-none rounded-none">
            <CardHeader>
              <CardTitle className="text-4xl ">{jobListings.length > 0 ? "Urgent Hiring!" : "No jobs found"} </CardTitle>
              <Button disabled={isFetching} onClick={handleJobs}>Fetch Jobs</Button>
            </CardHeader>
            <div className="grid scroll-auto items-center gap-5 p-6">
              {jobListings.length > 0 ? (
                jobListings.map((job, index) => <JobCard  key={index} job={job} />)
              ) : (
                <p className="text-center text-gray-500">No jobs found</p>
              )}
           </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadResume;
