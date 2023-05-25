declare namespace ApiProject {
  interface ProjectReturn extends Project.FormInputs {
    creator: string;
    teamId: string;
    sum: number;
    sponsorCount: number;
    isShowTarget: 0 | 1;
    isLimit: 0 | 1;
    isAbled: 0 | 1;
    isCommercialized: 0 | 1;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface ProjectItem extends ProjectReturn {
    status: Common.Status;
    type: Common.Type;
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
      Project.FormBasicSettings,
      Project.FormKeyVisionSettings,
      Project.FormPaymentSettings {
    isAbled: 0 | 1;
    orderCount: number;
    orderSuccess: number;
    orderUnpaidAmount: number;
    orderUnpaidCount: number;
    progressRate: number;
    countDownDays: number;
    status: Common.Status;
    type: Common.Type;
  }
}
