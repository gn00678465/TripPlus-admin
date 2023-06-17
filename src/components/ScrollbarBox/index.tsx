import { Box, BoxProps } from '@chakra-ui/react';

interface ScrollbarBoxProps extends BoxProps {}

const ScrollbarBox = ({ height, children }: ScrollbarBoxProps) => {
  return (
    <Box
      height={height}
      overflowX="hidden"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '12px'
        },
        '&::-webkit-scrollbar-track': {
          'background-color': '#EAF8F8',
          width: '12px'
        },
        '&::-webkit-scrollbar-thumb': {
          '-webkit-border-radius': '8px',
          'border-radius': '8px',
          border: '4px solid transparent',
          background: 'white',
          'background-clip': 'content-box'
        }
      }}
    >
      {children}
    </Box>
  );
};

export default ScrollbarBox;
