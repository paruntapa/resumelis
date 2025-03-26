import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface JobProps {
  job: {
    title: string;
    companyName: string;
    jobType: string;
    salary: string;
    url: string;
  };
}

export const JobCard: React.FC<JobProps> = ({ job }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl hover:underline">
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            {job.title}
          </a>
        </CardTitle>
        <CardDescription>{job.companyName}</CardDescription>
        <CardDescription>{job.jobType}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full h-full">
        {job.salary ? (
             <div className="flex font-mono text-black/60 bg-muted rounded-lg justify-start p-3 ">
             {job.salary}
             </div>
        ):(
            <div className="flex font-mono text-black/60 bg-muted rounded-lg justify-start p-3 ">
            Check salary on the website
            </div>
        ) }
        
      </CardContent>
    </Card>
  );
};
