'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto prose prose-green"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-8">Terms of <span className="text-green-500">Service</span></h1>
        
        <h3 className="text-xl font-bold mt-8">1. Acceptance of Terms</h3>
        <p>By using MzansiBuilds, you agree to abide by these terms and the rules of the Derivco Code Skills Challenge.</p>

        <h3 className="text-xl font-bold mt-8">2. Intellectual Property</h3>
        <p>You retain ownership of the code and projects you post. By posting, you grant other users the right to view and request collaboration.</p>

        <h3 className="text-xl font-bold mt-8">3. Conduct</h3>
        <p>Users must not upload malicious code, spam the collaboration system, or harass other builders.</p>

        <p className="mt-12 text-sm text-gray-400 italic">Last updated: April 12, 2026</p>
      </motion.div>
    </div>
  );
}