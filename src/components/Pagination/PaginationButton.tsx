import { useMemo } from 'react';
import { IconButton, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { PaginationItemCommonProps } from './types';

interface PaginationButtonProps extends PaginationItemCommonProps {
  isDisabled?: boolean;
  title?: string;
  ariaLabel: string;
  icon: IconType;
  onPageChange: () => void;
}

export default function PaginationButton({
  isDisabled = false,
  size = 'md',
  variant,
  colorScheme,
  shape,
  title,
  ariaLabel,
  icon,
  onPageChange
}: PaginationButtonProps) {
  const pseudoClass = useMemo(
    () => ({
      _hover:
        variant === 'ghost'
          ? { bg: `${colorScheme}.500`, color: 'white' }
          : undefined,
      _active:
        variant === 'ghost'
          ? { bg: `${colorScheme}.500`, color: 'white' }
          : undefined,
      _disabled:
        variant === 'ghost'
          ? {
              bg: 'transparent',
              cursor: 'not-allowed',
              color: `${colorScheme}.500`,
              opacity: 0.6
            }
          : undefined
    }),
    [colorScheme, variant]
  );
  return (
    <IconButton
      isDisabled={isDisabled}
      size={size}
      variant={variant}
      colorScheme={colorScheme}
      aria-label={ariaLabel}
      title={title}
      borderRadius={shape === 'circle' ? '50%' : undefined}
      width={4}
      {...pseudoClass}
      icon={<Icon as={icon} />}
      onClick={onPageChange}
    ></IconButton>
  );
}
