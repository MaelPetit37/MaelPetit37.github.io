// src/app/page.tsx (or your specific route folder)
import ExperienceList from '@/components/ExperienceList';
import EducationList from '@/components/EducationList';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-300 dark:bg-neutral-900 px-5 font-sans flex flex-col scroll-smooth">
      {/* 1. The Fixed Banner (Stays in the corner, ignored by layout) */}
      <div className="absolute top-0 right-0 z-50">
        <span className="bg-yellow-400 text-black text-xl font-bold px-6 py-1 rounded-bl-lg uppercase shadow-md">
          WIP
        </span>
      </div>

      <nav className="fixed left-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
        <a href="#home" className="w-3 h-3 rounded-full bg-neutral-800 dark:bg-neutral-300 hover:bg-yellow-600 dark:hover:bg-yellow-300" title="Accueil"></a>
        <a href="#experience" className="w-3 h-3 rounded-full bg-neutral-800 dark:bg-neutral-300 hover:bg-yellow-600 dark:hover:bg-yellow-300" title="Expérience"></a>
        <a href="#education" className="w-3 h-3 rounded-full bg-neutral-800 dark:bg-neutral-300 hover:bg-yellow-600 dark:hover:bg-yellow-300" title="Formation"></a>
      </nav>

      <nav className="fixed left-5 top-1/25 -translate-y-1/2 z-40 flex flex-col gap-4">
        <ThemeToggle />
      </nav>

      <div id="home" className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
        <header className="text-center">
          <div className="flex h-screen flex-col items-center justify-center">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-neutral-800 dark:text-neutral-100">Maël Petit</h1>
              <p className="text-lg text-neutral-800 dark:text-neutral-400">Passionné d'informatique, diplômé d'école d'ingénieur et spécialisé en développement logiciel.</p>

              <div className="flex justify-center items-center gap-6 mt-5">
                <a
                  href="mailto:contact@maelpetit.fr"
                  className="text-neutral-800 dark:text-neutral-300 hover:text-[#E8B333] dark:hover:text-[#F1E436] transition-colors duration-200"
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
                  className="text-neutral-800 dark:text-neutral-300 hover:text-[#0a66c2] transition-colors duration-200"
                  aria-label="LinkedIn Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                  </svg>
                </a>

              </div>
            </div>
            <a href="#experience" className="absolute bottom-10 text-neutral-800 hover:text-black dark:text-neutral-300 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-down animate-bounce" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
              </svg>
            </a>

          </div>
        </header>

        <ExperienceList />

        <EducationList />

        <footer className="text-center mt-12 py-6 border-t border-neutral-800 text-neutral-800 dark:border-neutral-700 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} Maël Petit</p>
        </footer>
      </div>
    </main >
  );
}