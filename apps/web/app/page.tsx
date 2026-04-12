'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ── Typewriter hook ── */
function useTypewriter(words: string[], speed = 70, pause = 1800) {
  const [displayed, setDisplayed] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];

    if (!word) return;

    // Fully typed — pause then start deleting
    if (!deleting && displayed === word) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }

    // Fully deleted — advance to next word
    if (deleting && displayed === '') {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(() => {
      setDisplayed(deleting
        ? displayed.slice(0, -1)
        : word.slice(0, displayed.length + 1)
      );
    }, deleting ? speed / 2 : speed);

    return () => clearTimeout(t);
  }, [displayed, deleting, wordIdx, words, speed, pause]);

  return displayed;
}

const WORDS = ['milestones', 'features', 'MVPs', 'side projects', 'solutions'];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Live Feed',
    desc: 'Watch builds happen in real time. Every commit, milestone, and breakthrough — streamed as it happens.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    title: 'Celebration Wall',
    desc: 'Ship something worth celebrating? Earn your spot on the wall and let the community recognise your grind.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
      </svg>
    ),
    title: 'Your Dashboard',
    desc: 'Track every milestone, manage your projects, and see your progress visualised in one focused space.',
  },
];

export default function LandingPage() {
  const typed = useTypewriter(WORDS);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .lp-root {
          font-family: 'DM Sans', sans-serif;
          background: #0d1117;
          color: #c9d1d9;
          overflow-x: hidden;
        }

        /* ── Grid background ── */
        .lp-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── Radial glow ── */
        .lp-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%);
          pointer-events: none;
          animation: glow-breathe 5s ease-in-out infinite;
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -60%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -60%) scale(1.08); }
        }

        /* ── Hero section ── */
        .lp-hero {
          position: relative;
          min-height: calc(100vh - 90px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 1.5rem 7rem;
          overflow: hidden;
        }

        /* Badge */
        .lp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.25);
          border-radius: 100px;
          padding: 0.35rem 0.9rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #4ade80;
          letter-spacing: 0.05em;
          margin-bottom: 2.5rem;
        }
        .lp-badge-dot {
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          animation: badge-pulse 1.8s ease-in-out infinite;
        }
        @keyframes badge-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          50%       { opacity: 0.6; box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }

        /* Headline */
        .lp-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(3rem, 8vw, 6.5rem);
          line-height: 1.0;
          letter-spacing: -0.04em;
          color: #f0f6ff;
          text-align: center;
          margin: 0 0 1.5rem;
        }
        .lp-h1 .green { color: #4ade80; }

        /* Typewriter row */
        .lp-typewriter-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-family: 'DM Mono', monospace;
          font-size: clamp(1rem, 2.5vw, 1.35rem);
          color: #8b949e;
          margin-bottom: 2.5rem;
          min-height: 2.2rem;
        }
        .lp-typewriter-word {
          color: #4ade80;
          min-width: 160px;
          text-align: left;
        }
        .lp-cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background: #4ade80;
          border-radius: 1px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
          margin-left: 1px;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        /* Subtext */
        .lp-sub {
          font-size: clamp(1rem, 1.8vw, 1.15rem);
          color: #8b949e;
          max-width: 560px;
          text-align: center;
          line-height: 1.7;
          margin-bottom: 3rem;
        }

        /* CTA buttons */
        .lp-ctas {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          width: 100%;
          max-width: 400px;
          align-items: center;
        }
        @media (min-width: 480px) {
          .lp-ctas { flex-direction: row; max-width: none; width: auto; }
        }

        .lp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #4ade80;
          color: #0d1117;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 0 24px rgba(74,222,128,0.2);
          white-space: nowrap;
        }
        .lp-btn-primary:hover {
          background: #86efac;
          transform: translateY(-2px);
          box-shadow: 0 0 40px rgba(74,222,128,0.35);
        }
        .lp-btn-primary:active { transform: scale(0.97); }

        .lp-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #c9d1d9;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.85rem 1.75rem;
          border-radius: 10px;
          border: 1px solid #2c3138;
          text-decoration: none;
          transition: color 0.15s, border-color 0.15s, background 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .lp-btn-secondary:hover {
          color: #f0f6ff;
          border-color: rgba(74,222,128,0.35);
          background: rgba(74,222,128,0.05);
          transform: translateY(-2px);
        }

        /* Scroll hint */
        .lp-scroll-hint {
          position: absolute;
          bottom: 1.75rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          color: #8b949e;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
          animation: hint-fade 3s ease-in-out 2s both;
        }
        @keyframes hint-fade { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .lp-scroll-arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid #4ade80;
          border-bottom: 2px solid #4ade80;
          transform: rotate(45deg);
          animation: arrow-bounce 1.5s ease-in-out infinite;
        }
        @keyframes arrow-bounce { 0%, 100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(4px); } }

        /* ── Stats bar ── */
        .lp-stats {
          background: #161b22;
          border-top: 1px solid #1e2530;
          border-bottom: 1px solid #1e2530;
          padding: 2.25rem 1.5rem;
        }
        .lp-stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          text-align: center;
        }
        .lp-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #4ade80;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .lp-stat-label {
          font-size: 0.8rem;
          color: #8b949e;
          margin-top: 0.35rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
        }
        .lp-stat-divider {
          width: 1px;
          background: #1e2530;
          height: auto;
          display: none;
        }
        @media (min-width: 640px) { .lp-stat-divider { display: block; } }

        /* ── Features section ── */
        .lp-features {
          padding: 6rem 1.5rem 6rem;
          max-width: 1100px;
          margin: 0 auto;
          overflow: visible;
        }
        .lp-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          color: #4ade80;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 1rem;
        }
        .lp-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.75rem);
          font-weight: 800;
          color: #f0f6ff;
          text-align: center;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          line-height: 1.15;
          padding: 0.1em 0;
        }
        .lp-section-sub {
          text-align: center;
          color: #8b949e;
          font-size: 1rem;
          max-width: 480px;
          margin: 0 auto 4rem;
          line-height: 1.65;
        }

        .lp-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .lp-cards { grid-template-columns: repeat(3, 1fr); }
        }

        .lp-card {
          background: #161b22;
          border: 1px solid #1e2530;
          border-radius: 14px;
          padding: 2rem;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .lp-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(74,222,128,0.05), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .lp-card:hover::before { opacity: 1; }
        .lp-card:hover {
          border-color: rgba(74,222,128,0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .lp-card-icon {
          width: 44px;
          height: 44px;
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4ade80;
          margin-bottom: 1.25rem;
        }
        .lp-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f0f6ff;
          margin-bottom: 0.6rem;
        }
        .lp-card-desc {
          font-size: 0.9rem;
          color: #8b949e;
          line-height: 1.65;
        }

        /* ── CTA section ── */
        .lp-cta-section {
          padding: 5rem 1.5rem 7rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .lp-cta-glow {
          position: absolute;
          bottom: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(74,222,128,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-cta-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 5vw, 3.25rem);
          font-weight: 800;
          color: #f0f6ff;
          letter-spacing: -0.04em;
          margin-bottom: 1rem;
        }
        .lp-cta-title span { color: #4ade80; }
        .lp-cta-sub {
          color: #8b949e;
          font-size: 1.05rem;
          max-width: 420px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
        }
        .lp-cta-btns {
          display: flex;
          gap: 0.85rem;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>

      <div className="lp-root">

        {/* ── HERO ── */}
        <section className="lp-hero">
          <div className="lp-grid" />
          <div className="lp-glow" />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="lp-badge"
          >
            <span className="lp-badge-dot" />
            MZANSIBUILDS ONLINE DEV CO-LAB
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="lp-h1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Build in <span className="green">Public,</span><br />
            Ship with Purpose!
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            className="lp-typewriter-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span>Track your</span>
            <span className="lp-typewriter-word">{typed}<span className="lp-cursor" /></span>
          </motion.div>

          {/* Sub */}
          <motion.p
            className="lp-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          >
            Where developers build in public and grow together. Collaborate with peers and earn your spot on the Celebration Wall! Track your progress, Inspire your peers, and own your journey!
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="lp-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          >
            <Link href="/login" className="lp-btn-primary">
              Start a Project
              <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="/feed" className="lp-btn-secondary">
              Explore Live Feed
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <div className="lp-scroll-hint">
            <span>scroll</span>
            <div className="lp-scroll-arrow" />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="lp-features">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="lp-section-label">{"// What you get"}</p>
            <h2 className="lp-section-title">Everything you need to ship.</h2>
            <p className="lp-section-sub">
              From first commit to celebration — MzansiBuilds gives you the tools to build in public and make your work visible.
            </p>
          </motion.div>

          <div className="lp-cards">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="lp-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="lp-card-icon">{f.icon}</div>
                <div className="lp-card-title">{f.title}</div>
                <div className="lp-card-desc">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="lp-cta-section">
          <div className="lp-cta-glow" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="lp-cta-title">
              Ready to <span>build</span>?
            </h2>
            <p className="lp-cta-sub">
              Join the challenge. Track your progress. Get on the wall.
            </p>
            <div className="lp-cta-btns">
              <Link href="/login" className="lp-btn-primary">
                Get Started — it&apos;s free
              </Link>
              <Link href="/wall" className="lp-btn-secondary">
                View the Wall
              </Link>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}