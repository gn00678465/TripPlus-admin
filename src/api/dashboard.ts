import { request } from '@/config/axios';
import type { AxiosRequestConfig } from 'axios';

export function apiFetchDashboard(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiDashboard.Dashboard>(
    `/admin/project/${id}/dashboard`,
    config
  );
}
