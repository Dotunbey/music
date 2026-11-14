"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { PublicPortfolioItem } from "@/lib/portfolio";
import styles from "./portfolio-record.module.css";

type YouTubePlayer = { playVideo(): void; destroy(): void };
type YouTubeApi = { Player: new (element: HTMLElement, options: { videoId: string; width: string; height: string; playerVars: Record<string, string | number>; events: { onReady(event: { target: YouTubePlayer }): void; onStateChange(event: { data: number }): void; onError(): void } }) => YouTubePlayer };
type SpotifyController = {
  play(): void;
  destroy(): void;
  addListener(event: "ready", callback: () => void): void;
  addListener(event: "playback_update", callback: (event: { data: { isPaused: boolean; isBuffering: boolean } }) => void): void;
};
type SpotifyApi = { createController(element: HTMLElement, options: { url: string; width: string; height: number }, callback: (controller: SpotifyController) => void): void };
type ApiWindow = Window & { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void; onSpotifyIframeApiReady?: (api: SpotifyApi) => void };
let youtube: Promise<YouTubeApi> | undefined;
let spotify: Promise<SpotifyApi> | undefined;

function loadYouTube() {
  const target = window as ApiWindow;
  if (target.YT?.Player) return Promise.resolve(target.YT);
  if (!youtube) youtube = new Promise<YouTubeApi>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("YouTube player timed out")), 15000);
    const previous = target.onYouTubeIframeAPIReady;
    target.onYouTubeIframeAPIReady = () => { window.clearTimeout(timer); previous?.(); if (target.YT) resolve(target.YT); };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { window.clearTimeout(timer); reject(new Error("YouTube player could not load")); };
    document.head.appendChild(script);
  }).catch((error: unknown) => { youtube = undefined; throw error; });
  return youtube;
}

function loadSpotify() {
  if (!spotify) spotify = new Promise<SpotifyApi>((resolve, reject) => {
    const target = window as ApiWindow;
    const timer = window.setTimeout(() => reject(new Error("Spotify player timed out")), 15000);
    const previous = target.onSpotifyIframeApiReady;
    target.onSpotifyIframeApiReady = (api) => { window.clearTimeout(timer); previous?.(api); resolve(api); };
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.onerror = () => { window.clearTimeout(timer); reject(new Error("Spotify player could not load")); };
    document.head.appendChild(script);
  }).catch((error: unknown) => { spotify = undefined; throw error; });
  return spotify;
}

export function PortfolioRecord({ artwork, spinning = false }: { artwork: string | null; spinning?: boolean }) {
  return <div className={`${styles.record} ${spinning ? styles.platter : ""}`} aria-hidden="true"><div className={styles.label}>{artwork ? <img src={artwork} alt="" loading="lazy" /> : <span>TB</span>}</div></div>;
}

function StreamingPlayer({ item, onPlaying, onEngage }: { item: PublicPortfolioItem; onPlaying: (playing: boolean) => void; onEngage: (engaged: boolean) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLMediaElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (item.mediaUrl && media.current) {
      const element = media.current;
      onEngage(true);
      const timer = setTimeout(() => {
        void element.play().catch(() => {
          console.info("Automatic portfolio playback was blocked; use the media play control.");
          onEngage(false);
        });
      }, 700);
      return () => { clearTimeout(timer); element.pause(); };
    }
    const container = host.current;
    if (!container || item.mediaUrl || !["youtube", "spotify"].includes(item.provider)) return;
    let disposed = false;
    let disposePlayer: (() => void) | undefined;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    const mount = document.createElement("div");
    container.appendChild(mount);
    function start(play: () => void) {
      if (disposed) return;
      onEngage(true);
      startTimer = setTimeout(() => { if (!disposed) play(); }, 700);
    }
    async function initialize() {
      if (item.provider === "youtube") {
        const api = await loadYouTube();
        if (disposed) return;
        const videoId = new URL(item.embedUrl!).pathname.split("/").filter(Boolean).pop()!;
        const player = new api.Player(mount, { videoId, width: "100%", height: "270", playerVars: { playsinline: 1, rel: 0, origin: window.location.origin }, events: {
          onReady: ({ target }) => start(() => target.playVideo()),
          onStateChange: ({ data }) => { if (!disposed) { onPlaying(data === 1); onEngage(data === 1 || data === 3); } },
          onError: () => { if (!disposed) { onPlaying(false); onEngage(false); setFailed(true); } },
        } });
        disposePlayer = () => player.destroy();
      } else {
        const api = await loadSpotify();
        if (disposed) return;
        api.createController(mount, { url: item.sourceUrl!, width: "100%", height: 352 }, (controller) => {
          if (disposed) { controller.destroy(); return; }
          disposePlayer = () => controller.destroy();
          controller.addListener("ready", () => start(() => controller.play()));
          controller.addListener("playback_update", ({ data }) => { if (!disposed) { onPlaying(!data.isPaused && !data.isBuffering); onEngage(!data.isPaused); } });
        });
      }
    }
    void initialize().catch((error: unknown) => {
      if (!disposed) { console.error("Portfolio player initialization failed", error); onPlaying(false); onEngage(false); setFailed(true); }
    });
    return () => { disposed = true; clearTimeout(startTimer); disposePlayer?.(); container.replaceChildren(); };
  }, [item, onPlaying, onEngage]);

  const events = { onPlaying: () => { onEngage(true); onPlaying(true); }, onPause: () => { onPlaying(false); onEngage(false); }, onEnded: () => { onPlaying(false); onEngage(false); }, onWaiting: () => onPlaying(false), onError: () => { onPlaying(false); onEngage(false); setFailed(true); } };
  return <div className="mt-5">
    {item.mediaUrl ? item.contentType === "video" ? <video ref={media as React.RefObject<HTMLVideoElement | null>} src={item.mediaUrl} poster={item.artworkUrl ?? undefined} controls playsInline preload="metadata" className="max-h-[40svh] w-full rounded-md bg-black" {...events} /> : <audio ref={media as React.RefObject<HTMLAudioElement | null>} src={item.mediaUrl} controls preload="metadata" className="w-full" {...events} /> : ["youtube", "spotify"].includes(item.provider) ? <div ref={host} className={styles.playerHost} /> : <iframe src={item.embedUrl ?? ""} title={item.title} className="h-[270px] w-full border-0" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />}
    {failed ? <p role="alert" className="mt-3 text-sm text-red-700">Playback is unavailable here. {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="underline">Open the original work</a> : "Please try again later."}</p> : <p className="mt-3 text-xs text-cream/60">Use the player controls if playback does not start automatically.</p>}
  </div>;
}

export function PortfolioPlayer({ item, onClose }: { item: PublicPortfolioItem; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const updatePlaying = useCallback((value: boolean) => setPlaying(value), []);
  const updateEngaged = useCallback((value: boolean) => setEngaged(value), []);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} aria-labelledby="portfolio-player-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose(); } }} className="fixed inset-0 m-auto max-h-[92svh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-xl border border-red-600/20 bg-white p-5 text-cream shadow-soft backdrop:bg-black/55 backdrop:backdrop-blur-md sm:p-7">
    <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">Tami Bedford / Selected work</p><h2 id="portfolio-player-title" className="mt-2 font-display text-2xl font-bold">{item.title}</h2></div><button type="button" autoFocus aria-label="Close player" onClick={onClose} className="nav-glass grid h-11 w-11 shrink-0 place-items-center rounded-full"><X aria-hidden="true" /></button></div>
    <div className={styles.deck} data-playing={playing} data-engaged={engaged}><PortfolioRecord artwork={item.artworkUrl} spinning /><span className={styles.arm} aria-hidden="true"><span className={styles.needle} /></span><span className={styles.power} aria-hidden="true" /></div>
    <StreamingPlayer item={item} onPlaying={updatePlaying} onEngage={updateEngaged} />
  </dialog>;
}
