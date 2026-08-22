type GameArtworkProps = {
  image: string;
  imageAlt: string;
  logo: string;
  logoAlt: string;
  tilt?: "left" | "right";
};

export default function GameArtwork({
  image,
  imageAlt,
  logo,
  logoAlt,
  tilt = "left",
}: GameArtworkProps) {
  const rotation = tilt === "left" ? "-rotate-6" : "rotate-6";
  const badgePosition =
    tilt === "left"
      ? "-top-4 sm:-top-6 md:-top-8 right-2 sm:right-6"
      : "-bottom-4 sm:-bottom-6 md:-bottom-8 left-2 sm:left-6";

  return (
    <div
      className={`relative w-full max-w-[280px] min-[380px]:max-w-xs sm:max-w-sm md:max-w-md ${rotation} transition-transform duration-300 group-hover:rotate-0`}
    >
      {/* stacked paper layers behind the card */}
      <div
        className="absolute inset-0 translate-x-2 translate-y-2 bg-white/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 translate-x-1 translate-y-1 bg-white/60"
        aria-hidden="true"
      />

      {/* main card */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e6e6e6] shadow-lg">
        <img
          src={image || "/placeholder.svg"}
          alt={imageAlt}
          className="h-full w-full object-cover [image-rendering:pixelated]"
        />
      </div>

      {/* circular logo badge overlapping a corner */}
      <div
        className={`absolute ${badgePosition} h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 overflow-hidden rounded-full border-2 sm:border-4 border-white bg-[#d9d9d9] shadow-md`}
      >
        <img
          src={logo || "/placeholder.svg"}
          alt={logoAlt}
          className="h-full w-full object-cover [image-rendering:pixelated]"
        />
      </div>
    </div>
  );
}
