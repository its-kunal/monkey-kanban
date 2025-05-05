"use client";

import React, { useEffect } from "react";

import { KanbanBoard } from "@/components/KanbanBoard";
import { useAuthContext } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  useEffect(() => {
    if (user === undefined && loading === false) {
      router.replace("/auth");
    }
  }, [loading, router, user]);
  return <>{loading === false && user && <KanbanBoard />}</>;
};

export default Page;
