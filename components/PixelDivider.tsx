type PixelDividerProps = {
  base?: string;
  pixel?: string;
};

export default function PixelDivider({
  base = "var(--arcade-yellow)",
  pixel = "var(--arcade-ink)",
}: PixelDividerProps = {}) {
  return (
    <div
      aria-hidden="true"
      className="h-10 w-full"
      style={{
        backgroundImage: `linear-gradient(${pixel} 0 0), linear-gradient(${pixel} 0 0)`,
        backgroundColor: base,
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0, 8px 8px",
        WebkitMaskImage:
          "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
        maskImage: "repeating-conic-gradient(#000 0% 25%, transparent 0% 50%)",
        WebkitMaskSize: "16px 16px",
        maskSize: "16px 16px",
      }}
    />
  );
}
