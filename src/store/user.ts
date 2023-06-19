import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type UserData = Pick<ApiUserData.userData, 'name' | 'photo'>;

type State = {
  userData: UserData | null;
};

type Actions = {
  setUserData: (arg: UserData) => void;
};

export const useUserStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        userData: null,
        setUserData: (params) => {
          set((state) => {
            return { ...state, userData: params };
          });
        }
      }),
      { name: 'userData' }
    ),
    { name: 'userStore' }
  )
);
