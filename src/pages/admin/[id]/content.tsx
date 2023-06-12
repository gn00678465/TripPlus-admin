import { ReactElement, useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AdminLayout, ProjectWrap, ImageFallback } from '@/components';
import {
  SettingsBlock,
  FormItem,
  SwitchField,
  TPListItem
} from '@/components/Project';
import useSwr from 'swr';
import useSWRMutation from 'swr/mutation';

export default function ProjectContent() {
  return <div>fdsffsdf</div>;
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
