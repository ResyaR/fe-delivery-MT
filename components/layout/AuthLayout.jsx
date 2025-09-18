"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
