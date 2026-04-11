import { createClient } from '../../utils/supabase/server';
// Make sure this import matches your actual database package setup
import { prisma } from '@repo/database'; 
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage(props: {
  searchParams: Promise<{ message?: string }>;
}) {
  // Await search params (Next.js 15 standard)
  const searchParams = await props.searchParams;
  
  // 1. Authenticate the user securely on the server
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // 2. Fetch only the projects belonging to this user
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Success Message Banner (Catches the redirect from the form) */}
        {searchParams?.message && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-bold">{searchParams.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Workspace</h1>
            <p className="text-gray-500 mt-1">Manage and track your Derivco submissions.</p>
          </div>
          <Link 
            href="/projects/new"
            className="hidden sm:flex bg-gray-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            + Create New
          </Link>
        </div>

        {/* Dynamic Project Grid */}
        {projects.length === 0 ? (
          /* Empty State */
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't launched any projects. Start building to see your progress tracked here.</p>
            <Link 
              href="/projects/new"
              className="inline-flex bg-green-500 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition-all shadow-lg shadow-green-500/30 cursor-pointer"
            >
              Launch First Project
            </Link>
          </div>
        ) : (
          /* Populated Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {project.title}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-0.5 rounded border border-green-200">
                    Active
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  <button className="text-gray-900 font-bold hover:text-green-600 transition-colors cursor-pointer">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}