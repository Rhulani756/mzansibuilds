import Link from 'next/link';
import React from 'react';
import AuthButton from './AuthButton';
// Adjust this import path depending on where your Header component is located!
import { ensureUserProfile } from '../utils/profile'; 

export default async function Header() {
  // Fetch the profile (or auto-create it if they just logged in)
  const profile = await ensureUserProfile();

  return (
    <header className="sticky top-0 z-50 w-full bg-gray-900 text-white border-b-2 border-green-500 shadow-md">
      {/* Bumped up to h-24 for a much taller, spacious feel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-green-500 hover:text-green-400 transition-colors">
            Mzansi<span className="text-white">Builds</span>
          </Link>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/feed" className="text-sm font-medium text-gray-300 hover:text-green-400 transition-colors">
              Live Feed
            </Link>
            <Link href="/wall" className="text-sm font-medium text-gray-300 hover:text-green-400 transition-colors">
              Celebration Wall
            </Link>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          
          {/* Only show these if the user has a profile (logged in) */}
          {profile && (
            <>
              <Link 
                href="/dashboard" 
                className="hidden sm:block text-sm font-medium text-gray-300 transition-colors hover:text-green-500"
              >
                My Dashboard
              </Link>
              
              <Link 
                href="/projects/new"
                className="hidden sm:flex items-center justify-center bg-green-500 text-gray-900 px-4 py-2 rounded-md font-bold hover:bg-green-400 transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                + New Project
              </Link>

              {/* The User Profile Pill (Dark Mode Adapted) */}
              <Link 
                href="/settings" 
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-green-400 to-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase shadow-sm group-hover:scale-105 transition-transform">
                  {profile.username.charAt(0)}
                </div>
                <span className="text-sm font-bold text-gray-200 hidden lg:block">
                  @{profile.username}
                </span>
              </Link>
            </>
          )}

          {/* Taller Vertical Divider to match the new height */}
          <div className="h-10 w-px bg-gray-700 hidden sm:block"></div>

          {/* The existing AuthButton (Handles Log In / Log Out) */}
          <AuthButton />
        </div>
        
      </div>
    </header>
  );
}