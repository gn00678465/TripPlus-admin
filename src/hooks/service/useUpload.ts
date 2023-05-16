import type { MutatorOptions } from 'swr';
import useSWRMutation from 'swr/mutation';
import { uploadImage } from '@/api';

export function useUploadImage(options?: MutatorOptions) {
  return useSWRMutation(
    '/upload',
    (key, { arg }: { arg: FormData }) =>
      uploadImage(arg, { headers: { 'Content-Type': 'multipart/form-data' } }),
    options
  );
}
