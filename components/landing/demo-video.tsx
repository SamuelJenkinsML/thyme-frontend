"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * Lazy, performance-conscious looping demo player.
 *
 * - `preload="none"` + no `autoPlay`: nothing downloads until it scrolls into view.
 * - An IntersectionObserver plays the clip when it enters the viewport and pauses it
 *   when it leaves, so a 44s loop never burns CPU/battery/bandwidth off-screen.
 * - Honors `prefers-reduced-motion`: shows the poster with a click-to-play button
 *   instead of autoplaying.
 */
export function DemoVideo({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Track the user's reduced-motion preference (and changes to it).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Play only while in view; pause when scrolled away. Skipped under reduced motion.
  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  const showPlayButton = reduced && !playing;

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster="/thyme-demo-poster.jpg"
        aria-label="Thyme demo: define a feature in Python, ship it with one command, query live feature values, and explore lineage and monitoring in the web app."
        className="w-full aspect-video object-cover bg-thyme-ink"
      >
        <source src="/thyme-demo.webm" type="video/webm" />
        <source src="/thyme-demo.mp4" type="video/mp4" />
      </video>

      {showPlayButton && (
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              video.play().catch(() => {});
              setPlaying(true);
            }
          }}
          aria-label="Play demo video"
          className="absolute inset-0 flex items-center justify-center bg-thyme-ink/40 backdrop-blur-[2px] transition-colors hover:bg-thyme-ink/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-thyme-cream text-thyme-ink shadow-lg">
            <Play size={26} fill="currentColor" className="ml-1" />
          </span>
        </button>
      )}
    </div>
  );
}
