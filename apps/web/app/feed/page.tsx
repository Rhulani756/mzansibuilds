import { prisma } from '@repo/database';
import Link from 'next/link';

// Next.js 15 requires dynamic rendering for pages fetching live data without caching
export const dynamic = 'force-dynamic';

export default async function LiveFeedPage() {
  // Fetch all projects, including the user ID so we know who owns it
  // In a real app, you'd join this with a User profile table to get their name/avatar
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Live <span className="text-green-500">Feed</span>
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Discover what the Mzansi community is building right now.
            </p>
          </div>
          <Link 
            href="/projects/new"
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-md cursor-pointer text-center"
          >
            + Share Your Project
          </Link>
        </div>

        {/* Project Grid */}
        {projects.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">It&apos;s quiet here...</h3>
            <p className="text-gray-500">Be the first to launch a project on the platform!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all flex flex-col group relative overflow-hidden">
                
                {/* Top Badge Row */}
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    {project.stage}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-6 grow line-clamp-3">
                  {project.description}
                </p>

                {/* Support Required Section */}
                {project.supportRequired && (
                  <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-wider">🙏 Support Needed</p>
                    <p className="text-sm text-blue-900">{project.supportRequired}</p>
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Link href={`/projects/${project.id}`} className="block w-full text-center bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 px-4 py-2 rounded-md font-bold transition-colors cursor-pointer border border-green-200">
                    View Project & Discuss
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}