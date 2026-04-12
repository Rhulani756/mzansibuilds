import { ensureUserProfile } from '../../utils/profile';
import { updateProfile } from './actions';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const profile = await ensureUserProfile();
  if (!profile) redirect('/login');

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Profile Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form action={updateProfile} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <div className="flex bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-4 py-3 text-gray-500 bg-gray-100 border-r border-gray-300 font-mono text-sm">@</span>
              <input 
                name="username" 
                defaultValue={profile.username}
                required
                className="w-full px-4 py-3 bg-transparent outline-none font-medium" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Developer Bio</label>
            <textarea 
              name="bio" 
              defaultValue={profile.bio || ''}
              rows={3}
              placeholder="What are you building?"
              className="w-full border border-gray-300 rounded-lg p-4 outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">GitHub Profile URL</label>
            <input 
              name="githubUrl" 
              defaultValue={profile.githubUrl || ''}
              placeholder="https://github.com/yourusername"
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-green-500 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-green-400 cursor-pointer">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}