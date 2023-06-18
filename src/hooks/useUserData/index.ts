import useSWR from 'swr';
import { useUserStore } from '@/store';
import { apiFetchUserInfo } from '@/api';
import { swrFetch } from '@/utils';

export function useUserData() {
  const userData = useUserStore((state) => state.userData);
  const setUserData = useUserStore((state) => state.setUserData);

  const { data, error } = useSWR(
    '/api/user/data',
    () => swrFetch(apiFetchUserInfo()),
    {
      onSuccess(data, key, config) {
        if (data.data) {
          setUserData({ name: data.data.name, photo: data.data.photo });
        }
      }
    }
  );

  return {
    name: data?.data.name,
    photo: data?.data.photo
  };
}
