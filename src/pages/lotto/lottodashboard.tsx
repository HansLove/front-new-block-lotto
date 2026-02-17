import 'react-toastify/dist/ReactToastify.css';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ArrowRight, ChevronDown, Clock, Info, Plus, Trophy, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import { formatExact } from '@/components/lotto/formatAttempts';
import { LottoOrbCard, type LottoOrbCardStatus } from '@/components/lotto/LottoOrbCard';
import { useAuth } from '@/hooks/useLogInHook';
import { useLotto } from '@/hooks/useLotto';
import type { LottoTicket } from '@/services/lotto';
import { createTicket } from '@/services/lotto';

const CYCLE_SEC = 10 * 60;

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

function LiveCounter({ baseValue }: { baseValue: number }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev + Math.floor(Math.random() * 4 + 1));
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return <>{formatExact(baseValue + offset)}</>;
}

function ticketToOrbProps(ticket: LottoTicket, isPlusUltraPending: boolean) {
  const attemptsTotal = ticket.nonceTotal ?? ticket.totalAttempts ?? 0;
  const lastAttemptMs = ticket.lastAttemptAt ? new Date(ticket.lastAttemptAt).getTime() : null;
  const nextAttemptMs = lastAttemptMs != null ? lastAttemptMs + CYCLE_SEC * 1000 : null;
  const nextAttemptInSec =
    nextAttemptMs != null ? Math.max(0, Math.round((nextAttemptMs - Date.now()) / 1000)) : CYCLE_SEC;

  const isMining = !ticket.lastAttemptAt;
  const status: LottoOrbCardStatus = isMining
    ? 'MINING'
    : ticket.status === 'active'
      ? 'ACTIVE'
      : ticket.status === 'suspended'
        ? 'PAUSED'
        : 'EXPIRED';

  return {
    ticketId: ticket.id,
    btcAddress: ticket.btcAddress ?? '',
    status,
    attemptsTotal,
    nextAttemptInSec,
    lastAttemptAt: ticket.lastAttemptAt ?? undefined,
    expiresAt: ticket.validUntil,
    isMining,
    isPlusUltra: isPlusUltraPending,
    stars: ticket.stars ?? 5,
    isPlusUltraPending,
  };
}

export default function LottoDash() {
  useLottoDisplayFonts();

  const navigate = useNavigate();
  const { tickets, stats, loading, refreshTickets, requestHighEntropyAttempt, highEntropyPending } = useLotto();
  const { isSessionActive, openLoginModal } = useAuth();
  const [btcAddress, setBtcAddress] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const ticketsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSessionActive && !loading) openLoginModal();
  }, [isSessionActive, loading, openLoginModal]);

  useEffect(() => {
    if (isSessionActive) refreshTickets();
  }, [refreshTickets, isSessionActive]);

  const handleCreateTicket = async () => {
    if (!btcAddress || btcAddress.trim().length < 26) {
      toast.error('Please enter a valid Bitcoin address (26+ characters)');
      return;
    }
    setCreating(true);
    try {
      await createTicket({ btcAddress: btcAddress.trim(), validDays: validDays || 30 });
      toast.success('Ticket created. You will participate every 10 minutes.');
      setShowBuyModal(false);
      setBtcAddress('');
      setValidDays(30);
      await refreshTickets();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const handlePlusUltra = async (ticket: LottoTicket) => {
    try {
      toast.info('Requesting high entropy from Bitcoin mining...', {
        position: 'bottom-center',
        autoClose: 2000,
      });
      const result = await requestHighEntropyAttempt(ticket);
      toast.success(result.message || 'Plus Ultra initiated.', {
        position: 'bottom-center',
        autoClose: 3000,
      });
      await refreshTickets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error initiating Plus Ultra.', {
        position: 'bottom-center',
        autoClose: 4000,
      });
    }
  };

  const activeTickets = tickets.filter(t => t.status === 'active' && new Date(t.validUntil) > new Date());
  const totalAttempts = stats?.totalAttempts ?? 0;

  if (!isSessionActive) return null;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#07070a] text-white">
      {/* ───────────── HERO ───────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
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
              background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
              left: '35%',
              bottom: '5%',
            }}
            animate={{ x: [0, 30, -40, 0], y: [0, -50, 20, 0] }}
            transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          />
        </div>

        {/* Grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
          }}
        />

        {/* Live status pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute left-0 right-0 top-6 flex justify-center"
        >
          <div className="flex items-center gap-5 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2 text-xs backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <motion.span
                className="block h-1.5 w-1.5 rounded-full bg-lotto-green-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-white/50">Live</span>
            </div>
            {stats && (
              <span className="text-white/30" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                Block #{stats.lastBlockHeight?.toLocaleString() ?? '—'}
              </span>
            )}
            {stats && (
              <span className="hidden text-white/30 sm:inline">{stats.totalActiveTickets ?? 0} active players</span>
            )}
          </div>
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <span className="mb-8 inline-block rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-amber-400">
              Decentralized Bitcoin Lottery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.9 }}
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="mb-6 text-[clamp(3rem,9vw,6.5rem)] font-light leading-[1.05] tracking-tight"
          >
            <span className="block text-white/90">The fortune of a</span>
            <span
              className="block font-semibold italic"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #fde68a 65%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Bitcoin block
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mx-auto mb-12 max-w-lg text-base font-light leading-relaxed text-white/40"
          >
            Every 10 minutes, your ticket challenges the Bitcoin network. One block mined sends{' '}
            <span className="text-amber-400/80">the entire block reward</span> straight to your address.
          </motion.p>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
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
                <LiveCounter baseValue={totalAttempts} />
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/25">total network attempts</div>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => setShowBuyModal(true)}
              className="group relative overflow-hidden rounded-xl px-8 py-3.5 text-sm font-semibold text-black"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-2">
                Start Playing
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>

            <motion.button
              onClick={() => ticketsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-xl border border-white/15 px-8 py-3.5 text-sm font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white/90"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              My Tickets
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 7, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 2.5 }}
        >
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </section>

      {/* ───────────── LIVE STATS ───────────── */}
      <section className="border-y border-white/[0.05] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: 'Active Tickets',
                value: stats?.totalActiveTickets?.toLocaleString() ?? '—',
                icon: Activity,
                mono: false,
              },
              {
                label: 'Network Attempts',
                value: stats ? formatExact(stats.totalAttempts) : '—',
                icon: Zap,
                mono: true,
              },
              {
                label: 'Blocks Mined',
                value: stats?.totalBlocksMined?.toLocaleString() ?? '0',
                icon: Trophy,
                mono: false,
              },
              {
                label: 'Block Height',
                value: stats?.lastBlockHeight?.toLocaleString() ?? '—',
                icon: Clock,
                mono: true,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-4"
              >
                <div className="mb-2 flex items-center gap-1.5 text-white/25">
                  <stat.icon className="h-3 w-3" />
                  <span className="text-[10px] uppercase tracking-wide">{stat.label}</span>
                </div>
                <div
                  className="text-xl font-semibold text-white sm:text-2xl"
                  style={stat.mono ? { fontFamily: "'JetBrains Mono', monospace" } : undefined}
                >
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── VALUE PROP ───────────── */}
      <section className="relative overflow-hidden py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(245,158,11,0.04) 0%, transparent 65%)',
          }}
        />
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/25">The mathematics of fortune</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="mb-6 text-[clamp(2.4rem,5vw,3.75rem)] font-light leading-tight text-white"
            >
              Astronomically small odds.
              <br />
              <span className="italic text-amber-400">Astronomically real reward.</span>
            </h2>
            <p className="mx-auto mb-16 max-w-md text-sm font-light leading-relaxed text-white/35">
              The probability is tiny — but it exists. Your ticket runs automatically every 10 minutes. If you win, the
              entire block reward goes directly to your Bitcoin wallet. No middlemen.
            </p>
          </motion.header>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                value: '3.125',
                unit: 'BTC',
                label: 'Current block reward',
                color: 'text-amber-400',
                border: 'border-amber-500/15',
                bg: 'rgba(245,158,11,0.04)',
              },
              {
                value: '10',
                unit: 'min',
                label: 'Between each attempt',
                color: 'text-teal-400',
                border: 'border-teal-500/15',
                bg: 'rgba(20,184,166,0.04)',
              },
              {
                value: '$10',
                unit: '/mo',
                label: 'Per ticket',
                color: 'text-lotto-green-400',
                border: 'border-lotto-green-500/15',
                bg: 'rgba(34,197,94,0.04)',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.75 }}
                className={`rounded-2xl border ${item.border} p-7`}
                style={{ background: item.bg }}
              >
                <div
                  className={`mb-1 font-bold ${item.color}`}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '2.5rem' }}
                >
                  {item.value}
                  <span className="ml-1 text-xl opacity-70">{item.unit}</span>
                </div>
                <p className="text-xs text-white/30">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section className="border-t border-white/[0.05] py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-white/25">Simple by design</p>
            <h2
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[clamp(2.4rem,5vw,3.5rem)] font-light text-white"
            >
              How it works
            </h2>
          </motion.header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                number: '01',
                icon: Plus,
                title: 'Buy a ticket',
                desc: 'Enter your Bitcoin address and pay $10 for 30 days of automatic participation. Your reward address is locked in — wins go there directly.',
                accent: 'text-amber-400',
                border: 'border-amber-500/10',
                glow: 'rgba(245,158,11,0.04)',
              },
              {
                number: '02',
                icon: Zap,
                title: 'Auto-mine every 10 min',
                desc: 'Your ticket attempts to mine a Bitcoin block automatically. Thousands of attempts happen per day across all active tickets on the network.',
                accent: 'text-teal-400',
                border: 'border-teal-500/10',
                glow: 'rgba(20,184,166,0.04)',
              },
              {
                number: '03',
                icon: Trophy,
                title: 'Claim the block reward',
                desc: 'If a block is mined during your attempt, the entire coinbase reward (3.125 BTC + fees) is sent to your address. No cuts. No delays.',
                accent: 'text-lotto-green-400',
                border: 'border-lotto-green-500/10',
                glow: 'rgba(34,197,94,0.04)',
              },
            ].map((step, i) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.18, duration: 0.7 }}
                className={`relative rounded-2xl border ${step.border} p-8`}
                style={{
                  background: `radial-gradient(ellipse at 30% 20%, ${step.glow} 0%, transparent 60%)`,
                }}
              >
                <div
                  className="mb-5 text-7xl font-bold leading-none text-white/[0.035]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {step.number}
                </div>
                <div className={`mb-4 inline-flex rounded-xl border ${step.border} p-2.5`}>
                  <step.icon className={`h-5 w-5 ${step.accent}`} />
                </div>
                <h3 className="mb-3 text-lg font-medium text-white/90">{step.title}</h3>
                <p className="text-sm leading-relaxed text-white/35">{step.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PLUS ULTRA STRIP ───────────── */}
      <section className="border-y border-lotto-orange-500/15 py-10">
        <div
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(249,115,22,0.05) 50%, transparent 100%)',
          }}
        >
          <div className="mb-2 flex items-center justify-center gap-2.5">
            <Zap className="h-5 w-5 text-lotto-orange-400" />
            <h3 className="text-base font-semibold text-white/80">Plus Ultra — High Entropy Mining</h3>
          </div>
          <p className="text-sm text-white/30">
            Activate high-entropy mining on any active ticket to trigger a 12-star attempt with stronger computational
            entropy. Higher probability per round. Takes longer to complete.
          </p>
        </div>
      </section>

      {/* ───────────── ACTIVE TICKETS ───────────── */}
      <section ref={ticketsSectionRef} className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-white/25">Your tickets</p>
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-[clamp(2rem,4vw,3rem)] font-light text-white"
              >
                Active Lottos
              </h2>
            </div>
            <motion.button
              onClick={() => setShowBuyModal(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-5 py-2.5 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-500/20"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              New Ticket
            </motion.button>
          </header>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
            </div>
          )}

          {!loading && activeTickets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-white/[0.05] bg-white/[0.02] py-24 text-center"
            >
              <div
                className="mx-auto mb-4 leading-none text-white/[0.04]"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '7rem' }}
              >
                ?
              </div>
              <h4 className="mb-2 text-lg font-medium text-white/50">No active tickets yet</h4>
              <p className="mb-8 text-sm text-white/25">Your first attempt could be the winning one.</p>
              <motion.button
                onClick={() => setShowBuyModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-3 text-sm font-semibold text-black"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4" />
                Buy Your First Ticket
              </motion.button>
            </motion.div>
          )}

          {!loading && activeTickets.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeTickets.map(ticket => {
                const pending = highEntropyPending[ticket.ticketId] ?? false;
                const orbProps = ticketToOrbProps(ticket, pending);
                return (
                  <LottoOrbCard
                    key={ticket.id}
                    {...orbProps}
                    onOpenDetails={id => navigate(`/lotto/${id}`)}
                    onPlusUltra={() => handlePlusUltra(ticket)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ───────────── FOOTER DISCLAIMER ───────────── */}
      <footer className="border-t border-white/[0.04] py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Info className="mx-auto mb-4 h-4 w-4 text-white/15" />
          <p className="text-xs leading-relaxed text-white/20">
            Block-Lotto is a probability-based participation system. Mining attempts are real and contribute to the
            Bitcoin network. Winning is not guaranteed — the system never stops trying. Results are publicly verifiable
            on the blockchain.
          </p>
        </div>
      </footer>

      {/* ───────────── BUY TICKET MODAL ───────────── */}
      <AnimatePresence>
        {showBuyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e14] p-7 shadow-2xl"
            >
              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="mb-1.5 text-2xl font-semibold text-white"
              >
                Create a ticket
              </h3>
              <p className="mb-6 text-sm text-white/35">
                Enter your Bitcoin address. Your ticket participates automatically every 10 minutes until it expires.
              </p>

              <input
                type="text"
                value={btcAddress}
                onChange={e => setBtcAddress(e.target.value)}
                placeholder="Bitcoin address (bc1q...)"
                className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              />

              <div className="mb-6">
                <label className="mb-1.5 block text-xs text-white/35">Valid for (days)</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={validDays}
                  onChange={e => setValidDays(Number(e.target.value) || 30)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/45 transition-colors hover:border-white/20 hover:text-white/70"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleCreateTicket}
                  disabled={creating}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-sm font-semibold text-black disabled:opacity-50"
                  whileHover={{ scale: creating ? 1 : 1.02 }}
                  whileTap={{ scale: creating ? 1 : 0.98 }}
                >
                  {creating ? 'Creating...' : 'Create Ticket'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer position="bottom-center" theme="dark" />
    </div>
  );
}
