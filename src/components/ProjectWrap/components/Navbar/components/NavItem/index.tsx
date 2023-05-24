import NextLink from 'next/link';
import { Link, LinkProps } from '@chakra-ui/react';

export interface NavItemProps extends LinkProps {
  _href: string;
  isActive?: boolean;
}

export default function NavItem({
  _href,
  children,
  isActive,
  ...rest
}: NavItemProps) {
  return (
    <Link
      as={NextLink}
      href={_href}
      pos="relative"
      aria-current={isActive ? 'page' : undefined}
      fontSize={{ base: 'sm', sm: '16px' }}
      fontWeight={{ base: 500 }}
      color="gray-500"
      _hover={{ color: 'secondary.500' }}
      _activeLink={{
        color: 'secondary.500',
        _after: {
          base: 'none',
          lg: {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '4px',
            backgroundColor: 'secondary.500',
            left: 0,
            bottom: '-16px'
          }
        }
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
