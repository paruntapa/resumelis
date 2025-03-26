import express, { type Request, type Response } from "express";
import cors from "cors";
import AuthRouter from "./routes/AuthRouter";
import * as pdfjs from "pdfjs-dist";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";
import { extractJobRoleAndLocation } from "./llm/gemini";
import { getRelevantJobs } from "./fetch-jobs";
import JobListing from "./models/JobListing ";
import UserModel from "./models/User";
import type { Types } from "mongoose";
import mongoose from "mongoose";
import connectDB from "./models/db";
import ensureAuthenticated from "./Middleware/Auth";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", ensureAuthenticated, (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/auth", AuthRouter);

app.get(
  "/pre-signed-url",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { fileName, fileType } = req.query;
      if (!fileName || !fileType) {
        return res.status(400).json({ error: "Missing file name or type" });
      }

      const key = `resumes/${uuidv4()}/${fileName}`;

      // Generate pre-signed URL for PUT request
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME as string,
        Key: key,
        ContentType: fileType as string,
      });

      const url = await getSignedUrl(s3, command, { expiresIn: 60 });

      res.json({ url, key });
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      res.status(500).json({ error: "Failed to generate pre-signed URL" });
    }
  }
);

const streamToBuffer = async (stream: any) => {
  return new Promise((resolve, reject) => {
    const chunks: any = [];
    stream.on("data", (chunk: any) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

const extractTextFromPdf = async (buffer: Buffer): Promise<string> => {
  // Convert Buffer to Uint8Array
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text +=
      content.items.map((item) => ("str" in item ? item.str : "")).join(" ") +
      "\n";
  }

  return text;
};

async function saveJobListings(userId: Types.ObjectId, jobData: any) {
  try {
    if (!Array.isArray(jobData)) {
      console.error("❌ Error: jobData is not an array", jobData);
      return;
    }

    const jobListings = jobData.map((job) => ({
      userId: new mongoose.Types.ObjectId(userId),
      url: job.url,
      title: job.title,
      companyName: job.company_name,
      tags: job.tags,
      jobType: job.job_type.replace("_", " ").trim(),
      publicationDate: new Date(job.publication_date),
      salary: job.salary,
    }));

    const bulkOps = jobListings.map((job) => ({
      updateOne: {
        filter: { url: job.url, userId: job.userId },
        update: { $set: job },
        upsert: true,
      },
    }));

    await JobListing.bulkWrite(bulkOps);
    console.log("Job listings saved successfully.");
  } catch (error) {
    console.error("Error saving job listings:", error);
  }
}

app.get(
  "/parse-resume",
  ensureAuthenticated,
  async (req: Request, res: Response): Promise<any> => { 
    const { key } = req.query;

    async function getObjectUrl(key: any) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      });

      const { Body } = await s3.send(command);
      if (!Body) {
        return res.status(500).json({ error: "Failed to fetch file from S3" });
      }
      return Body;
    }

    try {
      const Body = await getObjectUrl(key);

      const fileBuffer: any = await streamToBuffer(Body as Readable);

      const extractedText = await extractTextFromPdf(fileBuffer);

      const jobData: any[] = await extractJobRoleAndLocation(
        extractedText
      ).then(async (data) => {
        const role = data.role;
        console.log("Extracted Role:", role);
        console.log("Extracted Location:", data.location);
        const jobs = await getRelevantJobs(role);
        console.log("Relevant Jobs:", jobs);
        return jobs.jobs || [];
      });
      connectDB();

      const userEmail = req.user;
      console.log("User Email:", userEmail);

      const user = await UserModel.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userId: Types.ObjectId = user._id;

      console.log("User ID:", userId);

      saveJobListings(userId, jobData);

      res.json({ success: "success" });
    } catch (error) {
      console.error("Error parsing resume:", error);
      res.status(500).json({ error: "Failed to parse resume" });
    }
  }
);

app.get("/user-job-listings", ensureAuthenticated, async (req: Request, res: Response): Promise<any> => {
  try {
    const userEmail = req.user;
    connectDB();
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id;

    const jobListings = await JobListing.find({ userId })
      .sort({ publicationDate: -1 })
      .select("title companyName jobType salary publicationDate url");

    res.json({ jobListings });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
