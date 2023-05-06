import { Button, IconButton, Icon, ButtonProps } from '@chakra-ui/react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';

type PaginationProps = {
  page: number;
  pageCount: number;
  isDisabled: boolean;
  size: ButtonProps['size'];
  colorScheme: ButtonProps['colorScheme'];
  variant: ButtonProps['variant'];
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export default function Pagination({
  page = 1,
  pageCount = 1,
  isDisabled = false,
  size = 'md',
  colorScheme = 'primary',
  variant = 'solid',
  onPageChange,
  onPrevPage,
  onNextPage
}: Partial<PaginationProps>) {
  function makeArray(n: number) {
    return [...new Array(n)].map((num, key) => key + 1);
  }

  return (
    <div className="flex items-center gap-x-1.5">
      <IconButton
        isDisabled={isDisabled || page === 1}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        aria-label="first page"
        borderRadius="999em"
        icon={<Icon as={MdKeyboardDoubleArrowLeft} />}
        onClick={() => {
          onPageChange?.(1);
        }}
      ></IconButton>
      <IconButton
        isDisabled={isDisabled || page === 1}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        aria-label="prev page"
        borderRadius="999em"
        icon={<Icon as={MdKeyboardArrowLeft} />}
        onClick={onPrevPage}
      ></IconButton>
      {makeArray(pageCount).map((p) => (
        <Button
          key={p}
          isDisabled={isDisabled}
          size={size}
          variant={variant}
          colorScheme={colorScheme}
          isActive={page === p}
          borderRadius="50%"
          fontWeight={page === p ? 600 : 400}
          onClick={() => {
            onPageChange?.(p);
          }}
        >
          {p}
        </Button>
      ))}
      <IconButton
        isDisabled={isDisabled || page === pageCount}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        aria-label="next page"
        borderRadius="999em"
        icon={<Icon as={MdKeyboardArrowRight} />}
        onClick={onNextPage}
      ></IconButton>
      <IconButton
        isDisabled={isDisabled || page === pageCount}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        aria-label="last page"
        borderRadius="999em"
        icon={<Icon as={MdKeyboardDoubleArrowRight} />}
        onClick={() => {
          onPageChange?.(pageCount);
        }}
      ></IconButton>
    </div>
  );
}
