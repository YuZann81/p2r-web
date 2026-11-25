"use client";

import React, { useState } from "react";
import { Film } from "lucide-react";
import { DOCUMENTATION_VIDEO_CONFIG } from "@/lib/verification/config";

type DocumentationVideoPlayerProps = {
  videoSrc?: string;
  title?: string;
  onReplayVerification?: () => void;
};

export default function DocumentationVideoPlayer({
  videoSrc = DOCUMENTATION_VIDEO_CONFIG.src,
  title = DOCUMENTATION_VIDEO_CONFIG.title,
}: DocumentationVideoPlayerProps) {
  const [hasVideoError, setHasVideoError] = useState(false);

  return (
    <div
      data-testid="documentation-video-panel"
      onContextMenu={(e) => e.preventDefault()}
      className="p2r-stage-enter pointer-events-none w-full select-none"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#0E0919] shadow-[0_20px_60px_rgba(8,5,16,0.7)]">
        {!hasVideoError ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            aria-label={title}
            onContextMenu={(e) => e.preventDefault()}
            onError={() => setHasVideoError(true)}
            className="pointer-events-none h-full w-full select-none object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center">
            <Film className="h-8 w-8 text-[#68D5E8]" aria-hidden="true" />
            <p className="font-display text-sm tracking-wide text-[#FFD447]">
              Video Dokumentasi Belum Tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
