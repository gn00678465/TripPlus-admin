import { request } from '@/config/axios';
import type { AxiosRequestConfig } from 'axios';

export function apiFetchMessages(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiMessages.MessageList>(`/admin/${id}/chatroom`, config);
}

export function apiFetchMessage(
  id: string,
  pageIndex: number,
  pageSize: number,
  config?: AxiosRequestConfig
) {
  return request.get<ApiMessages.Message[]>(`/admin-project/${id}/message`, {
    params: {
      pageIndex,
      pageSize
    },
    ...config
  });
}
