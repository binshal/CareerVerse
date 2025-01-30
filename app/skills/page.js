import { Navbar } from "@/components/Pages/Navbar";
import React from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
} from "@clerk/nextjs";
import SkillsBody from "@/components/skills/SkillsBody";

const page = () => {
  return (
    <>
      <ClerkProvider>
        <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-6">
          <Navbar />
          <SkillsBody/>
          </div>
        </SignedIn>
      </ClerkProvider>
    </>
  );
};

export default page;