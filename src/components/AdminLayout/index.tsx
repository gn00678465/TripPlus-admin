import { FC, ReactNode, createContext } from 'react';
import { Box } from '@chakra-ui/react';
import { Sidebar } from './components';
import { useUserData } from '@/hooks';
import { BlankLayout } from '..';

interface LayoutProps {
  children: ReactNode;
}

export const AdminContext = createContext<{
  name?: string;
  photo?: string;
  id?: string;
}>({});

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  const { name, photo, id } = useUserData();
  return (
    <BlankLayout>
      <AdminContext.Provider value={{ name, photo, id }}>
        <Sidebar
          pos={{ base: 'relative', md: 'fixed' }}
          w={{ base: 'full', md: 'auto' }}
          name={name}
          photo={photo}
        ></Sidebar>
        <Box h="full" ml={{ base: 0, md: 398 }}>
          {children}
        </Box>
      </AdminContext.Provider>
    </BlankLayout>
  );
};

export default AdminLayout;
