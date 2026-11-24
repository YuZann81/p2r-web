import React from "react";

const BG_HERO = "#211B35";
// Matches P2RVoltSection's bg-[#171224]/50 composited over #211B35 for zero seam
const BG_STORY = "#1C172D";

// Subtle P2R accents woven into the organic pixel dissolve (never overpowering)
const P2R_DISSOLVE_ACCENTS = [
  "#39265E",
  "#39265E",
  "#39265E",
  "#5b2be6",
  "#5b2be6",
  "#7a1fb0",
  "#7a1fb0",
  "#7ac70c",
  "#ffe500",
] as const;

function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type PixelBlock = {
  col: number;
  row: number;
  color: string;
};

/**
 * Generates an organic, interlocking square-pixel dissolve between Hero (#211B35)
 * and Background Story (#1C172D) with zero hard horizontal edges.
 * Top row stays pure BG_HERO; bottom row stays pure BG_STORY; middle rows
 * interlock in irregular clusters and trailing stray squares in P2R colors.
 */
export function buildStaticPixelBorder(
  cols = 88,
  rows = 12,
  seed = 20260409,
): PixelBlock[] {
  const rand = createSeededRandom(seed);
  const blocks: PixelBlock[] = [];

  // Smooth multi-harmonic column contour so clusters ebb and flow organically
  const colBias: number[] = [];
  for (let col = 0; col < cols; col++) {
    const wave =
      Math.sin(col * 0.19) * 0.14 +
      Math.cos(col * 0.43 + 1.2) * 0.11 +
      Math.sin(col * 0.89 + 0.4) * 0.06;
    colBias.push(wave);
  }

  for (let row = 0; row < rows; row++) {
    // Row 0 is pure Hero background (handled by SVG container bg); no rects needed
    if (row === 0) continue;

    // Last row is pure Story background so the join into P2RVoltSection is invisible
    if (row === rows - 1) {
      for (let col = 0; col < cols; col++) {
        blocks.push({ col, row, color: BG_STORY });
      }
      continue;
    }

    // Normalized vertical progression [0..1] from Hero (top) to Story (bottom)
    const t = row / (rows - 1);

    for (let col = 0; col < cols; col++) {
      // Probability this cell has transitioned from Hero (#211B35) into Story (#1C172D)
      const storyProb = t + colBias[col];
      const n = rand();

      // Determine whether this cell belongs to the Story side or remains Hero
      const isStory = n < storyProb;

      // Distance from the local dissolve frontier controls where P2R pixel accents appear
      const distFromEdge = Math.abs(n - storyProb);

      if (isStory) {
        // Near the frontier, weave subtle P2R violet/purple/green/yellow square pixels
        // into the interlocking cluster edge; deeper down settle into clean BG_STORY.
        if (distFromEdge < 0.13 && row >= 2 && row <= rows - 3 && rand() < 0.42) {
          blocks.push({
            col,
            row,
            color:
              P2R_DISSOLVE_ACCENTS[
                Math.floor(rand() * P2R_DISSOLVE_ACCENTS.length)
              ],
          });
        } else {
          blocks.push({ col, row, color: BG_STORY });
        }
      } else {
        // Remains Hero (#211B35) on upper side, or scattered trailing P2R pixels dipping down
        if (distFromEdge < 0.11 && row >= 3 && row <= rows - 2 && rand() < 0.36) {
          blocks.push({
            col,
            row,
            color:
              P2R_DISSOLVE_ACCENTS[
                Math.floor(rand() * P2R_DISSOLVE_ACCENTS.length)
              ],
          });
        }
        // Otherwise leave transparent so BG_HERO shows through cleanly
      }
    }
  }

  return blocks;
}

const COLS = 88;
const ROWS = 12;
const CELL = 12;
const STATIC_BLOCKS = buildStaticPixelBorder(COLS, ROWS, 20260409);

export default function PixelTransitionDivider() {
  return (
    <div
      aria-hidden="true"
      data-testid="static-pixel-divider"
      className="pointer-events-none relative z-10 -my-px w-full overflow-hidden leading-none select-none"
      style={{ backgroundColor: BG_HERO }}
    >
      <svg
        viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
        preserveAspectRatio="xMidYMid slice"
        className="block h-28 w-full sm:h-36 md:h-44"
        shapeRendering="crispEdges"
      >
        {STATIC_BLOCKS.map((block) => (
          <rect
            key={`${block.col}-${block.row}`}
            x={block.col * CELL}
            y={block.row * CELL}
            width={CELL}
            height={CELL}
            fill={block.color}
          />
        ))}
      </svg>
    </div>
  );
}
