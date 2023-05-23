import { ReactElement } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Flex,
  Divider,
  Button,
  useToast
} from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { AdminLayout, Navbar } from '@/components';
import useSwr from 'swr';
import { apiFetchProjectInfo } from '@/api';
import { safeAwait } from '@/utils';
import { useForm, UseFormReturn } from 'react-hook-form';

interface SettingsBlockProps extends Omit<BoxProps, 'children'> {
  renderHeader?: JSX.Element;
  renderButton?: JSX.Element;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

const SettingsBlock = ({
  children,
  renderHeader,
  renderButton,
  ...rest
}: SettingsBlockProps) => {
  return (
    <Box backgroundColor="white" {...rest}>
      <Flex p={{ base: 2 }} justifyContent="space-between" alignItems="center">
        {renderHeader}
        {renderButton}
      </Flex>
      <Divider orientation="horizontal" />
      <Box p={{ base: 2 }}>1</Box>
      {children}
    </Box>
  );
};

const BasicSettings = ({
  isEdit,
  isLoading
}: {
  isEdit: boolean;
  isLoading: boolean;
}) => {
  const { register, handleSubmit } = useForm<Project.FormBasicSettings>({});

  return <Box as="form"></Box>;
};

const ProjectSettings = () => {
  const router = useRouter();
  const toast = useToast();

  const { id } = router.query;

  const { data, isLoading } = useSwr(
    id ? `/admin/project/${id}/info` : null,
    async () => {
      const [err, res] = await safeAwait(apiFetchProjectInfo(id as string));
      return new Promise((resolve, reject) => {
        if (res) {
          resolve(res);
        }
        if (err) {
          reject(err);
        }
      });
    },
    {
      onError(err, key, config) {
        toast({
          position: 'top',
          title: err.message,
          duration: 1500,
          status: 'error'
        });
        router.push('/admin/projects');
      }
    }
  );

  return (
    <>
      <Head>
        <title>專案管理</title>
      </Head>
      <Box px={{ base: 3, md: 20 }} pt={{ base: 10, lg: 20 }} pb={{ base: 3 }}>
        <Heading as="h2" size="xl" mb={{ base: 5, lg: 10 }} noOfLines={1}>
          專案管理
        </Heading>
        <Navbar></Navbar>
        <Flex
          w="full"
          flexDirection={{ base: 'column', lg: 'row' }}
          gap={{ base: 5 }}
        >
          <Flex w="full" flexDirection={{ base: 'column' }} gap={{ base: 5 }}>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  主視覺
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  編輯設定
                </Button>
              }
            ></SettingsBlock>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  專案預覽
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  更新預覽網址
                </Button>
              }
            ></SettingsBlock>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  專案資訊
                </Heading>
              }
            ></SettingsBlock>
          </Flex>
          <Flex w="full" flexDirection={{ base: 'column' }} gap={{ base: 5 }}>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  基本設定
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  編輯設定
                </Button>
              }
            ></SettingsBlock>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  付款設定
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  編輯設定
                </Button>
              }
            ></SettingsBlock>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default ProjectSettings;

ProjectSettings.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Box className="h-full bg-gray-200">{page}</Box>
    </AdminLayout>
  );
};
