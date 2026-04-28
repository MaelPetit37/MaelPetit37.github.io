import React from 'react';
import SidebarIcon from './SidebarIcon';

type SidebarItem = {
    id: string;
    href: string;
    title: string;
    icon: 'home' | 'experience' | 'education' | 'projects' | 'tools';
};

const sidebarItems: SidebarItem[] = [
    { id: 'home', href: '#home', title: 'Accueil', icon: 'home' },
    { id: 'experience', href: '#experience', title: 'Expérience', icon: 'experience' },
    { id: 'education', href: '#education', title: 'Formation', icon: 'education' },
    { id: 'projects', href: '#projects', title: 'Projets', icon: 'projects' },
    { id: 'tools', href: '#tools', title: 'Outils', icon: 'tools' },
];

const SidebarNav: React.FC = () => {
    return (
        <nav className="fixed left-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
            {sidebarItems.map(({ id, href, title, icon }) => (
                <a
                    key={id}
                    href={href}
                    title={title}
                    aria-label={title}
                    className="group flex items-center justify-center w-10 h-10 rounded-full border border-neutral-800 text-neutral-800 dark:border-neutral-300 dark:text-neutral-300 hover:border-yellow-600 hover:text-yellow-600 dark:hover:border-yellow-300 dark:hover:text-yellow-300 transition duration-300 ease-out hover:scale-110"
                >
                    <SidebarIcon name={icon} className="w-5 h-5 fill-current" />
                </a>
            ))}
        </nav>
    );
};

export default SidebarNav;
