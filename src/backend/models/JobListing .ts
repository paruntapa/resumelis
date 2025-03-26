import mongoose, { Schema, Document } from "mongoose";

interface IJobListing extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Foreign key reference
  url: string;
  title: string;
  companyName: string;
  tags: string[];
  jobType: string;
  publicationDate: Date;
  salary: string;
}

const JobListingSchema = new Schema<IJobListing>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true, index: true }, // Indexed field
    url: { type: String, required: true },
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    tags: { type: [String], default: [] },
    jobType: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    salary: { type: String, required: true },
  },
  { timestamps: true }
);


JobListingSchema.index({ userId: 1, url: 1  }, { unique: true });

const JobListing = mongoose.model<IJobListing>("JobListing", JobListingSchema);
export default JobListing;
