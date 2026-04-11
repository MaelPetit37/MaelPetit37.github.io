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

export interface School {
    name: string;
    url: string;
}

export interface Education {
    id: number;
    title: string;
    school: School;
    city: string,
    startDate: string;
    endDate?: string;
    description?: string[];
}

export interface EducationCollection {
    education: Education[];
}