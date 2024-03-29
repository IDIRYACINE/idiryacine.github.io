
export interface PortfolioProps{
    projects: Project[];
}


export type Project = {
    name: string;
    previewImage: string;
    previewDescription: string[];
    description: string[];
    tags: string[];
    images: string[];
    actions: {
      github?: string;
      website?: string;
      playstore?: string;
    };
  };
  

  export type  Profile = {
    name: string;
    email: string;
    secondaryEmail: string;
    phone: string;
    facebook: string;
    github: string;
    biography: string[];
  }


  export type Mindset = {
    title: string;
    summary: string;
  }

  export type Skills = {
    languages : string[];
    frameworks : string[];
    databases : string[];
    tools : string[];
  }

