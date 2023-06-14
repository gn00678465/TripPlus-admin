import { ReactElement, useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { AdminLayout, ProjectWrap } from '@/components';
import { SettingsBlock } from '@/components/Project';
import { Center, Button } from '@chakra-ui/react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiFetchProjectInfoContent, apiPostProjectInfoContent } from '@/api';
import { swrFetch } from '@/utils';

const CKeditor = dynamic(() => import('@/components/Editor'), { ssr: false });
export default function ProjectContent() {
  const router = useRouter();
  const { id } = router.query;
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState<string>('');

  const { data, mutate } = useSWR(
    id ? `/admin/project/${id}/content` : null,
    () => swrFetch(apiFetchProjectInfoContent(id as string)),
    {
      onSuccess(data, key, config) {
        setContent(data.data.content);
      }
    }
  );

  const { trigger } = useSWRMutation(
    id ? `/admin/project/${id}/info/content` : null,
    (key, { arg }: { arg: string }) =>
      swrFetch(apiPostProjectInfoContent(id as string, { content: arg }))
  );

  async function handleSaveContent() {
    if (!content) {
      return;
    }
    await trigger(content, {
      onSuccess(data, key, config) {
        mutate();
        setEdit(false);
      }
    });
  }

  return (
    <>
      <SettingsBlock
        title="專案內文"
        renderButton={
          <Button
            size="sm"
            colorScheme="primary"
            variant="outline"
            display={{ base: edit ? 'none' : '' }}
            onClick={() => {
              setEdit(!edit);
            }}
          >
            編輯設定
          </Button>
        }
      >
        {!edit ? (
          data?.data.content
        ) : (
          <>
            <CKeditor
              value={content}
              name="content"
              editorLoaded={edit}
              onChange={(data) => {
                setContent(data);
              }}
            />
            <Center mt={5} columnGap={5}>
              <Button
                variant="outline"
                onClick={() => {
                  setEdit(false);
                }}
              >
                取消
              </Button>
              <Button colorScheme="primary" onClick={handleSaveContent}>
                儲存
              </Button>
            </Center>
          </>
        )}
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
