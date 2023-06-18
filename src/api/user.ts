import { request } from '@/config/axios';
import type { AxiosRequestConfig } from 'axios';

export function apiFetchUserInfo(config?: AxiosRequestConfig) {
  return request.get<ApiUserData.userData>('/user/account', config);
}
