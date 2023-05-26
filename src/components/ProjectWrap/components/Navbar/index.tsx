import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Flex, Box, BoxProps, Text, Icon } from '@chakra-ui/react';
import { NavItem } from './components';
import { MdOutlineMenu } from 'react-icons/md';

interface NavbarProps extends BoxProps {}

const Navbar: FC<NavbarProps> = ({ ...rest }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const projectMenus = [
    {
      href: `/admin/${id}/settings`,
      label: '專案資料'
    },
    {
      href: `/admin/${id}/settings2`,
      label: '專案內文'
    },
    {
      href: `/admin/${id}/settings3`,
      label: '團隊資料'
    },
    {
      href: `/admin/${id}/settings4`,
      label: '回饋方案'
    },
    {
      href: `/admin/${id}/settings5`,
      label: '互動資訊'
    }
  ];

  return (
    <Box
      w="full"
      backgroundColor="white"
      px={{ base: 6 }}
      py={{ base: 0, sm: 3, md: 0, lg: 4 }}
      borderRadius={2}
      {...rest}
    >
      <Flex
        flexDirection={{ base: 'column', sm: 'row', md: 'column', lg: 'row' }}
        className="gap-x-0 sm:gap-x-5 md:gap-x-0 lg:gap-x-5"
        maxH={open ? '999px' : 10}
        overflowY={'hidden'}
        transition="max-height 0.15s ease-in-out"
      >
        <Flex
          display={{ base: 'flex', sm: 'none', md: 'flex', lg: 'none' }}
          py={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text>專案管理</Text>
          <Icon
            boxSize={{ base: 5, md: 6 }}
            as={MdOutlineMenu}
            cursor="pointer"
            onClick={() => {
              setOpen(!open);
            }}
          />
        </Flex>
        {projectMenus.map((item) => (
          <NavItem
            key={item.href}
            _href={item.href}
            py={{ base: 1.5, sm: 0, md: 1.5, lg: 0 }}
            isActive={item.href === router.asPath}
          >
            {item.label}
          </NavItem>
        ))}
      </Flex>
    </Box>
  );
};

export default Navbar;
