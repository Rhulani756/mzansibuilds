import { prisma } from '@repo/database';
import Link from 'next/link';

export default async function CelebrationWallPage() {
  // Fetch only projects that have reached the finish line
  const completedProjects = await prisma.project.findMany({
    where: { 
      stage: 'COMPLETED' 
    },
    orderBy: { 
      updatedAt: 'desc' // Show the most recently completed first
    },
    include: {
      milestones: true,
      comments: true,
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-yellow-500/30 overflow-hidden relative">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-yellow-500/20 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-black uppercase tracking-widest mb-6">
            <span>🏆</span> Hall of Fame
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-linear-to-br from-white via-yellow-100 to-yellow-600 bg-clip-text text-transparent">
            The Celebration Wall
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed font-medium">
            Honoring the builders who saw it through to the end. These are the completed masterpieces of the MzansiBuilds community.
          </p>
        </div>

        {/* The Grid of Champions */}
        {completedProjects.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-gray-700 rounded-2xl bg-gray-800/50 backdrop-blur-sm max-w-2xl mx-auto">
            <span className="text-4xl mb-4 block">🏗️</span>
            <h3 className="text-xl font-bold text-gray-200 mb-2">No completed builds yet.</h3>
            <p className="text-gray-500">The community is still grinding. Who will be the first to claim a spot on the wall?</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedProjects.map((project) => (
              <Link 
                href={`/projects/${project.id}`} 
                key={project.id}
                className="group relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.2)] flex flex-col h-full"
              >
                {/* Gold Accent Line */}
                <div className="absolute top-0 left-8 right-8 h-0.5 bg-linear-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-2xl" title="Completed">🏅</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Stats Footer */}
                <div className="pt-6 border-t border-gray-700 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-gray-500">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="text-yellow-500">★</span> {project.milestones.length} Updates
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-blue-400">💬</span> {project.comments.length}
                    </span>
                  </div>
                  <span className="text-gray-600">
                    {new Date(project.updatedAt).getFullYear()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}