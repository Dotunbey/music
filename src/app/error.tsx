"use client";

import { useEffect } from "react";
import { interactiveStateClasses } from "@/lib/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      message: "Uncaught error in route segment",
      error: { name: error.name, message: error.message, digest: error.digest },
    }));
  }, [error]);

  return (
    <section className="flex flex-1 items-center justify-center bg-ink px-5 py-28">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-bold uppercase text-red-400">Error</p>
        <h1 className="mt-3 font-display text-5xl font-black text-cream md:text-7xl">
          Something went wrong.
        </h1>
        <p className="mt-5 leading-8 text-cream/82">
          An unexpected error occurred. Please try again or contact support.
        </p>
        <div className="mt-8">
          <button
            onClick={() => unstable_retry()}
            className={`inline-flex min-h-12 items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
          >
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}
