import { prisma } from '@repo/database';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '../../../../utils/supabase/server';
import { addManagementMilestone, updateProjectStage } from './actions';
import Link from 'next/link';

export default async function ManageProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      milestones: { orderBy: { createdAt: 'desc' } },
      collabRequests: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!project) notFound();
  
  // Extra security: Kick them out if they don't own it
  if (project.userId !== user.id) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <Link href="/dashboard" className="text-xs font-bold text-green-600 hover:underline mb-2 block">
            ← Back to Workspace
          </Link>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            ⚙️ Manage: {project.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Controls (Left 2/3) */}
          <div className="md:col-span-2 space-y-8">
            
            {/* 1. Update Milestones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Post a Milestone</h2>
              
              <form action={addManagementMilestone} className="mb-8">
                <input type="hidden" name="projectId" value={project.id} />
                <textarea 
                  name="content"
                  required
                  rows={3}
                  placeholder="What did you achieve today?"
                  className="w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-3"
                />
                <div className="flex justify-end">
                  <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-colors cursor-pointer">
                    Publish Update
                  </button>
                </div>
              </form>

              {/* Recent Milestones List */}
              <div className="space-y-4 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Update History</h3>
                {project.milestones.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No updates published yet.</p>
                )}
                {project.milestones.map((ms) => (
                  <div key={ms.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-[10px] font-bold text-green-600 block mb-1">
                      {new Date(ms.createdAt).toLocaleDateString()}
                    </span>
                    <p className="text-sm text-gray-800">{ms.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Settings Sidebar (Right 1/3) */}
          <div className="space-y-8">
            
            {/* Project Stage Manager */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Project Stage</h3>
              
              <form action={updateProjectStage} className="space-y-4">
                <input type="hidden" name="projectId" value={project.id} />
                <select 
                  name="stage" 
                  defaultValue={project.stage}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none font-medium"
                >
                  <option value="IDEATION">Ideation</option>
                  <option value="PROTOTYPING">Prototyping</option>
                  <option value="DEVELOPMENT">Development</option>
                  <option value="COMPLETED">Completed 🏆</option>
                </select>
                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                  Update Stage
                </button>
              </form>
            </div>

            {/* Collab Requests (Preview for Next Step) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider flex justify-between">
                Network <span>{project.collabRequests.length}</span>
              </h3>
              {project.collabRequests.length === 0 ? (
                <p className="text-xs text-gray-500">No collaboration requests yet.</p>
              ) : (
                <p className="text-xs font-bold text-green-600">Requests pending! (Logic coming soon)</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}