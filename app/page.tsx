// src/app/page.tsx (or your specific route folder)
import ExperienceList from '@/components/ExperienceList';

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-900 text-neutral-100 py-10 px-5 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="absolute top-0 right-0">
            <span className="bg-yellow-400 text-black text-xl font-bold px-6 py-1 rounded-bl-lg uppercase shadow-md">
              WIP
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">Maël Petit</h1>
          <p className="text-lg text-neutral-400">Passionné d'informatique, diplômé d'école d'ingénieur et spécialisé en développement logiciel.</p>

          <div className="flex justify-center items-center gap-6 mt-5">
            <a
              href="mailto:contact@maelpetit.fr"
              className="text-neutral-400 hover:text-white transition-colors duration-200"
              aria-label="Email me"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
              </svg>
            </a>

            <a
              href="https://linkedin.com/in/m-petit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-[#0a66c2] transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
              </svg>
            </a>

          </div>
        </header>

        {/* This is where your component lives */}
        <ExperienceList />

        <footer className="text-center mt-12 pt-8 border-t border-neutral-800 text-gray-500">
          <p>© {new Date().getFullYear()} Maël Petit</p>
        </footer>
      </div>
    </main>
  );
}