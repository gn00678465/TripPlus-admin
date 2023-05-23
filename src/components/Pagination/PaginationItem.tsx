import { useMemo } from 'react';
import { Button } from '@chakra-ui/react';
import { PaginationItemCommonProps } from './types';

export interface PaginationItemProps extends PaginationItemCommonProps {
  isCurrent?: boolean;
  isDisabled?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export default function PaginationItem({
  isCurrent = false,
  isDisabled = false,
  page,
  onPageChange,
  variant,
  colorScheme,
  size = 'md',
  shape = 'square'
}: PaginationItemProps) {
  const pseudoClass = useMemo(
    () => ({
      _hover:
        variant === 'ghost'
          ? { bg: `${colorScheme}.500`, color: 'white' }
          : undefined,
      _active:
        variant === 'ghost'
          ? { bg: `${colorScheme}.500`, color: 'white' }
          : undefined
    }),
    [colorScheme, variant]
  );

  return (
    <Button
      size={size}
      fontSize="xs"
      fontWeight={isCurrent ? 600 : 400}
      aria-label={`${page} page`}
      isActive={isCurrent}
      isDisabled={isDisabled}
      variant={variant}
      colorScheme={colorScheme}
      borderRadius={shape === 'circle' ? '50%' : undefined}
      width={4}
      {...pseudoClass}
      onClick={() => onPageChange(page)}
    >
      {page}
    </Button>
  );
}
