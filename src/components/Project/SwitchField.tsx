import { Skeleton, Text } from '@chakra-ui/react';

export interface SwitchFieldProps {
  children: JSX.Element;
  content?: string | JSX.Element | (() => JSX.Element);
  isEdit?: boolean;
  isLoading?: boolean;
}

export const SwitchField = ({
  children,
  content = '未設定',
  isEdit = false,
  isLoading = false
}: SwitchFieldProps) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      {isEdit ? (
        children
      ) : typeof content === 'string' ? (
        <Text
          w="full"
          visibility={content ? 'visible' : 'hidden'}
          pl={0}
          fontSize="md"
          lineHeight="32px"
          wordBreak="break-all"
        >
          {content}
        </Text>
      ) : typeof content === 'function' ? (
        content()
      ) : (
        content
      )}
    </Skeleton>
  );
};
