import Image from "next/image";

/**
 * Official Pixel2Reality logo.
 *
 * The artwork is the official asset served from /public/brand. It is NOT
 * redrawn as text: the previous wordmark was a text approximation of the real
 * mark. Sizing is driven by height so the 1600x1600 source keeps its 1:1
 * aspect ratio at every breakpoint.
 */
const LOGO_SRC = "/brand/pixel2reality-logo.png";

export default function ArcadeLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src={LOGO_SRC}
        alt="Pixel2Reality — Pameran Karya Teknologi"
        width={1600}
        height={1600}
        priority
        sizes="(max-width: 640px) 48px, (max-width: 1024px) 60px, 72px"
        className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[4.5rem] lg:w-[4.5rem]"
      />
    </span>
  );
}

export { LOGO_SRC };
