import express from "express";
import cors from "cors";
import AuthRouter from "./routes/AuthRouter";
import  ensureAuthenticated from "./Middleware/Auth";
import proRoute from "./routes/proRoute";
import * as pdfjs from "pdfjs-dist";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const app = express();
const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", ensureAuthenticated, (req, res) => {
  res.send("Hello World");
});

app.use("/auth", AuthRouter);

app.get("/pre-signed-url", async (req, res) => {
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
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 });

    res.json({ url, key });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Failed to generate pre-signed URL" });
  }
});

const streamToBuffer = async (stream: any) => {
  return new Promise((resolve, reject) => {
    const chunks:any = [];
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
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n";
  }

  return text;
};


app.get("/parse-resume", async (req, res) => {
  const { key } = req.query; // The S3 key of the uploaded file

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
    // Fetch the file from S3
    const Body = await getObjectUrl(key);
    // Helper function: Convert stream to buffer

    // Convert S3 response to a Buffer
    const fileBuffer: any = await streamToBuffer(Body as Readable);

    const extractedText = await extractTextFromPdf(fileBuffer);
    // Parse the PDF content
    console.log("Extracted Text:", extractedText);
    res.json({ text: extractedText });
  } catch (error) {
    console.error("Error parsing resume:", error);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

app.use("/products", proRoute);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});