import {
  Text,
  Textarea,
  Icon,
  Flex,
  Box,
  BoxProps,
  Spinner
} from '@chakra-ui/react';
import { BsSend } from 'react-icons/bs';
import { CiImageOn } from 'react-icons/ci';
import { SlControlStart, SlEmotsmile, SlSocialYoutube } from 'react-icons/sl';
import { ScrollbarBox } from '@/components';
import { useEffect, useState, useRef, RefObject, useMemo } from 'react';
import { apiFetchMessage } from '@/api';
import useSWR from 'swr';
import { swrFetch, utc2Local } from '@/utils';
import { Socket, ServerToClientEvents, ClientToServerEvents } from '@/config';
import { useContext } from 'react';
import { AdminContext } from '@/components';
import { debounce } from 'lodash-es';
import dayjs from 'dayjs';

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

export interface ChatRoomProps extends BoxProps {
  name?: string;
  roomId?: string;
  sender?: string;
  receiver?: string;
  socket?: Socket<ServerToClientEvents, ClientToServerEvents>;
  renderProjectInfo: JSX.Element;
}

interface Message {
  content: string;
  receiver: string;
  roomId: string;
  sender: string;
  date?: string;
}

function handleMessage(data: ApiMessages.Message): Message {
  return {
    content: data.content,
    receiver: data.receiver._id,
    roomId: data.roomId._id,
    sender: data.sender._id,
    date: data.createdAt
  };
}

function useMessagesList(roomId: string, page: number) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStop, setIsStop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data } = useSWR(
    roomId ? `/admin/${roomId}/messages?page=${page}` : null,
    () => swrFetch(swrFetch(apiFetchMessage(roomId as string, page, 10))),
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        if (data.data.length < 10) {
          setIsStop(true);
        }
        setMessages((prev) =>
          data.data.reverse().map(handleMessage).concat(prev)
        );
        setIsLoading(false);
      },
      onError(err, key, config) {
        setIsLoading(false);
      }
    }
  );

  return {
    messages: useMemo(() => messages, [messages]),
    isLoading,
    setMessages,
    isStop,
    setIsLoading
  };
}

function groupMessages(arr: Message[]) {
  let map: Map<string, Message[]> = new Map();
  let currentDate: string | undefined = undefined;

  function compare(date: string) {
    return dayjs(date).isAfter(
      dayjs(currentDate).startOf('date').add(1, 'day')
    );
  }

  arr.forEach((item) => {
    if (!currentDate) {
      currentDate = item.date;
      map.set(currentDate as string, [item]);
    }
    if (currentDate && !compare(item.date as string)) {
      map.get(currentDate)?.push(item);
    }
    if (currentDate && compare(item.date as string)) {
      currentDate = item.date;
      map.set(currentDate as string, [item]);
    }
  });

  return Array.from(map.entries());
}

export function ChatRoom({
  name,
  roomId,
  socket,
  sender,
  receiver,
  renderProjectInfo,
  ...rest
}: ChatRoomProps) {
  const context = useContext(AdminContext);
  const chatWindowRef: RefObject<HTMLDivElement> = useRef(null);
  const contentRef: RefObject<HTMLTextAreaElement> = useRef(null);
  const [page, setPage] = useState(1);
  const scrollHeight = useRef(0);
  const isScrollTop = useRef<boolean>(false);
  const scrollToBottom = useRef<boolean>(true);

  const { messages, setMessages, isLoading, isStop, setIsLoading } =
    useMessagesList(roomId as string, page);

  useEffect(() => {
    if (socket && roomId) {
      socket.emit('joinRoom', roomId);
      socket.on('message', (data) => {
        setMessages((prev) => prev.concat([data]));
        scrollToBottom.current = true;
      });
    }

    return () => {
      if (socket && roomId) {
        socket?.emit('leaveRoom', roomId);
        socket.off('message');
      }
    };
  }, [roomId, socket]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;

    const debounceScroll = debounce(function () {
      if (chatWindow && chatWindow.scrollTop <= 30) {
        isScrollTop.current = true;
        if (!isStop) {
          setIsLoading(true);
          setPage((prev) => prev + 1);
        }
      }
    }, 200);

    if (chatWindow) {
      chatWindow.addEventListener('scroll', debounceScroll);
    }

    if (chatWindow && (page === 1 || scrollToBottom.current)) {
      chatWindow.scrollTop = scrollHeight.current = chatWindow.scrollHeight;
      scrollToBottom.current = false;
    }

    if (chatWindow && isScrollTop.current) {
      const scrollTop = chatWindow.scrollHeight - scrollHeight.current;
      chatWindow.scrollTop = scrollHeight.current = scrollTop;
      isScrollTop.current = false;
    }

    return () => {
      if (chatWindow) {
        chatWindow.removeEventListener('scroll', debounceScroll);
      }
    };
  }, [messages]);

  function sendMessage() {
    const content = contentRef.current?.value;
    if (!content || !receiver || !sender || !roomId) return;
    socket?.emit('message', { content, receiver, sender, roomId });
    contentRef.current.value = '';
  }

  return (
    <Box bg="gray.100" {...rest}>
      <Text py={2} pl={4} fontSize="xs" color="gray.400" bg="white">
        {name}
      </Text>
      <ScrollbarBox
        position="relative"
        height={{
          base: 'calc(100vh - 125px - 34px - 40px)',
          lg: 'calc(546px - 125px - 34px)'
        }}
        innerRef={chatWindowRef}
      >
        {isLoading ? (
          <Spinner
            position="absolute"
            top="50%"
            left="50%"
            size="lg"
            transform="translate(-50%, -50%)"
            color="primary.500"
          />
        ) : (
          <>
            {renderProjectInfo}
            {groupMessages(messages).map(([key, value]) => {
              return (
                <div key={key}>
                  <Text
                    fontSize="xs"
                    color="gray.400"
                    textAlign="center"
                    pt={4}
                    pb={2}
                  >
                    {utc2Local(key).format('YYYY.MM.DD HH:mm')}
                  </Text>
                  <Box px={4} py={2} className="space-y-6">
                    {value.map((msg, index) => {
                      if (msg.sender === sender) {
                        return (
                          <Receiver key={key + index} text={msg.content} />
                        );
                      }
                      return <Sender key={key + index} text={msg.content} />;
                    })}
                  </Box>
                </div>
              );
            })}
          </>
        )}
      </ScrollbarBox>
      <Box className="border-t-[1px] border-t-gray-200" py={3} px={4}>
        <Textarea
          placeholder="輸入文字..."
          resize={'none'}
          outline={'none'}
          border={0}
          fontSize="sm"
          ref={contentRef}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
        />
        <Flex
          w="full"
          alignItems="center"
          justifyContent="flex-end"
          columnGap={3}
        >
          {/* <Icon
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
          /> */}
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
            onClick={sendMessage}
          />
        </Flex>
      </Box>
    </Box>
  );
}
