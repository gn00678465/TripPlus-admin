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
      Project.FormPaymentSettings,
      Project.FormOptionSettings {
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

declare namespace ApiProjectContent {
  type Content = {
    content: string;
  };
}

declare namespace ApiProjectOrders {
  interface Order {
    _id: string;
    member: string;
    projectId: {
      _id: string;
      title: string;
      progressRate: null;
      countDownDays: number;
      type: string;
      id: string;
    };
    productId: null;
    planId: string;
    payment: 0 | 1;
    fundPrice: number;
    count: number;
    shipment: 0 | 1;
    shipPrice: number;
    extraFund: null;
    bonusDiscount: number;
    total: number;
    buyerName: string;
    buyerPhone: string;
    buyerEmail: string;
    buyerAddress: string;
    shipAddress: string;
    recipient: string;
    recipientPhone: string;
    recipientEmail: string;
    creditCard: string;
    note: string;
    bonus: null;
    paidAt: string;
    paymentStatus: 0 | 1;
    shipmentId: string;
    shipDate: string;
    status: 0 | 1;
    shipmentStatus: 0 | 1;
    isCommented: 0 | 1;
    createdAt: string;
    updatedAt: string;
    transactionId: string;
    __v: number;
  }

  interface OrderList {
    total: number;
    totalPages: number;
    page: number;
    startIndex: number;
    endIndex: number;
    limit: number;
    items: Order[];
  }
}
