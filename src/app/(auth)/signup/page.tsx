"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { BACKEND_URL } from "@/app/config";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";

function Signup() {
  const router = useRouter();
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copySignupInfo: any = { ...signupInfo };
    copySignupInfo[name] = value;
    setSignupInfo(copySignupInfo);
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return toast.error("Name, Email, and Password are required");
    }

    try {
      const url = `${BACKEND_URL}/auth/signup`;
      const response = await axios.post(url, signupInfo);

      if (response.data && response.data.success) {
        console.log("inside success");
        toast.success("Signup Successful", {
          position: "top-center",
        });
        router.push("/login");
      } else {
        toast.error(response.data?.error || "Signup Failed");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error("Signup Failed", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="containerinit">
        <h1>Signup</h1>
        <Toaster position="top-center" />
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              autoFocus
              placeholder="Enter your name..."
              value={signupInfo.name}
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
            />
          </div>
          <Button type="submit" className="bg-gray-600">
            Signup
          </Button>
          <span>
            Already have an account ?
            <p
              className="cursor-pointer hover:underline hover:text-green-600"
              onClick={() => router.push("/login")}
            >
              Login
            </p>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
