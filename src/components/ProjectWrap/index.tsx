import { FC, ReactNode } from 'react';
import { Box, Heading, BoxProps } from '@chakra-ui/react';
import { Navbar } from './components';

interface ProjectWrapProps extends Omit<BoxProps, 'children'> {
  children: ReactNode;
}

const ProjectWrap: FC<ProjectWrapProps> = ({ children, ...rest }) => {
  return (
    <Box
      px={{ base: 3, md: 10, lg: 20 }}
      pt={{ base: 10, lg: 20 }}
      pb={{ base: 3 }}
      {...rest}
    >
      <Heading as="h2" size="xl" mb={{ base: 5 }} noOfLines={1}>
        專案管理
      </Heading>
      <Navbar mb={{ base: 5 }}></Navbar>
      {children}
    </Box>
  );
};

export default ProjectWrap;
