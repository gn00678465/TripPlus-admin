import { useState, useEffect, useCallback } from 'react';

export function useFileReader(file?: File) {
  const [dataURL, setDataURL] = useState<string | null>(null);

  const readAsDataURL = useCallback((file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setDataURL(reader.result as string);
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setDataURL(null);
      return;
    }
    readAsDataURL(file);
  }, [file, readAsDataURL]);

  return {
    dataURL
  };
}

export type UseFileReaderReturn = ReturnType<typeof useFileReader>;
