import { extendTheme } from '@chakra-ui/react';
import tailwindConfig from '../../../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const tailwind = resolveConfig(tailwindConfig) as any;

// Extend the theme to include custom colors, fonts, etc
const colors = {
  black: '#000',
  white: '#fff',
  primary: tailwind.theme?.colors?.primary,
  secondary: tailwind.theme?.colors?.secondary,
  success: tailwind.theme?.colors?.success,
  light: tailwind.theme?.colors?.light,
  gray: tailwind.theme?.colors?.gray,
  info: tailwind.theme?.colors?.info,
  error: tailwind.theme?.colors?.error
};

export const theme = extendTheme({
  colors,
  breakpoints: tailwind.theme.screens
});
