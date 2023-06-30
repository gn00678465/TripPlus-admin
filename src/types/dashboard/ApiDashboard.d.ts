declare namespace ApiDashboard {
  interface Dashboard {
    id: string;
    projectTitle: string;
    projectCategory: number;
    accumulatedAmount: number;
    targetAmount: number;
    accumulatedSponsor: number;
    followerAmount: number;
    unpaidOrder: number;
    paidOrder: number;
    shippedOrder: number;
    progressRate: number;
    countDownDays: number;
  }
}
