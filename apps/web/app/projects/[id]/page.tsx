import { prisma } from '@repo/database';
import { notFound } from 'next/navigation';
import { postComment, raiseHand } from './actions';
import { createClient } from '../../../utils/supabase/server';
import Link from 'next/link';

export default async function ProjectDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the project, comments, and collab requests in one hit
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        orderBy: { createdAt: 'desc' }
      },
      collabRequests: true
    }
  });

  if (!project) {
    notFound();
  }

  // Business Logic for Collaboration
  const isOwner = user?.id === project.userId;
  const hasAlreadyRequested = user 
    ? project.collabRequests.some(req => req.userId === user.id) 
    : false;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Project Info (Left Column) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <Link href="/feed" className="text-xs font-bold text-green-600 hover:underline mb-2 block">
                  ← Back to Feed
                </Link>
                <h1 className="text-3xl font-black text-gray-900">{project.title}</h1>
              </div>
              <span className="bg-gray-100 text-gray-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {project.stage}
              </span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Comments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion ({project.comments.length})</h3>
            
            {/* Comment Form */}
            {user ? (
              <form action={postComment} className="mb-8">
                <input type="hidden" name="projectId" value={project.id} />
                <textarea 
                  name="content"
                  required
                  rows={3}
                  placeholder="Share your thoughts or offer help..."
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors cursor-pointer">
                    Post Comment
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200 mb-8">
                <p className="text-gray-600">You must be logged in to join the discussion.</p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {project.comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-linear-to-br from-green-400 to-blue-500 rounded-full shrink-0" />
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl rounded-tl-none border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-gray-900">Builder</span>
                      <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar (Right Column) - Always Visible */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              🤝 Collaboration
            </h3>
            
            {project.supportRequired ? (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <p className="text-xs font-bold text-blue-800 mb-1 uppercase tracking-tight">Support Requested:</p>
                <p className="text-blue-900 text-sm leading-relaxed">{project.supportRequired}</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-6 italic">
                No specific support requested, but this builder is open to collaboration!
              </p>
            )}
            
            {/* Logic for the Action Button */}
            {user ? (
              isOwner ? (
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 font-bold italic">This is your project</p>
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
                  <p className="text-[10px] text-gray-400 mt-3 text-center uppercase tracking-tighter">
                    Creator will be notified of your interest
                  </p>
                </form>
              )
            ) : (
              <Link 
                href="/login" 
                className="block w-full text-center bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors"
              >
                Log in to Collaborate
              </Link>
            )}
          </div>

          {/* Project Details Meta */}
          <div className="bg-gray-900 text-white rounded-xl p-6 shadow-xl">
            <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-4">Project Meta</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-gray-800 pb-2">
                <span className="text-gray-400">Created</span>
                <span className="font-mono">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Comments</span>
                <span>{project.comments.length}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}