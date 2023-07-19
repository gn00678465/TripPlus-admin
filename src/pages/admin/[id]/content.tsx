import { ReactElement, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AdminLayout, ProjectWrap } from '@/components';
import { SettingsBlock } from '@/components/Project';
import {
  Center,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import useSWR, { preload } from 'swr';
import { apiFetchProjectInfoContent, apiPostProjectInfoContent } from '@/api';
import { swrFetch, safeAwait } from '@/utils';
import { useLatest } from '@/hooks';

const CKeditor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function ProjectContent() {
  const { id } = useRouter().query;

  const fetcher = async () => {
    const res = await swrFetch(apiFetchProjectInfoContent(id as string));
    return res.data;
  };

  // preload('/api/movies', fetcher);

  const [content, setContent] = useState<string>('');

  const { data, mutate, isLoading, isValidating } = useSWR(
    id ? `/admin/project/${id}/content` : null,
    fetcher,
    {
      onSuccess(data, key, config) {
        setContent(data.content);
      }
    }
  );

  const latestContent = useLatest(content);

  async function handleContentUpdate() {
    if (content) {
      mutate(
        async () => {
          const [err, data] = await safeAwait(
            apiPostProjectInfoContent(id as string, {
              content
            })
          );
          if (data) {
            return data.data;
          }
        },
        { revalidate: true }
      );
    }
  }

  return (
    <>
      <SettingsBlock title="專案內文">
        <Tabs variant="enclosed">
          <TabList>
            <Tab>編輯</Tab>
            <Tab>預覽</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <CKeditor
                value={content}
                name="content"
                editorLoaded={true}
                onChange={(data) => {
                  setContent(data);
                }}
              />
              <Center mt={5} columnGap={5}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setContent(data?.content || '');
                  }}
                >
                  重置
                </Button>
                <Button
                  colorScheme="primary"
                  isLoading={!isLoading && isValidating}
                  onClick={handleContentUpdate}
                >
                  儲存
                </Button>
              </Center>
            </TabPanel>
            <TabPanel>
              <div
                className="ck-content h-[500px] overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: latestContent.current
                }}
              ></div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SettingsBlock>
    </>
  );
}

ProjectContent.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>專案管理-專案內文-TripPlus+</title>
      </Head>
      <ProjectWrap
        minH="calc(100vh)"
        backgroundColor="gray.100"
        px={{ base: 3, xl: 20 }}
        pt={{ base: 10, xl: 20 }}
        fontSize={{ base: 'sm', md: 'md' }}
      >
        {page}
      </ProjectWrap>
    </AdminLayout>
  );
};
