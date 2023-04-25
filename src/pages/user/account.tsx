import { Layout } from '@/components';
import type { ReactElement } from 'react';

const Account: App.NextPageWithLayout = () => {
  return <h2>Account</h2>;
};

export default Account;

Account.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>;
};
