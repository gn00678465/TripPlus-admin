export function safeAwait<T>(
  promise: Promise<Service.RequestResult<T>>
): Promise<[Service.FailedResult] | [undefined, Service.SuccessResult<T>]>;
export function safeAwait<T>(promise: Promise<Service.RequestResult<T>>) {
  return promise
    .then((res) => {
      if (res instanceof Error) {
        return [res];
      }
      return [undefined, res];
    })
    .catch((err) => {
      return [err];
    });
}
