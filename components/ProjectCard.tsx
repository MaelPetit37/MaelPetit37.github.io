import React from 'react';
import { Project } from '@/types';

interface ProjectCardProps extends Project { }

const ProjectCard: React.FC<ProjectCardProps> = ({
    title,
    date,
    summary,
    details,
    tools
}) => {
    return (
        <div className="group border border-neutral-400 dark:border-neutral-700 p-6 rounded-4xl mb-8 shadow-lg font-sans transition duration-300 hover:border-neutral-500 hover:-translate-y-1 hover:scale-101">
            {/* Header/Title */}
            <div className="border-b border-neutral-400 dark:border-neutral-700 pb-3 mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition duration-300 group-hover:border-neutral-500">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 m-0">{title}</h2>
                <div className="flex items-center text-sm text-yellow-800 dark:text-yellow-300">
                    <span>{date}</span>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-5">
                <p className="text-neutral-800 dark:text-neutral-300 leading-relaxed">
                    {summary}
                </p>
            </div>

            {/* Details */}
            <div className="mt-5 mb-3">
                <ul className="list-disc pl-5 m-0 text-neutral-800 dark:text-neutral-300 space-y-2">
                    {details.map((item, index) => (
                        <li key={index} className="leading-relaxed">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tools Used */}
            {tools && tools.length > 0 && (
                <div className="mt-6 border-t border-neutral-400 dark:border-neutral-700 pt-4 transition duration-300 group-hover:border-neutral-500">
                    <div className="flex flex-wrap gap-2">
                        {tools.map((tool, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 rounded-full text-sm text-yellow-800 dark:text-yellow-300 transition duration-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            >
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;