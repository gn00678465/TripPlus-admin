import { FC, ReactNode } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Menu } from './components';

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <Flex minH="100vh" w="full">
      <Menu />
      <Box flexGrow={1} ml={{ base: 0, md: 60 }}>
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;
