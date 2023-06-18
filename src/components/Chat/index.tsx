import { useDisclosure, Icon, useMediaQuery } from '@chakra-ui/react';
import { MdKeyboardArrowDown, MdKeyboardArrowLeft } from 'react-icons/md';
import { ChatRoom, ChatList } from './components';
import { ScrollbarBox } from '@/components';
import styles from './styles.module.css';
import { useEffect } from 'react';

export default function Chat() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerMd] = useMediaQuery('(min-width: 768px)');

  const {
    isOpen: sliderIsOpen,
    onOpen: onSlideOpen,
    onClose: onSliderClose
  } = useDisclosure();

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
        <div
          className={`right-5 top-[-9px] select-none rounded-full bg-error p-1 text-xs 2xl:right-4 ${
            isOpen ? 'hidden' : 'absolute'
          }`}
        >
          12
        </div>
        <div
          className={`${
            isOpen ? 'inline-block' : 'hidden'
          } ml-2 select-none rounded-full bg-white p-1 text-xs text-primary`}
        >
          12
        </div>
        <Icon
          display={isOpen ? 'inline-block' : 'none'}
          ml="auto"
          as={MdKeyboardArrowDown}
          boxSize={6}
          onClick={(e) => {
            e.stopPropagation();
            onSliderClose();
            onClose();
          }}
        ></Icon>
      </div>
      <div className={styles['chat-content']}>
        <div className="hidden w-full md:flex">
          <ChatRoom w={{ base: 'full', md: '400px' }} flexShrink={0} />
          <ScrollbarBox
            height={{ base: 'full', md: 546 }}
            w={{ base: 'full', md: 'auto' }}
          >
            <ChatList></ChatList>
          </ScrollbarBox>
        </div>
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
            <ChatList onClick={onSlideOpen}></ChatList>
          </ScrollbarBox>
          <ChatRoom w={{ base: 'full' }} flexShrink={0} />
        </div>
      </div>
    </div>
  );
}
