import { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return <Box h="calc(100vh)">{children}</Box>;
};

export default Layout;
