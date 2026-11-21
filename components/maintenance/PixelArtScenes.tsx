import React from "react";

interface SceneProps {
  className?: string;
}

/**
 * 16-bit Pixel-Art Scene: System Degraded (Recovery & Troubleshooting)
 * Strict 96x60 integer pixel canvas with crispEdges — zero anti-aliasing blur.
 * Depicts a friendly P2R technician robot repairing an open retro P2R arcade
 * terminal with glowing diagnostics and circuit sparks.
 */
export function SystemDegradedPixelScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 96 60"
      width="960"
      height="600"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ilustrasi pixel-art robot teknisi P2R sedang memperbaiki terminal komputer arcade"
      className={`block h-auto w-full select-none [image-rendering:pixelated] ${className}`}
    >
      {/* Stepped 16-bit workshop twilight backdrop */}
      <rect x="0" y="0" width="96" height="14" fill="#120722" />
      <rect x="0" y="14" width="96" height="12" fill="#1a0b30" />
      <rect x="0" y="26" width="96" height="12" fill="#220f3e" />
      <rect x="0" y="38" width="96" height="10" fill="#2b134d" />

      {/* Subtle pixel workshop wall grid & conduit pipes */}
      <rect x="0" y="9" width="96" height="1" fill="#2a144a" />
      <rect x="6" y="0" width="2" height="48" fill="#17092b" />
      <rect x="88" y="0" width="2" height="48" fill="#17092b" />
      <rect x="10" y="4" width="16" height="2" fill="#2f1754" />
      <rect x="70" y="4" width="16" height="2" fill="#2f1754" />

      {/* Overhead diagnostic light fixture */}
      <rect x="30" y="2" width="36" height="3" fill="#0d041a" />
      <rect x="31" y="3" width="34" height="1" fill="#64748b" />
      <rect x="34" y="4" width="28" height="1" fill="#22d3ee" />
      <rect x="38" y="5" width="20" height="1" fill="#22d3ee" opacity="0.25" />

      {/* Ambient background stars / status dots */}
      <rect x="13" y="8" width="1" height="1" fill="#7c3aed" />
      <rect x="82" y="12" width="1" height="1" fill="#22d3ee" />
      <rect x="52" y="10" width="1" height="1" fill="#ffe500" />
      <rect x="78" y="22" width="1" height="1" fill="#a855f7" />
      <rect x="10" y="24" width="1" height="1" fill="#fb923c" />

      {/* Checkered 16-bit arcade workshop floor */}
      <rect x="0" y="47" width="96" height="1" fill="#4c2485" />
      <rect x="0" y="48" width="96" height="12" fill="#1c0b33" />
      {/* Floor tile row 1 (y=48..53) */}
      <rect x="0" y="48" width="8" height="6" fill="#261145" />
      <rect x="16" y="48" width="8" height="6" fill="#261145" />
      <rect x="32" y="48" width="8" height="6" fill="#261145" />
      <rect x="48" y="48" width="8" height="6" fill="#261145" />
      <rect x="64" y="48" width="8" height="6" fill="#261145" />
      <rect x="80" y="48" width="8" height="6" fill="#261145" />
      {/* Floor tile row 2 (y=54..59) */}
      <rect x="8" y="54" width="8" height="6" fill="#261145" />
      <rect x="24" y="54" width="8" height="6" fill="#261145" />
      <rect x="40" y="54" width="8" height="6" fill="#261145" />
      <rect x="56" y="54" width="8" height="6" fill="#261145" />
      <rect x="72" y="54" width="8" height="6" fill="#261145" />
      <rect x="88" y="54" width="8" height="6" fill="#261145" />

      {/* Ground contact shadows */}
      <rect x="12" y="49" width="36" height="3" fill="#0d041a" />
      <rect x="54" y="49" width="22" height="3" fill="#0d041a" />
      <rect x="77" y="49" width="13" height="2" fill="#0d041a" />

      {/* === RETRO P2R ARCADE SERVER / COMPUTER TERMINAL (x=14..46, y=11..49) === */}
      {/* Outer dark ink frame */}
      <rect x="14" y="11" width="32" height="38" fill="#0c0418" />
      {/* Main chassis body */}
      <rect x="15" y="12" width="30" height="36" fill="#3a2366" />
      {/* Top & left 16-bit bevel highlight */}
      <rect x="15" y="12" width="30" height="1" fill="#6b46b5" />
      <rect x="15" y="12" width="1" height="36" fill="#543396" />
      {/* Right bevel shadow */}
      <rect x="43" y="13" width="2" height="35" fill="#231242" />
      {/* Base feet */}
      <rect x="16" y="48" width="5" height="2" fill="#1a0c30" />
      <rect x="39" y="48" width="5" height="2" fill="#1a0c30" />

      {/* Top marquee banner with warning LEDs */}
      <rect x="17" y="14" width="26" height="5" fill="#160829" />
      <rect x="18" y="15" width="24" height="3" fill="#5b2be6" />
      {/* Warning beacon LEDs */}
      <rect x="19" y="16" width="2" height="1" fill="#ef4444" />
      <rect x="22" y="16" width="2" height="1" fill="#fb923c" />
      <rect x="25" y="16" width="8" height="1" fill="#ffe500" />
      <rect x="35" y="16" width="2" height="1" fill="#fb923c" />
      <rect x="38" y="16" width="2" height="1" fill="#ef4444" />

      {/* Recessed CRT Monitor Bezel & Screen */}
      <rect x="17" y="20" width="26" height="14" fill="#130824" />
      <rect x="18" y="21" width="24" height="12" fill="#091526" />
      {/* Subtle CRT scanline sheen */}
      <rect x="18" y="22" width="24" height="1" fill="#0f233d" />
      <rect x="18" y="25" width="24" height="1" fill="#0f233d" />
      <rect x="18" y="28" width="24" height="1" fill="#0f233d" />
      <rect x="18" y="31" width="24" height="1" fill="#0f233d" />
      {/* CRT glass highlight */}
      <rect x="19" y="22" width="3" height="1" fill="#22d3ee" opacity="0.4" />
      <rect x="19" y="23" width="1" height="2" fill="#22d3ee" opacity="0.3" />

      {/* Pixel Warning Emblem (!) on CRT left */}
      <rect x="23" y="23" width="2" height="1" fill="#ffe500" />
      <rect x="22" y="24" width="4" height="1" fill="#ffe500" />
      <rect x="21" y="25" width="6" height="2" fill="#fb923c" />
      <rect x="20" y="27" width="8" height="2" fill="#ef4444" />
      <rect x="20" y="29" width="8" height="1" fill="#dc2626" />
      {/* Exclamation mark inside warning badge */}
      <rect x="23" y="24" width="2" height="3" fill="#130824" />
      <rect x="23" y="28" width="2" height="1" fill="#130824" />

      {/* Diagnostic flatline / glitch waveform on CRT right */}
      <rect x="30" y="27" width="2" height="1" fill="#22d3ee" />
      <rect x="32" y="25" width="1" height="2" fill="#22d3ee" />
      <rect x="33" y="24" width="1" height="5" fill="#fb923c" />
      <rect x="34" y="28" width="1" height="2" fill="#fb923c" />
      <rect x="35" y="27" width="2" height="1" fill="#ef4444" />
      <rect x="38" y="27" width="2" height="1" fill="#ef4444" />
      {/* Error status mini bars */}
      <rect x="30" y="30" width="4" height="1" fill="#fb923c" />
      <rect x="35" y="30" width="5" height="1" fill="#475569" />

      {/* Open Lower Service Hatch exposing circuit bay */}
      <rect x="17" y="36" width="25" height="10" fill="#090d1a" />
      {/* Green/cyan PCB motherboard inside bay */}
      <rect x="19" y="37" width="17" height="8" fill="#14532d" />
      <rect x="20" y="38" width="15" height="6" fill="#166534" />
      {/* Gold & cyan PCB traces */}
      <rect x="21" y="39" width="4" height="1" fill="#22d3ee" />
      <rect x="24" y="40" width="1" height="2" fill="#22d3ee" />
      <rect x="25" y="42" width="5" height="1" fill="#7ac70c" />
      <rect x="29" y="39" width="4" height="2" fill="#0f172a" />
      <rect x="30" y="39" width="2" height="1" fill="#94a3b8" />
      <rect x="21" y="42" width="2" height="2" fill="#fbbf24" />
      {/* Swung-open metal hatch door hanging to the left */}
      <rect x="10" y="37" width="5" height="9" fill="#0c0418" />
      <rect x="11" y="38" width="3" height="7" fill="#64748b" />
      <rect x="11" y="38" width="1" height="7" fill="#94a3b8" />
      <rect x="15" y="38" width="2" height="1" fill="#94a3b8" />
      <rect x="15" y="44" width="2" height="1" fill="#94a3b8" />

      {/* Electric Spark Clusters at the repair point */}
      {/* Spark 1 (bright pixel cross) */}
      <rect x="36" y="37" width="1" height="1" fill="#fb923c" />
      <rect x="36" y="38" width="1" height="1" fill="#ffffff" />
      <rect x="35" y="38" width="1" height="1" fill="#ffe500" />
      <rect x="37" y="38" width="1" height="1" fill="#ffe500" />
      <rect x="36" y="39" width="1" height="1" fill="#fb923c" />
      {/* Spark 2 (smaller glint) */}
      <rect x="39" y="42" width="1" height="1" fill="#ffe500" />
      <rect x="38" y="43" width="1" height="1" fill="#fb923c" />
      <rect x="40" y="43" width="1" height="1" fill="#fb923c" />

      {/* Diagnostic Floor Cable from Server to Robot area */}
      <rect x="37" y="46" width="2" height="2" fill="#0891b2" />
      <rect x="39" y="47" width="6" height="1" fill="#22d3ee" />
      <rect x="45" y="48" width="6" height="1" fill="#0891b2" />
      <rect x="51" y="47" width="4" height="1" fill="#22d3ee" />

      {/* === 16-BIT P2R PIXEL TECHNICIAN ROBOT (x=53..76, y=14..49) === */}
      {/* Antenna */}
      <rect x="64" y="13" width="2" height="2" fill="#22d3ee" />
      <rect x="64" y="13" width="1" height="1" fill="#ffffff" />
      <rect x="64" y="15" width="2" height="3" fill="#64748b" />

      {/* Robot Head */}
      <rect x="57" y="18" width="16" height="11" fill="#0c0418" />
      <rect x="58" y="19" width="14" height="9" fill="#94a3b8" />
      <rect x="58" y="19" width="14" height="2" fill="#e2e8f0" />
      <rect x="70" y="21" width="2" height="7" fill="#64748b" />
      {/* Ear sensors */}
      <rect x="56" y="21" width="1" height="4" fill="#ffe500" />
      <rect x="73" y="21" width="1" height="4" fill="#d99b00" />
      {/* Dark Visor & Expressive Cyan Eyes looking left at terminal */}
      <rect x="59" y="21" width="11" height="5" fill="#0f172a" />
      <rect x="60" y="22" width="3" height="2" fill="#22d3ee" />
      <rect x="60" y="22" width="1" height="1" fill="#ffffff" />
      <rect x="65" y="22" width="3" height="2" fill="#22d3ee" />
      <rect x="65" y="22" width="1" height="1" fill="#ffffff" />
      {/* Subtle focused brow line */}
      <rect x="60" y="21" width="2" height="1" fill="#0891b2" />
      <rect x="65" y="21" width="2" height="1" fill="#0891b2" />

      {/* Neck */}
      <rect x="62" y="29" width="6" height="1" fill="#475569" />

      {/* Robot Torso with P2R Violet Tech Vest */}
      <rect x="56" y="30" width="18" height="12" fill="#0c0418" />
      <rect x="57" y="31" width="16" height="10" fill="#5b2be6" />
      <rect x="57" y="31" width="16" height="1" fill="#7c53f5" />
      <rect x="71" y="32" width="2" height="9" fill="#3d1ba3" />
      {/* Chest Diagnostic Plate & P2R Yellow Emblem */}
      <rect x="60" y="33" width="8" height="4" fill="#1e1038" />
      <rect x="61" y="34" width="2" height="2" fill="#ffe500" />
      <rect x="64" y="34" width="3" height="1" fill="#7ac70c" />
      <rect x="64" y="36" width="2" height="1" fill="#22d3ee" />
      {/* Utility Belt */}
      <rect x="57" y="38" width="16" height="2" fill="#b98b00" />
      <rect x="63" y="38" width="4" height="2" fill="#ffe500" />

      {/* Left Arm Reaching Toward Server Bay + Crisp Pixel Wrench */}
      <rect x="47" y="33" width="10" height="4" fill="#0c0418" />
      <rect x="48" y="34" width="9" height="2" fill="#cbd5e1" />
      <rect x="48" y="35" width="9" height="1" fill="#94a3b8" />
      {/* Wrist clamp */}
      <rect x="47" y="34" width="2" height="2" fill="#ffe500" />
      {/* 16-bit Pixel Wrench */}
      <rect x="40" y="35" width="7" height="2" fill="#e2e8f0" />
      <rect x="41" y="36" width="6" height="1" fill="#94a3b8" />
      {/* Wrench C-jaw */}
      <rect x="38" y="33" width="3" height="2" fill="#e2e8f0" />
      <rect x="38" y="37" width="3" height="2" fill="#cbd5e1" />
      <rect x="39" y="34" width="2" height="1" fill="#94a3b8" />

      {/* Right Arm Holding Diagnostic Scanner */}
      <rect x="73" y="32" width="4" height="7" fill="#0c0418" />
      <rect x="74" y="33" width="2" height="5" fill="#94a3b8" />
      <rect x="74" y="33" width="1" height="4" fill="#e2e8f0" />

      {/* Legs & Arcade Boots */}
      <rect x="58" y="42" width="5" height="6" fill="#0c0418" />
      <rect x="59" y="42" width="3" height="4" fill="#64748b" />
      <rect x="59" y="42" width="1" height="4" fill="#94a3b8" />
      <rect x="57" y="46" width="6" height="3" fill="#0c0418" />
      <rect x="58" y="47" width="4" height="1" fill="#ffe500" />

      <rect x="67" y="42" width="5" height="6" fill="#0c0418" />
      <rect x="68" y="42" width="3" height="4" fill="#64748b" />
      <rect x="68" y="42" width="1" height="4" fill="#94a3b8" />
      <rect x="67" y="46" width="6" height="3" fill="#0c0418" />
      <rect x="68" y="47" width="4" height="1" fill="#ffe500" />

      {/* === PIXEL TOOLBOX (x=78..89, y=41..49) === */}
      {/* Handle */}
      <rect x="81" y="40" width="6" height="2" fill="#0c0418" />
      <rect x="82" y="41" width="4" height="1" fill="#cbd5e1" />
      {/* Red metal box */}
      <rect x="78" y="42" width="12" height="7" fill="#0c0418" />
      <rect x="79" y="43" width="10" height="5" fill="#dc2626" />
      <rect x="79" y="43" width="10" height="1" fill="#ef4444" />
      <rect x="79" y="45" width="10" height="1" fill="#991b1b" />
      {/* Yellow clasp */}
      <rect x="83" y="44" width="2" height="2" fill="#ffe500" />
    </svg>
  );
}

/**
 * 16-bit Pixel-Art Scene: Scheduled Maintenance (World Construction & Upgrade)
 * Strict 96x60 integer pixel canvas with crispEdges — same palette & scale as
 * SystemDegradedPixelScene, depicting a P2R arcade monument under structured
 * upgrade with crane hoist, scaffolding, builder bot in hard hat, and barricade.
 */
export function ScheduledMaintenancePixelScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 96 60"
      width="960"
      height="600"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ilustrasi pixel-art konstruksi dan peningkatan dunia Pixels to Reality"
      className={`block h-auto w-full select-none [image-rendering:pixelated] ${className}`}
    >
      {/* Cohesive 16-bit cyber-arcade twilight backdrop */}
      <rect x="0" y="0" width="96" height="14" fill="#120722" />
      <rect x="0" y="14" width="96" height="12" fill="#1a0b30" />
      <rect x="0" y="26" width="96" height="12" fill="#220f3e" />
      <rect x="0" y="38" width="96" height="10" fill="#2b134d" />

      {/* Distant cyber-arcade skyline silhouette */}
      <rect x="2" y="34" width="8" height="14" fill="#190930" />
      <rect x="4" y="37" width="1" height="1" fill="#5b2be6" />
      <rect x="7" y="40" width="1" height="1" fill="#22d3ee" />
      <rect x="11" y="39" width="7" height="9" fill="#17082b" />
      <rect x="82" y="33" width="11" height="15" fill="#190930" />
      <rect x="85" y="36" width="1" height="1" fill="#ffe500" />
      <rect x="89" y="39" width="1" height="1" fill="#22d3ee" />

      {/* Crisp pixel sky stars */}
      <rect x="9" y="7" width="1" height="1" fill="#ffe500" />
      <rect x="19" y="12" width="1" height="1" fill="#22d3ee" />
      <rect x="27" y="5" width="1" height="1" fill="#c4b5fd" />
      <rect x="65" y="4" width="1" height="1" fill="#ffe500" />
      <rect x="90" y="11" width="1" height="1" fill="#22d3ee" />

      {/* Checkered 16-bit arcade exhibition floor */}
      <rect x="0" y="47" width="96" height="1" fill="#4c2485" />
      <rect x="0" y="48" width="96" height="12" fill="#1c0b33" />
      <rect x="0" y="48" width="8" height="6" fill="#261145" />
      <rect x="16" y="48" width="8" height="6" fill="#261145" />
      <rect x="32" y="48" width="8" height="6" fill="#261145" />
      <rect x="48" y="48" width="8" height="6" fill="#261145" />
      <rect x="64" y="48" width="8" height="6" fill="#261145" />
      <rect x="80" y="48" width="8" height="6" fill="#261145" />
      <rect x="8" y="54" width="8" height="6" fill="#261145" />
      <rect x="24" y="54" width="8" height="6" fill="#261145" />
      <rect x="40" y="54" width="8" height="6" fill="#261145" />
      <rect x="56" y="54" width="8" height="6" fill="#261145" />
      <rect x="72" y="54" width="8" height="6" fill="#261145" />
      <rect x="88" y="54" width="8" height="6" fill="#261145" />

      {/* Ground contact shadows */}
      <rect x="8" y="49" width="16" height="2" fill="#0d041a" />
      <rect x="26" y="49" width="44" height="3" fill="#0d041a" />
      <rect x="72" y="49" width="18" height="2" fill="#0d041a" />

      {/* === OVERHEAD PIXEL CONSTRUCTION CRANE (Right Mast + Horizontal Boom) === */}
      {/* Crane vertical mast on right */}
      <rect x="78" y="7" width="6" height="41" fill="#0c0418" />
      <rect x="79" y="8" width="1" height="39" fill="#ffe500" />
      <rect x="82" y="8" width="1" height="39" fill="#d99b00" />
      {/* Lattice cross-rungs */}
      <rect x="80" y="11" width="2" height="1" fill="#ffe500" />
      <rect x="80" y="16" width="2" height="1" fill="#d99b00" />
      <rect x="80" y="21" width="2" height="1" fill="#ffe500" />
      <rect x="80" y="26" width="2" height="1" fill="#d99b00" />
      <rect x="80" y="31" width="2" height="1" fill="#ffe500" />
      <rect x="80" y="36" width="2" height="1" fill="#d99b00" />
      <rect x="80" y="41" width="2" height="1" fill="#ffe500" />
      {/* Crane beacon at mast top */}
      <rect x="80" y="5" width="2" height="2" fill="#ef4444" />
      <rect x="80" y="5" width="1" height="1" fill="#ffe500" />

      {/* Horizontal crane boom */}
      <rect x="38" y="7" width="52" height="5" fill="#0c0418" />
      <rect x="39" y="8" width="50" height="1" fill="#ffe500" />
      <rect x="39" y="10" width="50" height="1" fill="#d99b00" />
      {/* Boom vertical trusses */}
      <rect x="42" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="48" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="54" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="60" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="66" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="72" y="9" width="1" height="1" fill="#ffe500" />
      {/* Counterweight block on far right */}
      <rect x="85" y="9" width="5" height="4" fill="#64748b" />
      <rect x="85" y="9" width="5" height="1" fill="#94a3b8" />

      {/* Hoist Trolley, Cable & Glowing P2R Upgrade Core Crystal */}
      <rect x="45" y="11" width="6" height="3" fill="#475569" />
      <rect x="46" y="12" width="4" height="1" fill="#cbd5e1" />
      <rect x="47" y="14" width="2" height="5" fill="#94a3b8" />
      <rect x="48" y="14" width="1" height="5" fill="#e2e8f0" />
      {/* Hoist clamp */}
      <rect x="46" y="18" width="4" height="2" fill="#ffe500" />

      {/* Radiant P2R Upgrade Core / Pixel Star being lowered */}
      <rect x="47" y="20" width="2" height="1" fill="#ffffff" />
      <rect x="45" y="21" width="6" height="1" fill="#ffe500" />
      <rect x="44" y="22" width="8" height="3" fill="#ffe500" />
      <rect x="45" y="22" width="6" height="2" fill="#22d3ee" />
      <rect x="47" y="22" width="2" height="2" fill="#ffffff" />
      <rect x="45" y="25" width="6" height="1" fill="#d99b00" />
      <rect x="47" y="26" width="2" height="1" fill="#ffe500" />
      {/* Crisp symmetrical upgrade sparkles */}
      <rect x="41" y="21" width="1" height="1" fill="#22d3ee" />
      <rect x="54" y="21" width="1" height="1" fill="#22d3ee" />
      <rect x="42" y="25" width="1" height="1" fill="#ffe500" />
      <rect x="53" y="25" width="1" height="1" fill="#ffe500" />

      {/* === P2R CYBER ARCADE MONUMENT UNDER UPGRADE (x=33..63, y=27..49) === */}
      <rect x="33" y="27" width="30" height="22" fill="#0c0418" />
      <rect x="34" y="28" width="28" height="20" fill="#431fb8" />
      {/* Highlighted top & stepped P2R portal collar */}
      <rect x="34" y="28" width="28" height="2" fill="#5b2be6" />
      <rect x="34" y="28" width="28" height="1" fill="#7c53f5" />
      <rect x="60" y="29" width="2" height="19" fill="#2a1147" />
      {/* Top receiving slot glowing cyan for the lowered upgrade core */}
      <rect x="43" y="27" width="10" height="2" fill="#0e7490" />
      <rect x="44" y="28" width="8" height="1" fill="#22d3ee" />

      {/* Monument Upgrade Screen (x=38..58, y=32..44) */}
      <rect x="37" y="31" width="22" height="13" fill="#160829" />
      <rect x="38" y="32" width="20" height="11" fill="#0b152b" />
      {/* Pixel Upward Upgrade Chevron (^) in Cyan & Arcade Yellow */}
      <rect x="47" y="34" width="2" height="1" fill="#ffe500" />
      <rect x="45" y="35" width="6" height="1" fill="#ffe500" />
      <rect x="43" y="36" width="3" height="1" fill="#22d3ee" />
      <rect x="50" y="36" width="3" height="1" fill="#22d3ee" />
      <rect x="42" y="37" width="2" height="1" fill="#22d3ee" />
      <rect x="52" y="37" width="2" height="1" fill="#22d3ee" />
      {/* Second inner chevron */}
      <rect x="47" y="38" width="2" height="1" fill="#7ac70c" />
      <rect x="45" y="39" width="6" height="1" fill="#7ac70c" />
      <rect x="44" y="40" width="2" height="1" fill="#22d3ee" />
      <rect x="50" y="40" width="2" height="1" fill="#22d3ee" />
      {/* Base trim & arcade pedestal */}
      <rect x="34" y="45" width="28" height="3" fill="#2a1147" />
      <rect x="36" y="46" width="4" height="1" fill="#ffe500" />
      <rect x="46" y="46" width="4" height="1" fill="#22d3ee" />
      <rect x="56" y="46" width="4" height="1" fill="#ffe500" />

      {/* === CONSTRUCTION SCAFFOLDING FLANKING THE MONUMENT === */}
      {/* Left Scaffold Tower (x=27..33, y=22..49) */}
      <rect x="27" y="22" width="1" height="27" fill="#94a3b8" />
      <rect x="32" y="22" width="1" height="27" fill="#94a3b8" />
      <rect x="26" y="26" width="8" height="2" fill="#d99b00" />
      <rect x="26" y="26" width="8" height="1" fill="#ffe500" />
      <rect x="26" y="36" width="8" height="2" fill="#d99b00" />
      <rect x="26" y="36" width="8" height="1" fill="#ffe500" />
      {/* Cross brace pixels */}
      <rect x="28" y="29" width="1" height="1" fill="#64748b" />
      <rect x="29" y="31" width="2" height="1" fill="#64748b" />
      <rect x="31" y="33" width="1" height="1" fill="#64748b" />
      <rect x="28" y="40" width="1" height="1" fill="#64748b" />
      <rect x="29" y="42" width="2" height="1" fill="#64748b" />
      <rect x="31" y="44" width="1" height="1" fill="#64748b" />

      {/* Right Scaffold Tower (x=63..69, y=22..49) */}
      <rect x="63" y="22" width="1" height="27" fill="#94a3b8" />
      <rect x="68" y="22" width="1" height="27" fill="#94a3b8" />
      <rect x="62" y="26" width="8" height="2" fill="#d99b00" />
      <rect x="62" y="26" width="8" height="1" fill="#ffe500" />
      <rect x="62" y="36" width="8" height="2" fill="#d99b00" />
      <rect x="62" y="36" width="8" height="1" fill="#ffe500" />
      <rect x="64" y="29" width="1" height="1" fill="#64748b" />
      <rect x="65" y="31" width="2" height="1" fill="#64748b" />
      <rect x="67" y="33" width="1" height="1" fill="#64748b" />
      <rect x="64" y="40" width="1" height="1" fill="#64748b" />
      <rect x="65" y="42" width="2" height="1" fill="#64748b" />
      <rect x="67" y="44" width="1" height="1" fill="#64748b" />

      {/* === 16-BIT P2R BUILDER BOT IN HARD HAT (x=8..24, y=24..49) === */}
      {/* Yellow Safety Hard Hat */}
      <rect x="11" y="24" width="10" height="4" fill="#0c0418" />
      <rect x="12" y="25" width="8" height="3" fill="#ffe500" />
      <rect x="13" y="25" width="4" height="1" fill="#ffffff" />
      {/* Hard hat brim */}
      <rect x="10" y="28" width="12" height="2" fill="#0c0418" />
      <rect x="11" y="28" width="10" height="1" fill="#d99b00" />

      {/* Builder Bot Head */}
      <rect x="11" y="30" width="10" height="7" fill="#0c0418" />
      <rect x="12" y="30" width="8" height="6" fill="#94a3b8" />
      <rect x="12" y="30" width="8" height="1" fill="#e2e8f0" />
      {/* Visor with happy eyes looking up-right toward upgrade core */}
      <rect x="13" y="31" width="7" height="4" fill="#0f172a" />
      <rect x="14" y="32" width="2" height="2" fill="#22d3ee" />
      <rect x="14" y="32" width="1" height="1" fill="#ffffff" />
      <rect x="17" y="32" width="2" height="2" fill="#22d3ee" />
      <rect x="17" y="32" width="1" height="1" fill="#ffffff" />

      {/* Builder Bot High-Vis Torso */}
      <rect x="10" y="37" width="12" height="7" fill="#0c0418" />
      <rect x="11" y="38" width="10" height="5" fill="#5b2be6" />
      {/* High-vis yellow construction vest stripes */}
      <rect x="11" y="38" width="2" height="5" fill="#ffe500" />
      <rect x="19" y="38" width="2" height="5" fill="#ffe500" />
      <rect x="13" y="40" width="6" height="1" fill="#ffe500" />

      {/* Held Cyan Blueprint Sheet */}
      <rect x="20" y="36" width="7" height="6" fill="#0c0418" />
      <rect x="21" y="37" width="5" height="4" fill="#0891b2" />
      <rect x="22" y="38" width="3" height="1" fill="#ffffff" />
      <rect x="22" y="40" width="2" height="1" fill="#22d3ee" />

      {/* Builder Bot Legs & Boots */}
      <rect x="11" y="44" width="4" height="5" fill="#0c0418" />
      <rect x="12" y="44" width="2" height="3" fill="#64748b" />
      <rect x="12" y="47" width="3" height="1" fill="#ffe500" />
      <rect x="17" y="44" width="4" height="5" fill="#0c0418" />
      <rect x="18" y="44" width="2" height="3" fill="#64748b" />
      <rect x="18" y="47" width="3" height="1" fill="#ffe500" />

      {/* === CONSTRUCTION BARRICADE & SAFETY CONE (x=68..90, y=41..49) === */}
      {/* Safety Cone */}
      <rect x="69" y="43" width="2" height="2" fill="#fb923c" />
      <rect x="68" y="45" width="4" height="1" fill="#ffffff" />
      <rect x="68" y="46" width="4" height="2" fill="#fb923c" />
      <rect x="67" y="48" width="6" height="1" fill="#ea580c" />

      {/* Yellow & Ink Striped Barricade */}
      <rect x="74" y="41" width="16" height="5" fill="#0c0418" />
      <rect x="75" y="42" width="14" height="3" fill="#ffe500" />
      {/* Crisp diagonal hazard stripes */}
      <rect x="77" y="42" width="2" height="3" fill="#2a1147" />
      <rect x="81" y="42" width="2" height="3" fill="#2a1147" />
      <rect x="85" y="42" width="2" height="3" fill="#2a1147" />
      {/* Barricade legs */}
      <rect x="75" y="46" width="2" height="3" fill="#64748b" />
      <rect x="87" y="46" width="2" height="3" fill="#64748b" />
    </svg>
  );
}
