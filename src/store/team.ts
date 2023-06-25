import { create } from 'zustand';

interface TeamState {
  teamId: string;
  setTeamId: (id: string) => void;
}

export const useTeamStore = create<TeamState>()((set) => ({
  teamId: '',
  setTeamId: (id) => set({ teamId: id })
}));
