import { Stack, Text, StackProps } from '@chakra-ui/react';

export default function Chat() {
  return (
    <div className="relative w-full cursor-pointer rounded-t-lg bg-primary px-[120px] py-2 text-center text-base text-white 2xl:px-[120px] 2xl:py-3">
      聊聊{' '}
      <div className="absolute right-5 top-[-9px] rounded-full bg-error p-1 text-xs 2xl:right-4">
        12
      </div>
    </div>
  );
}
