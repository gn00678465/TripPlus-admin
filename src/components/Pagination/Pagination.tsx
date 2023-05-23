import { Stack, Text, StackProps } from '@chakra-ui/react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight
} from 'react-icons/md';
import { PaginationItem, PaginationButton } from '.';
import { PaginationItemCommonProps } from './types';

interface PaginationProps extends PaginationItemCommonProps, StackProps {
  page: number;
  pageCount: number;
  siblingsCount?: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
}

function generatePagesArray(from: number, to: number): number[] {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0);
}

export default function Pagination({
  page = 1,
  pageCount = 1,
  siblingsCount = 1,
  isDisabled = false,
  size = 'md',
  colorScheme = 'primary',
  variant = 'solid',
  shape = 'square',
  onPageChange,
  onPrevPage,
  onNextPage
}: Partial<PaginationProps>) {
  const previousPages =
    page > 1 ? generatePagesArray(page - 1 - siblingsCount, page - 1) : [];

  const nextPages =
    page < pageCount
      ? generatePagesArray(page, Math.min(page + siblingsCount, pageCount))
      : [];

  return (
    <Stack direction="row" align="center" spacing="1">
      <PaginationButton
        isDisabled={isDisabled || page === 1}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        ariaLabel="first page"
        title="第一頁"
        shape={shape}
        icon={MdKeyboardDoubleArrowLeft}
        onPageChange={() => {
          onPageChange?.(1);
        }}
      />
      <PaginationButton
        isDisabled={isDisabled || page === 1}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        ariaLabel="prev page"
        title="前一頁"
        shape={shape}
        icon={MdKeyboardArrowLeft}
        onPageChange={() => {
          onPrevPage?.();
        }}
      />
      <Stack direction="row" spacing="1">
        {page > 1 + siblingsCount ? (
          <>
            <PaginationItem
              page={1}
              size={size}
              variant={variant}
              shape={shape}
              colorScheme={colorScheme}
              onPageChange={(p) => onPageChange?.(1)}
            />
            {page > 2 + siblingsCount ? (
              <Text color="gray.300" w="8" textAlign="center">
                ...
              </Text>
            ) : null}
          </>
        ) : null}
        {previousPages.length > 0
          ? previousPages.map((p) => (
              <PaginationItem
                key={p}
                page={p}
                size={size}
                variant={variant}
                shape={shape}
                colorScheme={colorScheme}
                onPageChange={(p) => onPageChange?.(p)}
              />
            ))
          : null}

        <PaginationItem
          page={page}
          isCurrent
          size={size}
          variant={variant}
          shape={shape}
          colorScheme={colorScheme}
          onPageChange={() => onPageChange?.(page)}
        />

        {nextPages.length > 0
          ? nextPages.map((p) => (
              <PaginationItem
                key={p}
                page={p}
                size={size}
                variant={variant}
                shape={shape}
                colorScheme={colorScheme}
                onPageChange={(p) => onPageChange?.(p)}
              />
            ))
          : null}

        {page + siblingsCount < pageCount ? (
          <>
            {page + 1 + siblingsCount < pageCount ? (
              <Text color="gray.300" w="8" textAlign="center">
                ...
              </Text>
            ) : null}
            <PaginationItem
              page={pageCount}
              size={size}
              variant={variant}
              shape={shape}
              colorScheme={colorScheme}
              onPageChange={() => onPageChange?.(pageCount)}
            />
          </>
        ) : null}
      </Stack>
      <PaginationButton
        isDisabled={isDisabled || page === pageCount}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        ariaLabel="next page"
        title="下一頁"
        shape={shape}
        icon={MdKeyboardArrowRight}
        onPageChange={() => {
          onNextPage?.();
        }}
      />
      <PaginationButton
        isDisabled={isDisabled || page === pageCount}
        size={size}
        variant={variant}
        colorScheme={colorScheme}
        ariaLabel="last page"
        title="最後一頁"
        shape={shape}
        icon={MdKeyboardDoubleArrowRight}
        onPageChange={() => {
          onPageChange?.(pageCount);
        }}
      />
    </Stack>
  );
}
