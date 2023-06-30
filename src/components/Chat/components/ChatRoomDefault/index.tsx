import { Box, Text, Icon, BoxProps } from '@chakra-ui/react';
import { TbMessages } from 'react-icons/tb';

export interface ChatRoomDefaultProps extends BoxProps {}

export const ChatRoomDefault = ({ ...rest }: ChatRoomDefaultProps) => {
  return (
    <Box
      flexGrow={1}
      p={6}
      textAlign={'center'}
      justifyContent={'center'}
      alignItems={'center'}
      className="hidden md:flex"
      {...rest}
    >
      <Box>
        <Icon as={TbMessages} fontSize={'260px'} color={'primary.500'} mb={6} />
        <Box fontWeight={500} fontSize={'3xl'} mb={4}>
          歡迎來到訊息中心
        </Box>
        <Text color={'gray.500'}>請從右邊列表選擇想要談話的對象</Text>
      </Box>
    </Box>
  );
};
