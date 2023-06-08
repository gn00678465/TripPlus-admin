import { Box, BoxProps, Flex, Heading } from '@chakra-ui/react';

export interface SettingsBlockProps extends Omit<BoxProps, 'children'> {
  title: string;
  renderButton?: JSX.Element;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

export const SettingsBlock = ({
  children,
  title,
  renderButton,
  ...rest
}: SettingsBlockProps) => {
  return (
    <Box
      className="rounded-lg"
      px={{ base: 3, md: 6 }}
      pt={{ base: 4, md: 6 }}
      pb={{ base: 6, md: 12 }}
      backgroundColor="white"
      {...rest}
    >
      <Flex
        mb={{ base: 6 }}
        h={8}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading as="h3" fontSize="2xl">
          {title}
        </Heading>
        {renderButton}
      </Flex>
      {children}
    </Box>
  );
};
