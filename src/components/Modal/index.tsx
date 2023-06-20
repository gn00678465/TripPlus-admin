import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';
import { ReactElement } from 'react';

interface ModalContainerProps {
  show: boolean;
  title: string;
  children: string | ReactElement;
  onClose: () => void;
}

export const ModalContainer = ({
  show = false,
  title,
  children,
  onClose
}: ModalContainerProps) => {
  return (
    <Modal isOpen={show} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            取消
          </Button>
          <Button colorScheme="primary">搜尋</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
