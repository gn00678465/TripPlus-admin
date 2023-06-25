import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TeamState {
  teamId: string;
  setTeamId: (id: string) => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teamId: '',
      setTeamId: (id) => set({ teamId: id })
    }),
    {
      name: 'teamId',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
