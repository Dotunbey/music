"use client";

import { useActionState } from "react";
import {
  addInquiryNoteAction,
  type AdminNoteState,
} from "@/actions/admin-inquiries";
import { AnimatedError } from "@/components/motion-primitives";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";

const initialState: AdminNoteState = { status: "idle", message: "" };

export function AdminNoteForm({ inquiryId }: { inquiryId: string }) {
  const [state, formAction, isSubmitting] = useActionState(
    addInquiryNoteAction,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-3">
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <label className="grid gap-2">
        <span className="text-sm font-bold uppercase text-cream/60">
          Add internal note
        </span>
        <textarea
          required
          name="note"
          rows={3}
          placeholder="Called on Tuesday, prefers weekend slots..."
          className={`${formFieldClasses} py-3`}
        />
      </label>
      <AnimatedError
        id="note-error"
        message={state.status === "error" ? state.message : undefined}
      />
      {state.status === "success" ? (
        <p className="text-sm text-green-300" aria-live="polite">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`inline-flex min-h-11 w-fit items-center justify-center rounded-md border border-cream/18 px-4 py-2 text-sm font-bold uppercase hover:border-brass hover:text-brass ${interactiveStateClasses}`}
      >
        {isSubmitting ? "Saving..." : "Save Note"}
      </button>
    </form>
  );
}
