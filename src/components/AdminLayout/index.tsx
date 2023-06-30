import { FC, ReactNode, createContext } from 'react';
import { Box } from '@chakra-ui/react';
import { Sidebar } from './components';
import { useUserData } from '@/hooks';

interface LayoutProps {
  children: ReactNode;
}

export const AdminContext = createContext<{
  name?: string;
  photo?: string;
  id?: string;
}>({} as any);

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  const { name, photo, id } = useUserData();
  return (
    <AdminContext.Provider value={{ name, photo, id }}>
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
    </AdminContext.Provider>
  );
};

export default AdminLayout;
