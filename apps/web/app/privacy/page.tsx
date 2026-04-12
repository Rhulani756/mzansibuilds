'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto prose prose-green"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy <span className="text-green-500">Policy</span></h1>
        <p className="text-gray-600 leading-relaxed">
          At MzansiBuilds, we take your privacy seriously. This policy outlines how we handle your data 
          within the organisation ecosystem.
        </p>

        <h3 className="text-xl font-bold mt-8">1. Information We Collect</h3>
        <p>We collect your GitHub/Google profile information and the project data you voluntarily share on the platform.</p>

        <h3 className="text-xl font-bold mt-8">2. How We Use Data</h3>
        <p>Your data is used to facilitate collaboration between developers and to display your progress on the Celebration Wall.</p>

        <h3 className="text-xl font-bold mt-8">3. Data Security</h3>
        <p>We use Supabase and Prisma to ensure your data is stored securely using industry-standard encryption.</p>
        
        <p className="mt-12 text-sm text-gray-400 italic">Last updated: April 12, 2026</p>
      </motion.div>
    </div>
  );
}