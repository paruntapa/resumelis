import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const ProfileContainer = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  if (typeof window !== 'undefined') {
    useEffect(() => {
      setLoggedInUser(localStorage.getItem("loggedInUser"))
    }, [])
    console.log('we are running on the client')
  } else {
      console.log('we are running on the server');
  }

  const router = useRouter();

  const handleloginOut = () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("name");
      setTimeout( ()=> {
        router.push("/login");
      }, 2000);
  }

  return (
    <div className="flex items-center gap-6">
      {loggedInUser ? (
        <Button
          className="bg-white  border-gray-400 shadow text-md border hover:text-white text-black"
          size={"sm"}
          onClick={handleloginOut}
        >
          Logout
        </Button>
      ):(
        <>
        <Link href={"/login"}>
          <Button
            className="bg-white  border-gray-400 shadow text-md border hover:text-white text-black"
            size={"sm"}
          >
            Login
          </Button>
        </Link>

        <Link href={"/signup"}>
          <Button size={"sm"}>Get Started</Button>
        </Link>
      </>
      )}
    </div>
  );
};
