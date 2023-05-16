import { useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  NumberInput,
  NumberInputField,
  Input,
  Button,
  Center,
  Icon
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ImageFallback } from '@/components';
import NoImage from '../../../assets/images/no-image.png';
import { useFileReader, useUploadImage } from '@/hooks';
import { MdCameraEnhance } from 'react-icons/md';
import dayjs from 'dayjs';
import { useSWRConfig } from 'swr';
import { apiPostProject } from '@/api';
import { useRouter } from 'next/router';

export default function AdminProject() {
  const [file, setFile] = useState<undefined | File>();
  const { dataURL } = useFileReader(file);
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { trigger } = useUploadImage();

  function handleStartTime(date: string) {
    return dayjs(date).startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
  }

  function handleEndTime(date: string) {
    return dayjs(date).endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
  }

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = useForm<Project.FormInputs>();

  async function onSubmit(formInput: Project.FormInputs) {
    if (!file) return;
    const formData = new FormData();

    formData.append('file', file);
    await trigger(formData, {
      onSuccess: (data, key, config) => {
        if (data.status === 'Success') {
          const params = {
            ...formInput,
            startTime: handleStartTime(formInput.startTime),
            endTime: handleEndTime(formInput.endTime),
            keyVision: data.data.imageUrl
          };

          mutate('/post/admin/project', async () => {
            const res = await apiPostProject(params);

            if (res.status === 'Success') {
              router.push(`/admin/project/${res.data._id}/info`);
            }
          });
        }
      }
    });
  }

  function onCancel() {
    router.push('/admin/projects');
  }

  return (
    <>
      <Head>
        <title>新增專案-TripPlus+</title>
      </Head>
      <div className="h-full min-h-screen bg-gray-100">
        <Container maxW="760px" px={{ base: '4', sm: '6', md: '12' }}>
          <h2 className="py-4 text-2xl font-bold text-gray-500">新增專案</h2>
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-y-6 bg-white px-4 py-12 md:p-12">
              <Center px={{ base: 4, md: 12 }}>
                <FormControl>
                  <p className="flex w-full items-center justify-end gap-x-4 py-2">
                    <Icon boxSize={6} as={MdCameraEnhance} />
                    <span className="font-semibold text-gray-500">
                      上傳專案圖片
                    </span>
                  </p>
                  <FormLabel
                    mx="0"
                    p="0"
                    className="relative h-[300px] w-full cursor-pointer"
                  >
                    <ImageFallback
                      src={dataURL || NoImage.src}
                      fallbackSrc={NoImage.src}
                      alt="專案圖片"
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    ></ImageFallback>
                    <Input
                      className="hidden"
                      variant="unstyled"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setFile(e.target.files?.[0]);
                      }}
                    ></Input>
                  </FormLabel>
                </FormControl>
              </Center>
              <FormControl
                className="mt-4"
                isRequired
                display="flex"
                alignItems="center"
              >
                <FormLabel flexShrink={0} flexBasis="125px">
                  專案名稱
                </FormLabel>
                <Input
                  placeholder="填入專案名稱"
                  {...register('title', {
                    required: '請填入專案名稱'
                  })}
                />
                {!!errors.title && (
                  <FormErrorMessage className="visible">
                    {errors.title.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel flexShrink={0} flexBasis="125px">
                  提案團隊
                </FormLabel>
                <Input
                  placeholder="填入提案團隊"
                  {...register('teamName', {
                    required: '請填入提案團隊'
                  })}
                />
                {!!errors.teamName && (
                  <FormErrorMessage className="visible">
                    {errors.teamName.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel flexShrink={0} flexBasis="125px">
                  專案類型
                </FormLabel>
                <Select
                  placeholder="選擇專案類型"
                  {...register('category', {
                    required: '請選擇專案類型'
                  })}
                >
                  <option value={0}>社會計畫</option>
                  <option value={1}>精選商品</option>
                  <option value={3}>創新設計</option>
                </Select>
                {!!errors.category && (
                  <FormErrorMessage className="visible">
                    {errors.category.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel flexShrink={0} flexBasis="125px">
                  專案開始時間
                </FormLabel>
                <Input
                  placeholder="選擇專案開始時間"
                  type="date"
                  {...register('startTime', {
                    required: '請選擇專案開始時間'
                  })}
                />
                {!!errors.startTime && (
                  <FormErrorMessage className="visible">
                    {errors.startTime.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel flexShrink={0} flexBasis="125px">
                  專案結束時間
                </FormLabel>
                <Input
                  placeholder="專案結束時間"
                  type="date"
                  {...register('endTime', {
                    required: '專案結束時間'
                  })}
                />
                {!!errors.endTime && (
                  <FormErrorMessage className="visible">
                    {errors.endTime.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl isRequired display="flex" alignItems="center">
                <FormLabel flexShrink={0} flexBasis="125px">
                  目標金額
                </FormLabel>
                <NumberInput className="w-full">
                  <NumberInputField
                    placeholder="請輸入目標金額"
                    {...register('target', {
                      required: '目標金額'
                    })}
                    onChange={(e) => {
                      setValue('target', parseFloat(e.target.value));
                    }}
                  />
                </NumberInput>
                {!!errors.target && (
                  <FormErrorMessage className="visible">
                    {errors.target.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </div>
            <Center gap={4} py={4} mt={4}>
              <Button px={12} onClick={onCancel}>
                取消
              </Button>
              <Button px={12} type="submit" colorScheme="primary">
                儲存
              </Button>
            </Center>
          </Box>
        </Container>
      </div>
    </>
  );
}
