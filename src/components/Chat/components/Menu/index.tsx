import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon
} from '@chakra-ui/react';
import { MdKeyboardArrowDown } from 'react-icons/md';

export default function ChatMenu() {
  const menuList = [
    { label: '全部', value: 'all' },
    { label: '未讀', value: 'unread' },
    { label: '標記', value: 'mark' }
  ];

  return (
    <Menu arrowPadding={0}>
      <MenuButton
        variant="unstyled"
        fontSize={{ base: 'xs' }}
        as={Button}
        display="inline-flex"
        alignItems="center"
        rightIcon={<Icon as={MdKeyboardArrowDown} boxSize={4} />}
      >
        全部
      </MenuButton>
      <MenuList>
        {menuList.map((item) => (
          <MenuItem fontSize={{ base: 'xs' }} key={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
