import { Container } from "@/components/Container";
import { MarqueImg } from "@/components/marquee-img";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Marquee from "react-fast-marquee";

export default function Home() {
  return (
    <div className="w-full">
      <div className="flex-col w-full pb-24">
        <Container>
          <div className="my-8">
            <h2 className="text-3xl text-center md:text-left md:text-6xl">
              <span className=" text-outline font-extrabold md:text-8xl">
                AI-SuperPowere{" "}
              </span>
              <span className="text-gray-500 font-extrabold">
                – A better way to
              </span>
              <br />
              Your Smart Path to the Right Job
            </h2>

            <p className="mt-4 text-muted-foreground text-sm">
              Boost your job search with smart recommendations and skill-based
              matching. Our AI analyzes your resume and connects you with the
              best roles tailored to your expertise.
            </p>
          </div>

          <div className="flex w-full items-center justify-evenly md:px-12 md:py-16 md:items-center md:justify-end gap-12">
            <p className="text-3xl font-semibold text-gray-900 text-center">
              250k+
              <span className="block text-xl text-muted-foreground font-normal">
                Offers Recieved
              </span>
            </p>
            <p className="text-3xl font-semibold text-gray-900 text-center">
              1.2M+
              <span className="block text-xl text-muted-foreground font-normal">
                Interview Aced
              </span>
            </p>
          </div>

          {/* image section */}
          <div className="w-full mt-4 rounded-xl bg-gray-100 h-[420px] drop-shadow-md overflow-hidden relative">
            <img
              src="/assets/img/hero.jpg"
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 px-4 py-2 rounded-md bg-white/40 backdrop-blur-md">
              Inteviews Copilot&copy;
            </div>

            <div className="hidden md:block absolute w-80 bottom-4 right-4 px-4 py-2 rounded-md bg-white/60 backdrop-blur-md">
              <h2 className="text-neutral-800 font-semibold">Developer</h2>
              <p className="text-sm text-neutral-500">
                Maximize your potential with AI-driven job suggestions that
                align with your skills and experience. Whether you're a
                developer, data scientist, or sales expert, we help you find the
                right opportunity.
              </p>

              <Button className="mt-3">
                Generate <Sparkles />
              </Button>
            </div>
          </div>
        </Container>

        {/* marquee section */}
        <div className=" w-full my-12">
          <Marquee pauseOnHover>
            <MarqueImg img="/assets/img/logo/firebase.png" />
            <MarqueImg img="/assets/img/logo/meet.png" />
            <MarqueImg img="/assets/img/logo/zoom.png" />
            <MarqueImg img="/assets/img/logo/firebase.png" />
            <MarqueImg img="/assets/img/logo/microsoft.png" />
            <MarqueImg img="/assets/img/logo/meet.png" />
            <MarqueImg img="/assets/img/logo/tailwindcss.png" />
            <MarqueImg img="/assets/img/logo/microsoft.png" />
          </Marquee>
        </div>

        <Container className="py-8 space-y-8">
          <h2 className="tracking-wide text-xl text-gray-800 font-semibold">
            Transform the Way You Job Hunt
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="col-span-1 md:col-span-3">
              <img
                src="/assets/img/office.jpg"
                alt=""
                className="w-full max-h-96 rounded-md object-cover"
              />
            </div>

            <div className="col-span-1 md:col-span-2 gap-8 max-h-96 min-h-96 w-full flex flex-col items-center justify-center text-center">
              <p className="text-center text-muted-foreground">
                Discover personalized job matches, refine your applications, and
                land interviews faster with AI-powered career insights.
              </p>

              <Link href={"/generate"} className="w-full">
                <Button className="w-3/4">
                  Generate <Sparkles className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
