"use client";

import { useEffect } from "react";
import { interactiveStateClasses } from "@/lib/ui";

type AdminErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function AdminError({ error, unstable_retry }: AdminErrorProps) {
  useEffect(() => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      message: "Admin dashboard error",
      error: { name: error.name, message: error.message, digest: error.digest },
    }));
  }, [error]);

  return (
    <div className="rounded-lg border border-red-500/40 bg-red-600/10 p-8 text-center">
      <p className="text-sm font-bold uppercase text-red-400">Error</p>
      <h1 className="mt-2 font-display text-3xl font-black text-cream">
        Could not load this view.
      </h1>
      <p className="mx-auto mt-3 max-w-md leading-7 text-cream/70">
        This usually means the database is unreachable. Check that DATABASE_URL
        is configured for this environment, then try again.
      </p>
      <button
        onClick={() => unstable_retry()}
        className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
      >
        Try Again
      </button>
    </div>
  );
}
