import { FC, ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Sidebar } from './components';

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box h="calc(100vh)">
      <Flex h="full" flexDirection={{ base: 'column', sm: 'row' }}>
        <Sidebar flexShrink={1}></Sidebar>
        <Box flexGrow={1}>{children}</Box>
      </Flex>
    </Box>
  );
};

export default AdminLayout;
