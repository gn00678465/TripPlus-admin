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

  interface FormBasicSettings
    extends Omit<Project.FormInputs, 'teamName' | 'keyVision'> {
    summary: string;
    isLimit: 0 | 1;
    isAbled: 0 | 1;
    isShowTarget: 0 | 1;
    seoDescription: string;
  }
}
