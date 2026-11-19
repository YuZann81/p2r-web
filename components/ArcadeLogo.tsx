import Link from "next/link";

export default function ArcadeLogo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#FFD447] rounded-lg transition-transform hover:scale-[1.02]"
      aria-label="Pixel To Reality Home"
    >
      <div className="flex flex-col items-start">
        <span className="font-display text-2xl sm:text-3xl tracking-wide text-[#FFD447] drop-shadow-[2px_2px_0_#0E0A1A] group-hover:text-[#68D5E8] transition-colors leading-none">
          PIXEL TO REALITY
        </span>
        <span className="font-body text-[10px] tracking-wider text-[#9470E8] font-semibold uppercase mt-0.5">
          RPL Cyber Exhibition
        </span>
      </div>
    </Link>
  );
}
