import { ButtonProps } from '@chakra-ui/react';

export interface PaginationItemCommonProps {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  colorScheme?: ButtonProps['colorScheme'];
  shape?: 'square' | 'circle';
}
