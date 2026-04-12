import Link from 'next/link';
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .footer {
          font-family: 'DM Sans', sans-serif;
          background: #1e2227;
          border-top: 1px solid #2c3138;
          color: #8b949e;
        }

        .footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 2rem 2rem;
        }

        /* ── Top row ── */
        .footer-top {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        @media (min-width: 768px) {
          .footer-top {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        /* Brand */
        .footer-brand { max-width: 300px; }

        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.04em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }
        .footer-logo .mzansi { color: #4ade80; }
        .footer-logo .builds { color: #f0f6ff; }
        .footer-logo-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #4ade80;
          border-radius: 50%;
          margin-left: 3px;
          margin-bottom: 12px;
        }

        .footer-tagline {
          margin-top: 0.85rem;
          font-size: 0.875rem;
          line-height: 1.65;
          color: #8b949e;
        }

        /* Links grid */
        .footer-links {
          display: flex;
          gap: 3.5rem;
        }

        .footer-col h4 {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          color: #c9d1d9;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 1rem;
        }

        .footer-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-col a {
          font-size: 0.9rem;
          font-weight: 500;
          color: #8b949e;
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-col a:hover { color: #f0f6ff; }

        /* ── Bottom row ── */
        .footer-bottom {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #2c3138;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }

        .footer-copy {
          font-size: 0.85rem;
          color: #8b949e;
        }

        /* Social icons */
        .footer-socials {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .footer-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #272c33;
          border: 1px solid #2c3138;
          color: #8b949e;
          transition: color 0.15s, background 0.15s, border-color 0.15s;
          text-decoration: none;
        }
        .footer-social-link:hover {
          color: #f0f6ff;
          background: #2e343c;
          border-color: rgba(74,222,128,0.35);
        }

        .footer-social-link svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">

          {/* Top */}
          <div className="footer-top">

            {/* Brand */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <span className="mzansi">Mzansi</span>
                <span className="builds">Builds</span>
                <span className="footer-logo-dot" />
              </Link>
              <p className="footer-tagline">
                Built for the Derivco Code Skills Challenge. Empowering developers to build, track, and showcase their milestones.
              </p>
            </div>

            {/* Links */}
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <ul>
                  <li><Link href="/feed">Live Feed</Link></li>
                  <li><Link href="/wall">Celebration Wall</Link></li>
                  <li><Link href="/dashboard">Dashboard</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <div className="flex flex-col space-y-2">
                  <Link href="/privacy" className="text-gray-500 hover:text-green-500 transition-colors text-sm">Privacy</Link>
                  <Link href="/terms" className="text-gray-500 hover:text-green-500 transition-colors text-sm">Terms</Link>
                  <Link href="/guidelines" className="text-gray-500 hover:text-green-500 transition-colors text-sm">Guidelines</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="footer-bottom">
            <p className="footer-copy">
              &copy; {currentYear} MzansiBuilds. All rights reserved.
            </p>

           <div className="footer-socials">
              {/* GitHub */}
              <a href="https://github.com/Rhulani756/mzansibuilds" target="_blank" rel="noopener noreferrer"className="footer-social-link" aria-label="GitHub">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div> 

        </div>
      </footer>
    </>
  );
}