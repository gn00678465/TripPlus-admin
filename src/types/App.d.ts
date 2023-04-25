declare namespace App {
  type NextPageWithLayout<P = {}, IP = P> = import('next').NextPage<P, IP> & {
    getLayout?: (
      page: import('react').ReactElement
    ) => import('react').ReactNode;
  };
}
