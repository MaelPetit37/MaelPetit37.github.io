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
    title: string;
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
    title: string;
    education: Education[];
}

export interface GlobalData {
    introduction: string;
}

export interface Update {
    updateMessage: string;
}

export interface ToolCategory {
    id: string;
    name: string;
}

export interface Tool {
    id: string;
    name: string;
    categoryId: string;
    logo: string;
    invert?: boolean;
}

export interface ToolCollection {
    title: string;
    categories: ToolCategory[];
    tools: Tool[];
}

export interface Project {
    id: number;
    title: string;
    date: string;
    summary: string;
    details: string[];
    tools: string[];
}

export interface ProjectCollection {
    title: string;
    projects: Project[];
}