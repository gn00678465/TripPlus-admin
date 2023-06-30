import { Avatar, Box, Text, Flex, BoxProps } from '@chakra-ui/react';

interface ChatItemProps extends BoxProps {
  name: string;
  content: string;
  photo?: string;
}

export function ChatItem({ name, content, photo, ...rest }: ChatItemProps) {
  return (
    <Box
      py={3}
      cursor="pointer"
      transition="color 0.3s ease-in-out"
      _hover={{
        bg: 'gray.100'
      }}
      {...rest}
    >
      <Flex
        columnGap={2}
        justifyContent="flex-start"
        alignItems="center"
        w="full"
      >
        <div className="h-10 w-10 shrink-0">
          <Avatar size="full" src={photo}></Avatar>
        </div>
        <Box
          className="space-y-1"
          flexShrink={1}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          <Text fontSize="sm" color="gray.400">
            {name}
          </Text>
          <Text
            fontSize="xs"
            color="gray.500"
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
          >
            {content}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
