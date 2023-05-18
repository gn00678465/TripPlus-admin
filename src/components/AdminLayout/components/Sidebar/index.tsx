import {
  Flex,
  Button,
  Box,
  BoxProps,
  Icon,
  useMediaQuery,
  Avatar,
  Text
} from '@chakra-ui/react';
import { SlGrid } from 'react-icons/sl';
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';
import { SidebarButton } from './components';
import Image from 'next/image';

interface SidebarProps extends BoxProps {}

const Sidebar = ({ ...rest }: SidebarProps) => {
  const [isLargerSM] = useMediaQuery('(min-width: 640px)');

  return (
    <Box
      h="full"
      display={{ base: 'block' }}
      px={{ base: 3, sm: 5 }}
      pt={{ base: 5, sm: 20 }}
      pb={{ base: 5, sm: 10 }}
      {...rest}
    >
      <Flex className="gap-y-5" h="full" flexDirection="column">
        <div className="flex justify-center sm:px-[115px]">
          <Image
            src="/images/logo.png"
            width={isLargerSM ? 172 : 129}
            height={isLargerSM ? 48 : 36}
            alt="TripPlus-Admin"
          ></Image>
        </div>
        <div className="my-5 flex flex-col items-center justify-center gap-y-3 sm:my-10">
          <Avatar
            size="2xl"
            className="outline outline-8 outline-offset-0 outline-secondary"
            name="王小明"
          ></Avatar>
          <Text
            fontWeight={{ base: 400 }}
            fontSize={{ base: 'sm', sm: '16px' }}
          >
            王小明
          </Text>
        </div>
        <Flex
          flexDirection={{ base: 'row', sm: 'column' }}
          justifyContent={{ base: 'space-between' }}
          className="sm:gap-y-2"
        >
          <SidebarButton
            fontWeight={{ base: 400 }}
            leftIcon={
              <Icon
                mb={{ base: 3, sm: 0 }}
                mr={{ base: 0, sm: 2 }}
                as={SlGrid}
              />
            }
          >
            Dashboard
          </SidebarButton>
          <SidebarButton
            leftIcon={
              <Icon
                mb={{ base: 3, sm: 0 }}
                mr={{ base: 0, sm: 2 }}
                as={FaRegEdit}
              />
            }
          >
            專案管理
          </SidebarButton>
          <SidebarButton
            leftIcon={
              <Icon
                mb={{ base: 3, sm: 0 }}
                mr={{ base: 0, sm: 2 }}
                as={AiOutlineFileText}
              />
            }
          >
            訂單管理
          </SidebarButton>
        </Flex>
        <Button
          h="auto"
          display={{ base: 'none', sm: 'block' }}
          variant="outline"
          colorScheme="primary"
          mt={{ base: 0, sm: 'auto' }}
          py={{ base: 3 }}
        >
          返回專案列表
        </Button>
      </Flex>
    </Box>
  );
};

export default Sidebar;
