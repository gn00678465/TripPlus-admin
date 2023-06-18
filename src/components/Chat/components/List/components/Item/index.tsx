import { Avatar, Box, Text, Flex, BoxProps } from '@chakra-ui/react';

interface ChatItemProps extends BoxProps {}

export function ChatItem(props: ChatItemProps) {
  return (
    <Box
      py={3}
      cursor="pointer"
      transition="color 0.3s ease-in-out"
      _hover={{
        bg: 'gray.100'
      }}
      {...props}
    >
      <Flex
        columnGap={2}
        justifyContent="flex-start"
        alignItems="center"
        w="full"
      >
        <div className="h-10 w-10 shrink-0">
          <Avatar size="full"></Avatar>
        </div>
        <Box
          className="space-y-1"
          flexShrink={1}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          <Text fontSize="sm" color="gray.400">
            abc123456
          </Text>
          <Text
            fontSize="xs"
            color="gray.500"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            您好，我想請問一下這個活動的偏鄉地區是在哪邊呢？
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
