import { ReactElement } from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { AdminLayout } from '@/components';

const ProjectDashboard = () => {
  return (
    <>
      <Heading>Header</Heading>
      <Flex>Dashboard</Flex>
    </>
  );
};

export default ProjectDashboard;

ProjectDashboard.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Box
        h="full"
        backgroundColor="gray.100"
        px={{ base: 12, xl: 20 }}
        pt={{ base: 10, xl: 20 }}
        fontSize={{ base: 'sm', md: 'md' }}
      >
        {page}
      </Box>
    </AdminLayout>
  );
};
