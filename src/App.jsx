import React, { useState, useMemo } from "react";

/* Paper #EFE7DA · Card #F8F3E8 · Ink #2B241F · Rosewood #B25B54 · Mustard #D6A24A · Teal #4C7A72 */

const YARN_COLORS = [
  { name: "Panna", hex: "#EDE3CE" },
  { name: "Terracotta", hex: "#B25B54" },
  { name: "Senape", hex: "#D6A24A" },
  { name: "Salvia", hex: "#6F8F6A" },
  { name: "Prugna", hex: "#7C5A78" },
  { name: "Petrolio", hex: "#3E6B72" },
  { name: "Cioccolato", hex: "#5A4032" },
  { name: "Corallo", hex: "#D97B6C" },
];

const PAILLETTE_COLORS = [
  { name: "Oro", hex: "#D9A94A" },
  { name: "Argento", hex: "#C7C7C7" },
  { name: "Rame", hex: "#B5651D" },
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

const BODY_ONDULATO = "M20,153 Q17,171 42,173 L158,173 Q183,171 180,153 L172,115 Q168,80 130,75 Q100,69 70,75 Q32,80 28,115 Z";
const BODY_DRITTO = "M20,153 Q17,171 42,173 L158,173 Q183,171 180,153 L172,115 L130,72 L70,72 L28,115 Z";

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
  const bodyPath = handleProfile === "dritto" ? BODY_DRITTO : BODY_ONDULATO;
  const bodyD = hasHole
    ? `${bodyPath} M56,85 A44,8 0 1,0 144,85 A44,8 0 1,0 56,85 Z`
    : bodyPath;

  const seqPts = useMemo(() => {
    const pts = [];
    const area = { x0: 30, x1: 170, y0: 115, y1: 169 };
    const rows = 6, cols = 7;
    const rowH = (area.y1 - area.y0) / rows;
    const colW = (area.x1 - area.x0) / cols;
    for (let r = 0; r < rows; r++) {
      if (r % 2 === 1) continue;
      const y = area.y0 + rowH * (r + 0.5);
      const stagger = (r / 2) % 2 === 1 ? colW / 2 : 0;
      for (let c = 0; c < cols; c++) {
        const x = area.x0 + stagger + colW * (c + 0.5);
        if (x > area.x1 - colW * 0.2) continue;
        pts.push({ x, y });
      }
    }
    return pts;
  }, []);

  return (
    <svg viewBox="0 0 200 195" width={size} height={size * (195 / 200)} role="img" aria-label="Anteprima clutch">
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

        {/* optional crochet strap accessory: two rings + arced strap above the body */}
        {strapOn && (
          <>
            <path d="M46,120 C30,70 60,30 100,26 C140,30 170,70 154,120" fill="none" stroke={shade(strapColor, -35)} strokeWidth="15" strokeLinecap="round" />
            <path d="M46,120 C30,70 60,30 100,26 C140,30 170,70 154,120" fill="none" stroke="url(#strapribs)" strokeWidth="13" strokeLinecap="round" opacity="0.9" />
            <circle cx="46" cy="120" r="7" fill="none" stroke={ringColor === "Argento" ? "#C7C7C7" : "#D9A94A"} strokeWidth="3.5" />
            <circle cx="154" cy="120" r="7" fill="none" stroke={ringColor === "Argento" ? "#C7C7C7" : "#D9A94A"} strokeWidth="3.5" />
          </>
        )}

        {/* chain accessory */}
        {chainOn && (() => {
          const c = chainColor === "Argento" ? "#C7C7C7" : "#D9A94A";
          const anchors = [[68, 90], [76, 88], [124, 88], [132, 90]];
          return anchors.map(([ax, ay], ai) => {
            const pts = [];
            for (let t = 0; t <= 1; t += 0.12) pts.push([ax + (100 - ax) * t, ay - t * 82]);
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
          <circle key={i} cx={p.x} cy={p.y} r="3.4" fill={paColor} stroke="#00000022" strokeWidth="0.4" />
        ))}
      </g>
    </svg>
  );
}

export default function App() {
  const STEP_IDS = ["size", "profile", "hole", "color", "accessories", "summary"];
  const [stepIdx, setStepIdx] = useState(0);

  const [sizeId, setSizeId] = useState("media");
  const [handleProfile, setHandleProfile] = useState("ondulato");
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
    ...(sizeId === "grande" ? [`Profilo manico: ${handleProfile === "dritto" ? "Dritto" : "Ondulato"}`] : []),
    `Apertura: ${hasHole ? "Con foro (a mano)" : "Senza foro (sottobraccio)"}`,
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
      size={230}
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
      `}</style>

      <header style={{ padding: "32px 20px 16px", textAlign: "center", borderBottom: "1px solid #DCD1BB" }}>
        <div className="display" style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "#B25B54", marginBottom: 6 }}>
          Filo &amp; Forma
        </div>
        <h1 className="display" style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>Configura la tua Clutch</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
          {steps.map((s, i) => (
            <div key={s} style={{
              width: i === stepPos ? 22 : 8, height: 8, borderRadius: 999,
              background: i <= stepPos ? "#B25B54" : "#DCD1BB", transition: "all .2s ease",
            }} />
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 300px) 1fr", gap: 28 }}>
          <div style={{
            background: "#F8F3E8", border: "1px solid #DCD1BB", borderRadius: 16, padding: 20,
            display: "flex", flexDirection: "column", alignItems: "center",
            position: "sticky", top: 20, height: "fit-content",
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
              <Section title="2. Profilo del manico (solo Grande)">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
                  <button className="opt" onClick={() => setHandleProfile("ondulato")} style={optCardStyle(handleProfile === "ondulato")}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Ondulato</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Bordo morbido e curvo</div>
                  </button>
                  <button className="opt" onClick={() => setHandleProfile("dritto")} style={optCardStyle(handleProfile === "dritto")}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Dritto</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Bordo lineare e netto</div>
                  </button>
                </div>
              </Section>
            )}

            {currentStep === "hole" && (
              <Section title={`${sizeId === "grande" ? "3" : "2"}. Apertura per il manico`}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12 }}>
                  <button className="opt" onClick={() => setHasHole(true)} style={optCardStyle(hasHole)}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Con foro</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Si porta a mano</div>
                  </button>
                  <button className="opt" onClick={() => setHasHole(false)} style={optCardStyle(!hasHole)}>
                    <div className="display" style={{ fontSize: 17, fontWeight: 600 }}>Senza foro</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>Si porta sottobraccio</div>
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
                  <div style={{ display: "flex", gap: 10 }}>
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
    <div style={{ display: "flex", gap: 8 }}>
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