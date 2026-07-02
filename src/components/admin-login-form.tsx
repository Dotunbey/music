"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction, type AdminLoginState } from "@/actions/admin-auth";
import { AnimatedError } from "@/components/motion-primitives";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";

const initialState: AdminLoginState = { status: "idle", message: "" };

export function AdminLoginForm() {
  const [state, formAction, isSubmitting] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-lg border border-cream/12 bg-cream/[0.04] p-6 shadow-soft md:p-8"
    >
      <label className="grid gap-2">
        <span className="text-sm font-bold uppercase text-cream/82">
          Admin password
        </span>
        <input
          required
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          className={formFieldClasses}
        />
      </label>
      <AnimatedError
        id="login-error"
        message={state.status === "error" ? state.message : undefined}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 ${interactiveStateClasses}`}
      >
        <Lock aria-hidden="true" className="h-4 w-4" />
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
