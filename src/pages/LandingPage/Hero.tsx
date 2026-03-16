import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Plus, Trophy, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useLogInHook';
import { landingTranslations } from '@/pages/LandingPage/translations';

const SIMULATED_BASE = 12_481_903_774;

function useLottoDisplayFonts() {
  useEffect(() => {
    if (document.getElementById('lotto-display-fonts')) return;
    const link = document.createElement('link');
    link.id = 'lotto-display-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
    document.head.appendChild(link);
  }, []);
}

function SimulatedLiveCounter() {
  const [value, setValue] = useState(SIMULATED_BASE);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => prev + Math.floor(Math.random() * 5 + 2));
    }, 950);
    return () => clearInterval(interval);
  }, []);

  return <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value.toLocaleString()}</span>;
}

const KEY_NUMBER_STYLES = [
  { color: 'text-amber-400', border: 'border-amber-500/15', bg: 'rgba(245,158,11,0.04)' },
  { color: 'text-teal-400', border: 'border-teal-500/15', bg: 'rgba(20,184,166,0.04)' },
  { color: 'text-lotto-green-400', border: 'border-lotto-green-500/15', bg: 'rgba(34,197,94,0.04)' },
] as const;

const STEP_STYLES = [
  { accent: 'text-amber-400', border: 'border-amber-500/10', glow: 'rgba(245,158,11,0.04)' },
  { accent: 'text-teal-400', border: 'border-teal-500/10', glow: 'rgba(20,184,166,0.04)' },
  { accent: 'text-lotto-green-400', border: 'border-lotto-green-500/10', glow: 'rgba(34,197,94,0.04)' },
] as const;

const Hero = () => {
  useLottoDisplayFonts();

  const { locale } = useLanguage();
  const t = landingTranslations[locale];
  const { isSessionActive, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const howItWorksRef = useRef<HTMLDivElement>(null);

  const handleStartPlaying = () => {
    if (isSessionActive) navigate('/lotto');
    else openLoginModal();
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="bg-[#07070a] text-white">
      {/* ───────────── HERO ───────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute rounded-full blur-[130px]"
            style={{
              width: 700,
              height: 700,
              background: 'radial-gradient(circle, rgba(245,158,11,0.11) 0%, transparent 70%)',
              left: '-15%',
              top: '-5%',
            }}
            animate={{ x: [0, 60, -20, 0], y: [0, -40, 60, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute rounded-full blur-[160px]"
            style={{
              width: 600,
              height: 600,
              background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
              right: '-10%',
              top: '25%',
            }}
            animate={{ x: [0, -50, 30, 0], y: [0, 40, -50, 0] }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
          <motion.div
            className="absolute rounded-full blur-[100px]"
            style={{
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)',
              left: '40%',
              bottom: '10%',
            }}
            animate={{ x: [0, 30, -40, 0], y: [0, -50, 20, 0] }}
            transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          />
        </div>

        {/* Grain texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <span className="mb-8 inline-block rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400/90">
              {t.hero.pill}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="mb-6 text-[clamp(3rem,9vw,6.5rem)] font-light leading-[1.05] tracking-tight"
          >
            <span className="block text-white/90">{t.hero.headline1}</span>
            <span
              className="block font-semibold italic"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #fde68a 65%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t.hero.headline2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mb-12 max-w-lg text-base font-light leading-relaxed text-white/40"
          >
            {t.hero.subtext}
            <span className="text-amber-400/80">{t.hero.subtextHighlight}</span>
            {t.hero.subtextEnd}
          </motion.p>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-10 flex justify-center"
          >
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-10 py-6 backdrop-blur-sm">
              <div
                className="mb-1.5 tabular-nums text-white"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(2rem, 6vw, 3.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
              >
                <SimulatedLiveCounter />
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/25">
                <motion.span
                  className="block h-1.5 w-1.5 rounded-full bg-lotto-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {t.hero.counterLabel}
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              onClick={handleStartPlaying}
              className="group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-black sm:w-auto"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.hero.ctaStart}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </motion.button>

            <Link to="/lotto" className="text-sm text-white/40 transition-colors hover:text-white/70">
              {t.hero.seeLive}
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.button
          onClick={() => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 7, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
        >
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.button>
      </section>

      {/* ───────────── KEY NUMBERS ───────────── */}
      <section className="border-y border-white/[0.05] bg-white/[0.015]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {t.keyNumbers.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className={`rounded-2xl border ${KEY_NUMBER_STYLES[i].border} p-7`}
                style={{ background: KEY_NUMBER_STYLES[i].bg }}
              >
                <div
                  className={`mb-2 font-bold ${KEY_NUMBER_STYLES[i].color}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2.5rem' }}
                >
                  {item.value}
                  <span className="ml-1 text-xl opacity-70">{item.unit}</span>
                </div>
                <p className="text-xs leading-relaxed text-white/30">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section ref={howItWorksRef} className="py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/25">{t.howItWorks.subtitle}</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[clamp(2.4rem,5vw,3.5rem)] font-light text-white"
            >
              {t.howItWorks.title}
            </h2>
          </motion.header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.howItWorks.steps.map((step, i) => {
              const Icon = [Plus, Zap, Trophy][i];
              return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.18, duration: 0.7 }}
                className={`relative rounded-2xl border ${STEP_STYLES[i].border} p-8`}
                style={{
                  background: `radial-gradient(ellipse at 30% 20%, ${STEP_STYLES[i].glow} 0%, transparent 60%)`,
                }}
              >
                <div
                  className="mb-5 text-7xl font-bold leading-none text-white/[0.035]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {step.number}
                </div>
                <div className={`mb-4 inline-flex rounded-xl border ${STEP_STYLES[i].border} p-2.5`}>
                  <Icon className={`h-5 w-5 ${STEP_STYLES[i].accent}`} />
                </div>
                <h3 className="mb-3 text-lg font-medium text-white/90">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/35">{step.desc}</p>
              </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="border-t border-white/[0.05] py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="pointer-events-none absolute left-1/2 -translate-x-1/2 blur-[120px]"
              style={{
                width: 500,
                height: 200,
                background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
              }}
            />
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/25">{t.finalCta.subtitle}</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="mb-6 text-[clamp(2.5rem,6vw,4rem)] font-light text-white"
            >
              {t.finalCta.title}
              <br />
              <span className="italic text-amber-400">{t.finalCta.titleHighlight}</span>
            </h2>
            <p className="mx-auto mb-10 max-w-md text-sm font-light leading-relaxed text-white/35">
              {t.finalCta.body}
            </p>
            <motion.button
              onClick={handleStartPlaying}
              className="group inline-flex items-center gap-2.5 rounded-xl px-10 py-4 text-base font-semibold text-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.finalCta.cta}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
            <p className="mt-6 text-xs text-white/20">
              {t.finalCta.footer}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
