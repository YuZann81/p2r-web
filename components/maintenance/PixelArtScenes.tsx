import React from "react";

interface SceneProps {
  className?: string;
}

/**
 * 16-bit Pixel-Art Scene: System Degraded
 * Transparent-sky 112x56 integer pixel diorama (crispEdges) designed to sit
 * directly on the full-viewport arcade ground horizon without any card frame.
 * Depicts a small P2R robot technician repairing an upright arcade machine.
 */
export function SystemDegradedPixelScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 112 56"
      width="1120"
      height="560"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ilustrasi pixel-art robot teknisi kecil sedang memperbaiki mesin arcade P2R"
      className={`block select-none [image-rendering:pixelated] ${className}`}
    >
      {/* Subtle floating pixel ambience integrated into page sky */}
      <rect x="8" y="10" width="1" height="1" fill="#ffe500" opacity="0.85" />
      <rect x="16" y="4" width="1" height="1" fill="#22d3ee" opacity="0.7" />
      <rect x="64" y="6" width="1" height="1" fill="#c4b5fd" opacity="0.75" />
      <rect x="92" y="12" width="1" height="1" fill="#ffe500" opacity="0.8" />
      <rect x="103" y="7" width="1" height="1" fill="#22d3ee" opacity="0.7" />
      <rect x="78" y="16" width="1" height="1" fill="#fb923c" opacity="0.75" />

      {/* Ground contact shadows flush with bottom arcade floor (y=52) */}
      <rect x="15" y="51" width="42" height="3" fill="#0c0418" opacity="0.75" />
      <rect x="61" y="51" width="23" height="3" fill="#0c0418" opacity="0.75" />
      <rect x="86" y="51" width="15" height="2" fill="#0c0418" opacity="0.7" />

      {/* === UPRIGHT RETRO P2R ARCADE MACHINE (x=19..54, y=5..52) === */}
      {/* Outer cabinet silhouette */}
      <rect x="20" y="5" width="32" height="47" fill="#0c0418" />
      {/* Slanted top marquee hood */}
      <rect x="19" y="6" width="34" height="9" fill="#0c0418" />
      <rect x="20" y="7" width="32" height="7" fill="#4c2396" />
      <rect x="20" y="7" width="32" height="1" fill="#7c53f5" />
      <rect x="50" y="8" width="2" height="6" fill="#2a1147" />
      {/* Lit arcade marquee display */}
      <rect x="22" y="8" width="28" height="5" fill="#160829" />
      <rect x="23" y="9" width="26" height="3" fill="#5b2be6" />
      <rect x="24" y="10" width="2" height="1" fill="#ef4444" />
      <rect x="27" y="10" width="2" height="1" fill="#fb923c" />
      <rect x="31" y="10" width="10" height="1" fill="#ffe500" />
      <rect x="43" y="10" width="2" height="1" fill="#fb923c" />
      <rect x="46" y="10" width="2" height="1" fill="#ef4444" />

      {/* Upper cabinet body & CRT screen bay */}
      <rect x="21" y="15" width="30" height="16" fill="#3a2166" />
      <rect x="21" y="15" width="1" height="16" fill="#5b37a0" />
      <rect x="49" y="15" width="2" height="16" fill="#231242" />
      {/* Recessed CRT bezel & glass */}
      <rect x="23" y="16" width="26" height="13" fill="#120722" />
      <rect x="24" y="17" width="24" height="11" fill="#091526" />
      {/* Subtle CRT scanlines */}
      <rect x="24" y="18" width="24" height="1" fill="#0f233d" />
      <rect x="24" y="21" width="24" height="1" fill="#0f233d" />
      <rect x="24" y="24" width="24" height="1" fill="#0f233d" />
      <rect x="24" y="27" width="24" height="1" fill="#0f233d" />
      {/* Glass corner glint */}
      <rect x="25" y="18" width="3" height="1" fill="#22d3ee" opacity="0.4" />
      <rect x="25" y="19" width="1" height="2" fill="#22d3ee" opacity="0.3" />

      {/* CRT Diagnostic Warning Emblem (!) */}
      <rect x="29" y="19" width="2" height="1" fill="#ffe500" />
      <rect x="28" y="20" width="4" height="1" fill="#ffe500" />
      <rect x="27" y="21" width="6" height="2" fill="#fb923c" />
      <rect x="26" y="23" width="8" height="2" fill="#ef4444" />
      <rect x="26" y="25" width="8" height="1" fill="#dc2626" />
      <rect x="29" y="20" width="2" height="3" fill="#120722" />
      <rect x="29" y="24" width="2" height="1" fill="#120722" />

      {/* CRT Glitch / Signal Waveform */}
      <rect x="36" y="23" width="2" height="1" fill="#22d3ee" />
      <rect x="38" y="21" width="1" height="2" fill="#22d3ee" />
      <rect x="39" y="20" width="1" height="5" fill="#fb923c" />
      <rect x="40" y="24" width="1" height="2" fill="#fb923c" />
      <rect x="41" y="23" width="2" height="1" fill="#ef4444" />
      <rect x="44" y="23" width="2" height="1" fill="#ef4444" />
      <rect x="36" y="26" width="4" height="1" fill="#fb923c" />
      <rect x="41" y="26" width="5" height="1" fill="#475569" />

      {/* Protruding Arcade Control Deck (Joystick + Buttons) */}
      <rect x="17" y="30" width="38" height="5" fill="#0c0418" />
      <rect x="18" y="31" width="36" height="3" fill="#5b2be6" />
      <rect x="18" y="31" width="36" height="1" fill="#8b65ff" />
      {/* Arcade Joystick */}
      <rect x="24" y="29" width="2" height="2" fill="#cbd5e1" />
      <rect x="23" y="27" width="4" height="2" fill="#ef4444" />
      <rect x="24" y="27" width="1" height="1" fill="#fca5a5" />
      {/* Arcade Buttons */}
      <rect x="33" y="31" width="3" height="1" fill="#ffe500" />
      <rect x="38" y="31" width="3" height="1" fill="#22d3ee" />
      <rect x="43" y="31" width="3" height="1" fill="#7ac70c" />

      {/* Lower Cabinet Body + Open Service Access Panel */}
      <rect x="21" y="35" width="30" height="16" fill="#321b59" />
      <rect x="21" y="35" width="1" height="16" fill="#4d2c87" />
      <rect x="49" y="35" width="2" height="16" fill="#1e0f38" />
      {/* Coin slot trim on left */}
      <rect x="23" y="37" width="5" height="6" fill="#160829" />
      <rect x="24" y="38" width="3" height="2" fill="#ef4444" />
      <rect x="25" y="41" width="1" height="1" fill="#ffe500" />

      {/* Open Circuit Service Bay on right side of lower cabinet */}
      <rect x="30" y="37" width="19" height="11" fill="#090d1a" />
      {/* Green/cyan PCB inside bay */}
      <rect x="31" y="38" width="14" height="9" fill="#14532d" />
      <rect x="32" y="39" width="12" height="7" fill="#166534" />
      <rect x="33" y="40" width="4" height="1" fill="#22d3ee" />
      <rect x="36" y="41" width="1" height="2" fill="#22d3ee" />
      <rect x="37" y="43" width="5" height="1" fill="#7ac70c" />
      <rect x="39" y="40" width="4" height="2" fill="#0f172a" />
      <rect x="40" y="40" width="2" height="1" fill="#94a3b8" />
      <rect x="33" y="43" width="2" height="2" fill="#fbbf24" />
      {/* Hinged access door swung open downward-right */}
      <rect x="14" y="40" width="5" height="9" fill="#0c0418" />
      <rect x="15" y="41" width="3" height="7" fill="#64748b" />
      <rect x="15" y="41" width="1" height="7" fill="#94a3b8" />
      <rect x="19" y="41" width="2" height="1" fill="#94a3b8" />
      <rect x="19" y="47" width="2" height="1" fill="#94a3b8" />

      {/* Crisp Electric Spark Clusters */}
      <rect x="46" y="39" width="1" height="1" fill="#fb923c" />
      <rect x="46" y="40" width="1" height="1" fill="#ffffff" />
      <rect x="45" y="40" width="1" height="1" fill="#ffe500" />
      <rect x="47" y="40" width="1" height="1" fill="#ffe500" />
      <rect x="46" y="41" width="1" height="1" fill="#fb923c" />
      <rect x="48" y="45" width="1" height="1" fill="#ffe500" />
      <rect x="47" y="46" width="1" height="1" fill="#fb923c" />
      <rect x="49" y="46" width="1" height="1" fill="#fb923c" />

      {/* Floor diagnostic cable */}
      <rect x="46" y="49" width="2" height="2" fill="#0891b2" />
      <rect x="48" y="50" width="7" height="1" fill="#22d3ee" />
      <rect x="55" y="51" width="5" height="1" fill="#0891b2" />
      <rect x="60" y="50" width="3" height="1" fill="#22d3ee" />

      {/* === SMALL 16-BIT ROBOT TECHNICIAN (x=63..82, y=24..52) === */}
      {/* Compact scale relative to the tall upright arcade cabinet */}
      {/* Antenna */}
      <rect x="72" y="21" width="2" height="2" fill="#22d3ee" />
      <rect x="72" y="21" width="1" height="1" fill="#ffffff" />
      <rect x="72" y="23" width="2" height="2" fill="#64748b" />

      {/* Robot Head */}
      <rect x="66" y="25" width="14" height="10" fill="#0c0418" />
      <rect x="67" y="26" width="12" height="8" fill="#94a3b8" />
      <rect x="67" y="26" width="12" height="2" fill="#e2e8f0" />
      <rect x="77" y="28" width="2" height="6" fill="#64748b" />
      {/* Side ear bolts */}
      <rect x="65" y="28" width="1" height="3" fill="#ffe500" />
      <rect x="80" y="28" width="1" height="3" fill="#d99b00" />
      {/* Dark visor & focused cyan eyes looking left at the machine */}
      <rect x="68" y="28" width="9" height="4" fill="#0f172a" />
      <rect x="69" y="29" width="2" height="2" fill="#22d3ee" />
      <rect x="69" y="29" width="1" height="1" fill="#ffffff" />
      <rect x="73" y="29" width="2" height="2" fill="#22d3ee" />
      <rect x="73" y="29" width="1" height="1" fill="#ffffff" />

      {/* Neck */}
      <rect x="70" y="35" width="6" height="1" fill="#475569" />

      {/* Robot Torso with P2R Violet Vest */}
      <rect x="65" y="36" width="16" height="10" fill="#0c0418" />
      <rect x="66" y="37" width="14" height="8" fill="#5b2be6" />
      <rect x="66" y="37" width="14" height="1" fill="#7c53f5" />
      <rect x="78" y="38" width="2" height="7" fill="#3d1ba3" />
      {/* Chest badge */}
      <rect x="69" y="39" width="7" height="3" fill="#1e1038" />
      <rect x="70" y="40" width="2" height="1" fill="#ffe500" />
      <rect x="73" y="40" width="2" height="1" fill="#7ac70c" />
      {/* Utility belt */}
      <rect x="66" y="43" width="14" height="2" fill="#b98b00" />
      <rect x="71" y="43" width="4" height="2" fill="#ffe500" />

      {/* Left Arm + Pixel Wrench reaching into the arcade circuit bay */}
      <rect x="56" y="39" width="10" height="3" fill="#0c0418" />
      <rect x="57" y="40" width="9" height="1" fill="#cbd5e1" />
      <rect x="56" y="40" width="2" height="1" fill="#ffe500" />
      {/* Silver Pixel Wrench */}
      <rect x="50" y="40" width="6" height="2" fill="#e2e8f0" />
      <rect x="51" y="41" width="5" height="1" fill="#94a3b8" />
      <rect x="48" y="38" width="3" height="2" fill="#e2e8f0" />
      <rect x="48" y="42" width="3" height="2" fill="#cbd5e1" />

      {/* Right Arm */}
      <rect x="80" y="38" width="3" height="6" fill="#0c0418" />
      <rect x="81" y="39" width="1" height="4" fill="#cbd5e1" />

      {/* Compact Legs & Boots */}
      <rect x="67" y="46" width="4" height="4" fill="#0c0418" />
      <rect x="68" y="46" width="2" height="3" fill="#64748b" />
      <rect x="66" y="49" width="5" height="3" fill="#0c0418" />
      <rect x="67" y="50" width="3" height="1" fill="#ffe500" />

      <rect x="75" y="46" width="4" height="4" fill="#0c0418" />
      <rect x="76" y="46" width="2" height="3" fill="#64748b" />
      <rect x="75" y="49" width="5" height="3" fill="#0c0418" />
      <rect x="76" y="50" width="3" height="1" fill="#ffe500" />

      {/* === PIXEL TOOLBOX (x=87..99, y=44..52) === */}
      <rect x="90" y="43" width="6" height="2" fill="#0c0418" />
      <rect x="91" y="44" width="4" height="1" fill="#cbd5e1" />
      <rect x="87" y="45" width="12" height="7" fill="#0c0418" />
      <rect x="88" y="46" width="10" height="5" fill="#dc2626" />
      <rect x="88" y="46" width="10" height="1" fill="#ef4444" />
      <rect x="88" y="48" width="10" height="1" fill="#991b1b" />
      <rect x="92" y="47" width="2" height="2" fill="#ffe500" />
    </svg>
  );
}

/**
 * 16-bit Pixel-Art Scene: Scheduled Maintenance
 * Transparent-sky 112x56 integer pixel diorama (crispEdges) sharing the exact
 * scale, palette, and ground horizon as SystemDegradedPixelScene.
 * Depicts the P2R world under construction and scheduled upgrade.
 */
export function ScheduledMaintenancePixelScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 112 56"
      width="1120"
      height="560"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ilustrasi pixel-art konstruksi dan peningkatan dunia Pixels to Reality"
      className={`block select-none [image-rendering:pixelated] ${className}`}
    >
      {/* Subtle floating pixel ambience integrated into page sky */}
      <rect x="12" y="9" width="1" height="1" fill="#ffe500" opacity="0.85" />
      <rect x="24" y="14" width="1" height="1" fill="#22d3ee" opacity="0.75" />
      <rect x="36" y="5" width="1" height="1" fill="#c4b5fd" opacity="0.75" />
      <rect x="74" y="4" width="1" height="1" fill="#ffe500" opacity="0.8" />
      <rect x="103" y="10" width="1" height="1" fill="#22d3ee" opacity="0.75" />

      {/* Ground contact shadows flush with bottom arcade floor (y=52) */}
      <rect x="11" y="51" width="16" height="2" fill="#0c0418" opacity="0.75" />
      <rect x="30" y="51" width="49" height="3" fill="#0c0418" opacity="0.75" />
      <rect x="81" y="51" width="22" height="2" fill="#0c0418" opacity="0.7" />

      {/* === OVERHEAD PIXEL CONSTRUCTION CRANE (Right Mast + Boom) === */}
      {/* Crane vertical mast */}
      <rect x="86" y="7" width="6" height="45" fill="#0c0418" />
      <rect x="87" y="8" width="1" height="43" fill="#ffe500" />
      <rect x="90" y="8" width="1" height="43" fill="#d99b00" />
      <rect x="88" y="11" width="2" height="1" fill="#ffe500" />
      <rect x="88" y="16" width="2" height="1" fill="#d99b00" />
      <rect x="88" y="21" width="2" height="1" fill="#ffe500" />
      <rect x="88" y="26" width="2" height="1" fill="#d99b00" />
      <rect x="88" y="31" width="2" height="1" fill="#ffe500" />
      <rect x="88" y="36" width="2" height="1" fill="#d99b00" />
      <rect x="88" y="41" width="2" height="1" fill="#ffe500" />
      <rect x="88" y="46" width="2" height="1" fill="#d99b00" />
      {/* Mast safety beacon */}
      <rect x="88" y="5" width="2" height="2" fill="#ef4444" />
      <rect x="88" y="5" width="1" height="1" fill="#ffe500" />

      {/* Horizontal crane boom */}
      <rect x="44" y="7" width="56" height="5" fill="#0c0418" />
      <rect x="45" y="8" width="54" height="1" fill="#ffe500" />
      <rect x="45" y="10" width="54" height="1" fill="#d99b00" />
      <rect x="48" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="54" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="60" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="66" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="72" y="9" width="1" height="1" fill="#ffe500" />
      <rect x="78" y="9" width="1" height="1" fill="#ffe500" />
      {/* Counterweight */}
      <rect x="94" y="9" width="6" height="4" fill="#64748b" />
      <rect x="94" y="9" width="6" height="1" fill="#94a3b8" />

      {/* Hoist Trolley, Cable & Radiant P2R Upgrade Core */}
      <rect x="52" y="11" width="6" height="3" fill="#475569" />
      <rect x="53" y="12" width="4" height="1" fill="#cbd5e1" />
      <rect x="54" y="14" width="2" height="6" fill="#94a3b8" />
      <rect x="55" y="14" width="1" height="6" fill="#e2e8f0" />
      <rect x="53" y="19" width="4" height="2" fill="#ffe500" />

      {/* Radiant P2R Upgrade Core Crystal being lowered */}
      <rect x="54" y="21" width="2" height="1" fill="#ffffff" />
      <rect x="52" y="22" width="6" height="1" fill="#ffe500" />
      <rect x="51" y="23" width="8" height="3" fill="#ffe500" />
      <rect x="52" y="23" width="6" height="2" fill="#22d3ee" />
      <rect x="54" y="23" width="2" height="2" fill="#ffffff" />
      <rect x="52" y="26" width="6" height="1" fill="#d99b00" />
      <rect x="54" y="27" width="2" height="1" fill="#ffe500" />
      {/* Symmetrical upgrade sparkles */}
      <rect x="48" y="22" width="1" height="1" fill="#22d3ee" />
      <rect x="61" y="22" width="1" height="1" fill="#22d3ee" />
      <rect x="49" y="26" width="1" height="1" fill="#ffe500" />
      <rect x="60" y="26" width="1" height="1" fill="#ffe500" />

      {/* === P2R CYBER ARCADE MONUMENT UNDER UPGRADE (x=39..71, y=29..52) === */}
      <rect x="39" y="29" width="32" height="23" fill="#0c0418" />
      <rect x="40" y="30" width="30" height="21" fill="#431fb8" />
      <rect x="40" y="30" width="30" height="2" fill="#5b2be6" />
      <rect x="40" y="30" width="30" height="1" fill="#7c53f5" />
      <rect x="68" y="31" width="2" height="20" fill="#2a1147" />
      {/* Glowing cyan receiving slot */}
      <rect x="50" y="29" width="10" height="2" fill="#0e7490" />
      <rect x="51" y="30" width="8" height="1" fill="#22d3ee" />

      {/* Monument Upgrade Display Screen */}
      <rect x="43" y="33" width="24" height="13" fill="#160829" />
      <rect x="44" y="34" width="22" height="11" fill="#0b152b" />
      {/* Upward Upgrade Chevrons */}
      <rect x="54" y="36" width="2" height="1" fill="#ffe500" />
      <rect x="52" y="37" width="6" height="1" fill="#ffe500" />
      <rect x="50" y="38" width="3" height="1" fill="#22d3ee" />
      <rect x="57" y="38" width="3" height="1" fill="#22d3ee" />
      <rect x="49" y="39" width="2" height="1" fill="#22d3ee" />
      <rect x="59" y="39" width="2" height="1" fill="#22d3ee" />
      <rect x="54" y="40" width="2" height="1" fill="#7ac70c" />
      <rect x="52" y="41" width="6" height="1" fill="#7ac70c" />
      <rect x="51" y="42" width="2" height="1" fill="#22d3ee" />
      <rect x="57" y="42" width="2" height="1" fill="#22d3ee" />
      {/* Pedestal trim */}
      <rect x="40" y="48" width="30" height="3" fill="#2a1147" />
      <rect x="42" y="49" width="4" height="1" fill="#ffe500" />
      <rect x="53" y="49" width="4" height="1" fill="#22d3ee" />
      <rect x="64" y="49" width="4" height="1" fill="#ffe500" />

      {/* === CONSTRUCTION SCAFFOLDING FLANKING MONUMENT === */}
      {/* Left Scaffold */}
      <rect x="33" y="24" width="1" height="28" fill="#94a3b8" />
      <rect x="38" y="24" width="1" height="28" fill="#94a3b8" />
      <rect x="32" y="28" width="8" height="2" fill="#d99b00" />
      <rect x="32" y="28" width="8" height="1" fill="#ffe500" />
      <rect x="32" y="39" width="8" height="2" fill="#d99b00" />
      <rect x="32" y="39" width="8" height="1" fill="#ffe500" />
      <rect x="34" y="31" width="1" height="1" fill="#64748b" />
      <rect x="35" y="33" width="2" height="1" fill="#64748b" />
      <rect x="37" y="35" width="1" height="1" fill="#64748b" />
      <rect x="34" y="43" width="1" height="1" fill="#64748b" />
      <rect x="35" y="45" width="2" height="1" fill="#64748b" />
      <rect x="37" y="47" width="1" height="1" fill="#64748b" />

      {/* Right Scaffold */}
      <rect x="71" y="24" width="1" height="28" fill="#94a3b8" />
      <rect x="76" y="24" width="1" height="28" fill="#94a3b8" />
      <rect x="70" y="28" width="8" height="2" fill="#d99b00" />
      <rect x="70" y="28" width="8" height="1" fill="#ffe500" />
      <rect x="70" y="39" width="8" height="2" fill="#d99b00" />
      <rect x="70" y="39" width="8" height="1" fill="#ffe500" />
      <rect x="72" y="31" width="1" height="1" fill="#64748b" />
      <rect x="73" y="33" width="2" height="1" fill="#64748b" />
      <rect x="75" y="35" width="1" height="1" fill="#64748b" />
      <rect x="72" y="43" width="1" height="1" fill="#64748b" />
      <rect x="73" y="45" width="2" height="1" fill="#64748b" />
      <rect x="75" y="47" width="1" height="1" fill="#64748b" />

      {/* === SMALL 16-BIT BUILDER BOT IN HARD HAT (x=12..29, y=27..52) === */}
      {/* Yellow Safety Hard Hat */}
      <rect x="14" y="27" width="10" height="4" fill="#0c0418" />
      <rect x="15" y="28" width="8" height="3" fill="#ffe500" />
      <rect x="16" y="28" width="4" height="1" fill="#ffffff" />
      <rect x="13" y="31" width="12" height="2" fill="#0c0418" />
      <rect x="14" y="31" width="10" height="1" fill="#d99b00" />

      {/* Builder Bot Head */}
      <rect x="14" y="33" width="10" height="7" fill="#0c0418" />
      <rect x="15" y="33" width="8" height="6" fill="#94a3b8" />
      <rect x="15" y="33" width="8" height="1" fill="#e2e8f0" />
      <rect x="16" y="34" width="7" height="4" fill="#0f172a" />
      <rect x="17" y="35" width="2" height="2" fill="#22d3ee" />
      <rect x="17" y="35" width="1" height="1" fill="#ffffff" />
      <rect x="20" y="35" width="2" height="2" fill="#22d3ee" />
      <rect x="20" y="35" width="1" height="1" fill="#ffffff" />

      {/* High-Vis Builder Torso */}
      <rect x="13" y="40" width="12" height="7" fill="#0c0418" />
      <rect x="14" y="41" width="10" height="5" fill="#5b2be6" />
      <rect x="14" y="41" width="2" height="5" fill="#ffe500" />
      <rect x="22" y="41" width="2" height="5" fill="#ffe500" />
      <rect x="16" y="43" width="6" height="1" fill="#ffe500" />

      {/* Held Cyan Blueprint */}
      <rect x="23" y="39" width="7" height="6" fill="#0c0418" />
      <rect x="24" y="40" width="5" height="4" fill="#0891b2" />
      <rect x="25" y="41" width="3" height="1" fill="#ffffff" />
      <rect x="25" y="43" width="2" height="1" fill="#22d3ee" />

      {/* Legs & Boots */}
      <rect x="14" y="47" width="4" height="5" fill="#0c0418" />
      <rect x="15" y="47" width="2" height="3" fill="#64748b" />
      <rect x="15" y="50" width="3" height="1" fill="#ffe500" />
      <rect x="20" y="47" width="4" height="5" fill="#0c0418" />
      <rect x="21" y="47" width="2" height="3" fill="#64748b" />
      <rect x="21" y="50" width="3" height="1" fill="#ffe500" />

      {/* === CONSTRUCTION SAFETY CONE & BARRICADE (x=78..102, y=44..52) === */}
      {/* Safety Cone */}
      <rect x="79" y="46" width="2" height="2" fill="#fb923c" />
      <rect x="78" y="48" width="4" height="1" fill="#ffffff" />
      <rect x="78" y="49" width="4" height="2" fill="#fb923c" />
      <rect x="77" y="51" width="6" height="1" fill="#ea580c" />

      {/* Yellow & Ink Striped Barricade */}
      <rect x="85" y="44" width="16" height="5" fill="#0c0418" />
      <rect x="86" y="45" width="14" height="3" fill="#ffe500" />
      <rect x="88" y="45" width="2" height="3" fill="#2a1147" />
      <rect x="92" y="45" width="2" height="3" fill="#2a1147" />
      <rect x="96" y="45" width="2" height="3" fill="#2a1147" />
      <rect x="86" y="49" width="2" height="3" fill="#64748b" />
      <rect x="98" y="49" width="2" height="3" fill="#64748b" />
    </svg>
  );
}
