"use client";

import { useActionState, useMemo, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { sessions } from "@/lib/content";
import {
  submitInquiryAction,
  type InquirySubmitState,
} from "@/actions/submit-inquiry";
import {
  AnimatedError,
  AnimatedTurnstileSlot,
} from "@/components/motion-primitives";
import { formFieldClasses, interactiveStateClasses } from "@/lib/ui";

const fluidEase = [0.16, 1, 0.3, 1] as const;

const deliveryOptions = [
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
] as const;

const experienceLevels = ["Beginner", "Intermediate", "Advanced"] as const;

const initialInquiryState: InquirySubmitState = {
  status: "idle",
  message: "",
  errors: {},
};

type InquiryFormProps = {
  initialTrack?: string;
  sourcePath?: string;
};

function FormStep({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-cream/12 pt-6 first:border-t-0 first:pt-0">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-md border border-brass/40 bg-brass/10 font-display text-base font-black text-brass">
          {number}
        </span>
        <span className="text-sm font-bold uppercase tracking-wide text-cream/82">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export function InquiryForm({
  initialTrack = "piano",
  sourcePath = "/apply",
}: InquiryFormProps) {
  const [state, formAction, isSubmitting] = useActionState(
    submitInquiryAction,
    initialInquiryState,
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const reduceMotion = useReducedMotion();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const trackOptions = useMemo(
    () =>
      sessions.map((session) => ({
        value: session.slug,
        label: session.title,
      })),
    [],
  );

  const defaultTrack = trackOptions.some((option) => option.value === initialTrack)
    ? initialTrack
    : "piano";
  const submitState = state.status === "success" || state.status === "error" ? state : undefined;
  const controlClass = `${formFieldClasses} aria-[invalid=true]:border-red-400`;

  if (submitState?.status === "success") {
    return (
      <motion.div
        className="rounded-lg border border-cream/12 bg-cream/[0.04] p-8 text-center shadow-soft md:p-12"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: fluidEase }}
        role="status"
        aria-live="polite"
      >
        <motion.svg
          viewBox="0 0 52 52"
          className="mx-auto h-20 w-20"
          aria-hidden="true"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="var(--brass)"
            strokeWidth="2"
            initial={reduceMotion ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M15 27.2 22.4 34.4 37.5 19"
            fill="none"
            stroke="var(--red)"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduceMotion ? undefined : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
          />
        </motion.svg>
        <h3 className="mt-6 font-display text-3xl font-black text-cream md:text-4xl">
          Inquiry received.
        </h3>
        <p className="mx-auto mt-4 max-w-xl leading-8 text-cream/82">
          {submitState.message}
        </p>
        <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
          {submitState.emailLink ? (
            <a
              href={submitState.emailLink}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-cream/24 px-4 text-sm font-bold uppercase hover:border-red-600 hover:text-red-500 ${interactiveStateClasses}`}
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              Open Email Draft
            </a>
          ) : null}
          {submitState.whatsappLink ? (
            <a
              href={submitState.whatsappLink}
              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-cream/24 px-4 text-sm font-bold uppercase hover:border-red-600 hover:text-red-500 ${interactiveStateClasses}`}
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Open WhatsApp Draft
            </a>
          ) : null}
        </div>
        <p className="mt-8 text-sm leading-6 text-cream/62">
          We reply to agree on goals and timing — no payment before that.
        </p>
      </motion.div>
    );
  }

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

      <div className="grid gap-8">
        <FormStep number="01" label="About you">
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
                aria-invalid={Boolean(submitState?.errors.name)}
                aria-describedby={submitState?.errors.name ? "name-error" : undefined}
                className={controlClass}
              />
              <AnimatedError id="name-error" message={submitState?.errors.name} />
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
                aria-invalid={Boolean(submitState?.errors.email)}
                aria-describedby={submitState?.errors.email ? "email-error" : undefined}
                className={controlClass}
              />
              <AnimatedError id="email-error" message={submitState?.errors.email} />
            </label>
          </div>
        </FormStep>

        <FormStep number="02" label="Your session">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase text-cream/82">
                Session path
              </span>
              <select
                required
                name="track"
                defaultValue={defaultTrack}
                aria-invalid={Boolean(submitState?.errors.track)}
                aria-describedby={submitState?.errors.track ? "track-error" : undefined}
                className={controlClass}
              >
                {trackOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <AnimatedError id="track-error" message={submitState?.errors.track} />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase text-cream/82">
                Experience level
              </span>
              <select
                required
                name="experience"
                defaultValue=""
                aria-invalid={Boolean(submitState?.errors.experience)}
                aria-describedby={
                  submitState?.errors.experience ? "experience-error" : undefined
                }
                className={controlClass}
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
              <AnimatedError
                id="experience-error"
                message={submitState?.errors.experience}
              />
            </label>
          </div>
        </FormStep>

        <FormStep number="03" label="Schedule and goals">
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase text-cream/82">
                Preferred session day and time
              </span>
              <input
                required
                name="preferredTime"
                type="text"
                placeholder="Example: Saturdays, 4 PM WAT"
                aria-invalid={Boolean(submitState?.errors.preferredTime)}
                aria-describedby={
                  submitState?.errors.preferredTime
                    ? "preferred-time-error"
                    : undefined
                }
                className={controlClass}
              />
              <AnimatedError
                id="preferred-time-error"
                message={submitState?.errors.preferredTime}
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase text-cream/82">
                Message
              </span>
              <textarea
                required
                name="message"
                rows={5}
                placeholder="Share your goals, current skill level, or what you want to strengthen."
                aria-invalid={Boolean(submitState?.errors.message)}
                aria-describedby={
                  submitState?.errors.message ? "message-error" : undefined
                }
                className={`${controlClass} py-3`}
              />
              <AnimatedError
                id="message-error"
                message={submitState?.errors.message}
              />
            </label>

            <fieldset>
              <legend className="text-sm font-bold uppercase text-cream/82">
                Send through
              </legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <label
                      key={option.id}
                      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-cream/18 bg-cream/[0.03] px-4 has-checked:border-brass ${interactiveStateClasses}`}
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
          </div>
        </FormStep>
      </div>

      {siteKey ? (
        <div className="mt-6">
          <AnimatedTurnstileSlot>
            <Turnstile
              siteKey={siteKey}
              onSuccess={setTurnstileToken}
              options={{
                theme: "dark",
                size: "flexible",
              }}
            />
            <AnimatePresence mode="wait" initial={false}>
              {!turnstileToken ? (
                <motion.p
                  key="turnstile-help"
                  className="mt-2 overflow-hidden text-sm text-cream/70"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.22, ease: fluidEase }}
                >
                  Please complete the security check to submit.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </AnimatedTurnstileSlot>
        </div>
      ) : null}
      <AnimatedError id="form-error" message={submitState?.errors.form} />
      <button
        type="submit"
        disabled={isSubmitting || (!!siteKey && !turnstileToken)}
        data-state={isSubmitting ? "submitting" : "idle"}
        className={`motion-sheen mt-7 inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white hover:bg-red-500 sm:w-auto ${interactiveStateClasses}`}
      >
        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
      </button>
      {submitState?.status === "error" ? (
        <p className="mt-4 text-sm text-red-300" aria-live="polite">
          {submitState.message}
        </p>
      ) : null}
    </form>
  );
}
