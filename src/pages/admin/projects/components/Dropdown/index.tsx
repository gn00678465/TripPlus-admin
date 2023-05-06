import { ReactElement } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { features } from 'process';

export interface DropdownOptions {
  key: string;
  label: string;
  onClick: () => void;
}
interface DropdownProps {
  children: string;
  options: Partial<DropdownOptions>[];
  icon: ReactElement;
}

const Dropdown = ({ children, options, icon }: DropdownProps) => {
  return (
    <Menu>
      <MenuButton as={Button} variant="text" rightIcon={icon}>
        {children}
      </MenuButton>
      <MenuList>
        {options.map((option) => (
          <MenuItem onClick={option.onClick} key={option.key}>
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default Dropdown;
