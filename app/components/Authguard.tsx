"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useAuthStore, useRegisterNavigation } from "@/store/store";
import { fetchUser } from "@/lib/api-calls";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { setIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (pathName === "/login" || pathName === "/register" || pathName === "/") {
        } else {
          router.replace("/login");
        }

        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);

        fetchUser(user.uid)



        if (pathName === "/login" || pathName === "/register" || pathName === "/") {
          router.replace("/dashboard");
        } else {
        }
      }

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });

    return () => unsubscribe(); // Cleanup Firebase listener
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>); // Show loading while auth state is checked
  }

  return <>{children}</>; // Render children if authenticated
}