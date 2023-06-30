import { RefObject } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface ScrollbarBoxProps extends BoxProps {
  innerRef?: RefObject<HTMLDivElement>;
}

const ScrollbarBox = ({
  height,
  children,
  innerRef,
  ...rest
}: ScrollbarBoxProps) => {
  return (
    <Box
      ref={innerRef}
      height={height}
      overflowX="hidden"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '12px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#EAF8F8',
          width: '12px'
        },
        '&::-webkit-scrollbar-thumb': {
          WebkitBorderRadius: '8px',
          borderRadius: '8px',
          border: '4px solid transparent',
          background: 'white',
          backgroundClip: 'content-box'
        }
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default ScrollbarBox;
