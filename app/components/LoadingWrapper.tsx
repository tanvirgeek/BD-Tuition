"use client";
import { useLoading } from "./LoadingProvider";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { loading } = useLoading();

  return (
    <div className="relative">
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
