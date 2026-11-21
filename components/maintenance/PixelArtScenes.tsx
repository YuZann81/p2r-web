import React from "react";

interface SceneProps {
  className?: string;
}

/**
 * 16-bit Isometric Pixel-Art Diorama: System Degraded
 * Strict 120x92 integer pixel canvas (shapeRendering="crispEdges") designed to
 * sit directly on the #1c0e32 background canvas with zero framing or card box.
 * Depicts a 3/4 rear-left isometric purple arcade cabinet with cyan edge rim,
 * loose diagnostic cables, floor tools, metallic cog, and a small pixel robot
 * technician holding a glowing yellow-green wrench.
 */
export function SystemDegradedPixelScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 92"
      width="960"
      height="736"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ilustrasi pixel-art robot teknisi memperbaiki mesin arcade"
      className={`block h-auto w-full select-none [image-rendering:pixelated] ${className}`}
    >
      {/* === SUBTLE GROUND CAST SHADOWS ON #1c0e32 CANVAS === */}
      <rect x="18" y="67" width="44" height="7" fill="#110621" />
      <rect x="22" y="74" width="36" height="3" fill="#110621" />
      <rect x="27" y="77" width="24" height="2" fill="#110621" />
      <rect x="73" y="73" width="20" height="5" fill="#110621" />
      <rect x="76" y="78" width="14" height="2" fill="#110621" />
      <rect x="96" y="73" width="13" height="4" fill="#110621" />
      <rect x="8" y="76" width="18" height="3" fill="#110621" />
      <rect x="27" y="81" width="16" height="4" fill="#110621" />

      {/* === 3/4 REAR-LEFT ISOMETRIC PURPLE ARCADE CABINET === */}
      {/* Top roof silhouette & outline */}
      <rect x="22" y="9" width="29" height="1" fill="#0b0416" />
      <rect x="20" y="10" width="35" height="1" fill="#0b0416" />
      <rect x="19" y="11" width="39" height="2" fill="#0b0416" />
      <rect x="19" y="13" width="42" height="3" fill="#0b0416" />
      <rect x="19" y="16" width="44" height="5" fill="#0b0416" />

      {/* Top roof bright lavender fill */}
      <rect x="24" y="10" width="25" height="1" fill="#8b6ad6" />
      <rect x="22" y="11" width="31" height="2" fill="#7c5bc4" />
      <rect x="22" y="13" width="35" height="3" fill="#714fb8" />
      <rect x="25" y="16" width="35" height="2" fill="#6342a6" />

      {/* Bright cyan rim along top-right & top-left roof edge */}
      <rect x="49" y="10" width="4" height="1" fill="#2fd8f2" />
      <rect x="53" y="11" width="3" height="1" fill="#2fd8f2" />
      <rect x="56" y="12" width="3" height="1" fill="#2fd8f2" />
      <rect x="58" y="13" width="3" height="2" fill="#2fd8f2" />
      <rect x="60" y="15" width="2" height="3" fill="#2fd8f2" />

      {/* Left cabinet side-profile outline */}
      <rect x="19" y="18" width="20" height="8" fill="#0b0416" />
      <rect x="21" y="26" width="18" height="16" fill="#0b0416" />
      {/* Control deck protrusion outline */}
      <rect x="13" y="42" width="26" height="9" fill="#0b0416" />
      {/* Lower cabinet left face outline */}
      <rect x="18" y="51" width="21" height="23" fill="#0b0416" />
      <rect x="23" y="72" width="16" height="4" fill="#0b0416" />

      {/* Left cabinet side fill (rich cyber-arcade violet) */}
      <rect x="20" y="16" width="17" height="9" fill="#6a48b2" />
      <rect x="22" y="25" width="15" height="17" fill="#6342a8" />
      <rect x="14" y="43" width="23" height="6" fill="#7351bd" />
      <rect x="19" y="49" width="18" height="23" fill="#5e3ea0" />
      <rect x="24" y="71" width="13" height="3" fill="#533591" />
      {/* Subtle angled shade on left face */}
      <rect x="21" y="19" width="5" height="5" fill="#4f328c" />
      <rect x="24" y="28" width="6" height="12" fill="#4f328c" />
      <rect x="21" y="52" width="5" height="16" fill="#4f328c" />

      {/* Crisp cyan edge trim tracing the left arcade silhouette */}
      <rect x="20" y="12" width="1" height="13" fill="#2fd8f2" />
      <rect x="21" y="24" width="2" height="2" fill="#2fd8f2" />
      <rect x="22" y="26" width="1" height="15" fill="#2fd8f2" />
      <rect x="15" y="42" width="7" height="1" fill="#2fd8f2" />
      <rect x="14" y="43" width="1" height="6" fill="#2fd8f2" />
      <rect x="15" y="49" width="4" height="1" fill="#2fd8f2" />
      <rect x="19" y="50" width="1" height="21" fill="#2fd8f2" />
      <rect x="20" y="71" width="5" height="1" fill="#2fd8f2" />
      <rect x="25" y="72" width="6" height="1" fill="#2fd8f2" />
      <rect x="31" y="73" width="6" height="1" fill="#2fd8f2" />

      {/* Tiny red ball-top joystick peeking on left control deck */}
      <rect x="16" y="38" width="4" height="3" fill="#0b0416" />
      <rect x="17" y="38" width="2" height="2" fill="#ef4444" />
      <rect x="17" y="38" width="1" height="1" fill="#fca5a5" />
      <rect x="17" y="41" width="2" height="2" fill="#cbd5e1" />
      <rect x="20" y="41" width="2" height="1" fill="#ffe500" />

      {/* Rear Cabinet Service Face (x=38..62, y=18..75) */}
      <rect x="37" y="18" width="26" height="57" fill="#0b0416" />
      <rect x="38" y="19" width="23" height="54" fill="#442b78" />
      {/* Subtle vertical corner crease & right depth shade */}
      <rect x="38" y="19" width="2" height="54" fill="#52358f" />
      <rect x="58" y="19" width="3" height="54" fill="#352061" />
      {/* Crisp vertical cyan rim along outer right cabinet edge */}
      <rect x="61" y="18" width="1" height="54" fill="#2fd8f2" />
      <rect x="56" y="72" width="5" height="1" fill="#2fd8f2" />
      <rect x="49" y="73" width="7" height="1" fill="#2fd8f2" />
      <rect x="39" y="74" width="10" height="1" fill="#2fd8f2" />

      {/* Upper Rear Ventilation Louver Slits */}
      <rect x="43" y="24" width="13" height="1" fill="#1e103b" />
      <rect x="43" y="27" width="13" height="1" fill="#1e103b" />
      <rect x="43" y="30" width="13" height="1" fill="#1e103b" />
      <rect x="43" y="33" width="10" height="1" fill="#1e103b" />

      {/* Lower Rear Power Panel, Vent Grate & Diagnostic LEDs */}
      <rect x="40" y="59" width="7" height="7" fill="#1d0f38" />
      <rect x="41" y="60" width="2" height="2" fill="#332059" />
      <rect x="44" y="60" width="2" height="2" fill="#332059" />
      <rect x="41" y="63" width="2" height="2" fill="#332059" />
      <rect x="44" y="63" width="2" height="2" fill="#332059" />

      {/* Power port box with blinking diagnostic LEDs */}
      <rect x="51" y="60" width="8" height="6" fill="#150a29" />
      <rect x="52" y="61" width="2" height="2" fill="#2fd8f2" className="p2r-anim-led" />
      <rect x="56" y="61" width="2" height="2" fill="#ef4444" className="p2r-anim-led" />
      <rect x="52" y="64" width="6" height="1" fill="#2c1954" />

      {/* === LOOSE CURLING BLACK DIAGNOSTIC WIRES ON FLOOR === */}
      <rect x="45" y="66" width="1" height="4" fill="#090314" />
      <rect x="46" y="70" width="3" height="1" fill="#090314" />
      <rect x="49" y="71" width="4" height="1" fill="#090314" />
      <rect x="53" y="72" width="3" height="3" fill="#090314" />
      <rect x="51" y="75" width="3" height="3" fill="#090314" />
      <rect x="48" y="78" width="4" height="2" fill="#090314" />
      <rect x="45" y="80" width="4" height="1" fill="#090314" />
      {/* Wire plug tip 1 */}
      <rect x="44" y="80" width="2" height="2" fill="#cbd5e1" />
      <rect x="43" y="81" width="1" height="1" fill="#ffe500" />

      {/* Second wire snaking right under robot */}
      <rect x="56" y="66" width="1" height="5" fill="#090314" />
      <rect x="57" y="71" width="6" height="1" fill="#090314" />
      <rect x="63" y="72" width="5" height="2" fill="#090314" />
      <rect x="68" y="74" width="4" height="4" fill="#090314" />
      <rect x="72" y="78" width="7" height="1" fill="#090314" />
      <rect x="79" y="79" width="7" height="2" fill="#090314" />
      <rect x="86" y="81" width="7" height="1" fill="#090314" />
      {/* Wire plug tip 2 */}
      <rect x="93" y="80" width="3" height="2" fill="#ffe500" />
      <rect x="96" y="81" width="1" height="1" fill="#cbd5e1" />

      {/* === SMALL 16-BIT PIXEL ROBOT TECHNICIAN (x=70..96, y=24..77) === */}
      {/* Top Antenna */}
      <rect x="82" y="23" width="3" height="3" fill="#0b0416" />
      <rect x="83" y="24" width="1" height="1" fill="#4be3ff" className="p2r-anim-led" />
      <rect x="83" y="26" width="1" height="4" fill="#94a3b8" />

      {/* Cubic Isometric Robot Head */}
      <rect x="73" y="30" width="19" height="16" fill="#0b0416" />
      {/* Top light steel face */}
      <rect x="75" y="31" width="14" height="3" fill="#e2e8f0" />
      <rect x="74" y="32" width="16" height="2" fill="#cbd5e1" />
      {/* Front steel face */}
      <rect x="74" y="34" width="13" height="11" fill="#9ba9c4" />
      {/* Shaded right head face */}
      <rect x="87" y="34" width="4" height="11" fill="#647292" />
      {/* Left & Right Ear Bolts */}
      <rect x="71" y="37" width="2" height="4" fill="#0b0416" />
      <rect x="72" y="38" width="1" height="2" fill="#cbd5e1" />
      <rect x="92" y="37" width="3" height="5" fill="#0b0416" />
      <rect x="92" y="38" width="2" height="3" fill="#7c8ba8" />

      {/* Dark Visor Screen & Glowing Soft Cyan Eyes */}
      <rect x="75" y="35" width="11" height="8" fill="#171130" />
      <rect x="76" y="36" width="9" height="6" fill="#201842" />
      <g className="p2r-anim-eye">
        <rect x="77" y="37" width="2" height="4" fill="#4be3ff" />
        <rect x="77" y="37" width="1" height="1" fill="#ffffff" />
        <rect x="82" y="37" width="2" height="4" fill="#4be3ff" />
        <rect x="82" y="37" width="1" height="1" fill="#ffffff" />
      </g>

      {/* Neck */}
      <rect x="79" y="46" width="6" height="2" fill="#475569" />

      {/* Compact Boxy Silver Torso */}
      <rect x="75" y="48" width="15" height="13" fill="#0b0416" />
      <rect x="76" y="49" width="10" height="11" fill="#b4c0d9" />
      <rect x="76" y="49" width="10" height="2" fill="#dbe4f5" />
      <rect x="86" y="49" width="3" height="11" fill="#6e7c9c" />

      {/* Glowing Cyan/Mint Chest Display */}
      <rect x="77" y="51" width="8" height="6" fill="#171130" />
      <rect x="78" y="52" width="6" height="4" fill="#2be8d5" />
      <rect x="79" y="53" width="2" height="1" fill="#ffffff" />
      <rect x="82" y="54" width="1" height="1" fill="#0e7490" />

      {/* Right Arm hanging down */}
      <rect x="90" y="50" width="4" height="10" fill="#0b0416" />
      <rect x="91" y="51" width="2" height="7" fill="#9ba9c4" />
      <rect x="91" y="51" width="1" height="5" fill="#cbd5e1" />
      <rect x="91" y="59" width="3" height="3" fill="#0b0416" />
      <rect x="92" y="60" width="1" height="1" fill="#cbd5e1" />

      {/* Left Arm + Large Glowing Yellow-Green Wrench (Subtle working bob) */}
      <g className="p2r-anim-wrench">
        {/* Articulated Left Arm */}
        <rect x="67" y="51" width="9" height="4" fill="#0b0416" />
        <rect x="68" y="52" width="7" height="2" fill="#cbd5e1" />
        <rect x="68" y="53" width="7" height="1" fill="#8e9cb8" />

        {/* Large Diagonal Yellow-Green Pixel Wrench */}
        {/* Top open jaw near cabinet */}
        <rect x="57" y="41" width="7" height="2" fill="#0b0416" />
        <rect x="55" y="43" width="10" height="5" fill="#0b0416" />
        <rect x="57" y="48" width="8" height="2" fill="#0b0416" />
        <rect x="58" y="42" width="5" height="2" fill="#e8f538" />
        <rect x="56" y="44" width="3" height="3" fill="#e8f538" />
        <rect x="61" y="44" width="3" height="4" fill="#e8f538" />
        <rect x="58" y="47" width="6" height="2" fill="#a3e635" />
        {/* Jaw cutout */}
        <rect x="58" y="44" width="3" height="2" fill="#1c0e32" />

        {/* Diagonal wrench handle */}
        <rect x="61" y="49" width="5" height="4" fill="#0b0416" />
        <rect x="62" y="50" width="3" height="3" fill="#e8f538" />
        <rect x="63" y="53" width="5" height="4" fill="#0b0416" />
        <rect x="64" y="54" width="3" height="3" fill="#d9f029" />
        <rect x="65" y="56" width="5" height="4" fill="#0b0416" />
        <rect x="66" y="57" width="3" height="3" fill="#a3e635" />

        {/* Bottom wrench jaw */}
        <rect x="66" y="60" width="7" height="5" fill="#0b0416" />
        <rect x="67" y="61" width="5" height="3" fill="#e8f538" />
        <rect x="68" y="63" width="3" height="2" fill="#84cc16" />
        <rect x="69" y="63" width="1" height="2" fill="#1c0e32" />

        {/* Robot hand gripping wrench */}
        <rect x="65" y="51" width="4" height="4" fill="#0b0416" />
        <rect x="66" y="52" width="2" height="2" fill="#e2e8f0" />
      </g>

      {/* Robot Legs & Cyan-Highlighted Boots */}
      <rect x="77" y="61" width="4" height="10" fill="#0b0416" />
      <rect x="78" y="61" width="2" height="9" fill="#94a3b8" />
      <rect x="78" y="61" width="1" height="9" fill="#cbd5e1" />
      <rect x="75" y="70" width="6" height="5" fill="#0b0416" />
      <rect x="76" y="71" width="4" height="3" fill="#cbd5e1" />
      <rect x="76" y="73" width="4" height="1" fill="#4be3ff" />

      <rect x="84" y="61" width="4" height="10" fill="#0b0416" />
      <rect x="85" y="61" width="2" height="9" fill="#94a3b8" />
      <rect x="85" y="61" width="1" height="9" fill="#cbd5e1" />
      <rect x="83" y="71" width="6" height="5" fill="#0b0416" />
      <rect x="84" y="72" width="4" height="3" fill="#cbd5e1" />
      <rect x="84" y="74" width="4" height="1" fill="#4be3ff" />

      {/* === FLOOR PROPS: SCREWDRIVER, MINI WRENCH, METALLIC COG === */}
      {/* Yellow-handled Screwdriver (bottom-left) */}
      <rect x="9" y="71" width="5" height="2" fill="#0b0416" />
      <rect x="10" y="72" width="4" height="1" fill="#4be3ff" />
      <rect x="13" y="72" width="4" height="3" fill="#0b0416" />
      <rect x="14" y="73" width="3" height="1" fill="#cbd5e1" />
      <rect x="16" y="73" width="9" height="5" fill="#0b0416" />
      <rect x="17" y="74" width="7" height="3" fill="#ffe500" />
      <rect x="18" y="76" width="6" height="1" fill="#d99b00" />

      {/* Silver-Cyan Mini Wrench (below cabinet) */}
      <rect x="35" y="75" width="6" height="4" fill="#0b0416" />
      <rect x="36" y="76" width="4" height="2" fill="#cbd5e1" />
      <rect x="32" y="78" width="5" height="3" fill="#0b0416" />
      <rect x="33" y="79" width="3" height="1" fill="#4be3ff" />
      <rect x="28" y="80" width="6" height="4" fill="#0b0416" />
      <rect x="29" y="81" width="4" height="2" fill="#cbd5e1" />
      <rect x="29" y="82" width="2" height="1" fill="#4be3ff" />

      {/* Metallic Isometric Pixel Cog / Gear (far right) */}
      <rect x="99" y="66" width="7" height="9" fill="#0b0416" />
      <rect x="96" y="68" width="13" height="5" fill="#0b0416" />
      <rect x="97" y="67" width="11" height="7" fill="#0b0416" />
      {/* Gear silver rim & teeth */}
      <rect x="100" y="67" width="5" height="7" fill="#94a3b8" />
      <rect x="97" y="69" width="11" height="3" fill="#94a3b8" />
      <rect x="98" y="68" width="9" height="5" fill="#cbd5e1" />
      {/* Gear inner depth & hole */}
      <rect x="98" y="72" width="9" height="1" fill="#64748b" />
      <rect x="101" y="69" width="3" height="2" fill="#1c0e32" />
    </svg>
  );
}

/**
 * 16-bit Isometric Pixel-Art Diorama: Scheduled Maintenance
 * Strict 120x92 integer pixel canvas matching SystemDegradedPixelScene in
 * perspective, 1px dark outlines, purple/cyan/yellow palette, and frameless
 * integration directly onto #1c0e32.
 * Depicts the P2R arcade cabinet inside a compact upgrade gantry lowering a
 * glowing upgrade core while the pixel robot wears a hard hat with blueprint.
 */
export function ScheduledMaintenancePixelScene({ className = "" }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 92"
      width="960"
      height="736"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Ilustrasi pixel-art peningkatan dan pemeliharaan terjadwal mesin arcade P2R"
      className={`block h-auto w-full select-none [image-rendering:pixelated] ${className}`}
    >
      {/* === SUBTLE GROUND CAST SHADOWS ON #1c0e32 CANVAS === */}
      <rect x="17" y="68" width="48" height="7" fill="#110621" />
      <rect x="22" y="75" width="38" height="3" fill="#110621" />
      <rect x="74" y="73" width="20" height="5" fill="#110621" />
      <rect x="77" y="78" width="14" height="2" fill="#110621" />
      <rect x="97" y="74" width="11" height="3" fill="#110621" />
      <rect x="8" y="78" width="26" height="4" fill="#110621" />

      {/* === COMPACT ISOMETRIC PIXEL UPGRADE GANTRY / HOIST FRAME === */}
      {/* Back-right gantry leg */}
      <rect x="61" y="9" width="4" height="63" fill="#0b0416" />
      <rect x="62" y="10" width="2" height="61" fill="#d99b00" />
      <rect x="62" y="10" width="1" height="61" fill="#ffe500" />
      {/* Front-left gantry leg */}
      <rect x="16" y="13" width="4" height="58" fill="#0b0416" />
      <rect x="17" y="14" width="2" height="56" fill="#d99b00" />
      <rect x="17" y="14" width="1" height="56" fill="#ffe500" />

      {/* Top horizontal lattice beam */}
      <rect x="15" y="7" width="52" height="6" fill="#0b0416" />
      <rect x="16" y="8" width="50" height="1" fill="#ffe500" />
      <rect x="16" y="11" width="50" height="1" fill="#d99b00" />
      <rect x="21" y="9" width="2" height="2" fill="#ffe500" />
      <rect x="28" y="9" width="2" height="2" fill="#ffe500" />
      <rect x="35" y="9" width="2" height="2" fill="#ffe500" />
      <rect x="42" y="9" width="2" height="2" fill="#ffe500" />
      <rect x="49" y="9" width="2" height="2" fill="#ffe500" />
      <rect x="56" y="9" width="2" height="2" fill="#ffe500" />

      {/* Gantry Top Safety Beacon */}
      <rect x="61" y="4" width="4" height="3" fill="#0b0416" />
      <rect x="62" y="5" width="2" height="2" fill="#ffe500" className="p2r-anim-led" />

      {/* === 3/4 ISOMETRIC PURPLE ARCADE CABINET BEING UPGRADED === */}
      {/* Lower & mid cabinet silhouette matching Scene 1 scale */}
      <rect x="23" y="29" width="35" height="44" fill="#0b0416" />
      {/* Left cabinet face */}
      <rect x="24" y="30" width="16" height="42" fill="#6544ad" />
      <rect x="25" y="33" width="5" height="15" fill="#4f328c" />
      <rect x="25" y="54" width="5" height="14" fill="#4f328c" />
      {/* Cyan rim on left edge */}
      <rect x="24" y="30" width="1" height="41" fill="#2fd8f2" />
      <rect x="25" y="71" width="14" height="1" fill="#2fd8f2" />

      {/* Right/front-angled upgrade display face */}
      <rect x="40" y="30" width="17" height="42" fill="#442b78" />
      <rect x="55" y="30" width="2" height="42" fill="#321e5c" />
      <rect x="57" y="30" width="1" height="41" fill="#2fd8f2" />
      <rect x="41" y="72" width="16" height="1" fill="#2fd8f2" />

      {/* Glowing Open Top Upgrade Bay */}
      <rect x="26" y="28" width="29" height="4" fill="#0e7490" />
      <rect x="28" y="29" width="25" height="2" fill="#2fd8f2" />
      <rect x="33" y="29" width="15" height="1" fill="#a5f3fc" />

      {/* Cabinet Screen Showing Crisp Pixel Upgrade Chevron */}
      <rect x="42" y="35" width="13" height="15" fill="#130926" />
      <rect x="43" y="36" width="11" height="13" fill="#0b1830" />
      <rect x="48" y="38" width="1" height="1" fill="#ffe500" />
      <rect x="47" y="39" width="3" height="1" fill="#ffe500" />
      <rect x="46" y="40" width="5" height="1" fill="#2fd8f2" />
      <rect x="45" y="41" width="2" height="1" fill="#2fd8f2" />
      <rect x="50" y="41" width="2" height="1" fill="#2fd8f2" />
      <rect x="48" y="43" width="1" height="1" fill="#7ac70c" />
      <rect x="47" y="44" width="3" height="1" fill="#7ac70c" />
      <rect x="46" y="45" width="2" height="1" fill="#2fd8f2" />
      <rect x="49" y="45" width="2" height="1" fill="#2fd8f2" />

      {/* Lower Front Trim Details */}
      <rect x="43" y="54" width="11" height="2" fill="#2fd8f2" />
      <rect x="43" y="58" width="11" height="8" fill="#26154a" />
      <rect x="45" y="60" width="3" height="2" fill="#ffe500" />
      <rect x="49" y="60" width="3" height="2" fill="#2fd8f2" className="p2r-anim-led" />

      {/* === HOIST TROLLEY & LOWERING GLOWING UPGRADE CORE MODULE === */}
      <rect x="37" y="12" width="7" height="3" fill="#475569" />
      <rect x="38" y="13" width="5" height="1" fill="#cbd5e1" />
      <rect x="40" y="15" width="1" height="5" fill="#e2e8f0" />

      <g className="p2r-anim-core">
        {/* Hoist clamp */}
        <rect x="38" y="19" width="5" height="2" fill="#0b0416" />
        <rect x="39" y="19" width="3" height="1" fill="#ffe500" />
        {/* Glowing Golden-Cyan P2R Upgrade Core Cartridge */}
        <rect x="35" y="21" width="11" height="7" fill="#0b0416" />
        <rect x="36" y="22" width="9" height="5" fill="#ffe500" />
        <rect x="37" y="23" width="7" height="3" fill="#2fd8f2" />
        <rect x="39" y="23" width="3" height="2" fill="#ffffff" />
        {/* Crisp tiny sparkles */}
        <rect x="32" y="22" width="1" height="1" fill="#ffe500" />
        <rect x="48" y="22" width="1" height="1" fill="#2fd8f2" />
      </g>

      {/* === SAME CUTE PIXEL ROBOT WEARING YELLOW HARD HAT + BLUEPRINT === */}
      {/* Yellow Isometric Safety Hard Hat */}
      <rect x="75" y="25" width="15" height="5" fill="#0b0416" />
      <rect x="76" y="26" width="13" height="3" fill="#ffe500" />
      <rect x="77" y="26" width="6" height="1" fill="#ffffff" />
      <rect x="72" y="29" width="21" height="2" fill="#0b0416" />
      <rect x="73" y="29" width="19" height="1" fill="#d99b00" />

      {/* Robot Head */}
      <rect x="74" y="31" width="18" height="15" fill="#0b0416" />
      <rect x="75" y="32" width="12" height="13" fill="#9ba9c4" />
      <rect x="87" y="32" width="4" height="13" fill="#647292" />
      <rect x="92" y="37" width="2" height="4" fill="#0b0416" />
      <rect x="92" y="38" width="1" height="2" fill="#7c8ba8" />

      {/* Visor & Glowing Cyan Eyes */}
      <rect x="76" y="35" width="10" height="8" fill="#171130" />
      <rect x="77" y="36" width="8" height="6" fill="#201842" />
      <g className="p2r-anim-eye">
        <rect x="78" y="37" width="2" height="4" fill="#4be3ff" />
        <rect x="78" y="37" width="1" height="1" fill="#ffffff" />
        <rect x="83" y="37" width="2" height="4" fill="#4be3ff" />
        <rect x="83" y="37" width="1" height="1" fill="#ffffff" />
      </g>

      {/* Neck & Torso */}
      <rect x="80" y="46" width="6" height="2" fill="#475569" />
      <rect x="76" y="48" width="15" height="13" fill="#0b0416" />
      <rect x="77" y="49" width="10" height="11" fill="#b4c0d9" />
      <rect x="77" y="49" width="10" height="2" fill="#dbe4f5" />
      <rect x="87" y="49" width="3" height="11" fill="#6e7c9c" />

      {/* Glowing Cyan Chest Display */}
      <rect x="78" y="51" width="8" height="6" fill="#171130" />
      <rect x="79" y="52" width="6" height="4" fill="#2be8d5" />
      <rect x="80" y="53" width="2" height="1" fill="#ffffff" />

      {/* Left Arm Holding Open Cyan Blueprint */}
      <rect x="63" y="49" width="13" height="9" fill="#0b0416" />
      <rect x="64" y="50" width="11" height="7" fill="#0e7490" />
      <rect x="65" y="51" width="9" height="5" fill="#22d3ee" />
      {/* Blueprint grid marks */}
      <rect x="66" y="52" width="4" height="1" fill="#ffffff" />
      <rect x="66" y="54" width="6" height="1" fill="#0b1830" />
      <rect x="72" y="52" width="1" height="2" fill="#ffe500" />
      {/* Robot hand */}
      <rect x="73" y="52" width="3" height="3" fill="#cbd5e1" />

      {/* Right Arm */}
      <rect x="91" y="50" width="4" height="10" fill="#0b0416" />
      <rect x="92" y="51" width="2" height="7" fill="#9ba9c4" />

      {/* Legs & Cyan-Highlighted Boots */}
      <rect x="78" y="61" width="4" height="10" fill="#0b0416" />
      <rect x="79" y="61" width="2" height="9" fill="#94a3b8" />
      <rect x="76" y="70" width="6" height="5" fill="#0b0416" />
      <rect x="77" y="71" width="4" height="3" fill="#cbd5e1" />
      <rect x="77" y="73" width="4" height="1" fill="#4be3ff" />

      <rect x="85" y="61" width="4" height="10" fill="#0b0416" />
      <rect x="86" y="61" width="2" height="9" fill="#94a3b8" />
      <rect x="84" y="71" width="6" height="5" fill="#0b0416" />
      <rect x="85" y="72" width="4" height="3" fill="#cbd5e1" />
      <rect x="85" y="74" width="4" height="1" fill="#4be3ff" />

      {/* === FLOOR PROPS: STRIPED BARRICADE & SAFETY CONE === */}
      {/* Yellow-and-Plum Striped Construction Barricade (bottom-left) */}
      <rect x="9" y="72" width="22" height="6" fill="#0b0416" />
      <rect x="10" y="73" width="20" height="4" fill="#ffe500" />
      <rect x="13" y="73" width="3" height="4" fill="#1c0e32" />
      <rect x="19" y="73" width="3" height="4" fill="#1c0e32" />
      <rect x="25" y="73" width="3" height="4" fill="#1c0e32" />
      <rect x="11" y="78" width="2" height="4" fill="#94a3b8" />
      <rect x="27" y="78" width="2" height="4" fill="#94a3b8" />

      {/* Orange-and-White Pixel Safety Cone (far right) */}
      <rect x="100" y="66" width="4" height="2" fill="#0b0416" />
      <rect x="99" y="68" width="6" height="3" fill="#0b0416" />
      <rect x="98" y="71" width="8" height="3" fill="#0b0416" />
      <rect x="97" y="74" width="10" height="2" fill="#0b0416" />
      <rect x="101" y="67" width="2" height="2" fill="#fb923c" />
      <rect x="100" y="69" width="4" height="2" fill="#ffffff" />
      <rect x="99" y="71" width="6" height="3" fill="#fb923c" />
      <rect x="98" y="74" width="8" height="1" fill="#ea580c" />
    </svg>
  );
}
