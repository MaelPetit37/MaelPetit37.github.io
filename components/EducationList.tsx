import React from 'react';
import educationData from '@/data/education.json';
import { EducationCollection, Education } from '@/types';
import EducationCard from '@/components/EducationCard';

const EducationList: React.FC = () => {
    // Cast the imported JSON to your EducationCollection type
    const { education } = educationData as EducationCollection;

    return (
        <section id="education" className="py-8 px-4 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-neutral-100">Formation et diplômes</h2>

            <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                {education.map((exp: Education) => (
                    <EducationCard
                        key={exp.id}
                        {...exp}
                    />
                ))}
            </div>
        </section>
    );
};

export default EducationList;