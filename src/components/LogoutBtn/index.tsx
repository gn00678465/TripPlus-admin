import { Button, ButtonProps } from '@chakra-ui/react';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface LogoutBtnProps extends ButtonProps {}

export function LogoutBtn({ ...rest }: LogoutBtnProps) {
  const router = useRouter();

  function handleLogout() {
    useAuthStore.persist.clearStorage();
    Cookies.remove('token');
    router.push('/');
  }

  return (
    <Button
      variant="link"
      color="primary.500"
      transition="color 0.15s ease-in-out"
      _hover={{
        textDecoration: 'none',
        color: 'secondary.500'
      }}
      onClick={handleLogout}
      {...rest}
    >
      登出後台
    </Button>
  );
}
