import { Button, ButtonProps } from '@chakra-ui/react';

interface SidebarButtonProps extends ButtonProps {}

export default function SidebarButton({
  children,
  ...rest
}: SidebarButtonProps) {
  return (
    <Button
      h="auto"
      fontSize={{ base: 'sm', sm: '16px' }}
      fontWeight={{ base: 500 }}
      py={{ base: 3, sm: 5 }}
      px={{ base: '22px', sm: 5 }}
      display={{ base: 'flex' }}
      alignItems="center"
      justifyContent={{ base: 'center', sm: 'start' }}
      flexDirection={{ base: 'column', sm: 'row' }}
      borderRadius={{ base: 4 }}
      backgroundColor="white"
      color="gray-500"
      _hover={{ color: '#008E86', backgroundColor: 'secondary' }}
      _active={{
        color: '#008E86',
        backgroundColor: 'secondary'
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
