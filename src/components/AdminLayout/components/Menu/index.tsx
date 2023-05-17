import { Flex, VStack, Button, Box } from '@chakra-ui/react';

const Menu = () => {
  return (
    <Box pos="fixed" h="full" display={{ base: 'block' }}>
      <div className="flex h-full flex-col">
        <div>Logo</div>
        <Flex flexDirection={{ base: 'row', md: 'column' }}>
          <Button>返回專案列表</Button>
          <Button>返回專案列表</Button>
          <Button>返回專案列表</Button>
        </Flex>
        <Button className="mt-auto">返回專案列表</Button>
      </div>
    </Box>
  );
};

export default Menu;
