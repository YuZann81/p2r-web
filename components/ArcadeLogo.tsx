import Link from "next/link";
import { PixelLogo } from "@/components/PixelLogo";

export default function ArcadeLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] transition-transform hover:scale-[1.02]"
      aria-label="Pixel To Reality Home"
    >
      <PixelLogo className="size-8 sm:size-9" />
      <div className="flex flex-col items-start">
        <span className="font-display text-xl sm:text-2xl tracking-wide text-[#FFD447] drop-shadow-[2px_2px_0_#0E0A1A] group-hover:text-[#68D5E8] transition-colors leading-none">
          PIXEL TO REALITY
        </span>
        <span className="font-body text-[10px] tracking-wider text-[#B7ABCE] font-semibold uppercase mt-0.5">
          RPL Cyber Exhibition
        </span>
      </div>
    </Link>
  );
}
