import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Check, Clock3, Heart, Leaf, LoaderCircle, MapPin, Navigation } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import heroBotanical from "../assets/wedding-wreath.webp";
import floralDivider from "../assets/wedding-floral-divider.webp";

const WEDDING_DATE = new Date("2027-05-15T17:00:00-03:00").getTime();
const MAP_QUERY = "Igreja Nossa Senhora da Assunção, Porteirinha, Minas Gerais, Brasil";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;
type Countdown = { days: number; hours: number; minutes: number; seconds: number };

function getCountdown(): Countdown {
  const remaining = Math.max(0, WEDDING_DATE - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FineRule({ heart = false }: { heart?: boolean }) {
  return (
    <div className={`fine-rule${heart ? " fine-rule--heart" : ""}`} aria-hidden="true">
      <span />
      {heart ? <Heart size={14} strokeWidth={1.4} /> : <i />}
      <span />
    </div>
  );
}

function DecorativeImage({ src, className, eager = false }: { src: string; className: string; eager?: boolean }) {
  return (
    <img
      src={src}
      className={className}
      alt=""
      aria-hidden="true"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={(event) => { event.currentTarget.hidden = true; }}
    />
  );
}

export default function Home() {
  const [countdown, setCountdown] = useState(getCountdown);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState === "sending") return;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    setGuestName(name);
    setFormState("sending");

    window.setTimeout(() => {
      try {
        const response = {
          name,
          companions: Number(formData.get("companions") ?? 0),
          message: String(formData.get("message") ?? "").trim(),
          submittedAt: new Date().toISOString(),
        };
        window.localStorage.setItem("ana-clara-lucas-rsvp", JSON.stringify(response));
        setFormState("sent");
      } catch {
        setFormState("idle");
        window.alert("Não foi possível salvar sua resposta neste dispositivo. Tente novamente.");
      }
    }, 650);
  }

  return (
    <main className="invitation-page" id="inicio">
      <div className="paper-grain" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Ana Clara e Lucas David — início">
          <span className="wordmark-date">A<span>&</span>L</span>
          <span className="wordmark-date">15 <i>·</i> 05 <i>·</i> 2027</span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a className="nav-rsvp" href="#familia">familia<ArrowUpRight size={14} /></a>

          <a className="nav-rsvp" href="#cerimonia">cerimonia<ArrowUpRight size={14} /></a>

         
        </nav>
      </header>

      <section className="hero">
        <div className="hero-topline"><span className="topline-ornament">✦</span>
        <span>Um dia para guardar para sempre</span><span className="topline-ornament">✦</span></div>
        <motion.div
          className="hero-grid"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <div className="hero-visual">
            <div className="hero-visual-frame">
              <div className="visual-wash" aria-hidden="true" />
              <div className="fallback-leaves" aria-hidden="true">
                <Leaf className="fallback-leaf fallback-leaf--one" />
                <Leaf className="fallback-leaf fallback-leaf--two" />
                <Leaf className="fallback-leaf fallback-leaf--three" />
                <Leaf className="fallback-leaf fallback-leaf--four" />
              </div>
              <DecorativeImage src={heroBotanical} className="hero-botanical" eager />
              <div className="monogram">
                <svg viewBox="0 0 180 180" aria-hidden="true">
          
                  <path d="M32 90h16M132 90h16M90 32v16M90 132v16" />
                </svg>
                <span>A<i>&</i>L</span>
                <small>ANA CLARA <b>·</b> LUCAS DAVID</small>
              </div>
              <div className="visual-seal"><span>15</span><i>mai</i><span>27</span></div>
            </div>
          </div>

          <div className="hero-copy">
            <span className="eyebrow"><i /> Com alegria, convidam você <i /></span>
            <h1><span>Ana Clara</span><i>e</i><span>Lucas David</span></h1>
            <FineRule heart />
            <p className="parents-intro">Juntamente com seus pais</p>
            <p className="hero-invitation">Convidam para a cerimônia<br />de seu casamento</p>
            <div className="hero-date-card">
              <div><CalendarDays size={16} /><span><b>15 de maio</b><small>2027</small></span></div>
              <span className="date-card-divider" />
              <div><Clock3 size={16} /><span><b>Às 16h</b><small>sábado</small></span></div>
            </div>
          </div>
        </motion.div>

        <Reveal className="parents-section" delay={0.1}>
          <div className="section-heading" id="familia">
            <span className="section-index">01 <i>—</i> Família</span>
            <h2>Com a bênção de<br className="mobile-break" /> quem nos trouxe até aqui</h2>
            <FineRule />
          </div>
          <div className="parents-grid">
            <div className="parent-card">
              <span className="parent-index">Família</span>
              <div className="parent-flourish" aria-hidden="true">❧</div>
              <p>Antonio Pereira David</p>
              <span className="parent-and">&</span>
              <p>Marize Fereira David</p>
            </div>
            <div className="parent-card">
              <span className="parent-index">Família</span>
              <div className="parent-flourish" aria-hidden="true">❧</div>
              <p>Geilson Carlos da Silva</p>
              <span className="parent-and">&</span>
              <p>Aneli Barbosa dos Santos Silva</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="invitation-copy" delay={0.12}>
          <span className="section-index">02 <i>—</i> A data</span>
          <p className="invitation-line">O começo de uma linda história</p>
          <DecorativeImage src={floralDivider} className="floral-divider" />
          <p className="script-date">15 de Maio de 2027</p>
          <p className="date-subline"><span /> Sábado <i>·</i> às 16h <span /></p>
        </Reveal>

        <Reveal className="ceremony-card" delay={0.16}>
          <div className="ceremony-inner">
            <span className="section-index ceremony-index" id="cerimonia">03 <i>—</i> Cerimônia religiosa</span>
            <span className="ceremony-icon"><MapPin size={18} strokeWidth={1.4} /></span>
            <h2>Igreja Nossa Senhora<br />da Assunção</h2>
            <p className="venue-location">Porteirinha <span>—</span> Minas Gerais</p>
            <div className="ceremony-meta"><Clock3 size={14} /><span>15 de maio de 2027</span><i /> <span>16h</span></div>
            <a className="map-link" href={DIRECTIONS_URL} target="_blank" rel="noreferrer">
              <Navigation size={14} strokeWidth={1.5} /> Como chegar <ArrowUpRight size={13} />
            </a>
          </div>
        </Reveal>

        <Reveal className="after-ceremony" delay={0.1}>
          <FineRule heart />
          <p>Depois da cerimônia,<br />os noivos receberão os cumprimentos.</p>
          <span className="after-signature">Será muito especial ter você conosco</span>
        </Reveal>
      </section>

      <section className="countdown-section" aria-label="Contagem regressiva para o casamento">
        <div className="countdown-heading"><span className="countdown-star">✦</span><CalendarDays size={16} strokeWidth={1.5} /><span>Contamos os dias para celebrar</span><span className="countdown-star">✦</span></div>
        <div className="countdown" aria-live="off">
          {([
            ["days", "dias"], ["hours", "horas"], ["minutes", "minutos"], ["seconds", "segundos"],
          ] as const).map(([unit, label]) => (
            <div className="countdown-unit" key={unit}>
              <span className="countdown-number">{String(countdown[unit]).padStart(2, "0")}</span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      

      <footer className="site-footer">
        <FineRule heart />
        <p className="footer-kicker">Com amor</p>
        <p className="footer-names">Ana Clara <i>e</i> Lucas David</p>
        <p className="footer-date">15 de maio de 2027 <span>·</span> Porteirinha, MG</p>
        <a href="#inicio" className="back-top">Voltar ao convite ↑</a>
      </footer>
    </main>
  );
}
