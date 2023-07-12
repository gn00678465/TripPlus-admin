import { FC, ReactNode, createContext } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { useWindowSize } from '@/hooks';

export interface BlankLayoutProps extends BoxProps {
  children: ReactNode;
}

export const WindowSizeContext = createContext({ width: 0, height: 0 });

const Layout: FC<BlankLayoutProps> = ({ children, ...rest }) => {
  const windowSize = useWindowSize({});

  return (
    <WindowSizeContext.Provider value={windowSize}>
      <Box minH="calc(100vh)" h="full" {...rest}>
        {children}
      </Box>
    </WindowSizeContext.Provider>
  );
};

export default Layout;
