import { Text, Textarea, Icon, Flex, Box, BoxProps } from '@chakra-ui/react';
import { BsSend } from 'react-icons/bs';
import { CiImageOn } from 'react-icons/Ci';
import { SlEmotsmile, SlSocialYoutube } from 'react-icons/sl';
import { ImageFallback } from '@/components';
import NoImage from '@/assets/images/no-image.png';

const ProjectInfo = () => {
  return (
    <Flex
      justifyContent="flex-start"
      fontSize="sm"
      mr="44px"
      bg="white"
      borderRadius={8}
      color="gray.500"
      px={4}
      py={3}
      columnGap={3}
    >
      <Box
        w={84}
        height={84}
        borderRadius={8}
        overflow="hidden"
        position="relative"
        flexShrink={0}
      >
        <ImageFallback
          src="https://images.unsplash.com/photo-1603030908455-4a4588c0acdd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          fallbackSrc={NoImage.src}
          alt="專案圖片"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </Box>
      <Text fontSize="sm">
        台灣世界展望會「籃海計畫」|用籃球教育翻轉偏鄉孩子人生，追「球」夢想、站穩舞台！
      </Text>
    </Flex>
  );
};

const Sender = ({ text }: { text: string }) => {
  return (
    <Flex justifyContent="flex-start" fontSize="sm" pr="44px">
      <Box bg="white" borderRadius={8} color="gray.500" px={4} py={3}>
        {text}
      </Box>
    </Flex>
  );
};

const Receiver = ({ text }: { text: string }) => {
  return (
    <Flex justifyContent="flex-end" fontSize="sm" pl="44px">
      <Box bg="primary.500" borderRadius={8} color="white" px={4} py={3}>
        {text}
      </Box>
    </Flex>
  );
};

export interface ChatRoomProps extends BoxProps {}

export function ChatRoom(props: ChatRoomProps) {
  return (
    <Box bg="gray.100" {...props}>
      <Text py={2} pl={4} fontSize="xs" color="gray.400" bg="white">
        abc123456
      </Text>
      <Text fontSize="xs" color="gray.400" textAlign="center" pt={4} pb={2}>
        2021.03.18 00:45
      </Text>
      <ProjectInfo />
      <Box px={4} py={2} className="space-y-6">
        <Sender text="您好，我想請問一下這個活動的偏鄉地區是在哪邊呢？" />
        <Receiver text="主要是幫助東部偏鄉的小朋友，籌助資金，讓他們也能站上夢想的舞台！" />
        <Sender text="好的，謝謝！" />
      </Box>
      <Box className="border-t-[1px] border-t-gray-200" py={3} px={4}>
        <Textarea
          placeholder="輸入文字..."
          resize={'none'}
          outline={'none'}
          border={0}
        />
        <Flex w="full" alignItems="center" columnGap={3}>
          <Icon
            as={SlEmotsmile}
            color="gray.400"
            cursor="pointer"
            transition="color 0.3s ease-in-out"
            _hover={{
              color: 'gray.500'
            }}
            boxSize={{ base: 5 }}
          />
          <Icon
            as={SlSocialYoutube}
            color="gray.400"
            cursor="pointer"
            transition="color 0.3s ease-in-out"
            _hover={{
              color: 'gray.500'
            }}
            boxSize={{ base: 5 }}
          />
          <Icon
            as={CiImageOn}
            color="gray.400"
            cursor="pointer"
            transition="color 0.3s ease-in-out"
            _hover={{
              color: 'gray.500'
            }}
            boxSize={{ base: 5 }}
          />
          <Icon
            as={BsSend}
            ml="auto"
            color="gray.400"
            cursor="pointer"
            transition="color 0.3s ease-in-out"
            _hover={{
              color: 'gray.500'
            }}
            boxSize={{ base: 5 }}
          />
        </Flex>
      </Box>
    </Box>
  );
}
