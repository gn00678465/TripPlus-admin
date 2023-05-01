import { request } from '../request';

interface LoginBody {
  email: string;
  password: string;
}

export function login(data: LoginBody) {
  return request.post<ApiAuth.UserInfo>('/auth/login', data);
}
