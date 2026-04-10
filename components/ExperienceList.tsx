import React from 'react';
import experiencesData from '@/data/experiences.json';
import { ExperienceCollection, Experience } from '@/types';
import ExperienceCard from '@/components/ExperienceCard';

const ExperienceList: React.FC = () => {
    // Cast the imported JSON to your ExperienceCollection type
    const { experiences } = experiencesData as ExperienceCollection;

    return (
        <section className="py-8 px-4 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center text-neutral-100">Expérience professionnelle</h2>

            <div className="flex flex-col gap-2 max-w-4xl mx-auto">
                {experiences.map((exp: Experience) => (
                    <ExperienceCard
                        key={exp.id}
                        {...exp}
                    />
                ))}
            </div>
        </section>
    );
};

export default ExperienceList;