import { request } from '@/config/axios';
import type { AxiosRequestConfig } from 'axios';

export function apiFetchMessages(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiProject.ProjectList>(`/admin/${id}/chatroom`, config);
}

export function apiFetchMessage(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiProject.ProjectList>(
    `/admin_project/${id}/message`,
    config
  );
}
