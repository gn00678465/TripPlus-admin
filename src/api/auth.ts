import { request } from '@/config/axios';

interface LoginBody {
  email: string;
  password: string;
}

export function login(data: LoginBody) {
  return request.post<ApiAuth.UserInfo>('/auth/login', data);
}
