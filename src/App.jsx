import { useState, useEffect, useRef } from "react";
const equipeDiretoria = '/diretoria-original.jpeg';
import logoBranco from "./image/Logo Branco com Frase.png";
import magaOficial from "./image/magá SEM FUNDO(3).png";
import mapaMundi from "./image/mapa mundi com navio.png";
import VLibras from './VLibras'
import { DEFAULT_CONTENT, initials, validateContent } from '../shared/content.js';
/* ── Brand tokens ── */
const B = {
  navy: "#01113d",
  navy2: "#1a3061",
  orange: "#fca311",
  orangeLt: "#ffbe4f",
  silver: "#b1bfcc",
  mist: "#dde5f2",
  offwhite: "#efefef",
};

/* ── Intersection reveal hook ── */
function useReveal(threshold = 0.14) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ══════════════════════════════
   NAV
══════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Início", href: "#hero" },
    { label: "Serviços", href: "#servicos" },
    { label: "Cases", href: "#cases" },
    { label: "Quem Somos", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(1,17,61,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(252,163,17,0.12)` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center group" aria-label="Atlântica Consultoria Internacional — início">
          <img
            src={logoBranco}
            alt="Atlântica Consultoria Internacional"
            className="w-40 h-14 object-contain object-left"
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        <a
          href="#contato"
          className="hidden md:inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded text-sm"
        >
          Fale Conosco
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Mobile burger */}
        <button className="md:hidden p-2" style={{ color: B.silver }} onClick={() => setOpen(v => !v)} aria-label="menu hambúrguer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>
              : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-5 space-y-4" style={{ background: "rgba(1,17,61,0.98)", borderTop: `1px solid rgba(252,163,17,0.12)` }}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="block nav-link py-1.5" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contato" className="block btn-primary px-5 py-3 rounded text-sm text-center mt-2" onClick={() => setOpen(false)}>
            Fale Conosco
          </a>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════
   HERO
══════════════════════════════ */
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${B.navy} 0%, ${B.navy2} 100%)` }}
    >
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-30" />

      {/* Ambient orbs */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, ${B.orange}, transparent 65%)`, filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full pointer-events-none opacity-8"
        style={{ background: `radial-gradient(circle, ${B.navy2}, transparent 70%)`, filter: "blur(60px)" }} />

      {/* Official world map — right side */}
      <div className="absolute right-8 xl:right-20 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
        <img
          src={mapaMundi}
          alt="Mapa-múndi com navio, símbolo da atuação internacional da Atlântica"
          className="w-[380px] xl:w-[500px] h-auto float-slow opacity-25"
          style={{ filter: "drop-shadow(0 16px 40px rgba(252,163,17,0.12))" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="max-w-[600px]">
          <div className="section-label mb-5 flex items-center gap-3" style={{ animation: "fade-up 0.5s ease both" }}>
            <span className="w-8 h-px" style={{ background: B.orange }} />
            Consultoria Internacional de Alto Nível
          </div>

          <h1
            className="leading-[1.08] mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              color: B.offwhite,
              animation: "fade-up 0.6s 0.1s ease both",
            }}
          >
            Sua empresa,{" "}
            <em className="orange-text not-italic">sem fronteiras</em>
          </h1>

          <p
            className="text-base leading-relaxed mb-10 max-w-lg"
            style={{ color: B.silver, animation: "fade-up 0.6s 0.2s ease both" }}
          >
            Desde 2015, a Atlântica auxilia empresas brasileiras em seu processo de internacionalização, promovendo a inserção estratégica e assertiva no mercado global.
          </p>
          <div className="flex flex-wrap gap-4" style={{ animation: "fade-up 0.6s 0.3s ease both" }}>
            <a href="#contato" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm">
              Agendar Consulta Gratuita
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#cases" className="btn-outline inline-flex items-center gap-2 px-7 py-3.5 rounded text-sm">
              Ver Cases de Sucesso
            </a>
          </div>

        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-35 pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: B.silver }}>Scroll</span>
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <rect x="1" y="1" width="14" height="20" rx="7" stroke={B.silver} strokeWidth="1.5" />
          <circle cx="8" cy="7" r="2" fill={B.orange}>
            <animate attributeName="cy" values="7;13;7" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-10">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#01113d" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   SERVICES
══════════════════════════════ */
const SERVICES = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /><path d="m15 8 3-3m0 0h-3m3 0v3" /></svg>,
    title: "Exportação",
    desc: "Ajudamos empresas a ingressar no mercado internacional de forma estratégica e segura. Analisamos a documentação necessária e conectamos negócios às melhores oportunidades no mercado global.",
    items: ["Análise de viabilidade", "Estudos de mercado e logístico-burocrático", "Prospecção internacional de compradores"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5h7M7.5 3v2c0 4-2 7-5 9" /><path d="M5 10c1.5 2 3 3.5 5 4.5" /><path d="m13 21 4-10 4 10M14.5 17h5" /></svg>,
    title: "Tradução",
    desc: "Facilitamos a comunicação entre empresas de diferentes países com traduções claras e profissionais. Oferecemos suporte linguístico para documentos e encontros comerciais.",
    items: ["Serviços de tradução", "Tradução de documentos", "Reuniões de negócios"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
    title: "Importação",
    desc: "Orientamos operações de importação desde o planejamento até a escolha de fornecedores. Buscamos oportunidades fiscais e reduzimos riscos durante todo o processo.",
    items: ["Busca por benefícios fiscais", "Consultoria em importação", "Prospecção internacional de fornecedores"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 11c1.5 0 3-1.5 3-3s-1.5-3-3-3-3 1.5-3 3" /><path d="M8 11c-1.5 0-3-1.5-3-3s1.5-3 3-3 3 1.5 3 3" /><path d="m8 12 4 4 4-4" /><path d="M3 21v-2a5 5 0 0 1 5-5M21 21v-2a5 5 0 0 0-5-5" /></svg>,
    title: "Paradiplomacia",
    desc: "Aproximamos governos locais, instituições e organizações de oportunidades no exterior. Desenvolvemos conexões estratégicas para atrair investimentos e estabelecer parcerias internacionais.",
    items: ["Serviços paradiplomáticos", "Atração de investimentos estrangeiros", "Parcerias internacionais"],
  },
];

function Services() {
  const { ref, visible } = useReveal();
  return (
    <section id="servicos" className="py-28 relative"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, ${B.navy2} 50%, ${B.navy} 100%)` }}>

      {/* Top divider accent */}
      <div className="brand-divider mb-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className={`text-center mb-16 reveal ${visible ? "visible" : ""}`}>
          <div className="section-label mb-4">O que fazemos</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: B.offwhite }}>
            Nossos <span className="orange-text">Serviços</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: B.silver }}>
            Conectamos empresas e instituições ao mercado internacional por meio de soluções em importação, exportação, paradiplomacia, tradução e internacionalização.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {SERVICES.map((s, i) => {
            const { ref: cr, visible: cv } = useReveal();
            return (
              <div
                key={s.title}
                ref={cr}
                className={`service-card rounded-xl p-7 reveal ${cv ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "rgba(252,163,17,0.1)", color: B.orange, border: "1px solid rgba(252,163,17,0.22)" }}
                >
                  {s.icon}
                </div>
                <h3 className="font-semibold text-base mb-3" style={{ color: B.offwhite }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: B.silver }}>{s.desc}</p>
                <ul className="space-y-2">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: B.mist }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: B.orange }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   CASES
══════════════════════════════ */
const CASES = [
  {
    flag: "🌎", country: "América Latina",
    client: "Exatron", sector: "Exportação",
    title: "Identificação de mercados e compradores potenciais para a expansão da Exatron na América Latina",
    result: "Mercados prioritários e principais clientes identificados com segurança",
    tags: ["Análise de Mercado", "Exportação", "Prospecção"], color: B.orange,
    featured: true,
  },
  {
    flag: "🌐", country: "EUA, Europa e China",
    client: "SECON", sector: "Importação de eletrônicos",
    title: "Redução tributária, busca de fornecedores e seleção de parceiros logísticos internacionais",
    result: "Alíquota de importação reduzida de 16% para até 0%",
    tags: ["Ex-Tarifário", "Fornecedores", "Logística"], color: "#4A90D9",
  },
  {
    flag: "⚓", country: "Comércio Exterior",
    client: "Sulmix Diluentes", sector: "Importação de óleo mineral",
    title: "Estruturação regulatória, logística e tributária para uma operação de importação segura",
    result: "Redução de custos de R$ 100 mil e alíquota zero de II e IPI identificada",
    tags: ["ANP", "DUIMP", "Sourcing"], color: "#22c55e",
  },
];

function CaseCard({ caseItem, index }) {
  const { ref, visible } = useReveal();

  return (
    <div
      ref={ref}
      className={`case-card rounded-xl p-8 reveal ${visible ? "visible" : ""} ${caseItem.featured ? "md:col-span-2 lg:p-10" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{caseItem.flag}</span>
          <div>
            <div className="text-xs mb-1" style={{ color: B.silver }}>{caseItem.country} · {caseItem.sector}</div>
            <div className="text-base font-bold tracking-wide" style={{ color: caseItem.color }}>{caseItem.client}</div>
          </div>
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded font-medium flex-shrink-0"
          style={{ background: `${caseItem.color}18`, color: caseItem.color, border: `1px solid ${caseItem.color}35` }}
        >
          Concluído
        </span>
      </div>

      <h3
        className={`font-medium leading-snug mb-4 ${caseItem.featured ? "text-lg" : "text-base"}`}
        style={{ color: B.offwhite }}
      >
        {caseItem.title}
      </h3>

      <div
        className="flex items-center gap-2.5 py-3 px-4 rounded mb-5"
        style={{ background: "rgba(252,163,17,0.07)", border: "1px solid rgba(252,163,17,0.15)" }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.orange} strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-sm font-medium" style={{ color: B.orange }}>{caseItem.result}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {caseItem.tags.map(tag => (
          <span key={tag} className="text-xs px-2.5 py-1 rounded"
            style={{ background: "rgba(221,229,242,0.05)", border: "1px solid rgba(221,229,242,0.1)", color: B.silver }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Cases() {
  const { ref, visible } = useReveal();
  return (
    <section id="cases" className="py-28 relative overflow-hidden"
      style={{ background: B.navy }}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none opacity-6"
        style={{ background: `radial-gradient(circle, ${B.orange}, transparent)`, filter: "blur(90px)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className={`mb-14 reveal ${visible ? "visible" : ""}`}>
          <div className="section-label mb-4">Resultados comprovados</div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: B.offwhite }}>
              Cases de <span className="orange-text">Sucesso</span>
            </h2>
            <p className="text-sm max-w-xs" style={{ color: B.silver }}>
              Projetos reais de exportação e importação conduzidos com análise, segurança e estratégia.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {CASES.map((caseItem, index) => (
            <CaseCard key={caseItem.client} caseItem={caseItem} index={index} />
          ))}
        </div>

        {/* Testimonial */}
        <div
          className="mt-10 rounded-xl p-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, rgba(252,163,17,0.07), rgba(26,48,97,0.7))`, border: "1px solid rgba(252,163,17,0.16)" }}
        >
          <div
            className="absolute top-4 right-6 text-7xl opacity-8 select-none leading-none"
            style={{ color: B.orange, fontFamily: "Georgia, serif" }}
          >"</div>
          <p
            className="text-lg leading-relaxed max-w-3xl italic mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: B.mist }}
          >
            "Foi possível identificar os países com maior potencial de compra e quais poderiam ser os principais clientes."
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${B.orange}, ${B.orangeLt})`, color: B.navy }}
            >LM</div>
            <div>
              <div className="font-semibold text-sm" style={{ color: B.offwhite }}>Leonardo Moliterni</div>
              <div className="text-xs" style={{ color: B.silver }}>Diretor de Comércio Exterior · Exatron</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   ABOUT
══════════════════════════════ */
/* ── CEO Mascote card ── */
function CeoCard() {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""}`}>
      <div className="section-label mb-3 text-center">Liderança executiva</div>
      <h3 className="text-center mb-10"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: B.offwhite }}>
        CEO
      </h3>

      <div
        className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${B.navy2} 0%, ${B.navy} 100%)`,
          border: `1px solid rgba(252,163,17,0.25)`,
          boxShadow: `0 0 80px rgba(252,163,17,0.07)`,
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72"
            style={{ background: `radial-gradient(circle at top right, rgba(252,163,17,0.08), transparent 60%)` }} />
          <div className="absolute bottom-0 left-0 w-56 h-56"
            style={{ background: `radial-gradient(circle at bottom left, rgba(26,48,97,0.8), transparent 60%)` }} />
        </div>

        <div className="relative flex flex-col sm:flex-row">

          {/* Mascote slot */}
          <div
            className="flex-shrink-0 flex flex-col items-center justify-end sm:w-56 min-h-[220px] sm:min-h-0 relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, rgba(252,163,17,0.12), rgba(1,17,61,0.6))` }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(252,163,17,0.12), transparent 70%)` }} />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full pointer-events-none"
              style={{ border: `1px solid rgba(252,163,17,0.12)` }} />
            <div className="absolute -bottom-2 -right-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ border: `1px solid rgba(252,163,17,0.08)` }} />

            <div
              className="relative z-10 w-40 h-48 sm:w-48 sm:h-56 flex items-center justify-center mt-6 mb-4 sm:my-auto"
              style={{ filter: "drop-shadow(0 8px 24px rgba(252,163,17,0.25))" }}
            >
              <img
                src={magaOficial}
                alt="Magá, mascote oficial da Atlântica Consultoria Internacional"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Label sob o mascote */}
            <div
              className="relative z-10 mb-4 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: "rgba(252,163,17,0.15)", color: B.orange, border: "1px solid rgba(252,163,17,0.3)" }}
            >
              Mascote Oficial
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 p-7 sm:p-9 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 mb-4 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit"
              style={{ background: "rgba(252,163,17,0.1)", color: B.orange, border: "1px solid rgba(252,163,17,0.25)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill={B.orange}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Chief Executive Officer
            </div>

            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.75rem", color: B.offwhite, lineHeight: 1.1 }}>
              Magá
            </div>
            <div className="mt-1 mb-5 text-sm" style={{ color: B.orange }}>CEO & Fundador · Atlântica Consultoria Internacional</div>

            <div className="w-10 h-px mb-5" style={{ background: `linear-gradient(90deg, ${B.orange}, transparent)` }} />

            <p className="text-sm leading-relaxed mb-6" style={{ color: B.silver }}>
              Magá, nossa mascote e CEO, está presente na Atlântica, desde sua fundação, em 2015. Seu nome vem de Magalhães, uma estrela da constelação do Cruzeiro do Sul, símbolo que representa seu papel de guiar e conectar a Atlântica ao mundo.            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { icon: "🎓", text: "Formação acadêmica" },
                { icon: "🌍", text: "Experiência internacional" },
                { icon: "📅", text: "Fundou a empresa em 2009" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2" style={{ color: B.silver }}>
                  <span>{item.icon}</span>
                  <span className="text-xs">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DIRETORIAS = [
  {
    name: "Presidência",
    heading: "Presidência",
    acento: B.orange,
    director: { name: "Yasmim Teixeira", role: "Presidente", initials: "YT", badge: "Pres.", grad: [B.orange, B.orangeLt] },
  },
  {
    name: "Vice-Presidência",
    heading: "Vice-Presidência",
    acento: "#a855f7",
    director: { name: "Donato Mörschbächer", role: "Vice-presidente", initials: "DM", badge: "Vice", grad: ["#a855f7", "#d8b4fe"] },
  },
  {
    name: "Administrativo-Financeiro",
    acento: "#4A90D9",
    director: { name: "Luís Gustavo Brum", role: "Diretor Administrativo-Financeiro", initials: "LB", grad: ["#4A90D9", "#7CB9F0"] },
  },
  {
    name: "Comercial",
    acento: "#22c5d6",
    director: { name: "Huesley Padilha", role: "Diretor Comercial", initials: "HP", grad: ["#22c5d6", "#67e8f9"] },
  },
  {
    name: "Gestão de Pessoas",
    acento: "#ec4899",
    director: { name: "Miguel Vigolo", role: "Diretor de Gestão de Pessoas", initials: "MV", grad: ["#ec4899", "#f9a8d4"] },
  },
  {
    name: "Marketing",
    acento: "#f97316",
    director: { name: "Maria Isabela Gesswein", role: "Diretora de Marketing", initials: "MG", grad: ["#f97316", "#fdba74"] },
  },
  {
    name: "Projetos",
    acento: "#10b981",
    director: { name: "Bibiana Garcia", role: "Diretora de Projetos", initials: "BG", grad: ["#10b981", "#34d399"] },
  },
];

function PersonCard({ person, delay, acento, isDirector = false }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal flex items-center gap-3 p-3 rounded-lg ${visible ? "visible" : ""}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: isDirector ? `${acento}10` : "rgba(1,17,61,0.4)",
        border: `1px solid ${isDirector ? `${acento}35` : "rgba(221,229,242,0.07)"}`,
        transition: "border-color 0.25s ease, opacity 0.65s ease, transform 0.65s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${acento}45`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isDirector ? `${acento}35` : "rgba(221,229,242,0.07)"; }}
    >
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ background: `linear-gradient(135deg, ${person.grad[0]}, ${person.grad[1]})`, color: B.navy }}
      >
        {person.initials}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold truncate" style={{ color: B.offwhite }}>{person.name}</div>
        <div className="text-[11px] truncate" style={{ color: isDirector ? acento : B.silver }}>{person.role}</div>
      </div>
      {isDirector && (
        <span
          className="ml-auto flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background: `${acento}18`, color: acento, border: `1px solid ${acento}30` }}
        >{person.badge || "Dir."}</span>
      )}
    </div>
  );
}

function DiretoriaBlock({ d, index }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`rounded-xl overflow-hidden reveal ${visible ? "visible" : ""}`}
      style={{
        border: `1px solid rgba(221,229,242,0.09)`,
        background: "rgba(26,48,97,0.25)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center gap-2.5"
        style={{ background: `${d.acento}12`, borderBottom: `1px solid ${d.acento}22` }}
      >
        <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: d.acento }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: d.acento }}>
          {d.heading || `Diretoria de ${d.name}`}
        </span>
      </div>

      {/* Director row */}
      <div className={`px-4 pt-4 ${d.staff?.length ? "pb-2" : "pb-4"}`}>
        <PersonCard person={d.director} delay={index * 60} acento={d.acento} isDirector />
      </div>

      {d.staff?.length > 0 && (
        <>
          {/* Divider */}
          <div className="mx-4 my-1" style={{ height: "1px", background: "rgba(221,229,242,0.06)" }} />

          {/* Staff */}
          <div className="px-4 pb-4 space-y-2">
            {d.staff.slice(0, 1).map((s, si) => (
              <PersonCard key={s.name} person={s} delay={index * 60 + (si + 1) * 50} acento={d.acento} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function About({ content }) {
  const { ref, visible } = useReveal();
  const { ref: teamRef, visible: teamVis } = useReveal();
  return (
    <section id="sobre" className="py-28"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, ${B.navy2} 100%)` }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Intro row */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div ref={ref} className={`reveal-left ${visible ? "visible" : ""}`}>
            <div className="section-label mb-4">Nossa história</div>
            <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: B.offwhite }}>
              Quem <span className="orange-text">Somos</span>
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: B.silver }}>
              Fundada em 2015, a Atlântica é uma empresa júnior vinculada ao curso de Relações Internacionais da UFRGS. Sem fins lucrativos, tem como propósito proporcionar aos seus membros uma experiência prática em comércio exterior e uma vivência empresarial. Para isso, dedicamo-nos ao desenvolvimento de projetos de internacionalização de empresas e instituições, atuando em áreas como exportação, importação, paradiplomacia e tradução, conectando o conhecimento acadêmico às demandas e oportunidades do mercado internacional.
            </p>
          </div>

          <div className={`reveal-right flex items-center justify-center ${visible ? "visible" : ""}`}>
            <img
              src={logoBranco}
              alt="Atlântica Consultoria Internacional"
              className="w-full max-w-lg h-auto object-contain"
            />
          </div>
        </div>

        <div className="brand-divider mb-16" />

        {/* ── CEO / Mascote ── */}
        <CeoCard />

        <div className="brand-divider my-16" />

        {/* Diretorias */}
        <div
          ref={teamRef}
          className={`grid lg:grid-cols-[1.35fr_0.65fr] items-stretch gap-8 mb-12 reveal ${teamVis ? "visible" : ""}`}
        >
          <figure
            className="relative min-h-[380px] lg:min-h-[430px] rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(252,163,17,0.2)", boxShadow: "0 18px 50px rgba(0,0,0,0.2)" }}
          >
            <img
              src={content.photo ? `/api/photo?path=${encodeURIComponent(content.photo)}` : equipeDiretoria}
              onError={event => {
                const fallback = new URL(equipeDiretoria, window.location.href).href;
                if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
              }}
              alt="Equipe de diretoria da Atlântica Consultoria Internacional"
              className="absolute inset-0 w-full h-full object-cover imagem-diretoria"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, transparent 45%, rgba(1,17,61,0.92) 100%)" }}
            />
            <figcaption className="absolute left-6 right-6 bottom-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: B.orange }}>
                  Liderança Atlântica
                </div>
                <div className="text-sm font-medium" style={{ color: B.offwhite }}>
                  Estratégia construída por pessoas
                </div>
              </div>
              <span className="hidden sm:block text-xs" style={{ color: B.silver }}>Nossa diretoria</span>
            </figcaption>
          </figure>

          <div
            className="flex flex-col justify-center rounded-2xl p-7 lg:p-8"
            style={{ background: "rgba(1,17,61,0.45)", border: "1px solid rgba(221,229,242,0.08)" }}
          >
            <div className="section-label mb-3">Estrutura organizacional</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: B.offwhite }}>
              Nossas Diretorias
            </h3>
            <div className="w-10 h-px my-5" style={{ background: `linear-gradient(90deg, ${B.orange}, transparent)` }} />
            <p className="text-sm leading-relaxed" style={{ color: B.silver }}>
              Equipes especializadas organizadas por área de atuação, cada uma liderada por uma diretoria comprometida com os resultados dos clientes.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {DIRETORIAS.map((d, i) => <DiretoriaBlock key={d.name} d={{ ...d, director: { ...d.director, name: content.names[i], initials: initials(content.names[i]) } }} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   CONTACT
══════════════════════════════ */
function Contact({ phone }) {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <section id="contato" className="py-28 relative overflow-hidden"
      style={{ background: B.navy }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${B.orange}, transparent)`, filter: "blur(100px)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Left */}
          <div ref={ref} className={`lg:col-span-2 reveal-left ${visible ? "visible" : ""}`}>
            <div className="section-label mb-4">Vamos conversar</div>
            <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,3.5vw,2.8rem)", color: B.offwhite }}>
              Entre em <span className="orange-text">Contato</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: B.silver }}>
              Agende uma consulta gratuita e confidencial. Nossa equipe retornará em até 24 horas úteis.
            </p>

            <div className="space-y-5">
              {[
                { icon: "📍", label: "Endereço", val: "Avenida João Pessoa, 52, Porto Alegre, Rio Grande do Sul" },
                { icon: "📞", label: "Telefone", val: phone },
                { icon: "✉️", label: "E-mail", val: "Diretor Comercial · comercial@atlanticaconsultoria.com" },
                { icon: "🕐", label: "Horário", val: "Seg – Sex · 8h às 18h" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: B.silver }}>{item.label}</div>
                    <div className="text-sm" style={{ color: B.offwhite }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Form */}
          <div className={`lg:col-span-3 reveal-right ${visible ? "visible" : ""}`}>
            {sent ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center py-16 px-8 rounded-xl"
                style={{ background: "rgba(26,48,97,0.5)", border: "1px solid rgba(252,163,17,0.2)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "rgba(252,163,17,0.1)", border: "1px solid rgba(252,163,17,0.3)" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={B.orange} strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: B.offwhite }}>Mensagem enviada!</h3>
                <p className="text-sm" style={{ color: B.silver }}>Nossa equipe entrará em contato em até 24 horas úteis.</p>
                <button className="mt-6 text-sm btn-outline px-6 py-2.5 rounded" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); setSent(true); }}
                className="p-8 rounded-xl space-y-5"
                style={{ background: "rgba(26,48,97,0.4)", border: "1px solid rgba(221,229,242,0.08)" }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Nome completo *</label>
                    <input required className="form-input w-full px-4 py-3 rounded text-sm" placeholder="Seu nome" value={form.nome} onChange={set("nome")} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>E-mail *</label>
                    <input required type="email" className="form-input w-full px-4 py-3 rounded text-sm" placeholder="email@empresa.com" value={form.email} onChange={set("email")} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Telefone / WhatsApp</label>
                    <input className="form-input w-full px-4 py-3 rounded text-sm" placeholder="+55 (11) 00000-0000" value={form.telefone} onChange={set("telefone")} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }} for="assunto">Assunto *</label>
                    <select required id="assunto" className="form-input w-full px-4 py-3 rounded text-sm" value={form.assunto} onChange={set("assunto")}>
                      <option value="" disabled selected hidden>Selecione...</option>
                      <option>Exportação</option>
                      <option>Tradução</option>
                      <option>Importação</option>
                      <option>Paradiplomacia</option>
                      <option>Outro assunto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Mensagem *</label>
                  <textarea
                    required rows={4}
                    className="form-input w-full px-4 py-3 rounded text-sm resize-none"
                    placeholder="Descreva brevemente sua necessidade..."
                    value={form.mensagem}
                    onChange={set("mensagem")}
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input type="checkbox" required id="lgpd" className="mt-0.5" style={{ accentColor: B.orange }} />
                  <label htmlFor="lgpd" className="text-xs leading-relaxed" style={{ color: B.silver }}>
                    Concordo com a{" "}
                    <span style={{ color: B.orange }}>Política de Privacidade</span>{" "}
                    e autorizo o tratamento dos meus dados conforme a LGPD.
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full py-3.5 rounded font-semibold text-sm flex items-center justify-center gap-2">
                  Enviar Mensagem
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}



/* ══════════════════════════════
   FOOTER
══════════════════════════════ */
function Footer() {
  return (
    <footer className="py-10" style={{ background: B.navy, borderTop: "1px solid rgba(221,229,242,0.07)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid sm:grid-cols-3 items-center gap-6">
          {/* Brand */}
          <div className="flex items-center">
            <img
              src={logoBranco}
              alt="Atlântica Consultoria Internacional"
              className="w-36 h-auto object-contain object-left"
            />
          </div>

          {/* Links */}
          <div className="flex justify-center gap-6">
            {["Privacidade", "Termos de Uso", "Cookies"].map(l => (
              <a key={l} href="#" className="text-xs transition-colors hover:text-white" style={{ color: B.silver }}>{l}</a>
            ))}
          </div>

          <p className="text-xs text-right" style={{ color: "#4a5568" }}>
            © 2026 Atlântica Consultoria Internacional.<br />Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}



/* ══════════════════════════════
   APP ROOT
══════════════════════════════ */
export default function App() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/content', { signal: controller.signal, cache: 'no-store' })
      .then(response => { if (!response.ok) throw new Error('Conteúdo indisponível'); return response.json(); })
      .then(data => setContent({ ...validateContent(data), photo: data.photo || null }))
      .catch(() => { /* Mantém o conteúdo original se a API estiver indisponível. */ });
    return () => controller.abort();
  }, []);
  return (
    <div className="min-h-full">
      <Nav />
      <Hero />
      <Services />
      <Cases />
      <About content={content} />
      <Contact phone={content.phone} />
      <Footer />
      <VLibras />
    </div>
  );
}

