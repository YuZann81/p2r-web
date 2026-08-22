import React from 'react';

const tilePattern = [
  "0000000000000000",
  "0000000000000000",
  "1111111111111110",
  "0000000000000010",
  "1111111111111010",
  "1000000000001010",
  "1011111111101010",
  "1010000000101010",
  "1010111110101010",
  "1010100010101010",
  "1010101110101010",
  "1010100000101010",
  "1010111111101010",
  "1010000000001010",
  "1011111111111010",
  "1000000000000010",
  "1111111111111110",
  "0000000000000000",
  "0100010001000100",
  "0001000100010001",
  "0000000000000000",
  "1111111111111111",
  "0000000000000000"
];

const pixelSize = 4;
const tileWidth = 16 * pixelSize;
const tileHeight = tilePattern.length * pixelSize;

export function PixelBorder() {
  return (
    <div 
      className="w-full bg-[#2A238A] overflow-hidden shadow-lg border-b-4 border-[#2A238A]"
      style={{ height: `${tileHeight}px` }}
    >
      <svg 
        width="100%" 
        height="100%" 
        style={{ shapeRendering: 'crispEdges' }} 
      >
        <defs>
          <pattern
            id="pixel-spiral-border"
            x="0"
            y="0"
            width={tileWidth}
            height={tileHeight}
            patternUnits="userSpaceOnUse"
          >
            {tilePattern.map((row, y) =>
              row.split('').map((cell, x) =>
                cell === '1' ? (
                  <rect
                    key={`${x}-${y}`}
                    x={x * pixelSize}
                    y={y * pixelSize}
                    width={pixelSize}
                    height={pixelSize}
                    fill="#6737FF" 
                  />
                ) : null
              )
            )}
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#pixel-spiral-border)" />
      </svg>
    </div>
  );
}

export const pixelClipPath = `polygon(
  8px 0px, calc(100% - 8px) 0px, calc(100% - 8px) 4px, calc(100% - 4px) 4px, 
  calc(100% - 4px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), 
  calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%, 
  8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 
  0px calc(100% - 8px), 0px 8px, 4px 8px, 4px 4px, 8px 4px
)`;

type PixelImageProps = {
  imageUrl?: string;
};

export function PixelImage({ imageUrl = "/placeholder.svg" }: PixelImageProps) {
  return (
    <div 
      className="w-full aspect-square bg-[#e5e5e5] flex items-center justify-center"
      style={{ clipPath: pixelClipPath }}
    >
      <img src={imageUrl} alt="Product" className="w-24 h-24 opacity-20" />
    </div>
  );
}

type PixelButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function PixelButton({ children, onClick, type = "button" }: PixelButtonProps) {
  return (
    <div style={{ filter: "drop-shadow(0px 5px 0px #b8b01c)" }} className="w-full">
      <button 
        type={type}
        onClick={onClick}
        className="w-full bg-[#F4EA2A] text-[#5B10B4] font-bold text-lg py-3 active:translate-y-1 transition-transform outline-none hover:bg-[#ffe100]"
        style={{ clipPath: pixelClipPath }}
      >
        {children}
      </button>
    </div>
  );
}

type MerchandiseCardProps = {
  onClick: () => void;
  containerClassName?: string;
  imageBoxClassName?: string;
};

export default function MerchandiseCard({ 
  onClick, 
  containerClassName = "", 
  imageBoxClassName = "aspect-square" 
}: MerchandiseCardProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${containerClassName}`}>
      <div 
        role="button"
        tabIndex={0}
        className={`w-full bg-[#e5e5e5] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ${imageBoxClassName}`}
        style={{ clipPath: pixelClipPath }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
      >
        <img 
          src="/placeholder.svg" 
          alt="Placeholder" 
          className="w-24 h-24 opacity-20" 
        />
      </div>
      
      <div style={{ filter: "drop-shadow(0px 5px 0px var(--arcade-yellow-shadow))" }}>
        <button 
          onClick={onClick}
          className="bg-arcade-yellow text-arcade-ink font-display font-bold text-xl px-12 py-2 active:translate-y-1 transition-transform outline-none"
          style={{ clipPath: pixelClipPath }}
        >
          Order Now!
        </button>
      </div>
    </div>
  );
}