import { services, sessions } from "@/lib/content";

const validTracks: Set<string> = new Set([
  ...sessions.map((s) => s.slug),
  ...services.map((s) => s.title),
]);

export function isValidTrack(value: string): boolean {
  return validTracks.has(value);
}

export function resolveInquiryType(value: string): "session" | "service" | "general" {
  if (sessions.some((session) => session.slug === value)) {
    return "session";
  }

  if (services.some((service) => service.title === value)) {
    return "service";
  }

  return "general";
}

export function normalizeTrackLabel(track: string): string {
  const session = sessions.find((item) => item.slug === track);
  if (session) {
    return session.title;
  }

  const service = services.find((item) => item.title === track);
  return service?.title ?? track;
}
