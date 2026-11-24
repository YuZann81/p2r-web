type MarqueeProps = {
  text: string;
  repeat?: number;
};

export default function Marquee({ text, repeat = 4 }: MarqueeProps) {
  const items = Array.from({ length: repeat });

  return (
    <div
      className="overflow-hidden bg-[#171224] py-2 border-y border-[#39265E]"
      role="marquee"
      aria-label={text}
    >
      <div className="flex w-max animate-arcade-marquee gap-16 pr-16">
        {[0, 1].map((track) => (
          <div
            key={track}
            className="flex shrink-0 gap-16 pr-16"
            aria-hidden={track === 1}
          >
            {items.map((_, i) => (
              <span
                key={i}
                className="font-display text-xs tracking-wider uppercase text-[#FFD447]/80 sm:text-sm"
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
