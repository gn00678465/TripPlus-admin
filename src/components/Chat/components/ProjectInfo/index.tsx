import { Text, Flex, Box } from '@chakra-ui/react';
import { ImageFallback } from '@/components';
import NoImage from '@/assets/images/no-image.png';

export interface ProjectInfoProps {
  title: string;
  photo: string;
}

export const ProjectInfo = ({ title, photo }: ProjectInfoProps) => {
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
      mx={4}
      mt={3}
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
          src={photo}
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
      <Text fontSize="sm">{title}</Text>
    </Flex>
  );
};
