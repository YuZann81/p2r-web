const WORDMARK = "PIXELS TO REALITY";

export default function ArcadeLogo() {
  const chars = WORDMARK.split("");
  const lastIndex = chars.length - 1;

  return (
    <span
      aria-label={WORDMARK}
      className="flex select-none items-end font-display text-2xl leading-none text-arcade-yellow sm:text-3xl lg:text-4xl"
      style={{ textShadow: "3px 4px 0 var(--arcade-ink)" }}
    >
      {chars.map((char, index) => {
        const arc = -Math.sin((index / lastIndex) * Math.PI) * 16;
        return (
          <span
            key={`${char}-${index}`}
            aria-hidden="true"
            className="inline-block"
            style={{ transform: `translateY(${arc}px)` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}
