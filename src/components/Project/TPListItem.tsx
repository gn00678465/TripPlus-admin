import { Skeleton, ListItem, Text, ListItemProps } from '@chakra-ui/react';

export interface TPListItemProps extends ListItemProps {
  label: string;
  children?: JSX.Element | string | number;
  isLoading?: boolean;
}

export const TPListItem = ({ label, children, isLoading }: TPListItemProps) => {
  return (
    <ListItem py={1}>
      <div className="block w-full items-baseline sm:flex md:block 2xl:flex">
        <Text
          flexShrink={0}
          w={{
            base: 'auto',
            xs: '125px',
            md: 'auto',
            '2xl': '130px'
          }}
          mb={{ base: 2, '2xl': 0 }}
        >
          {label}
        </Text>
        <Skeleton flexGrow={1} isLoaded={!isLoading}>
          <Text wordBreak="break-all">{children}</Text>
        </Skeleton>
      </div>
    </ListItem>
  );
};
