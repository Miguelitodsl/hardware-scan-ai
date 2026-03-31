"use client";
import { useState, useEffect, useRef } from "react";

const NEON = "#00FF88";
const NEON_BLUE = "#00C8FF";
const BG = "#0A0A0F";
const SURFACE = "#12121A";
const SURFACE2 = "#1A1A25";
const BORDER = "#2A2A3A";
const TEXT = "#E0E0F0";
const TEXT2 = "#8888AA";

const cpuOptions = [
  "Ryzen 5 5600","Ryzen 5 5600X","Ryzen 7 5700X","Ryzen 7 5800X","Ryzen 9 5900X","Ryzen 9 5950X",
  "Ryzen 5 7600X","Ryzen 7 7700X","Ryzen 9 7900X","Ryzen 9 7950X",
  "Core i5-10400F","Core i5-12400F","Core i5-13400F","Core i5-13600K",
  "Core i7-10700K","Core i7-12700K","Core i7-13700K","Core i9-13900K",
  "Core i5-14600K","Core i7-14700K","Core i9-14900K",
];
const gpuOptions = [
  "GTX 1050 Ti","GTX 1060 6GB","GTX 1070","GTX 1080 Ti",
  "RTX 2060","RTX 2070","RTX 2080 Ti",
  "RTX 3060","RTX 3060 Ti","RTX 3070","RTX 3080","RTX 3090",
  "RTX 4060","RTX 4060 Ti","RTX 4070","RTX 4070 Ti","RTX 4080","RTX 4090",
  "RX 6600","RX 6700 XT","RX 6800 XT","RX 7600","RX 7700 XT","RX 7900 XTX",
  "Arc A750","Arc A770",
];
const ramOptions = ["DDR4 2133","DDR4 2400","DDR4 2666","DDR4 3000","DDR4 3200","DDR4 3600","DDR4 4000","DDR5 4800","DDR5 5200","DDR5 6000"];
const mobos = [
  "B450M Steel Legend","B450 Tomahawk","B550M Aorus Pro","B550 Gaming X","X570 Aorus Elite",
  "B660M Pro RS","Z690 Aorus Pro","B760M Aorus","Z790 Aorus Master",
  "MAG B550M Mortar","MPG X570 Gaming Edge",
];
const psus = ["400W Bronze","450W Bronze","550W Bronze","600W Bronze","650W Gold","750W Gold","850W Gold","1000W Platinum","1200W Titanium"];
const ramSizes = ["8GB (1x8)","8GB (2x4)","16GB (2x8)","16GB (1x16)","32GB (2x16)","32GB (4x8)","64GB (2x32)"];

function GlowText({ children, color = "#00ff88" }: any) {
  return (
    <span style={{ color, textShadow: `0 0 12px ${color}88, 0 0 24px ${color}44` }}>
      {children}
    </span>
  );
}

function ScanLine() {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPos(p => (p + 1) % 100), 30);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 8 }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2,
        top: `${pos}%`,
        background: `linear-gradient(90deg, transparent, ${NEON}44, ${NEON}88, ${NEON}44, transparent)`,
        transition: "top 30ms linear",
      }} />
    </div>
  );
}

function StatBar({ label, value, max = 100, color = NEON, unit = "%" }) {
  const pct = Math.min((value / max) * 100, 100);
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
        <span style={{ color: TEXT2, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
        <span style={{ color, fontFamily: "monospace", fontWeight: 700 }}>{value}{unit}</span>
      </div>
      <div style={{ background: BORDER, borderRadius: 2, height: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${anim}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 2,
          transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}

function SelectInput({ label, value, onChange, options, icon }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 11, color: TEXT2, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
        {icon} {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 6, color: TEXT, padding: "10px 14px", fontSize: 14,
          outline: "none", cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = NEON}
        onBlur={e => e.target.style.borderColor = BORDER}
      >
        <option value="">-- Selecionar --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MarkdownBlock({ text }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} style={{ color: NEON_BLUE, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", margin: "20px 0 10px", borderBottom: `1px solid ${BORDER}`, paddingBottom: 6 }}>
          {line.replace("## ", "")}
        </h3>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} style={{ color: NEON, fontSize: 12, letterSpacing: 1, margin: "14px 0 6px" }}>
          ⬡ {line.replace("### ", "")}
        </h4>
      );
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      elements.push(
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: TEXT }}>
          <span style={{ color: NEON, flexShrink: 0, marginTop: 1 }}>›</span>
          <span>{line.replace(/^[-•] /, "").replace(/\*\*(.+?)\*\*/g, "").replace(/`(.+?)`/g, "$1")}</span>
        </div>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} style={{ color: NEON_BLUE, fontWeight: 700, fontSize: 13, margin: "8px 0 4px" }}>
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.trim()) {
      const parsed = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`(.+?)`/g, `<code style="background:${BORDER};padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;color:${NEON}">$1</code>`);
      elements.push(
        <p key={i} style={{ color: TEXT, fontSize: 13, lineHeight: 1.7, margin: "4px 0" }}
          dangerouslySetInnerHTML={{ __html: parsed }} />
      );
    }
    i++;
  }
  return <div>{elements}</div>;
}

function BottleneckMeter({ score, label }) {
  const color = score >= 80 ? NEON : score >= 50 ? "#FFD700" : "#FF4466";
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnim(score), 200);
    return () => clearTimeout(t);
  }, [score]);

  const r = 54, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  const offset = circ - (anim / 100) * circ;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={BORDER} strokeWidth="8" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.23,1,0.32,1), stroke 0.5s", filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="monospace"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
          {anim}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill={TEXT2} fontSize="11">SCORE</text>
      </svg>
      <p style={{ color: TEXT2, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 4 }}>{label}</p>
    </div>
  );
}

const glassCard = {
  background: SURFACE,
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  padding: "20px 24px",
  position: "relative",
  overflow: "hidden",
};

export default function HardwareScanAI() {
  const [form, setForm] = useState({ cpu: "", gpu: "", ram: "", ramSize: "", mobo: "", psu: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("form");
  const [scanActive, setScanActive] = useState(false);
  const [dots, setDots] = useState(".");
  const resultRef = useRef(null);
  // Essa função vai avisar o Mercado Pago que o Miguel quer receber R$ 20
  const handlePagamento = async () => {
    try {
      const response = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "cliente@email.com", // Depois a gente coloca um campo de input aqui
          cpu: "Ryzen 5 5600",
          gpu: "RTX 4060",
          ram: "16GB",
          ramSize: "2x8",
          mobo: "B450M Steel Legend",
          psu: "550W Bronze",
          score: 70,
          relatorio: "Relatório completo de hardware gerado por Hardware Scan AI."
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Mágica acontece aqui: redireciona para o Mercado Pago
        window.location.href = data.checkoutUrl;
      } else {
        alert("Erro ao gerar link de pagamento. Verifique as chaves na Vercel.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na conexão com o servidor.");
    }
  };

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 400);
    return () => clearInterval(t);
  }, [loading]);

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const allFilled = form.cpu && form.gpu && form.ram && form.ramSize && form.mobo && form.psu;

  async function runScan() {
    if (!allFilled) { setError("⚠ Preencha todos os campos antes de escanear."); return; }
    setError(""); setLoading(true); setScanActive(true);
    try {
      const prompt = `Você é um especialista em hardware PC Gamer. Analise o seguinte setup e retorne um relatório técnico completo em português.

SETUP ANALISADO:
- CPU: ${form.cpu}
- GPU: ${form.gpu}
- RAM: ${form.ramSize} @ ${form.ram}
- Placa-mãe: ${form.mobo}
- Fonte: ${form.psu}

Retorne EXATAMENTE neste formato Markdown:

## SCORE DE EFICIÊNCIA
[Número de 0 a 100 representando a eficiência geral do setup. Considere balanceamento CPU/GPU, RAM, e potência da fonte.]
SCORE: [número]

## DIAGNÓSTICO RÁPIDO
[2-3 frases resumindo o estado do setup]

## GARGALOS IDENTIFICADOS
### [Nome do gargalo 1]
- Descrição do problema e impacto nos jogos/tarefas

### [Nome do gargalo 2 se houver]
- Descrição

## OTIMIZAÇÕES DE BIOS E SOFTWARE
- **XMP/DOCP:** [Se a RAM está rodando abaixo do potencial, instrução para ativar XMP/DOCP]
- **Resizable BAR:** [Se aplicável, instrução]
- **CPU Curve Optimizer:** [Se Ryzen, mencionar PBO/CO]
- **Driver:** [Versão ou recomendação de driver]
- **Software:** [MSI Afterburner, HWiNFO, etc.]

## UPGRADE RECOMENDADO
### Upgrade Prioritário
- Componente: [qual trocar primeiro e por quê]

### Upgrade Secundário
- Componente: [próximo upgrade lógico]

## VEREDITO FINAL
[Frase impactante resumindo o setup em estilo gamer]`;

 // Substitua as linhas 271 até a 279 por isso aqui:
const res = await fetch("/api/analyze", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  // O jeito certo para o SEU código:
body: JSON.stringify({
  cpu: form.cpu,
  gpu: form.gpu,
  ram: form.ram,
  mobo: form.mobo,
  psu: form.psu
}),
});

      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "";

      const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 70;

      const cleanText = text.replace(/SCORE:\s*\d+/i, "").replace(/## SCORE DE EFICIÊNCIA[\s\S]*?(?=## )/i, "");

      setResult({ score, text: cleanText, raw: text });
      setActiveSection("result");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("Erro na análise: " + e.message);
    } finally {
      setLoading(false); setScanActive(false);
    }
  }

  return (
    <div style={{ fontFamily: "'Courier New', monospace", background: BG, minHeight: "100vh", color: TEXT, padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ padding: "32px 24px 24px", borderBottom: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% -20%, ${NEON}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: NEON, boxShadow: `0 0 12px ${NEON}` }} />
            <span style={{ color: TEXT2, fontSize: 11, letterSpacing: 3, textTransform: "uppercase" }}>Hardware Scan AI v1.0</span>
            <div style={{ flex: 1 }} />
            <span style={{ color: NEON, fontSize: 11, fontFamily: "monospace" }}>SJC/SP · 2025</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>
            <GlowText color={NEON}>HARDWARE</GlowText>
            <span style={{ color: TEXT }}> SCAN </span>
            <GlowText color={NEON_BLUE}>AI</GlowText>
          </h1>
          <p style={{ color: TEXT2, fontSize: 13, margin: "8px 0 0", letterSpacing: 1 }}>
            Diagnóstico inteligente de setup gamer · Identifica gargalos · Sugere otimizações
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginTop: 24, marginBottom: 24, borderBottom: `1px solid ${BORDER}` }}>
          {[["form", "⬡ SETUP"], ["result", "⬡ ANÁLISE"]].map(([id, label]) => (
            <button key={id} onClick={() => id === "result" && result ? setActiveSection(id) : setActiveSection("form")}
              style={{
                background: "none", border: "none", padding: "10px 20px", cursor: "pointer",
                color: activeSection === id ? NEON : TEXT2,
                fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
                borderBottom: activeSection === id ? `2px solid ${NEON}` : "2px solid transparent",
                transition: "all 0.2s",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* FORM */}
        {activeSection === "form" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ ...glassCard, gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 6, height: 20, background: NEON, borderRadius: 2, boxShadow: `0 0 8px ${NEON}` }} />
                <span style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: NEON }}>Configuração do Sistema</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 24px" }}>
                <SelectInput label="Processador (CPU)" icon="⚡" value={form.cpu} onChange={v => f("cpu", v)} options={cpuOptions} />
                <SelectInput label="Placa de Vídeo (GPU)" icon="🎮" value={form.gpu} onChange={v => f("gpu", v)} options={gpuOptions} />
                <SelectInput label="Memória RAM" icon="💾" value={form.ram} onChange={v => f("ram", v)} options={ramOptions} />
                <SelectInput label="Capacidade RAM" icon="📊" value={form.ramSize} onChange={v => f("ramSize", v)} options={ramSizes} />
                <SelectInput label="Placa-mãe" icon="🔌" value={form.mobo} onChange={v => f("mobo", v)} options={mobos} />
                <SelectInput label="Fonte de Alimentação" icon="⚡" value={form.psu} onChange={v => f("psu", v)} options={psus} />
              </div>
            </div>

            {/* Preview do setup */}
            {allFilled && (
              <div style={{ ...glassCard, gridColumn: "1 / -1", borderColor: `${NEON}44` }}>
                <ScanLine />
                <div style={{ fontSize: 11, letterSpacing: 2, color: NEON, marginBottom: 14, textTransform: "uppercase" }}>⬡ Setup Detectado</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {[
                    ["CPU", form.cpu], ["GPU", form.gpu], ["RAM", `${form.ramSize} ${form.ram}`],
                    ["MOBO", form.mobo], ["PSU", form.psu],
                  ].map(([k, v]) => (
                    <div key={k} style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 12px" }}>
                      <span style={{ color: TEXT2, fontSize: 10, letterSpacing: 1 }}>{k} </span>
                      <span style={{ color: NEON_BLUE, fontSize: 13, fontWeight: 700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ gridColumn: "1 / -1", background: "#FF446620", border: "1px solid #FF4466", borderRadius: 8, padding: "12px 16px", color: "#FF4466", fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              <button onClick={runScan} disabled={loading || !allFilled}
                style={{
                  background: loading || !allFilled ? SURFACE2 : `linear-gradient(135deg, ${NEON}22, ${NEON}44)`,
                  border: `1px solid ${loading || !allFilled ? BORDER : NEON}`,
                  borderRadius: 8, color: loading || !allFilled ? TEXT2 : NEON,
                  padding: "14px 48px", fontSize: 13, letterSpacing: 3, textTransform: "uppercase",
                  cursor: loading || !allFilled ? "not-allowed" : "pointer",
                  fontFamily: "monospace", fontWeight: 700,
                  boxShadow: loading || !allFilled ? "none" : `0 0 20px ${NEON}44`,
                  transition: "all 0.3s",
                  position: "relative", overflow: "hidden",
                }}>
                {loading ? (
                  <span>⬡ ANALISANDO{dots}</span>
                ) : (
                  <span>⬡ INICIAR SCAN</span>
                )}
              </button>
              {!allFilled && <p style={{ color: TEXT2, fontSize: 11, marginTop: 10, letterSpacing: 1 }}>Preencha todos os campos para habilitar o scan</p>}
            </div>
          </div>
        )}

        {/* RESULT */}
        {activeSection === "result" && result && (
          <div ref={resultRef} style={{ display: "grid", gap: 20 }}>

            {/* Score principal */}
            <div style={{ ...glassCard, borderColor: `${NEON}44` }}>
              <ScanLine />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: NEON, textTransform: "uppercase", marginBottom: 8 }}>⬡ Resultado da Análise</div>
                  <h2 style={{ margin: 0, fontSize: 18, color: TEXT }}>
                    {form.cpu} + {form.gpu}
                  </h2>
                  <p style={{ color: TEXT2, fontSize: 13, margin: "6px 0 0" }}>{form.ramSize} @ {form.ram} · {form.mobo} · {form.psu}</p>
                </div>
                <BottleneckMeter score={result.score} label="Eficiência" />
              </div>
            </div>

            {/* Barras de métricas estimadas */}
            <div style={{ ...glassCard }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: TEXT2, textTransform: "uppercase", marginBottom: 16 }}>⬡ Métricas Estimadas</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
                <StatBar label="Balanceamento CPU/GPU" value={result.score} color={NEON} />
                <StatBar label="Performance RAM" value={form.ram.includes("3200") || form.ram.includes("3600") || form.ram.includes("DDR5") ? 82 : form.ram.includes("2666") ? 60 : 45} color={NEON_BLUE} />
                <StatBar label="Potência da Fonte" value={
                  form.psu.includes("750") || form.psu.includes("850") || form.psu.includes("1000") ? 90 :
                  form.psu.includes("650") ? 75 : form.psu.includes("550") || form.psu.includes("600") ? 60 : 45
                } color="#FFD700" />
                <StatBar label="Potencial de OC" value={
                  (form.cpu.includes("X") || form.cpu.includes("K")) && (form.mobo.includes("X5") || form.mobo.includes("Z6") || form.mobo.includes("Z7")) ? 85 : 40
                } color="#FF8C00" />
              </div>
            </div>

            {/* Relatório da IA */}
            <div style={{ ...glassCard }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: NEON_BLUE, textTransform: "uppercase", marginBottom: 16 }}>
                ⬡ Relatório Completo · Claude AI
              </div>
              <MarkdownBlock text={result.text} />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setActiveSection("form")}
                style={{
                  background: "none", border: `1px solid ${BORDER}`, borderRadius: 8,
                  color: TEXT2, padding: "10px 24px", fontSize: 12, letterSpacing: 2,
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "monospace",
                }}>
                ← Novo Setup
              </button>
              <button onClick={() => {
                const txt = `HARDWARE SCAN AI - RELATÓRIO\n\nSetup: ${form.cpu} + ${form.gpu} | ${form.ramSize} ${form.ram}\nMobo: ${form.mobo} | PSU: ${form.psu}\nScore: ${result.score}/100\n\n${result.raw}`;
                navigator.clipboard?.writeText(txt);
              }}
                style={{
                  background: `${NEON}22`, border: `1px solid ${NEON}`, borderRadius: 8,
                  color: NEON, padding: "10px 24px", fontSize: 12, letterSpacing: 2,
                  textTransform: "uppercase", cursor: "pointer", fontFamily: "monospace",
                }}>
                <button 
          onClick={handlePagamento}
          className="bg-[#00ff88] text-black font-bold py-2 px-4 rounded hover:bg-[#00cc66] transition-all ml-2"
        >
          🔓 LIBERAR RELATÓRIO (R$ 20,00)
        </button>
      </div>
    </div>
  )
}

        {activeSection === "result" && !result && (
          <div style={{ textAlign: "center", padding: "60px 0", color: TEXT2 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⬡</div>
            <p style={{ letterSpacing: 2, textTransform: "uppercase", fontSize: 13 }}>Nenhuma análise realizada ainda</p>
            <button onClick={() => setActiveSection("form")}
              style={{ background: "none", border: `1px solid ${NEON}`, borderRadius: 8, color: NEON, padding: "10px 24px", marginTop: 16, cursor: "pointer", fontSize: 12, letterSpacing: 2, fontFamily: "monospace" }}>
              → Ir para o Setup
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, borderTop: `1px solid ${BORDER}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: TEXT2, fontSize: 11, letterSpacing: 1 }}>Hardware Scan AI · Powered by Claude · SJC/SP</span>
          <span style={{ color: BORDER, fontSize: 11, fontFamily: "monospace" }}>MVP v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
