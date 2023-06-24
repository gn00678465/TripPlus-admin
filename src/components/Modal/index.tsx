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

export interface ModalContainerProps {
  show: boolean;
  title: string;
  children: string | ReactElement;
  onClose: () => void;
  onOk?: () => void;
  okText?: string;
  cancelText?: string;
  footerHidden?: boolean;
  footer?: string | number | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

export const ModalContainer = ({
  show = false,
  title,
  children,
  onClose,
  onOk,
  footer,
  okText = 'Ok',
  cancelText = 'Cancel',
  footerHidden = false
}: ModalContainerProps) => {
  function renderFooter(footer: ModalContainerProps['footer']) {
    if (typeof footer === 'function') {
      return footer();
    }
    return footer;
  }

  return (
    <Modal isOpen={show} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {!footerHidden && (
          <ModalFooter>
            {(footer && renderFooter(footer)) || (
              <>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  {cancelText}
                </Button>
                <Button colorScheme="primary" onClick={onOk}>
                  {okText}
                </Button>
              </>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
