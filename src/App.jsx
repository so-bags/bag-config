import React, { useState, useMemo } from "react";

/* Paper #EFE7DA · Card #F8F3E8 · Ink #2B241F · Rosewood #B25B54 · Mustard #D6A24A · Teal #4C7A72 */

const YARN_COLORS = [
  { name: "Bianco", hex: "#F9F9F7" },
  { name: "Avorio", hex: "#F5F0DC" },
  { name: "Ecrù", hex: "#E7D9B4" },
  { name: "Beige", hex: "#D9B77A" },
  { name: "Grigio Chiaro", hex: "#B4B8B9" },
  { name: "Grigio", hex: "#7A7A7A" },
  { name: "Fango", hex: "#A48F60" },
  { name: "Toffee", hex: "#7B4A2A" },
  { name: "Cacao", hex: "#4A2B19" },
  { name: "Cioccolato Fondente", hex: "#3A1F14" },
  { name: "Antracite", hex: "#2E2E2E" },
  { name: "Giallo Vivo", hex: "#F1C51C" },
  { name: "Girasole", hex: "#E28619" },
  { name: "Ocra", hex: "#C08A34" },
  { name: "Arancione", hex: "#F06419" },
  { name: "Verde Lime", hex: "#7CB92E" },
  { name: "Verde Neon", hex: "#8DD649" },
  { name: "Salvia", hex: "#8FAE72" },
  { name: "Verde Smeraldo", hex: "#2E9F4F" },
  { name: "Verde Vittoriano", hex: "#179A66" },
  { name: "Verde Giada", hex: "#3FBB9F" },
  { name: "Turchese", hex: "#40C9C1" },
  { name: "Verde Militare", hex: "#5C5A29" },
  { name: "Oliva", hex: "#6E6B28" },
  { name: "Verde Bottiglia", hex: "#1B5F3A" },
  { name: "Celeste Baby", hex: "#A9CBE7" },
  { name: "Puffo", hex: "#1D8A9E" },
  { name: "Carta da Zucchero", hex: "#5C8A99" },
  { name: "Petrolio", hex: "#1B5E64" },
  { name: "Denim Blu", hex: "#4A79B1" },
  { name: "Blu Elettrico", hex: "#1B2A6B" },
  { name: "Blu Navy", hex: "#131949" },
  { name: "Lilla", hex: "#C99AC4" },
  { name: "Viola", hex: "#5C2C82" },
  { name: "Viola Ametista", hex: "#4B1E63" },
  { name: "Orchidea", hex: "#8E1B5C" },
  { name: "Fucsia Supremo", hex: "#9B1E7A" },
  { name: "Rosa Caramella", hex: "#F2A0B6" },
  { name: "Fucsia", hex: "#E81759" },
  { name: "Rosa Neon", hex: "#F01980" },
  { name: "Lampone", hex: "#E21C4F" },
  { name: "Corallo", hex: "#E07388" },
  { name: "Rosa Antico", hex: "#C08484" },
  { name: "Terracotta", hex: "#C0443A" },
  { name: "Rosso", hex: "#E11B1C" },
  { name: "Bordeaux", hex: "#7B1220" },
  { name: "Vinaccia", hex: "#6E1227" },
];

const PAILLETTE_COLORS = [
  { name: "Bianco Holo", hex: "#B8DCF3" },
  { name: "Nero", hex: "#161616" },
  { name: "Bronzo", hex: "#8A4E27" },
  { name: "Fucsia", hex: "#CD58A6" },
  { name: "Verde Oliva", hex: "#90B273" },
  { name: "Argento", hex: "#C9CBC9" },
  { name: "Oro", hex: "#9F9D82" },
  { name: "Blu", hex: "#1C305A" },
  { name: "Rose Gold", hex: "#9B5E2D" },
  { name: "Oro Giallo", hex: "#AD7D30" },
  { name: "Azzurro", hex: "#199CAF" },
  { name: "Rosa", hex: "#A6939C" },
  { name: "Ciliegia", hex: "#CC2346" },
];

const METAL_COLORS = [
  { name: "Oro", hex: "#D9A94A" },
  { name: "Argento", hex: "#C7C7C7" },
];

const SIZES = [
  { id: "piccola", name: "Piccola", cm: 16, scale: 0.73 },
  { id: "media", name: "Media", cm: 18, scale: 0.82 },
  { id: "grande", name: "Grande", cm: 22, scale: 1.0 },
];

// The frame ("chiusura click clack"), once covered in yarn, coincides with
// the bag's own top edge — it isn't a separate piece rising above the body.
// Two full silhouettes (outer edge including the frame's outline, plus an
// inset opening for the hand) traced from the real hardware: flat "dritto"
// and wavy "ondulato".
// Both variants share the EXACT same outer silhouette from the reference
// photo — nothing is added on top of it. Only the top segment differs:
// "dritto" flattens just the peak into a straight line (the rest of the
// curve, from the shoulders inward, is untouched); "ondulato" keeps the
// original curve as-is and instead has a wavy line inscribed at the opening.
const BODY_DRITTO_OUTER = "M20,153 Q17,171 42,173 L158,173 Q183,171 180,153 L172,115 Q168,80 130,75 L70,75 Q32,80 28,115 Z";
const BODY_DRITTO_HOLE = "M60,85 A40,8 0 1,0 140,85 A40,8 0 1,0 60,85 Z";

const BODY_ONDULATO_OUTER = "M20,153 Q17,171 42,173 L158,173 Q183,171 180,153 L172,115 Q168.29,82.54 135.33,75.88 Q134.15,75.88 133.56,75.88 Q132.97,75.88 132.39,75.89 Q131.80,75.89 131.21,75.91 Q130.62,75.92 130.03,75.94 Q129.44,75.96 128.85,76.00 Q128.26,76.04 127.68,76.09 Q127.09,76.15 126.50,76.22 Q125.91,76.30 125.32,76.39 Q124.73,76.48 124.14,76.60 Q123.55,76.71 122.96,76.84 Q122.38,76.97 121.79,77.12 Q121.20,77.27 120.61,77.43 Q120.02,77.59 119.43,77.76 Q118.84,77.93 118.25,78.10 Q117.67,78.28 117.08,78.45 Q116.49,78.62 115.90,78.79 Q115.31,78.96 114.72,79.12 Q114.13,79.28 113.54,79.43 Q112.95,79.58 112.37,79.71 Q111.78,79.84 111.19,79.95 Q110.60,80.07 110.01,80.16 Q109.42,80.25 108.83,80.33 Q108.24,80.40 107.65,80.46 Q107.07,80.51 106.48,80.55 Q105.89,80.59 105.30,80.61 Q104.71,80.63 104.12,80.64 Q103.53,80.66 102.94,80.66 Q102.36,80.67 101.77,80.67 Q101.18,80.67 100.59,80.67 Q100.00,80.67 99.41,80.67 Q98.82,80.67 98.23,80.67 Q97.64,80.67 97.06,80.66 Q96.47,80.66 95.88,80.64 Q95.29,80.63 94.70,80.61 Q94.11,80.59 93.52,80.55 Q92.93,80.51 92.35,80.46 Q91.76,80.40 91.17,80.33 Q90.58,80.25 89.99,80.16 Q89.40,80.07 88.81,79.95 Q88.22,79.84 87.63,79.71 Q87.05,79.58 86.46,79.43 Q85.87,79.28 85.28,79.12 Q84.69,78.96 84.10,78.79 Q83.51,78.62 82.92,78.45 Q82.33,78.28 81.75,78.10 Q81.16,77.93 80.57,77.76 Q79.98,77.59 79.39,77.43 Q78.80,77.27 78.21,77.12 Q77.62,76.97 77.04,76.84 Q76.45,76.71 75.86,76.60 Q75.27,76.48 74.68,76.39 Q74.09,76.30 73.50,76.22 Q72.91,76.15 72.32,76.09 Q71.74,76.04 71.15,76.00 Q70.56,75.96 69.97,75.94 Q69.38,75.92 68.79,75.91 Q68.20,75.89 67.61,75.89 Q67.03,75.88 66.44,75.88 Q65.85,75.88 65.26,75.88 L64.67,75.88 Q31.71,82.54 28,115 Z";
const BODY_ONDULATO_HOLE = "M64,96 A30,6 0 1,0 136,96 A30,6 0 1,0 64,96 Z";

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function ClutchPreview({
  sizeScale, handleProfile, hasHole, color, chainOn, chainColor,
  paillettesOn, paColor, strapOn, strapColor, ringColor, size = 260,
}) {
  const dark = shade(color, -35);
  const outerContour = handleProfile === "ondulato" ? BODY_ONDULATO_OUTER : BODY_DRITTO_OUTER;
  const holePath = handleProfile === "ondulato" ? BODY_ONDULATO_HOLE : BODY_DRITTO_HOLE;
  const bodyD = hasHole ? `${outerContour} ${holePath}` : outerContour;

  // Ring attachment points for the optional crochet-handle accessory. The X
  // positions are always the start/end of the top profile's horizontal run
  // (where it meets the diagonal sides). The Y position depends on how the
  // bag is carried: right on the upper edge when there's no hole (sottobraccio),
  // or just below the hole when there is one (a mano) — same X, lower Y.
  const topSpan = handleProfile === "ondulato" ? { x: 64.67, y: 75.88 } : { x: 70, y: 75 };
  const holeBottomY = handleProfile === "ondulato" ? 103.2 : 93;
  const ringY = hasHole ? holeBottomY + 4 : topSpan.y;
  const leftRing = [topSpan.x, ringY];
  const rightRing = [200 - topSpan.x, ringY];

  const seqPts = useMemo(() => {
    const pts = [];
    const area = { x0: 30, x1: 170, y0: holeBottomY + 6, y1: 169 };
    const rows = 4, cols = 7;
    const rowH = (area.y1 - area.y0) / rows;
    const colW = (area.x1 - area.x0) / cols;
    for (let r = 0; r < rows; r++) {
      const y = area.y0 + rowH * (r + 0.5);
      const stagger = r % 2 === 1 ? colW / 2 : 0;
      for (let c = 0; c < cols; c++) {
        const x = area.x0 + stagger + colW * (c + 0.5);
        if (x > area.x1 - colW * 0.2) continue;
        pts.push({ x, y });
      }
    }
    return pts;
  }, [holeBottomY]);

  return (
    <svg viewBox="0 0 200 195" width="100%" style={{ maxWidth: size, height: "auto", aspectRatio: "200 / 195", display: "block" }} role="img" aria-label="Anteprima clutch">
      <g transform={`translate(${100 - 100 * sizeScale},${195 - 195 * sizeScale}) scale(${sizeScale})`}>
        <defs>
          <pattern id="ribs" patternUnits="userSpaceOnUse" width="10" height="9">
            <rect width="10" height="9" fill={color} />
            <rect width="10" height="4" fill={dark} />
          </pattern>
          <pattern id="strapribs" patternUnits="userSpaceOnUse" width="10" height="9" patternTransform="rotate(90)">
            <rect width="10" height="9" fill={strapColor} />
            <rect width="10" height="4" fill={shade(strapColor, -35)} />
          </pattern>
        </defs>

        {/* optional crochet handle accessory: TWO parallel handles between the
            same pair of rings, positioned per the a-mano/sottobraccio rule above */}
        {strapOn && (() => {
          const [lx, ly] = leftRing;
          const [rx, ry] = rightRing;
          const peakY = Math.min(ly, ry) - 68;
          // Same shape/size for both — shifted a few units apart horizontally
          // (like two real handles side by side), not nested at different sizes.
          const handlePath = (xShift) => {
            const l = [lx + xShift, ly], r = [rx + xShift, ry], mid = 100 + xShift, spread = 28;
            return `M${l[0]},${l[1]} C${l[0] - spread},${(l[1] + peakY) / 2 - 6} ${l[0] + spread * 0.3},${peakY} ${mid},${peakY} ` +
              `C${r[0] - spread * 0.3},${peakY} ${r[0] + spread},${(r[1] + peakY) / 2 - 6} ${r[0]},${r[1]}`;
          };
          const outerHandle = handlePath(-4);
          const innerHandle = handlePath(4);
          return (
            <>
              <path d={outerHandle} fill="none" stroke={shade(strapColor, -35)} strokeWidth="7" strokeLinecap="round" />
              <path d={outerHandle} fill="none" stroke="url(#strapribs)" strokeWidth="5.5" strokeLinecap="round" opacity="0.9" />
              <path d={innerHandle} fill="none" stroke={shade(strapColor, -35)} strokeWidth="7" strokeLinecap="round" />
              <path d={innerHandle} fill="none" stroke="url(#strapribs)" strokeWidth="5.5" strokeLinecap="round" opacity="0.9" />
              <circle cx={lx} cy={ly} r="7" fill="none" stroke={ringColor === "Argento" ? "#C7C7C7" : "#D9A94A"} strokeWidth="3.5" />
              <circle cx={rx} cy={ry} r="7" fill="none" stroke={ringColor === "Argento" ? "#C7C7C7" : "#D9A94A"} strokeWidth="3.5" />
            </>
          );
        })()}

        {/* chain accessory */}
        {chainOn && (() => {
          const c = chainColor === "Argento" ? "#C7C7C7" : "#D9A94A";
          // Right shoulder curve: "L172,115 Q168.29,82.54 135.33,75.88" — sample
          // two close points further up it (not at the straight-side/curve
          // junction, but where the curve's own slope has visibly shifted),
          // with the exact tangent at each for a natural-looking attachment.
          const P0 = [172, 115], P1 = [168.29, 82.54], P2 = [135.33, 75.88];
          const quadPoint = (t) => [
            (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t ** 2 * P2[0],
            (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t ** 2 * P2[1],
          ];
          const quadTangent = (t) => {
            const dx = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
            const dy = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
            const mag = Math.hypot(dx, dy);
            return [dx / mag, dy / mag];
          };
          const ts = [0.35, 0.4];
          const rightAnchors = ts.map((t) => ({ pt: quadPoint(t), dir: quadTangent(t) }));
          const leftAnchors = ts.map((t) => {
            const [x, y] = quadPoint(t);
            const [dx, dy] = quadTangent(t);
            return { pt: [200 - x, y], dir: [-dx, dy] };
          });
          const allAnchors = [...leftAnchors, ...rightAnchors];
          const convergeY = 8;
          return allAnchors.map(({ pt: [ax, ay], dir: [dx, dy] }, ai) => {
            const isLeft = ax < 100;
            const tangentLen = 34;
            const c1 = [ax + dx * tangentLen, ay + dy * tangentLen];
            // second control point: pulled outward for a gentle outward bulge
            // before curving back in to the shared hand-hold point — a soft
            // "S" instead of a straight run to the peak.
            const bulgeX = isLeft ? -30 : 30;
            const c2 = [100 + bulgeX, convergeY + 34];
            const end = [100, convergeY];
            const pts = [];
            for (let t = 0; t <= 1; t += 0.05) {
              const x = (1 - t) ** 3 * ax + 3 * (1 - t) ** 2 * t * c1[0] + 3 * (1 - t) * t ** 2 * c2[0] + t ** 3 * end[0];
              const y = (1 - t) ** 3 * ay + 3 * (1 - t) ** 2 * t * c1[1] + 3 * (1 - t) * t ** 2 * c2[1] + t ** 3 * end[1];
              pts.push([x, y]);
            }
            return (
              <g key={ai}>
                <circle cx={ax} cy={ay} r="3" fill="none" stroke={c} strokeWidth="1.3" />
                {pts.map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="2.3" ry="1.5" fill="none" stroke={c} strokeWidth="1.1" />)}
              </g>
            );
          });
        })()}

        <path d={bodyD} fill={dark} fillRule="evenodd" />
        <path d={bodyD} fill="url(#ribs)" fillRule="evenodd" opacity="0.95" />
        <path d={bodyD} fill="none" stroke={dark} strokeWidth="2" fillRule="evenodd" />

        {paillettesOn && seqPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="7.4" fill={paColor} stroke="#00000022" strokeWidth="0.4" />
        ))}
      </g>
    </svg>
  );
}

export default function App() {
  const STEP_IDS = ["size", "profile", "hole", "color", "accessories", "summary"];
  const [stepIdx, setStepIdx] = useState(0);

  const [sizeId, setSizeId] = useState("media");
  const [handleProfile, setHandleProfile] = useState("dritto");
  const [hasHole, setHasHole] = useState(true);
  const [color, setColor] = useState(YARN_COLORS[0].hex);

  const [chainOn, setChainOn] = useState(false);
  const [chainColor, setChainColor] = useState("Oro");

  const [paillettesOn, setPaillettesOn] = useState(false);
  const [paColor, setPaColor] = useState(PAILLETTE_COLORS[0].hex);

  const [strapOn, setStrapOn] = useState(false);
  const [strapColor, setStrapColor] = useState(null); // null = same as body
  const [ringColor, setRingColor] = useState("Oro");

  const size = SIZES.find((s) => s.id === sizeId);
  const effectiveStrapColor = strapColor || color;

  const steps = STEP_IDS.filter((id) => id !== "profile" || sizeId === "grande");
  const currentStep = steps[stepIdx] || steps[steps.length - 1];
  const stepPos = steps.indexOf(currentStep);

  const goNext = () => setStepIdx((i) => Math.min(steps.length - 1, i + 1));
  const goBack = () => setStepIdx((i) => Math.max(0, i - 1));

  const colorName = YARN_COLORS.find((c) => c.hex === color)?.name ?? color;
  const paColorName = PAILLETTE_COLORS.find((c) => c.hex === paColor)?.name ?? "";
  const strapColorName = strapColor ? (YARN_COLORS.find((c) => c.hex === strapColor)?.name ?? "") : `${colorName} (come il corpo)`;

  const summary = [
    `Modello: Clutch`,
    `Dimensione: ${size.name} (${size.cm} cm)`,
    ...(sizeId === "grande" ? [`Profilo chiusura click clack: ${handleProfile === "dritto" ? "Quadrato" : "Ondulato"}`] : []),
    `Chiusura click clack: ${hasHole ? "Sì (si porta a mano)" : "No (si porta sottobraccio)"}`,
    `Colore corpo: ${colorName}`,
    `Catenella: ${chainOn ? chainColor : "No"}`,
    `Paillettes: ${paillettesOn ? paColorName : "No"}`,
    `Manico a uncinetto: ${strapOn ? `${strapColorName}, anelli ${ringColor}` : "No"}`,
  ];

  const waNumber = "393519221704"; // <-- sostituisci con il numero WhatsApp del negozio
  const waText = encodeURIComponent(`Ciao! Vorrei ordinare questa clutch personalizzata:\n${summary.join("\n")}`);
  const [copied, setCopied] = useState(false);
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };

  const preview = (
    <ClutchPreview
      sizeScale={size.scale}
      handleProfile={handleProfile}
      hasHole={hasHole}
      color={color}
      chainOn={chainOn}
      chainColor={chainColor}
      paillettesOn={paillettesOn}
      paColor={paColor}
      strapOn={strapOn}
      strapColor={effectiveStrapColor}
      ringColor={ringColor}
      size={320}
    />
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#EFE7DA", color: "#2B241F",
      fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        .display { font-family: Georgia, 'Times New Roman', serif; }
        button { font-family: inherit; cursor: pointer; }
        .swatch { transition: transform .15s ease; }
        .swatch:hover { transform: scale(1.12); }
        .opt { transition: box-shadow .15s ease, transform .15s ease; }
        .opt:hover { transform: translateY(-2px); }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(220px, 380px) 1fr;
          gap: 28px;
        }
        .preview-panel {
          position: sticky;
          top: 20px;
          height: fit-content;
        }
        @media (max-width: 680px) {
          .main-grid { grid-template-columns: 1fr; gap: 18px; }
          .preview-panel { position: static; top: auto; }
        }
        @media (max-width: 420px) {
          h1.display { font-size: 24px !important; }
        }
      `}</style>

      <header style={{ padding: "32px 20px 16px", textAlign: "center", borderBottom: "1px solid #DCD1BB" }}>
        <div className="display" style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#B25B54", marginBottom: 6 }}>
          Filo &amp; Forma
        </div>
        <h1 className="display" style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Configura la tua Clutch</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {steps.map((s, i) => (
            <div key={s} style={{
              width: i === stepPos ? 22 : 8, height: 8, borderRadius: 999,
              background: i <= stepPos ? "#B25B54" : "#DCD1BB", transition: "all .2s ease",
            }} />
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 16px 60px" }}>
        <div className="main-grid">
          <div className="preview-panel" style={{
            background: "#F8F3E8", border: "1px solid #DCD1BB", borderRadius: 16, padding: 20,
            display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            {preview}
            <div className="display" style={{ fontSize: 15, opacity: 0.7, marginTop: 6 }}>{size.name} · {size.cm} cm</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22, minHeight: 320 }}>
            {currentStep === "size" && (
              <Section title="1. Scegli la dimensione">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
                  {SIZES.map((s) => (
                    <button key={s.id} className="opt" onClick={() => setSizeId(s.id)} style={optCardStyle(sizeId === s.id)}>
                      <div className="display" style={{ fontSize: 18, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 13, opacity: 0.65 }}>{s.cm} cm</div>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {currentStep === "profile" && (
              <Section title="2. Scegli il profilo della tua borsa">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
                  <button className="opt" onClick={() => setHandleProfile("dritto")} style={optCardStyle(handleProfile === "dritto")}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Quadrato</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Bordo lineare e netto</div>
                  </button>
                  <button className="opt" onClick={() => setHandleProfile("ondulato")} style={optCardStyle(handleProfile === "ondulato")}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Ondulato</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Bordo morbido e curvo</div>
                  </button>
                </div>
              </Section>
            )}

            {currentStep === "hole" && (
              <Section title={`${sizeId === "grande" ? "3" : "2"}. Come vorresti portare la tua clutch?`}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
                  <button className="opt" onClick={() => setHasHole(true)} style={optCardStyle(hasHole)}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>A mano</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Viene lasciato un foro per l'impugnatura</div>
                  </button>
                  <button className="opt" onClick={() => setHasHole(false)} style={optCardStyle(!hasHole)}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Sottobraccio</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Nessun foro per l'impugnatura</div>
                  </button>
                </div>
              </Section>
            )}

            {currentStep === "color" && (
              <Section title={`${sizeId === "grande" ? "4" : "3"}. Colore del corpo`}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {YARN_COLORS.map((c) => (
                    <button key={c.hex} className="swatch" onClick={() => setColor(c.hex)} title={c.name} style={{
                      width: 38, height: 38, borderRadius: "50%", background: c.hex,
                      border: color === c.hex ? "3px solid #2B241F" : "1px solid #00000022",
                    }} />
                  ))}
                </div>
              </Section>
            )}

            {currentStep === "accessories" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <div className="display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.6 }}>
                  {sizeId === "grande" ? "5" : "4"}. Accessori opzionali
                </div>

                <AccessoryBlock title="Catenella" on={chainOn} onToggle={setChainOn}>
                  <SwatchRow options={METAL_COLORS} value={chainColor} onChange={setChainColor} />
                </AccessoryBlock>

                <AccessoryBlock title="Paillettes" on={paillettesOn} onToggle={setPaillettesOn}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {PAILLETTE_COLORS.map((c) => (
                      <button key={c.hex} className="swatch" onClick={() => setPaColor(c.hex)} title={c.name} style={{
                        width: 28, height: 28, borderRadius: "50%", background: c.hex,
                        border: paColor === c.hex ? "3px solid #2B241F" : "1px solid #00000022",
                      }} />
                    ))}
                  </div>
                </AccessoryBlock>

                <AccessoryBlock title="Manico fatto a uncinetto" on={strapOn} onToggle={setStrapOn}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>Colore del filato (default: come il corpo)</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <button
                          onClick={() => setStrapColor(null)}
                          style={{
                            width: 28, height: 28, borderRadius: "50%", background: color,
                            border: strapColor === null ? "3px solid #2B241F" : "1px solid #00000022",
                          }}
                          title="Come il corpo"
                        />
                        {YARN_COLORS.map((c) => (
                          <button key={c.hex} className="swatch" onClick={() => setStrapColor(c.hex)} title={c.name} style={{
                            width: 28, height: 28, borderRadius: "50%", background: c.hex,
                            border: strapColor === c.hex ? "3px solid #2B241F" : "1px solid #00000022",
                          }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6 }}>Colore anelli di aggancio</div>
                      <SwatchRow options={METAL_COLORS} value={ringColor} onChange={setRingColor} />
                    </div>
                  </div>
                </AccessoryBlock>
              </div>
            )}

            {currentStep === "summary" && (
              <div style={{ background: "#2B241F", color: "#EFE7DA", borderRadius: 14, padding: 22 }}>
                <div className="display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Riepilogo</div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.9 }}>
                  {summary.map((s) => <li key={s}>{s}</li>)}
                </ul>
                <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
                  <a href={`https://wa.me/${waNumber}?text=${waText}`} target="_blank" rel="noreferrer" style={{
                    background: "#4C7A72", color: "#fff", padding: "10px 16px", borderRadius: 8,
                    fontSize: 14, fontWeight: 600, textDecoration: "none",
                  }}>
                    Ordina su WhatsApp
                  </a>
                  <button onClick={copySummary} style={{
                    background: "transparent", color: "#EFE7DA", border: "1px solid #EFE7DA55",
                    padding: "10px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                  }}>
                    {copied ? "Copiato ✓" : "Copia riepilogo"}
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <button onClick={goBack} disabled={stepPos === 0} style={{
                background: "none", border: "none", color: stepPos === 0 ? "#00000033" : "#4C7A72",
                fontSize: 14, fontWeight: 600, padding: 0, cursor: stepPos === 0 ? "default" : "pointer",
              }}>
                ← Indietro
              </button>
              {stepPos < steps.length - 1 && (
                <button onClick={goNext} style={{
                  background: "#2B241F", color: "#EFE7DA", border: "none",
                  padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                }}>
                  Avanti →
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function optCardStyle(active) {
  return {
    background: active ? "#2B241F" : "#fff",
    color: active ? "#EFE7DA" : "#2B241F",
    border: active ? "1px solid #2B241F" : "1px solid #DCD1BB",
    borderRadius: 12, padding: "14px 12px", textAlign: "left",
  };
}

function Section({ title, children }) {
  return (
    <div>
      <div className="display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.6, marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function AccessoryBlock({ title, on, onToggle, children }) {
  return (
    <div style={{ background: "#F8F3E8", border: "1px solid #DCD1BB", borderRadius: 12, padding: 16 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
        <input type="checkbox" checked={on} onChange={(e) => onToggle(e.target.checked)} />
        {title}
      </label>
      {on && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
}

function SwatchRow({ options, value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => (
        <button key={o.hex} onClick={() => onChange(o.name)} style={{
          padding: "7px 14px", borderRadius: 999, fontSize: 13,
          border: value === o.name ? "1px solid #2B241F" : "1px solid #DCD1BB",
          background: value === o.name ? "#2B241F" : "#fff",
          color: value === o.name ? "#EFE7DA" : "#2B241F", fontWeight: 500,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: o.hex, display: "inline-block" }} />
          {o.name}
        </button>
      ))}
    </div>
  );
}