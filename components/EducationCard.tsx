import React from 'react';
import { Education } from '@/types';

interface EducationCardProps extends Education { }

const EducationCard: React.FC<EducationCardProps> = ({
    title,
    school,
    city,
    startDate,
    endDate,
    description,
}) => {
    return (
        <div className="group border border-neutral-400 dark:border-neutral-700 p-6 rounded-4xl mb-8 shadow-lg font-sans transition duration-300 hover:border-neutral-500 hover:-translate-y-1 hover:scale-101">
            {/* Header/Role */}
            <div className="border-b border-neutral-400 dark:border-neutral-700 pb-3 mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition duration-300 group-hover:border-neutral-500">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 m-0">{school.name}</h2>
                    <a
                        href={school.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-800 dark:text-purple-400 font-bold"
                        title={school.url}
                    >
                        ↗
                    </a>
                </div>

                <div className="text-sm text-purple-800 dark:text-purple-400 text-right">
                    <div className="flex">
                        <span>{startDate}</span>
                        {endDate && (
                            <>
                                <span className="mx-2">-</span>
                                <span>{endDate}</span>
                            </>
                        )}
                    </div>
                    <span>{city}</span>
                </div>
            </div>

            {/* Company Info */}
            <div className="mb-5">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 m-0">{title}</h3>

                </div>
            </div>

            {/* Description / Responsibilities */}
            {description && description.length > 0 && (
                <div className="mt-5 mb-3">
                    <ul className="list-disc pl-5 m-0 text-neutral-800 dark:text-neutral-300 space-y-2">
                        {description.map((item, index) => (
                            <li key={index} className="leading-relaxed">
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EducationCard;