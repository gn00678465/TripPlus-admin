import { useRouter } from 'next/router';
import { useDisclosure, Icon, useMediaQuery } from '@chakra-ui/react';
import { MdKeyboardArrowDown, MdKeyboardArrowLeft } from 'react-icons/md';
import { ChatRoom, ChatList, ChatRoomDefault, ProjectInfo } from './components';
import { ScrollbarBox } from '@/components';
import styles from './styles.module.css';
import { useEffect, useState, useRef, createContext } from 'react';
import {
  createSocket,
  Socket,
  ServerToClientEvents,
  ClientToServerEvents
} from '@/config';
import { apiFetchMessages } from '@/api';
import useSWR from 'swr';
import { swrFetch } from '@/utils';
import NoImage from '@/assets/images/no-image.png';

export default function Chat() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerMd] = useMediaQuery('(min-width: 768px)');
  const [chatRooms, setChatRooms] = useState<ApiMessages.ChatRoom[]>([]);
  const [currentChatRoom, setCurrentChatRoom] = useState<
    Messages.MessageSetting | undefined
  >(undefined);
  const socket = useRef<
    Socket<ServerToClientEvents, ClientToServerEvents> | undefined
  >(undefined);
  const [projectInfo, setProjectInfo] = useState({
    title: '',
    photo: NoImage.src
  });
  const [latestMessage, setLatesMessage] = useState<Record<string, string>>({});

  const {
    isOpen: sliderIsOpen,
    onOpen: onSlideOpen,
    onClose: onSliderClose
  } = useDisclosure();

  const router = useRouter();
  const { id } = router.query;

  useSWR(
    id ? `/admin/project/messages` : null,
    () => swrFetch(swrFetch(apiFetchMessages(id as string))),
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        setProjectInfo({
          title: data.data.project.title,
          photo: data.data.project.keyVision
        });
        setChatRooms(data.data.chatRooms);
      }
    }
  );

  useEffect(() => {
    socket.current = createSocket();
    socket?.current.on('connect', () => {});
    return () => {
      socket.current?.disconnect();
      socket.current?.on('disconnect', () => {});
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    if (isOpen && !isLargerMd) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, [isLargerMd, isOpen]);
  return (
    <div
      className={`${styles['chat-container']} ${isOpen ? styles.active : ''}`}
    >
      <div
        className={`
          relative w-full cursor-pointer select-none bg-primary px-4 py-2 text-base text-white 2xl:py-3
          ${
            isOpen
              ? 'flex items-center text-left md:rounded-t-lg'
              : 'rounded-t-lg text-center'
          }
        `}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      >
        {sliderIsOpen && (
          <Icon
            as={MdKeyboardArrowLeft}
            boxSize={6}
            onClick={(e) => {
              e.stopPropagation();
              onSliderClose();
            }}
          />
        )}
        <span className="tracking-[1px] text-white">聊聊</span>
        {/* <div
          className={`right-5 top-[-9px] select-none rounded-full bg-error p-1 text-xs 2xl:right-4 ${
            isOpen ? 'hidden' : 'absolute'
          }`}
        >
          12
        </div> */}
        {/* <div
          className={`${
            isOpen ? 'inline-block' : 'hidden'
          } ml-2 select-none rounded-full bg-white p-1 text-xs text-primary`}
        >
          12
        </div> */}
        <Icon
          display={isOpen ? 'inline-block' : 'none'}
          ml="auto"
          as={MdKeyboardArrowDown}
          boxSize={6}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentChatRoom(undefined);
            onSliderClose();
            onClose();
          }}
        ></Icon>
      </div>
      <div className={styles['chat-content']}>
        {isLargerMd ? (
          // desktop
          <div className="hidden w-full md:flex">
            {!currentChatRoom ? (
              <ChatRoomDefault
                w={{ base: 'full', md: '400px' }}
                flexShrink={0}
              />
            ) : (
              <ChatRoom
                w={{ base: 'full', md: '400px' }}
                flexShrink={0}
                name={currentChatRoom.name}
                socket={socket.current}
                roomId={currentChatRoom.roomId}
                sender={currentChatRoom.sender}
                receiver={currentChatRoom.receiver}
                renderProjectInfo={
                  <ProjectInfo
                    title={projectInfo.title}
                    photo={projectInfo.photo}
                  />
                }
                setLatestMessage={setLatesMessage}
              ></ChatRoom>
            )}
            <ScrollbarBox
              height={{ base: 'full', md: 546 }}
              w={{ base: 'full' }}
            >
              <ChatList
                chatRooms={chatRooms}
                latestMessage={latestMessage}
                onClick={(arg) => {
                  setCurrentChatRoom(arg);
                }}
              />
            </ScrollbarBox>
          </div>
        ) : (
          // mobile
          <div
            className={`
            flex w-full md:hidden
            ${styles['chat-content_mobile']}
            ${sliderIsOpen ? styles.slider : ''}
          `}
          >
            <ScrollbarBox
              height={{ base: '100vh' }}
              w={{ base: 'full' }}
              flexShrink={0}
            >
              <ChatList
                chatRooms={chatRooms}
                latestMessage={latestMessage}
                onClick={(arg) => {
                  setCurrentChatRoom(arg);
                  onSlideOpen();
                }}
              />
            </ScrollbarBox>
            <ChatRoom
              w={{ base: 'full' }}
              flexShrink={0}
              name={currentChatRoom?.name}
              socket={socket.current}
              roomId={currentChatRoom?.roomId}
              sender={currentChatRoom?.sender}
              receiver={currentChatRoom?.receiver}
              renderProjectInfo={
                <ProjectInfo
                  title={projectInfo.title}
                  photo={projectInfo.photo}
                />
              }
              setLatestMessage={setLatesMessage}
            ></ChatRoom>
          </div>
        )}
      </div>
    </div>
  );
}
