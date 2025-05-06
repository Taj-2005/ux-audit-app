import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 dark:text-white flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-5xl font-extrabold text-center mb-12">
        Landing Page UX Audit Tool
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <Link href="/backend">
          <div className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-72 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Using Backend</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Leverages server-side analysis and audits</p>
          </div>
        </Link>

        <Link href="/ai">
          <div className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl p-8 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-72 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Using Gemini</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Powered by AI for smart UX evaluations</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
