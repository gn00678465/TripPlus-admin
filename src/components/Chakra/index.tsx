import { ReactNode } from 'react';
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager
} from '@chakra-ui/react';
import { theme } from '@/config';

interface Props {
  cookies?: string;
  children?: ReactNode;
}

export function Chakra({ cookies, children }: Props) {
  const colorModeManager =
    typeof cookies === 'string'
      ? cookieStorageManagerSSR(cookies)
      : localStorageManager;

  return (
    <ChakraProvider
      resetCSS={true}
      colorModeManager={colorModeManager}
      theme={theme}
    >
      {children}
    </ChakraProvider>
  );
}
