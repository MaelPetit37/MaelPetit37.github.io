import React from 'react';
import projectsData from '@/data/projects.json';
import { ProjectCollection, Project } from '@/types';
import ProjectCard from '@/components/ProjectCard';

const ProjectList: React.FC = () => {
    // Cast the imported JSON to your ProjectCollection type
    const { title, projects } = projectsData as ProjectCollection;

    return (
        <section id="projects" className="py-8 px-4 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-neutral-800 dark:text-neutral-100">{title}</h2>

            <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                {projects.map((project: Project) => (
                    <ProjectCard
                        key={project.id}
                        {...project}
                    />
                ))}
            </div>
        </section>
    );
};

export default ProjectList;