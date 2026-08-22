import { ABOUT_CONTENT } from "@/lib/content";

export default function RplEmblem() {
  return (
    <img
      src={ABOUT_CONTENT.emblem.src || "/placeholder.svg"}
      alt={ABOUT_CONTENT.emblem.alt}
      width={280}
      height={300}
      loading="lazy"
      className="h-auto w-48 select-none drop-shadow-[4px_6px_0_rgba(0,0,0,0.35)] sm:w-60 md:w-72 [image-rendering:pixelated]"
    />
  );
}
