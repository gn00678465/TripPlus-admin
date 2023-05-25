declare namespace Project {
  interface FormInputs {
    title: string;
    teamName: string;
    category: 0 | 1 | 2;
    startTime: string;
    endTime: string;
    target: number;
    keyVision: string;
  }

  interface FormKeyVisionSettings {
    keyVision: string;
    video: string;
  }

  interface FormBasicSettings
    extends Omit<Project.FormInputs, 'teamName' | 'keyVision'> {
    summary: string;
    isLimit: 0 | 1;
    isShowTarget: 0 | 1;
    seoDescription: string;
    url: string;
  }

  interface FormPaymentSettings {
    payment: 0 | 1;
    isAllowInstallment: number;
    atmDeadline: string;
    csDeadline: string;
  }

  interface FormOptionSettings {
    isAbled: 0 | 1;
  }
}
