import React from 'react';
import { Experience } from '@/types';

interface ExperienceCardProps extends Experience { }

const ExperienceCard: React.FC<ExperienceCardProps> = ({
    role,
    company,
    startDate,
    endDate,
    description,
    tools
}) => {
    return (
        <div className="group bg-neutral-900 border border-neutral-700 p-6 rounded-4xl mb-8 shadow-lg font-sans transition duration-300 hover:border-neutral-500 hover:-translate-y-1 hover:scale-101">
            {/* Header/Role */}
            <div className="border-b border-neutral-700 pb-3 mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition duration-300 group-hover:border-neutral-500">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-100 m-0">{company.name}</h2>
                    <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 font-bold"
                        title={company.url}
                    >
                        ↗
                    </a>
                </div>

                <div className="flex items-center text-sm text-teal-400">
                    <span>{startDate}</span>
                    {endDate && (
                        <>
                            <span className="mx-2">-</span>
                            <span>{endDate}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Company Info */}
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-200 m-0">{role}</h3>

                </div>
            </div>

            {/* Description / Responsibilities */}
            <div className="mt-5 mb-3">
                <ul className="list-disc pl-5 m-0 text-neutral-300 space-y-2">
                    {description.map((item, index) => (
                        <li key={index} className="leading-relaxed">
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tools Used */}
            {tools && tools.length > 0 && (
                <div className="mt-6 border-t border-neutral-700 pt-4 transition duration-300 group-hover:border-neutral-500">
                    <div className="flex flex-wrap gap-2">
                        {tools.map((tool, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-teal-300 transition duration-300 hover:bg-neutral-700"
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

export default ExperienceCard;