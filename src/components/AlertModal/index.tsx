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

interface ModalBoxProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  footer: React.ReactNode;
  content: React.ReactNode;
}

export interface ModalState {
  isOpen: boolean;
  content: React.ReactNode;
  footer: React.ReactNode | null;
}

export const AlertModal = ({
  isOpen,
  onClose,
  header,
  footer,
  content
}: ModalBoxProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>
        <ModalFooter>
          {footer}
          <Button onClick={onClose} ml={3}>
            取消
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
