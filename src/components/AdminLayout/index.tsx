import { FC, ReactNode } from 'react';
import { Box } from '@chakra-ui/react';
import { Sidebar } from './components';
import { useUserData } from '@/hooks';

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  const { name, photo } = useUserData();
  return (
    <Box minH="100vh">
      <Sidebar
        pos={{ base: 'relative', md: 'fixed' }}
        w={{ base: 'full', md: 'auto' }}
        name={name}
        photo={photo}
      ></Sidebar>
      <Box h="full" ml={{ base: 0, md: 398 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
