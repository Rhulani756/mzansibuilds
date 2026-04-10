import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <h1 className="text-5xl md:text-7xl font-extrabold text-mzansi-dark tracking-tight">
        Build in <span className="text-mzansi-green">Public.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
        The developer platform for the Derivco Code Skills Challenge. Track your milestones, collaborate with peers, and earn your spot on the Celebration Wall.
      </p>

      <div className="flex space-x-4 mt-8">
        <button className="bg-mzansi-dark text-mzansi-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition shadow-lg">
          Explore Live Feed
        </button>
        <button className="bg-mzansi-green text-mzansi-dark px-8 py-3 rounded-md font-bold hover:bg-emerald-400 transition shadow-lg">
          Start a Project
        </button>
      </div>
    </div>
  );
}