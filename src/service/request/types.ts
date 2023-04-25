import type { InternalAxiosRequestConfig, AxiosError } from 'axios';

export interface RequestInterceptor<T> {
  requestInterceptors?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  requestInterceptorsCatch?: (err: AxiosError) => AxiosError;
  responseInterceptors?: (config: T) => T;
  responseInterceptorsCatch?: (err: AxiosError) => AxiosError;
}
