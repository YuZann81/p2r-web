type MarqueeProps = {
  text: string;
  repeat?: number;
};

export default function Marquee({ text, repeat = 4 }: MarqueeProps) {
  const items = Array.from({ length: repeat });

  return (
    <div
      className="overflow-hidden bg-arcade-yellow py-3"
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
                className="font-display text-sm whitespace-nowrap text-arcade-ink sm:text-base"
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
