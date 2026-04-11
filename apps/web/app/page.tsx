'use client'; // Required for Framer Motion animations

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-white">
      
      {/* Design Element 1: The Developer Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Design Element 2: Ambient Green Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-400/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-[-5vh]">
        
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-gray-900 mb-6">
            Build in <span className="text-green-500">Public.</span>
          </h1>
        </motion.div>

        {/* Animated Subheadline (Delayed) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
            The developer platform for the Derivco Code Skills Challenge. Track your milestones, collaborate with peers, and earn your spot on the Celebration Wall!
          </p>
        </motion.div>

        {/* Animated Buttons (Delayed further) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          {/* Secondary Button */}
          <Link 
            href="/feed" 
            className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20"
          >
            Explore Live Feed
          </Link>
          
          {/* Primary CTA Button */}
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
          >
            Start a Project
          </Link>
        </motion.div>

      </main>
    </div>
  );
}