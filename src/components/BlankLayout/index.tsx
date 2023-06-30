import { FC, ReactNode } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface LayoutProps extends BoxProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children, ...rest }) => {
  return (
    <Box h="calc(100vh)" {...rest}>
      {children}
    </Box>
  );
};

export default Layout;
