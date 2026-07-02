"use client";

import { interactiveStateClasses } from "@/lib/ui";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({ error: _error, unstable_retry }: GlobalErrorProps) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-ink px-5">
        <div className="max-w-lg text-center">
          <p className="text-sm font-bold uppercase text-red-400">Error</p>
          <h1 className="mt-3 font-display text-5xl font-black text-cream md:text-7xl">
            Something went wrong.
          </h1>
          <p className="mt-5 leading-8 text-cream/82">
            A critical error occurred. Please try again or contact support.
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
      </body>
    </html>
  );
}
