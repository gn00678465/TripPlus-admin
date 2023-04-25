import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <header>nav</header>
      <main>{children}</main>
      <footer>footer</footer>
    </>
  );
};

export default Layout;
