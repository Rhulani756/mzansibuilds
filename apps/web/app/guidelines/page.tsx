'use client';

import { motion } from 'framer-motion';

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-8">Community <span className="text-green-500">Guidelines</span></h1>
        
        <div className="space-y-8">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🚀 Build in Public</h3>
            <p className="text-gray-600 text-sm">Be transparent about your progress. Use Milestones to share wins and hurdles alike.</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🤝 Collaborative Spirit</h3>
            <p className="text-gray-600 text-sm">When you &quot;Raise a Hand,&quot; explain briefly why you want to help. Be constructive in the comments.</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">🇿🇦 Mzansi Spirit</h3>
            <p className="text-gray-600 text-sm">Keep the vibes positive. We are here to grow the South African tech ecosystem together.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}