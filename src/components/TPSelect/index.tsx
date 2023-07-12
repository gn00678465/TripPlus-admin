import { FC, memo } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { MdArrowDropDown } from 'react-icons/md';

export interface TPSelectOption {
  value: string | number;
  label: string;
}

export interface TPSelectProps extends Omit<SelectProps, 'icon'> {
  options: TPSelectOption[];
}

const MemoSelect = memo(Select);

export const TPSelect: FC<TPSelectProps> = ({ options, ...rest }) => {
  return (
    <MemoSelect icon={<MdArrowDropDown />} {...rest}>
      {options.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </MemoSelect>
  );
};
