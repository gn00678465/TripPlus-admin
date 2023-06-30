import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface UserInfo extends ApiAuth.UserInfo {
  expires: number;
}

type State = {
  userInfo: UserInfo | null;
  _hasHydrated: boolean;
  getters: {
    isLogin: boolean;
  };
};

type Actions = {
  setUserInfo: (arg: ApiAuth.UserInfo | null) => void;
  setHasHydrated: (state: boolean) => void;
};

const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

export const useAuthStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        userInfo: null,
        _hasHydrated: false,
        setUserInfo: (params) => {
          const expires = new Date().getTime() + DEFAULT_CACHE_TIME * 1000;
          set((state) => {
            if (params) {
              Cookies.set('token', params.token, {
                secure: true,
                expires: new Date(expires)
              });
              return {
                ...state,
                userInfo: {
                  ...params,
                  expires: expires
                }
              };
            }
            return {
              ...state,
              userInfo: null
            };
          });
        },
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        },
        getters: {
          get isLogin() {
            return !!get().userInfo;
          }
        }
      }),
      {
        name: 'userInfo',
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) => ['userInfo'].includes(key))
          ),
        onRehydrateStorage: () => {
          Cookies.remove('token');
          return (state) => {
            if (state) {
              if (state.userInfo && state.userInfo.expires < Date.now()) {
                state.setUserInfo(null);
                return state.setHasHydrated(true);
              }
              const token = state.userInfo?.token;
              const expires =
                (state.userInfo && new Date(state.userInfo.expires)) ||
                undefined;
              if (token) {
                Cookies.set('token', token, {
                  secure: true,
                  expires
                });
              }
              return state.setHasHydrated(true);
            }
          };
        }
      }
    ),
    { name: 'authStore' }
  )
);
