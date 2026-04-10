import Link from 'next/link';
import React from 'react';

/**
 * Main application header and navigation bar.
 * Implements secure routing via Next.js <Link> components.
 * * @returns {JSX.Element} The rendered Header component
 */
export default function Header() {
  return (
    <header className="bg-mzansi-dark text-mzansi-white shadow-md border-b-4 border-mzansi-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold tracking-tight text-mzansi-green hover:text-white transition">
            Mzansi<span className="text-white">Builds</span>
          </Link>
          
          {/* Main Navigation - Maps to User Journey */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/feed" className="hover:text-mzansi-green transition font-medium">
              Live Feed
            </Link>
            <Link href="/wall" className="hover:text-mzansi-green transition font-medium">
              Celebration Wall
            </Link>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-semibold hover:text-mzansi-green transition">
            My Dashboard
          </Link>
          <button className="bg-mzansi-green text-mzansi-dark px-4 py-2 rounded-md font-bold hover:bg-emerald-400 transition shadow-sm">
            + New Project
          </button>
        </div>
        
      </div>
    </header>
  );
}