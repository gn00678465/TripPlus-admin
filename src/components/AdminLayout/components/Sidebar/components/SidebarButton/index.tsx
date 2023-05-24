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
      w={{ base: 28, md: 'auto' }}
      fontSize={{ base: 'sm', sm: '16px' }}
      fontWeight={{ base: 500 }}
      py={{ base: 3, md: 5 }}
      px={{ base: '22px', md: 5 }}
      borderRadius={{ base: 4 }}
      backgroundColor="white"
      color="gray-500"
      _hover={{ color: 'secondary.500', backgroundColor: 'secondary.300' }}
      _active={{
        color: 'secondary.500',
        backgroundColor: 'secondary.300'
      }}
      _activeLink={{
        color: 'secondary.500',
        backgroundColor: 'secondary.300'
      }}
    >
      <Flex
        alignItems="center"
        justifyContent={{ base: 'center', md: 'start' }}
        flexDirection={{ base: 'column', md: 'row' }}
        className="gap-y-3 md:gap-x-2 md:gap-y-0"
      >
        <Icon boxSize={{ base: 5, md: 6 }} as={icon} />
        {children}
      </Flex>
    </Link>
  );
}
