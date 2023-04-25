declare namespace Service {
  type SuccessResult<T> = T extends unknown
    ? {
        status: 'Success';
        message?: string;
      }
    : {
        status: 'Success';
        message?: string;
        data: T;
      };

  interface FailedResult {
    status: 'Error';
    message: string;
  }

  type RequestResult<T> = SuccessResult<T> | FailedResult;
}
