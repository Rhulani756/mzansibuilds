import { prisma } from '@repo/database';
import { notFound } from 'next/navigation';
import { postComment, raiseHand, addMilestone } from './actions';
import { createClient } from '../../../utils/supabase/server';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function ProjectDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch project, comments, collab requests, AND milestones in one query
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      user: true, 
      comments: {
        include: { user: true }, // 🚀 ADDED 'include:' HERE
        orderBy: { createdAt: 'desc' }
      },
      milestones: {
        orderBy: { createdAt: 'desc' } 
      },
      collabRequests: true
    }
  });

  if (!project) {
    notFound();
  }

  const isOwner = user?.id === project.userId;
  const hasAlreadyRequested = user 
    ? project.collabRequests.some(req => req.userId === user.id) 
    : false;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Project Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Link href="/feed" className="text-xs font-bold text-green-600 hover:underline mb-2 block">
                  ← Back to Feed
                </Link>
                <h1 className="text-3xl font-black text-gray-900 mb-3">{project.title}</h1>
                
                {/* NEW: Project Owner Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-[10px] font-bold uppercase">
                    {project.user.username.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-600">
                    @{project.user.username}
                  </span>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-gray-200">
                {project.stage}
              </span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap italic opacity-90 mt-6">
              {project.description}
            </p>
          </div>

          {/* 2. Progress Timeline Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🚀</span> Progress Timeline
              </h3>
            </div>

            {/* Form to add a milestone - Only for the Owner */}
            {isOwner && (
              <form action={addMilestone} className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-3">
                <input type="hidden" name="projectId" value={project.id} />
                <input 
                  name="content"
                  required
                  placeholder="Share a new achievement..."
                  className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                />
                <button type="submit" className="bg-gray-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors cursor-pointer">
                  Update Progress
                </button>
              </form>
            )}

            {/* Vertical Timeline List */}
            <div className="relative pl-8 space-y-8 before:absolute before:inset-y-0 before:left-2.75 before:w-0.5 before:bg-gray-100">
              {project.milestones.length === 0 ? (
                <p className="text-gray-400 text-sm italic">The build journey has just begun. No updates yet.</p>
              ) : (
                project.milestones.map((ms) => (
                  <div key={ms.id} className="relative group">
                    {/* The Dot */}
                    <div className="absolute -left-6.75 top-1.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10 group-hover:scale-125 transition-transform" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        {new Date(ms.createdAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <p className="text-gray-800 font-semibold leading-relaxed">
                        {ms.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 3. Discussion Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion ({project.comments.length})</h3>
            
            {user ? (
              <form action={postComment} className="mb-8">
                <input type="hidden" name="projectId" value={project.id} />
                <textarea 
                  name="content"
                  required
                  rows={3}
                  placeholder="Share your thoughts or offer help..."
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none bg-gray-50 text-sm"
                />
                <div className="flex justify-end mt-2">
                  <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors cursor-pointer">
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200 mb-8">
                <p className="text-gray-600 text-sm">Log in to join the conversation.</p>
              </div>
            )}

            <div className="space-y-6">
              {/* NEW: Updated Comment Map */}
              {project.comments.map(comment => {
                // Check if the commenter is the project owner
                const isCreator = comment.userId === project.userId;

                return (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 bg-linear-to-br from-gray-800 to-gray-900 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm uppercase shadow-sm">
                      {comment.user.username.charAt(0)}
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-xl rounded-tl-none border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900">@{comment.user.username}</span>
                          {/* Creator Badge */}
                          {isCreator && (
                            <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Creator</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              🤝 Collaboration
            </h3>
            
            {project.supportRequired ? (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-tight">Support Requested:</p>
                <p className="text-blue-900 text-sm leading-relaxed font-medium">{project.supportRequired}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-6 italic">
                Open to all collaborators. No specific needs listed.
              </p>
            )}
            
            {user ? (
              isOwner ? (
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-bold italic">You own this build.</p>
                </div>
              ) : hasAlreadyRequested ? (
                <div className="w-full bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-lg font-bold text-center flex items-center justify-center gap-2">
                  ✅ Hand Raised
                </div>
              ) : (
                <form action={raiseHand}>
                  <input type="hidden" name="projectId" value={project.id} />
                  <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md cursor-pointer"
                  >
                    Raise Hand to Help
                  </button>
                </form>
              )
            ) : (
              <Link 
                href="/login" 
                className="block w-full text-center bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Log in to Help
              </Link>
            )}
          </div>

          <div className="bg-gray-900 text-white rounded-xl p-6 shadow-xl">
            <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-4">Build Meta</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Launched</span>
                <span className="font-mono">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Updates</span>
                <span className="font-bold text-green-400">{project.milestones.length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}