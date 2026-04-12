import Link from 'next/link';
import React from 'react';
import AuthButton from './AuthButton';
import { ensureUserProfile } from '../utils/profile';

export default async function Header() {
  const profile = await ensureUserProfile();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .nav-header {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          background: #1e2227;
          border-bottom: 1px solid #2c3138;
        }

        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        /* Logo */
        .nav-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.55rem;
          letter-spacing: -0.04em;
          text-decoration: none;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .nav-logo:hover { opacity: 0.8; }
        .nav-logo .mzansi { color: #4ade80; }
        .nav-logo .builds { color: #f0f6ff; }
        .nav-logo-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          background: #4ade80;
          border-radius: 50%;
          margin-left: 3px;
          margin-bottom: 14px;
          flex-shrink: 0;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .nav-links {
          display: none;
          align-items: center;
          gap: 0.25rem;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }

        .nav-link {
          font-size: 1.05rem;
          font-weight: 500;
          color: #c9d1d9;
          text-decoration: none;
          padding: 0.5rem 0.9rem;
          border-radius: 7px;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover { color: #ffffff; background: #272c33; }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Dashboard */
        .nav-dashboard {
          display: none;
          font-size: 1.05rem;
          font-weight: 500;
          color: #c9d1d9;
          text-decoration: none;
          padding: 0.5rem 0.9rem;
          border-radius: 7px;
          transition: color 0.15s, background 0.15s;
        }
        @media (min-width: 640px) { .nav-dashboard { display: block; } }
        .nav-dashboard:hover { color: #ffffff; background: #272c33; }

        /* Divider */
        .nav-divider {
          width: 1px;
          height: 28px;
          background: #2c3138;
          flex-shrink: 0;
          display: none;
        }
        @media (min-width: 640px) { .nav-divider { display: block; } }

        /* Profile pill */
        .nav-profile {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.65rem 0.3rem 0.3rem;
          background: #272c33;
          border: 1px solid #2c3138;
          border-radius: 100px;
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .nav-profile:hover {
          background: #2e343c;
          border-color: rgba(74,222,128,0.45);
        }

        .nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4ade80 0%, #22d3ee 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          color: #0d1117;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .nav-username {
          font-size: 1rem;
          font-weight: 600;
          color: #c9d1d9;
          display: none;
        }
        @media (min-width: 1024px) { .nav-username { display: block; } }

        .nav-status {
          width: 6px;
          height: 6px;
          background: #4ade80;
          border-radius: 50%;
          flex-shrink: 0;
          animation: status-pulse 2.5s ease-in-out infinite;
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }

        /* AuthButton override */
        .nav-auth-wrap a,
        .nav-auth-wrap button {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 1.05rem !important;
          font-weight: 500 !important;
          color: #c9d1d9 !important;
          background: transparent !important;
          border: none !important;
          padding: 0.5rem 0.9rem !important;
          border-radius: 7px !important;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.15s, background 0.15s !important;
          white-space: nowrap;
        }
        .nav-auth-wrap a:hover,
        .nav-auth-wrap button:hover {
          color: #ffffff !important;
          background: #272c33 !important;
        }
      `}</style>

      <header className="nav-header">
        <div className="nav-inner">

          {/* LEFT */}
          <div className="nav-left">
            <Link href="/" className="nav-logo">
              <span className="mzansi">Mzansi</span>
              <span className="builds">Builds</span>
              <span className="nav-logo-dot" />
            </Link>

            <nav className="nav-links">
              <Link href="/feed" className="nav-link">Live Feed</Link>
              <Link href="/wall" className="nav-link">Celebration Wall</Link>
              {profile && (
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
              )}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="nav-right">
            {profile && (
              <>
                <Link href="/settings" className="nav-profile">
                  <div className="nav-avatar">{profile.username.charAt(0)}</div>
                  <span className="nav-username">@{profile.username}</span>
                  <span className="nav-status" />
                </Link>
                <div className="nav-divider" />
              </>
            )}

            <div className="nav-auth-wrap">
              <AuthButton />
            </div>
          </div>

        </div>
      </header>
    </>
  );
}