'use client';

import { motion } from 'framer-motion';
import { login, signup, signInWithGoogle } from './actions';
import { use } from 'react';

export default function LoginPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  // Using the 'use' hook is the modern way to handle async searchParams in Client Components
  const searchParams = use(props.searchParams);

  return (
    <div className="relative min-h-[calc(100vh-96px)] flex items-center justify-center p-6 overflow-hidden bg-white">
      
      {/* 1. Background Grid & Ambient Glow to match Landing Page */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-green-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 2. Animated Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome to <span className="text-green-500">MzansiBuilds</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Enter your credentials to access your dashboard</p>
          </div>
          
          <form className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black"
                placeholder="you@example.com"
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {searchParams?.message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-200 text-red-600 text-center text-sm rounded-lg font-semibold"
              >
                {searchParams.message}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                formAction={login}
                className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-900/10"
              >
                Log In
              </button>
              <button
                formAction={signup}
                className="w-full bg-white text-gray-900 border-2 border-gray-900 p-3 rounded-lg font-bold hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign Up
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              formAction={signInWithGoogle}
              formNoValidate
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 p-3 rounded-lg font-bold hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google Account
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}