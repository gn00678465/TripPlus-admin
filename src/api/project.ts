import { request } from '@/config/axios';
import type { AxiosRequestConfig } from 'axios';

export function apiPostProject(
  data: Project.FormInputs,
  config?: AxiosRequestConfig
) {
  return request.post<ApiProject.ProjectReturn>('/admin/project', data, config);
}

export function apiFetchProjects(
  query: string = '',
  config?: AxiosRequestConfig
) {
  return request.get<ApiProject.ProjectList>(
    !query ? '/admin/project' : `/admin/project?${query}`,
    config
  );
}

export function apiFetchProjectInfo(id: string, config?: AxiosRequestConfig) {
  return request.get<ApiProjectSettings.ProjectSettings>(
    `/admin/project/${id}/info`,
    config
  );
}

export function apiPatchProjectImage(
  id: string,
  data: Project.FormKeyVisionSettings
) {
  return request.patch<ApiProject.ProjectReturn>(
    `/admin/project/${id}/info/image`,
    data
  );
}

export function apiPatchProjInfoSetting(
  id: string,
  data: Project.FormBasicSettings
) {
  return request.patch<ApiProject.ProjectReturn>(
    `/admin/project/${id}/info/settings`,
    data
  );
}

export function apiPatchProjInfoPayment(
  id: string,
  data: Project.FormPaymentSettings
) {
  return request.patch<ApiProject.ProjectReturn>(
    `/admin/project/${id}/info/payment`,
    data
  );
}

export function apiPatchProjectEnable(
  id: string,
  data: Project.FormOptionSettings
) {
  return request.patch<ApiProject.ProjectReturn>(
    `/admin/project/${id}/info/abled`,
    data
  );
}

export function apiPostProjectTransform(id: string) {
  return request.post(`/admin/project/${id}/transform`);
}
