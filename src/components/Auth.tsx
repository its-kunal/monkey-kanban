"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";

import Image from "next/image";
import MonkeySVG from "@/assets/monkey.svg";
import { auth } from "@/lib/firebase";
import theme from "@/config/theme";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const signInWithGoogleCb = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.replace("/");
      setLoading(false);
    } catch {
      // empty
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex items-center gap-8 flex-col">
        <div className="flex flex-col items-center">
          <h1 className="text-center font-bold text-4xl" style={{ color: theme.accent }}>
            Welcome to Monkey Kanban
          </h1>
          <Image src={MonkeySVG} height={400} width={400} alt="" priority />
        </div>
        <button
          onClick={signInWithGoogleCb}
          className="px-4 py-2 rounded-xl font-bold"
          style={{
            backgroundColor: theme.primary,
            color: "white",
          }}
          disabled={loading}
        >
          Sign In With Google
        </button>
      </div>
    </div>
  );
}
