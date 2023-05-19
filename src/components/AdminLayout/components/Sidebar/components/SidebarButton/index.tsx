import NextLink from 'next/link';
import { Link, LinkProps, Icon, Flex } from '@chakra-ui/react';
import { IconType } from 'react-icons';
export interface SidebarButtonProps extends LinkProps {
  _href: string;
  icon: IconType;
  isActive: boolean;
}

export default function SidebarButton({
  _href,
  children,
  icon,
  isActive,
  ...rest
}: SidebarButtonProps) {
  return (
    <Link
      as={NextLink}
      href={_href}
      aria-current={isActive ? 'page' : undefined}
      h="auto"
      fontSize={{ base: 'sm', sm: '16px' }}
      fontWeight={{ base: 500 }}
      py={{ base: 3, sm: 5 }}
      px={{ base: '22px', sm: 5 }}
      borderRadius={{ base: 4 }}
      backgroundColor="white"
      color="gray-500"
      _hover={{ color: '#008E86', backgroundColor: 'secondary' }}
      _active={{
        color: '#008E86',
        backgroundColor: 'secondary'
      }}
      _activeLink={{
        color: '#008E86',
        backgroundColor: 'secondary'
      }}
    >
      <Flex
        alignItems="center"
        justifyContent={{ base: 'center', sm: 'start' }}
        flexDirection={{ base: 'column', sm: 'row' }}
        className="gap-y-3 sm:gap-x-2 sm:gap-y-0"
      >
        <Icon as={icon} />
        {children}
      </Flex>
    </Link>
  );
}
