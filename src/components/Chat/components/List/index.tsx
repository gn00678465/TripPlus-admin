import {
  Flex,
  Input,
  InputLeftElement,
  Icon,
  InputGroup
} from '@chakra-ui/react';
import { ChatItem } from './components';
import { MdOutlineSearch } from 'react-icons/md';
import styles from './styles.module.css';

export function ChatList() {
  return (
    <Flex
      px={3}
      py={4}
      flexDirection="column"
      overflowY="auto"
      borderLeftWidth="1px"
      borderLeftStyle="solid"
      borderLeftColor="gray.100"
    >
      <Flex>
        <InputGroup>
          <InputLeftElement pl={{ base: 5, lg: 3 }}>
            <Icon boxSize={5} color="gray.900" as={MdOutlineSearch} />
          </InputLeftElement>
          <Input
            mb={1}
            height="36px"
            variant="filled"
            placeholder="搜尋關鍵字"
            bg="gray.100"
          />
        </InputGroup>
      </Flex>
      <ul className={styles['chat-list']}>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
        <li>
          <ChatItem></ChatItem>
        </li>
      </ul>
    </Flex>
  );
}
