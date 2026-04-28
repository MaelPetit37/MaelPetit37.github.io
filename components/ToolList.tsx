import React from 'react';
import toolData from '@/data/tools.json';
import { ToolCollection, Tool, ToolCategory } from '@/types';
import ToolLogo from '@/components/ToolLogo';

const EducationList: React.FC = () => {
    const { title, categories, tools } = toolData as ToolCollection;

    return (
        <section id="tools" className="py-8 px-4 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-neutral-800 dark:text-neutral-100">{title}</h2>

            <div className="flex flex-col max-w-4xl mx-auto divide-y divide-neutral-400 dark:divide-neutral-700">
                {categories.map((category: ToolCategory) => (
                    <div
                        key={category.id}
                        className="grid grid-cols-1 md:grid-cols-[150px_1fr] items-center gap-4 py-4"
                    >
                        {/* Centers text on mobile, aligns left on desktop */}
                        <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 text-center md:text-left">
                            {category.name}
                        </h3>

                        {/* Centers logos on mobile, aligns left on desktop */}
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            {tools
                                .filter(t => t.categoryId === category.id)
                                .map((tool: Tool) => (
                                    <ToolLogo key={tool.id} {...tool} />
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default EducationList;