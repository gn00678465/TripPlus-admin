import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios';
import { getToken } from './helpers';
import type { RequestInterceptor } from './types';

export default class CustomAxiosInstance {
  instance: AxiosInstance;
  interceptorsObj: RequestInterceptor<AxiosResponse> | null;

  constructor(
    axiosConfig: AxiosRequestConfig,
    interceptorsObj?: RequestInterceptor<AxiosResponse>
  ) {
    this.instance = axios.create(axiosConfig);
    this.interceptorsObj = interceptorsObj || null;
    this.setInterceptor();
  }

  setInterceptor() {
    // global request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        let handleConfig = { ...config };

        // 處理 token
        handleConfig.headers.Authorization = getToken();

        return handleConfig;
      },
      (axiosError: AxiosError) => axiosError
    );

    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestInterceptors,
      this.interceptorsObj?.requestInterceptorsCatch
    );

    this.instance.interceptors.response.use(
      this.interceptorsObj?.responseInterceptors,
      this.interceptorsObj?.responseInterceptorsCatch
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => res,
      (axiosError: AxiosError) => axiosError
    );
  }
}
