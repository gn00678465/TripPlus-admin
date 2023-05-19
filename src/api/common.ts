import type { AxiosRequestConfig } from 'axios';
import { request } from '@/config/axios';

export function uploadImage(formData: FormData, config?: AxiosRequestConfig) {
  return request.post<ApiCommon.Upload>('/upload', formData, config);
}
