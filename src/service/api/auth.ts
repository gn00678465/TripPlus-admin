import { request } from '../request';

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponseData {
  id: string;
  token: string;
  expired: number;
}

export function login(data: LoginBody) {
  return request.post<LoginResponseData>('/login', data);
}
