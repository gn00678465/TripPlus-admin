import type { AxiosError } from 'axios';

export function handleAxiosError(axiosError: AxiosError<Service.FailedResult>) {
  const error: Service.FailedResult = {
    status: 'Error',
    message: ''
  };
  if (axiosError.response) {
    Object.assign(error, { message: axiosError.response.data.message });
  }

  return error;
}
