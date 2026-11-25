import React from "react";

type Pixel404IllustrationProps = {
  className?: string;
};

export default function Pixel404Illustration({
  className = "",
}: Pixel404IllustrationProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 210"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[440px] h-auto select-none [image-rendering:pixelated]"
        style={{ shapeRendering: "crispEdges" }}
        role="img"
        aria-label="Ilustrasi Pixel Art Retro Arcade Error 404"
      >
        <defs>
          {/* CRT Screen Scanline Pattern */}
          <pattern
            id="crt-scanlines"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="2" fill="#000000" opacity="0.25" />
          </pattern>
        </defs>

        {/* ========================================================
            1. RETRO PIXEL STARS & FLOATING DIMENSIONAL SHARDS
           ======================================================== */}
        <g className="animate-[sparkle_3s_ease-in-out_infinite] motion-reduce:animate-none" opacity="0.9">
          {/* Star 1 - Arcade Yellow (top left) */}
          <rect x="36" y="28" width="4" height="12" fill="#FFD43B" />
          <rect x="32" y="32" width="12" height="4" fill="#FFD43B" />
          <rect x="36" y="32" width="4" height="4" fill="#FFF5E9" />

          {/* Star 2 - Cyber Cyan (upper center) */}
          <rect x="80" y="14" width="4" height="10" fill="#68D5E8" />
          <rect x="77" y="17" width="10" height="4" fill="#68D5E8" />
          <rect x="80" y="17" width="4" height="4" fill="#FFF5E9" />

          {/* Star 3 - Arcade Yellow (top right) */}
          <rect x="272" y="22" width="4" height="12" fill="#FFD43B" />
          <rect x="268" y="26" width="12" height="4" fill="#FFD43B" />
          <rect x="272" y="26" width="4" height="4" fill="#FFF5E9" />

          {/* Star 4 - Vibrant Purple (far right) */}
          <rect x="296" y="74" width="4" height="10" fill="#9470E8" />
          <rect x="293" y="77" width="10" height="4" fill="#9470E8" />

          {/* Star 5 - Vibrant Purple (lower left) */}
          <rect x="26" y="96" width="4" height="10" fill="#9470E8" />
          <rect x="23" y="99" width="10" height="4" fill="#9470E8" />

          {/* Star 6 - Cyber Cyan (lower right) */}
          <rect x="282" y="138" width="4" height="10" fill="#68D5E8" />
          <rect x="279" y="141" width="10" height="4" fill="#68D5E8" />

          {/* Floating Dimensional Glitch Pixels */}
          <rect x="54" y="60" width="4" height="4" fill="#FFF5E9" opacity="0.8" />
          <rect x="66" y="38" width="6" height="6" fill="#503080" />
          <rect x="60" y="46" width="4" height="4" fill="#9470E8" />
          <rect x="228" y="26" width="6" height="6" fill="#9470E8" />
          <rect x="238" y="36" width="4" height="4" fill="#FFD43B" />
          <rect x="260" y="52" width="4" height="4" fill="#68D5E8" />
          <rect x="18" y="132" width="4" height="4" fill="#FFD43B" opacity="0.6" />
          <rect x="300" y="112" width="4" height="4" fill="#F276A5" opacity="0.7" />
        </g>

        {/* ========================================================
            2. GROUND SHADOW (FLOOR PIXELS)
           ======================================================== */}
        <g opacity="0.55">
          <rect x="74" y="184" width="138" height="6" fill="#0E0A1A" />
          <rect x="84" y="188" width="118" height="6" fill="#0E0A1A" />
          <rect x="96" y="192" width="94" height="4" fill="#0E0A1A" />
          {/* Shadow under floating ghost */}
          <rect x="222" y="182" width="42" height="6" fill="#0E0A1A" />
          <rect x="228" y="186" width="30" height="4" fill="#0E0A1A" />
        </g>

        {/* ========================================================
            3. ARCADE CABINET (RETRO 8-BIT MACHINE)
           ======================================================== */}
        <g id="arcade-cabinet">
          {/* --- Outer Silhouette / Shadow Border --- */}
          {/* Cabinet outer black/ink silhouette */}
          <path
            d="M 88 34 H 194 V 58 H 198 V 130 H 202 V 150 H 194 V 186 H 88 V 150 H 80 V 130 H 84 V 58 H 88 Z"
            fill="#0E0A1A"
          />

          {/* Side Outer Panels (Purple Arcade Wings) */}
          <path
            d="M 90 36 H 192 V 58 H 196 V 130 H 200 V 148 H 192 V 184 H 90 V 148 H 82 V 130 H 86 V 58 H 90 Z"
            fill="#171122"
          />
          {/* Purple Border Accents (#503080) along side edges */}
          <rect x="84" y="60" width="4" height="68" fill="#503080" />
          <rect x="194" y="60" width="4" height="68" fill="#503080" />
          <rect x="82" y="132" width="4" height="16" fill="#503080" />
          <rect x="196" y="132" width="4" height="16" fill="#503080" />
          <rect x="88" y="150" width="4" height="34" fill="#503080" />
          <rect x="190" y="150" width="4" height="34" fill="#503080" />

          {/* --- MARQUEE HEADER (Top Light Box) --- */}
          <rect x="94" y="38" width="94" height="20" fill="#39265E" />
          <rect x="96" y="40" width="90" height="16" fill="#FFD43B" />
          {/* Marquee Inner Dark Glow */}
          <rect x="98" y="42" width="86" height="12" fill="#171122" />
          {/* Pixel Text "4 0 4" on Marquee */}
          {/* '4' */}
          <rect x="126" y="44" width="2" height="5" fill="#FFD43B" />
          <rect x="126" y="47" width="6" height="2" fill="#FFD43B" />
          <rect x="130" y="44" width="2" height="8" fill="#FFD43B" />
          {/* '0' */}
          <rect x="138" y="44" width="6" height="8" fill="#FFD43B" />
          <rect x="140" y="46" width="2" height="4" fill="#171122" />
          {/* '4' */}
          <rect x="148" y="44" width="2" height="5" fill="#FFD43B" />
          <rect x="148" y="47" width="6" height="2" fill="#FFD43B" />
          <rect x="152" y="44" width="2" height="8" fill="#FFD43B" />

          {/* Marquee Left & Right Accent Lights */}
          <rect x="100" y="45" width="4" height="6" fill="#FFD43B" />
          <rect x="108" y="45" width="4" height="6" fill="#9470E8" />
          <rect x="170" y="45" width="4" height="6" fill="#9470E8" />
          <rect x="178" y="45" width="4" height="6" fill="#FFD43B" />

          {/* --- SPEAKER GRILL / BEVEL --- */}
          <rect x="92" y="58" width="98" height="8" fill="#211A35" />
          <rect x="102" y="61" width="78" height="2" fill="#0E0A1A" />
          <rect x="106" y="64" width="70" height="2" fill="#0E0A1A" />

          {/* --- CRT MONITOR BEZEL & SCREEN --- */}
          {/* Outer Monitor Frame */}
          <rect x="92" y="66" width="98" height="62" fill="#171122" />
          <rect x="94" y="68" width="94" height="58" stroke="#503080" strokeWidth="2" fill="#0E0A1A" />

          {/* CRT Screen Glass Background */}
          <rect x="98" y="72" width="86" height="50" fill="#12091F" />

          {/* Scanlines Overlay */}
          <rect x="98" y="72" width="86" height="50" fill="url(#crt-scanlines)" />

          {/* Screen Glitch Artifact Blocks */}
          <rect x="102" y="78" width="8" height="2" fill="#68D5E8" opacity="0.6" />
          <rect x="168" y="86" width="10" height="2" fill="#F276A5" opacity="0.5" />
          <rect x="110" y="112" width="12" height="2" fill="#9470E8" opacity="0.4" />

          {/* --- BIG 8-BIT ERROR "404" ON CRT SCREEN --- */}
          {/* Glitch Offset Ghosting Behind 404 */}
          <g opacity="0.3" transform="translate(-1, 0)">
            {/* Cyan Glitch Shift */}
            {/* '4' */}
            <path d="M 108 80 V 94 H 118 V 104 H 122 V 80 H 118 V 90 H 112 V 80 Z" fill="#68D5E8" />
            {/* '0' */}
            <path d="M 130 80 H 146 V 104 H 130 Z M 134 84 V 100 H 142 V 84 Z" fill="#68D5E8" />
            {/* '4' */}
            <path d="M 154 80 V 94 H 164 V 104 H 168 V 80 H 164 V 90 H 158 V 80 Z" fill="#68D5E8" />
          </g>

          <g opacity="0.3" transform="translate(1, 1)">
            {/* Pink Glitch Shift */}
            {/* '4' */}
            <path d="M 108 80 V 94 H 118 V 104 H 122 V 80 H 118 V 90 H 112 V 80 Z" fill="#F276A5" />
            {/* '0' */}
            <path d="M 130 80 H 146 V 104 H 130 Z M 134 84 V 100 H 142 V 84 Z" fill="#F276A5" />
            {/* '4' */}
            <path d="M 154 80 V 94 H 164 V 104 H 168 V 80 H 164 V 90 H 158 V 80 Z" fill="#F276A5" />
          </g>

          {/* 404 Drop Shadow (Dark Orange #C37D29) */}
          <g transform="translate(2, 2)">
            {/* '4' */}
            <path d="M 108 80 V 94 H 118 V 104 H 122 V 80 H 118 V 90 H 112 V 80 Z" fill="#C37D29" />
            {/* '0' */}
            <path d="M 130 80 H 146 V 104 H 130 Z M 134 84 V 100 H 142 V 84 Z" fill="#C37D29" />
            {/* '4' */}
            <path d="M 154 80 V 94 H 164 V 104 H 168 V 80 H 164 V 90 H 158 V 80 Z" fill="#C37D29" />
          </g>

          {/* Main 404 Pixels (Arcade Yellow #FFD43B) */}
          <g id="main-404-digits">
            {/* '4' (First digit) */}
            <path
              d="M 108 80 V 94 H 118 V 104 H 122 V 80 H 118 V 90 H 112 V 80 Z"
              fill="#FFD43B"
            />
            {/* '0' (Middle digit) */}
            <path
              d="M 130 80 H 146 V 104 H 130 Z M 134 84 V 100 H 142 V 84 Z"
              fill="#FFD43B"
            />
            {/* '4' (Last digit) */}
            <path
              d="M 154 80 V 94 H 164 V 104 H 168 V 80 H 164 V 90 H 158 V 80 Z"
              fill="#FFD43B"
            />
          </g>

          {/* Screen Sub-Banner: "[ NOT FOUND ]" */}
          <g id="screen-status-badge">
            <rect x="112" y="110" width="58" height="8" fill="#171122" stroke="#503080" strokeWidth="1" />
            {/* Blinking Red/Amber indicator dot */}
            <rect x="115" y="112" width="4" height="4" fill="#EF4444" />
            {/* Micro pixel letters "OFFLINE" */}
            <rect x="122" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="126" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="130" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="134" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="138" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="142" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="146" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="150" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="154" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="158" y="113" width="2" height="3" fill="#FFF5E9" />
            <rect x="162" y="113" width="4" height="2" fill="#FFD43B" />
          </g>

          {/* --- ARCADE CONTROL PANEL (DECK) --- */}
          {/* Deck Base */}
          <rect x="80" y="128" width="122" height="18" fill="#25183E" stroke="#503080" strokeWidth="2" />
          {/* Deck Bevel Highlight */}
          <rect x="82" y="130" width="118" height="2" fill="#9470E8" opacity="0.8" />

          {/* 8-bit Joystick */}
          <rect x="100" y="138" width="12" height="4" fill="#0E0A1A" />
          <rect x="105" y="132" width="2" height="8" fill="#FFF5E9" />
          {/* Joystick Ball Knob (#FFD43B) */}
          <rect x="102" y="126" width="8" height="8" fill="#FFD43B" />
          <rect x="104" y="128" width="4" height="4" fill="#FFF5E9" />
          <rect x="102" y="132" width="8" height="2" fill="#C37D29" />

          {/* Arcade Push Buttons */}
          {/* Button 1: Cyber Cyan */}
          <rect x="130" y="134" width="8" height="8" fill="#0E0A1A" />
          <rect x="131" y="135" width="6" height="6" fill="#68D5E8" />
          <rect x="132" y="136" width="2" height="2" fill="#FFF5E9" />

          {/* Button 2: Arcade Yellow */}
          <rect x="144" y="132" width="8" height="8" fill="#0E0A1A" />
          <rect x="145" y="133" width="6" height="6" fill="#FFD43B" />
          <rect x="146" y="134" width="2" height="2" fill="#FFF5E9" />

          {/* Button 3: Arcade Pink */}
          <rect x="158" y="134" width="8" height="8" fill="#0E0A1A" />
          <rect x="159" y="135" width="6" height="6" fill="#F276A5" />
          <rect x="160" y="136" width="2" height="2" fill="#FFF5E9" />

          {/* 1P / 2P Small Buttons */}
          <rect x="176" y="134" width="4" height="4" fill="#FFF5E9" />
          <rect x="184" y="134" width="4" height="4" fill="#FFF5E9" />

          {/* --- LOWER CABINET & COIN DOOR --- */}
          <rect x="88" y="146" width="106" height="38" fill="#171122" />
          {/* Center decorative panel */}
          <rect x="94" y="150" width="94" height="32" fill="#120B1E" stroke="#39265E" strokeWidth="2" />

          {/* Coin Door Frame */}
          <rect x="114" y="154" width="54" height="24" fill="#171122" stroke="#503080" strokeWidth="2" />
          {/* Dual Coin Slots */}
          <rect x="122" y="158" width="12" height="8" fill="#FFD43B" />
          <rect x="126" y="160" width="4" height="4" fill="#0E0A1A" />

          <rect x="148" y="158" width="12" height="8" fill="#FFD43B" />
          <rect x="152" y="160" width="4" height="4" fill="#0E0A1A" />

          {/* Coin Return Reject Buttons */}
          <rect x="124" y="168" width="8" height="4" fill="#F5A05E" />
          <rect x="150" y="168" width="8" height="4" fill="#F5A05E" />
        </g>

        {/* ========================================================
            4. DISCONNECTED POWER CABLE & SPARKS (FAILURE CAUSE!)
           ======================================================== */}
        <g id="unplugged-cable">
          {/* Thick black/purple cord trailing from lower right */}
          <path
            d="M 194 168 H 202 V 176 H 208 V 182 H 216 V 186 H 224"
            stroke="#503080"
            strokeWidth="4"
            fill="none"
          />
          {/* Detached 2-Prong Wall Plug Body */}
          <rect x="224" y="180" width="8" height="10" fill="#171122" stroke="#503080" strokeWidth="1" />
          {/* Metal Prongs */}
          <rect x="232" y="182" width="6" height="2" fill="#FFF5E9" />
          <rect x="232" y="186" width="6" height="2" fill="#FFF5E9" />

          {/* Electric Sparks popping out from unplugged prongs (⚡) */}
          <g className="animate-[sparkle_1.5s_ease-in-out_infinite] motion-reduce:animate-none">
            {/* Spark 1 */}
            <rect x="240" y="176" width="4" height="4" fill="#FFD43B" />
            <rect x="244" y="174" width="2" height="2" fill="#FFF5E9" />
            <rect x="242" y="180" width="4" height="4" fill="#FFD43B" />
            {/* Spark 2 */}
            <rect x="238" y="188" width="4" height="4" fill="#FFD43B" />
            <rect x="244" y="186" width="4" height="4" fill="#68D5E8" />
          </g>
        </g>

        {/* ========================================================
            5. CONFUSED PIXEL ARCADE GHOST (RETRO MASCOT)
           ======================================================== */}
        <g id="confused-ghost" className="animate-[float-slow_3.5s_ease-in-out_infinite] motion-reduce:animate-none">
          {/* --- FLOATING 8-BIT QUESTION MARK '?' OVER GHOST HEAD --- */}
          <g id="question-mark" transform="translate(240, 42)">
            {/* Dark Outline */}
            <path
              d="M 4 0 H 16 V 4 H 20 V 12 H 16 V 16 H 12 V 20 H 8 V 16 H 12 V 12 H 16 V 4 H 4 Z"
              fill="#0E0A1A"
            />
            <rect x="8" y="24" width="4" height="4" fill="#0E0A1A" />

            {/* Glowing Yellow '?' Pixels */}
            <rect x="6" y="2" width="8" height="4" fill="#FFD43B" />
            <rect x="12" y="6" width="4" height="6" fill="#FFD43B" />
            <rect x="8" y="12" width="4" height="6" fill="#FFD43B" />
            {/* Question mark dot */}
            <rect x="8" y="22" width="4" height="4" fill="#FFD43B" />
            <rect x="9" y="23" width="2" height="2" fill="#FFF5E9" />
          </g>

          {/* --- GHOST BODY (8-bit Silhouette & Shading) --- */}
          {/* Black Outer Ink Outline */}
          <path
            d="M 226 84 H 258 V 88 H 262 V 92 H 266 V 126 H 262 V 122 H 258 V 126 H 250 V 122 H 246 V 126 H 238 V 122 H 234 V 126 H 226 V 122 H 222 V 126 H 218 V 92 H 222 V 88 H 226 Z"
            fill="#0E0A1A"
          />

          {/* Main Body (Vibrant Purple #9470E8) */}
          <path
            d="M 228 86 H 256 V 90 H 260 V 94 H 264 V 124 H 260 V 120 H 256 V 124 H 248 V 120 H 244 V 124 H 236 V 120 H 232 V 124 H 224 V 120 H 220 V 94 H 224 V 90 H 228 Z"
            fill="#9470E8"
          />

          {/* Top Highlight (#FFF5E9/B7ABCE) */}
          <rect x="232" y="88" width="16" height="2" fill="#FFF5E9" opacity="0.6" />
          <rect x="228" y="90" width="6" height="4" fill="#FFF5E9" opacity="0.5" />

          {/* Bottom Tentacle Shading (#503080) */}
          <rect x="222" y="114" width="40" height="6" fill="#503080" />
          <rect x="224" y="118" width="6" height="4" fill="#39265E" />
          <rect x="236" y="118" width="6" height="4" fill="#39265E" />
          <rect x="248" y="118" width="6" height="4" fill="#39265E" />

          {/* --- CONFUSED RETRO EYES (O_O with question/spiral pupils) --- */}
          {/* Left Eye Sclera */}
          <rect x="228" y="96" width="10" height="12" fill="#FFF5E9" stroke="#0E0A1A" strokeWidth="1" />
          {/* Right Eye Sclera */}
          <rect x="244" y="96" width="10" height="12" fill="#FFF5E9" stroke="#0E0A1A" strokeWidth="1" />

          {/* Confused Pupils looking left toward broken machine */}
          {/* Left Pupil 'X' or shifted dot */}
          <rect x="230" y="100" width="4" height="4" fill="#0E0A1A" />
          <rect x="231" y="101" width="2" height="2" fill="#68D5E8" />

          {/* Right Pupil looking left */}
          <rect x="246" y="100" width="4" height="4" fill="#0E0A1A" />
          <rect x="247" y="101" width="2" height="2" fill="#68D5E8" />

          {/* Confused Squiggle Mouth */}
          <rect x="236" y="110" width="4" height="2" fill="#0E0A1A" />
          <rect x="240" y="111" width="4" height="2" fill="#0E0A1A" />
          <rect x="244" y="110" width="4" height="2" fill="#0E0A1A" />
        </g>
      </svg>
    </div>
  );
}
