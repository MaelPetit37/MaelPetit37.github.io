export interface Company {
    name: string;
    url: string;
}

export interface Experience {
    id: number;
    role: string;
    company: Company;
    startDate: string;
    endDate?: string;
    description: string[];
    tools?: string[];
}

export interface ExperienceCollection {
    experiences: Experience[];
}