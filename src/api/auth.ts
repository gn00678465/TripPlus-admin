import { request } from '@/config/axios';

export function login(data: Auth.LoginBody) {
  return request.post<ApiAuth.UserInfo>('/auth/login', data);
}
