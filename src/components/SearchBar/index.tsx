import { useRef, ChangeEvent, FC, Dispatch, SetStateAction } from 'react';
import {
  InputGroup,
  InputRightElement,
  Input,
  Icon,
  InputProps,
  InputGroupProps
} from '@chakra-ui/react';
import { debounce } from 'lodash-es';
import { MdOutlineSearch } from 'react-icons/md';

interface SearchBarProps
  extends Omit<
    InputProps,
    'onChange' | 'onCompositionStart' | 'onCompositionEnd'
  > {
  className?: string;
  duration?: number;
  onChange?: Dispatch<SetStateAction<string>> | ((arg: string) => void);
  inputGroup?: InputGroupProps;
}

export const SearchBar: FC<SearchBarProps> = ({
  className,
  duration = 300,
  onChange,
  inputGroup,
  ...rest
}) => {
  const compositionLockRef = useRef<boolean>(false);

  function handleSetQuery(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target || compositionLockRef.current) return;
    onChange?.(e.target.value);
  }

  const debounceInput = debounce(handleSetQuery, duration);

  return (
    <InputGroup className={className} {...inputGroup}>
      <Input
        {...rest}
        onChange={debounceInput}
        onCompositionStart={(e) => {
          compositionLockRef.current = true;
        }}
        onCompositionEnd={(e) => {
          compositionLockRef.current = false;
          onChange?.(e.currentTarget.value);
        }}
      />
      <InputRightElement>
        <Icon as={MdOutlineSearch} />
      </InputRightElement>
    </InputGroup>
  );
};
