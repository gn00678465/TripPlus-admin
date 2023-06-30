import { request } from '@/config/axios';

export function apiGetTeamInfo(id: string, teamId: string) {
  return request.get<ApiTeam.Team>(`/admin/project/${id}/team/${teamId}`);
}

export function apiPatchTeamInfo(
  id: string,
  teamId: string,
  data: Team.TeamData
) {
  return request.patch<ApiTeam.Team>(
    `/admin/project/${id}/team/${teamId}`,
    data
  );
}
