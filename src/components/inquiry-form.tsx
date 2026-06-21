"use client";

import { useActionState, useMemo, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { sessions, services } from "@/lib/content";
import {
  initialInquiryState,
  submitInquiryAction,
} from "@/actions/submit-inquiry";

const deliveryOptions = [
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
] as const;

const experienceLevels = ["Beginner", "Intermediate", "Advanced"] as const;

type InquiryFormProps = {
  initialTrack?: string;
  sourcePath?: string;
};

export function InquiryForm({
  initialTrack = "piano",
  sourcePath = "/apply",
}: InquiryFormProps) {
  const [state, formAction, isSubmitting] = useActionState(
    submitInquiryAction,
    initialInquiryState,
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const trackOptions = useMemo(
    () => [
      ...sessions.map((session) => ({
        value: session.slug,
        label: session.title,
      })),
      ...services.map((service) => ({
        value: service.title,
        label: service.title,
      })),
    ],
    [],
  );

  const defaultTrack = trackOptions.some((option) => option.value === initialTrack)
    ? initialTrack
    : "piano";
  const submitState = state.status === "success" || state.status === "error" ? state : undefined;
  const statusClass = submitState?.status === "success" ? "text-green-300" : "text-red-300";

  function handleFormAction(formData: FormData) {
    if (siteKey && !turnstileToken) return;
    if (turnstileToken) {
      formData.set("cf-turnstile-response", turnstileToken);
    }
    formAction(formData);
  }

  return (
    <form
      action={handleFormAction}
      className="rounded-lg border border-cream/12 bg-cream/[0.04] p-5 shadow-soft md:p-8"
    >
      <input type="hidden" name="sourcePath" value={sourcePath} />
      <input
        type="hidden"
        name="consentTimestamp"
        value={new Date().toISOString()}
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <input
        type="hidden"
        name="sourceMetadata"
        value={`track=${initialTrack}`}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/82">
            Full name
          </span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500 focus-visible:outline-2 focus-visible:outline-red-300"
          />
          {submitState?.errors.name ? (
            <span className="text-sm text-red-400">{submitState.errors.name}</span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/82">
            Email
          </span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500 focus-visible:outline-2 focus-visible:outline-red-300 focus-visible:outline-2 focus-visible:outline-red-300"
          />
          {submitState?.errors.email ? (
            <span className="text-sm text-red-400">{submitState.errors.email}</span>
          ) : null}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/82">
            Course or service
          </span>
          <select
            required
            name="track"
            defaultValue={defaultTrack}
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500 focus-visible:outline-2 focus-visible:outline-red-300 focus-visible:outline-2 focus-visible:outline-red-300"
          >
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

          <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/82">
            Experience level
          </span>
          <select
            required
            name="experience"
            defaultValue=""
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500 focus-visible:outline-2 focus-visible:outline-red-300 focus-visible:outline-2 focus-visible:outline-red-300"
          >
            <option value="" disabled>
              Select level
            </option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          {submitState?.errors.experience ? (
            <span className="text-sm text-red-400">
              {submitState.errors.experience}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-bold uppercase text-cream/82">
            Preferred session day and time
          </span>
          <input
            required
            name="preferredTime"
            type="text"
            placeholder="Example: Saturdays, 4 PM WAT"
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition placeholder:text-cream/38 focus:border-red-500 focus-visible:outline-2 focus-visible:outline-red-300"
          />
          {submitState?.errors.preferredTime ? (
            <span className="text-sm text-red-400">
              {submitState.errors.preferredTime}
            </span>
          ) : null}
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-bold uppercase text-cream/82">
            Message
          </span>
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Share your goals, current skill level, or service brief."
            className="resize-y rounded-md border border-cream/18 bg-ink/70 px-4 py-3 text-cream outline-none transition placeholder:text-cream/38 focus:border-red-500 focus-visible:outline-2 focus-visible:outline-red-300"
          />
          {submitState?.errors.message ? (
            <span className="text-sm text-red-400">
              {submitState.errors.message}
            </span>
          ) : null}
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold uppercase text-cream/82">
          Send through
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {deliveryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label
                key={option.id}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-cream/18 bg-cream/[0.03] px-4"
              >
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  defaultChecked={option.id === "email"}
                  className="h-4 w-4 accent-red-600"
                />
                <Icon aria-hidden="true" className="h-4 w-4 text-brass" />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {siteKey ? (
        <div className="mt-6">
          <Turnstile
            siteKey={siteKey}
            onSuccess={setTurnstileToken}
            options={{
              theme: "dark",
              size: "flexible",
            }}
          />
          {!turnstileToken ? (
            <p className="mt-2 text-sm text-cream/70">
              Please complete the security check to submit.
            </p>
          ) : null}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting || (!!siteKey && !turnstileToken)}
        data-state={isSubmitting ? "submitting" : "idle"}
        className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </button>
      {state.status !== "idle" ? (
        <div className="mt-4 space-y-2" aria-live="polite">
          <p className={`text-sm ${statusClass}`}>{state.message}</p>
          {state.status === "success" ? (
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              {state.emailLink ? (
                <a
                  href={state.emailLink}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cream/24 px-3 text-sm transition hover:border-red-600 hover:text-red-600"
                >
                  Open Email Draft
                </a>
              ) : null}
              {state.whatsappLink ? (
                <a
                  href={state.whatsappLink}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-cream/24 px-3 text-sm transition hover:border-red-600 hover:text-red-600"
                >
                  Open WhatsApp Draft
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
