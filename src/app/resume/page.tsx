import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadResume from "@/components/UploadResume";
const page = () => {
  return (
    <div className="max-w-6xl  mx-auto px-4 py-24 min-h-screen">
      <div className="m-10">
        <div className="space-y-8 ">
          <Tabs defaultValue="train" className=" items-center ">
            <TabsList className="inline-flex h-10 w-[30vw] items-center justify-start rounded-lg p-1 dark:bg-muted/50 ">
              <TabsTrigger
                value="train"
                className="data-[state=active]:bg-green-500/70 backdrop-blur-sm data-[state=active]:text-pink-50 cursor-pointer px-3  py-2.5"
              >
                Upload<span className="md:block hidden pl-1">Resume</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-8 bg-card rounded-lg">
              <TabsContent
                value="train"
                className="mt-0 focus-visible:outline-none min-w-[70vw] "
              >
                <UploadResume />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default page;
