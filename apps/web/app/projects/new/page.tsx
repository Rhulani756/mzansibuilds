'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const stage = formData.get('stage') as string;
    const supportRequired = formData.get('supportRequired') as string;

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, stage, supportRequired }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create project');
      }

      window.location.href = '/dashboard?message=Project+Created+Successfully';
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-96px)] flex items-center justify-center p-6 overflow-hidden bg-white">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-green-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-200">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Launch a <span className="text-green-500">New Project</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Share what you are building for the Derivco Code Skills Challenge.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={50}
                disabled={isLoading}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black disabled:opacity-50"
                placeholder="e.g., MzansiBuilds Platform"
              />
            </div>
            
            {/* Description Input */}
            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                maxLength={500}
                disabled={isLoading}
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black resize-none disabled:opacity-50"
                placeholder="Briefly describe the tech stack and the problem it solves..."
              />
              <p className="text-xs text-gray-400 mt-2 text-right">Max 500 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Stage Dropdown */}
              <div>
                <label htmlFor="stage" className="block text-sm font-bold text-gray-700 mb-1.5">
                  Current Stage <span className="text-red-500">*</span>
                </label>
                <select
                  id="stage"
                  name="stage"
                  required
                  disabled={isLoading}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black cursor-pointer disabled:opacity-50"
                >
                  <option value="IDEATION">Ideation (Planning)</option>
                  <option value="PROTOTYPING">Prototyping</option>
                  <option value="DEVELOPMENT">Active Development</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Support Required Section */}
              <div>
                <label htmlFor="supportRequired" className="block text-sm font-bold text-gray-700 mb-1.5">
                  Support Required <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="supportRequired"
                  name="supportRequired"
                  type="text"
                  maxLength={100}
                  disabled={isLoading}
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-black disabled:opacity-50"
                  placeholder="e.g., UI Designer, Code Review..."
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg font-semibold"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-green-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:hover:scale-100 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Launching...
                  </>
                ) : (
                  'Publish Project'
                )}
              </button>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
}