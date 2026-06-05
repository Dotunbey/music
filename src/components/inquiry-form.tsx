"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { contact, sessions, services } from "@/lib/content";

type InquiryFormProps = {
  initialTrack?: string;
};

const experienceLevels = ["Beginner", "Intermediate", "Advanced"] as const;

function trackLabel(track: string) {
  const session = sessions.find((item) => item.slug === track);
  if (session) {
    return session.title;
  }

  const service = services.find((item) => item.title === track);
  return service?.title ?? track;
}

export function InquiryForm({ initialTrack = "piano" }: InquiryFormProps) {
  const [delivery, setDelivery] = useState<"email" | "whatsapp">("email");
  const [status, setStatus] = useState("");
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const track = String(formData.get("track") ?? "");
    const experience = String(formData.get("experience") ?? "");
    const preferredTime = String(formData.get("preferredTime") ?? "");
    const message = String(formData.get("message") ?? "");

    const body = [
      "Hello Tami Bedford team,",
      "",
      `My name is ${name}.`,
      `Email: ${email}`,
      `Interested in: ${trackLabel(track)}`,
      `Experience level: ${experience}`,
      `Preferred session day/time: ${preferredTime}`,
      "",
      "Message:",
      message,
    ].join("\n");

    if (delivery === "whatsapp") {
      setStatus("Opening WhatsApp with your prepared inquiry.");
      window.location.href = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("Opening your email app with your prepared inquiry.");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      `Application inquiry: ${trackLabel(track)}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-cream/12 bg-cream/[0.04] p-5 shadow-soft md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/70">
            Full name
          </span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/70">
            Email
          </span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/70">
            Course or service
          </span>
          <select
            required
            name="track"
            defaultValue={defaultTrack}
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500"
          >
            {trackOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase text-cream/70">
            Experience level
          </span>
          <select
            required
            name="experience"
            defaultValue=""
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition focus:border-red-500"
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
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-bold uppercase text-cream/70">
            Preferred session day and time
          </span>
          <input
            required
            name="preferredTime"
            type="text"
            placeholder="Example: Saturdays, 4 PM WAT"
            className="min-h-12 rounded-md border border-cream/18 bg-ink/70 px-4 text-cream outline-none transition placeholder:text-cream/38 focus:border-red-500"
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-bold uppercase text-cream/70">
            Message
          </span>
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Share your goals, current skill level, or service brief."
            className="resize-y rounded-md border border-cream/18 bg-ink/70 px-4 py-3 text-cream outline-none transition placeholder:text-cream/38 focus:border-red-500"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold uppercase text-cream/70">
          Send through
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-cream/18 bg-cream/[0.03] px-4">
            <input
              type="radio"
              name="delivery"
              checked={delivery === "email"}
              onChange={() => setDelivery("email")}
              className="h-4 w-4 accent-red-600"
            />
            <Mail aria-hidden="true" className="h-4 w-4 text-brass" />
            <span>Email</span>
          </label>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-cream/18 bg-cream/[0.03] px-4">
            <input
              type="radio"
              name="delivery"
              checked={delivery === "whatsapp"}
              onChange={() => setDelivery("whatsapp")}
              className="h-4 w-4 accent-red-600"
            />
            <MessageCircle aria-hidden="true" className="h-4 w-4 text-brass" />
            <span>WhatsApp</span>
          </label>
        </div>
      </fieldset>

      <button
        type="submit"
        className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-600 px-5 py-3 text-sm font-bold uppercase text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 sm:w-auto"
      >
        Prepare Inquiry
      </button>
      {status ? (
        <p className="mt-4 text-sm text-cream/64" aria-live="polite">
          {status}
        </p>
      ) : null}
    </form>
  );
}
