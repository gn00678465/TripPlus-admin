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
    KeyVision: string;
    video: string;
  }

  interface FormBasicSettings
    extends Omit<Project.FormInputs, 'teamName' | 'keyVision'> {
    summary: string;
    isLimit: 0 | 1;
    isAbled: 0 | 1;
    isShowTarget: 0 | 1;
    seoDescription: string;
  }

  interface FormPaymentSettings {
    payment: number;
    isAllowInstallment: number;
    atmDeadline: number;
    csDeadline: number;
  }
}
