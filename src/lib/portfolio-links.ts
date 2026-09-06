import type { PortfolioContentType, PortfolioProvider } from "@/lib/db/schema";

export type ParsedPortfolioLink = {
  provider: PortfolioProvider;
  contentType: PortfolioContentType;
  sourceUrl: string;
  embedUrl: string;
};

const spotifyHosts = new Set(["open.spotify.com"]);
const youtubeHosts = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"]);
const audiomackHosts = new Set(["audiomack.com", "www.audiomack.com"]);

export function parsePortfolioLink(value: string): ParsedPortfolioLink | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  if (spotifyHosts.has(url.hostname)) {
    const match = url.pathname.match(/^\/(album|track)\/([A-Za-z0-9]+)\/?$/);
    if (!match) return null;
    const contentType = match[1] as "album" | "track";
    const sourceUrl = `https://open.spotify.com/${contentType}/${match[2]}`;
    return { provider: "spotify", contentType, sourceUrl, embedUrl: `https://open.spotify.com/embed/${contentType}/${match[2]}` };
  }

  if (youtubeHosts.has(url.hostname)) {
    const id = url.hostname.includes("youtu.be")
      ? url.pathname.split("/").filter(Boolean)[0]
      : url.pathname.startsWith("/shorts/")
        ? url.pathname.split("/")[2]
        : url.searchParams.get("v");
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    return {
      provider: "youtube",
      contentType: "video",
      sourceUrl: `https://youtu.be/${id}`,
      embedUrl: `https://www.youtube.com/embed/${id}?playsinline=1&rel=0`,
    };
  }

  if (audiomackHosts.has(url.hostname)) {
    const match = url.pathname.match(/^\/([^/]+)\/song\/([^/]+)\/?$/);
    if (!match) return null;
    const sourceUrl = `https://audiomack.com/${match[1]}/song/${match[2]}`;
    return {
      provider: "audiomack",
      contentType: "song",
      sourceUrl,
      embedUrl: `https://audiomack.com/embed/song/${match[1]}/${match[2]}`,
    };
  }

  url.hash = "";
  return {
    provider: "external",
    contentType: "track",
    sourceUrl: url.toString(),
    embedUrl: "",
  };
}

export const portfolioCreditOptions = [
  "Music Production",
  "Vocal Arrangement",
  "Vocal Production",
] as const;

export type PortfolioCredit = (typeof portfolioCreditOptions)[number];
