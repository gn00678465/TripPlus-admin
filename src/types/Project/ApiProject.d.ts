declare namespace ApiProject {
  interface ProjectReturn extends Project.FormInputs {
    creator: string;
    teamId: string;
    sum: number;
    sponsorCount: number;
    isShowTarget: 1;
    isLimit: number;
    isAbled: number;
    isCommercialized: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface ProjectItem extends ProjectReturn {
    status: 'draft' | 'progress' | 'complete';
    type: 'project' | 'product';
    countDownDays: number;
    progressRate: number;
    productId: string;
    content: string;
    teamId: {
      _id: string;
      title: string;
    };
  }

  interface ProjectList {
    total: number;
    totalPages: number;
    page: number;
    items: ProjectsItem[];
  }
}

declare namespace ApiProjectSettings {
  interface ProjectSettings
    extends ApiProject.ProjectReturn,
      Project.FormBasicSettings {
    isAbled: 0 | 1;
    payment: string;
    atmDeadline: string;
  }
}
