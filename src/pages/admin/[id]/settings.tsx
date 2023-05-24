import { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';
import { AdminLayout } from '@/components';

const ProjectInfo = () => {
  return <div>info</div>;
};

export default ProjectInfo;

ProjectInfo.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Box className="h-full bg-gray-200">{page}</Box>
    </AdminLayout>
  );
};
