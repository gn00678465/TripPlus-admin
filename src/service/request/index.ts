import { createRequest } from './request';

export const request = createRequest({
  baseURL: process.env.BASE_API_URL
});
