import { Skeleton, Text } from '@chakra-ui/react';

export interface SwitchFieldProps {
  children: JSX.Element;
  text?: string;
  isEdit?: boolean;
  isLoading?: boolean;
}

export const SwitchField = ({
  children,
  text = '未設定',
  isEdit = false,
  isLoading = false
}: SwitchFieldProps) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      {isEdit ? (
        children
      ) : (
        <Text
          w="full"
          visibility={text ? 'visible' : 'hidden'}
          pl={0}
          fontSize="md"
          lineHeight="32px"
        >
          {text}
        </Text>
      )}
    </Skeleton>
  );
};
