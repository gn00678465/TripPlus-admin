import { ReactElement, useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Button,
  useToast,
  Input,
  Select,
  FormControl,
  FormControlProps,
  FormLabel,
  Textarea,
  Text,
  Icon,
  Skeleton
} from '@chakra-ui/react';
import { AdminLayout, ProjectWrap, ImageFallback } from '@/components';
import useSwr from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiGetTeamInfo, apiPatchTeamInfo } from '@/api';
import { safeAwait, swrFetch } from '@/utils';
import { useForm } from 'react-hook-form';
import { MdCameraEnhance } from 'react-icons/md';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import NoImage from '@/assets/images/no-image.png';
import { useFileReader, useUploadImage } from '@/hooks';
import { useTeamStore } from '@/store';

dayjs.extend(utc);

interface FormItem extends Omit<FormControlProps, 'children'> {
  children: JSX.Element | JSX.Element[];
  label: string;
  showFeedback?: boolean;
}

const FormItem = ({
  children,
  label,
  showFeedback = true,
  ...rest
}: FormItem) => {
  return (
    <FormControl flexShrink={0} {...rest}>
      <Box
        display={{ base: 'block', sm: 'flex', md: 'block', '2xl': 'flex' }}
        alignItems="center"
      >
        <FormLabel
          mb={{ base: 2, '2xl': 0 }}
          flexShrink={0}
          flexBasis={{ base: 'auto', sm: '125px', md: 'auto', '2xl': '130px' }}
        >
          {label}
        </FormLabel>
        <div className="grow">{children}</div>
      </Box>
    </FormControl>
  );
};

const SwitchField = ({
  children,
  text = '-',
  isEdit = false,
  isLoading = false
}: {
  children: JSX.Element;
  text?: string;
  isEdit?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <Skeleton isLoaded={!isLoading}>
      {isEdit ? (
        children
      ) : (
        <Text
          w="full"
          visibility={text ? 'visible' : 'hidden'}
          pl={1}
          fontSize="20px"
          lineHeight="32px"
        >
          {text}
        </Text>
      )}
    </Skeleton>
  );
};

const TeamSetting = () => {
  const router = useRouter();
  const toast = useToast();

  const { teamId } = useTeamStore();

  const { id } = router.query;

  const { data, isLoading } = useSwr(
    id ? `/admin/project/${id}/team/${teamId}` : null,
    async () => {
      const [err, res] = await safeAwait(
        apiGetTeamInfo(id as string, teamId as string)
      );
      return new Promise<ApiTeam.Team>((resolve, reject) => {
        if (res && res.status === 'Success') {
          resolve(res.data);
        }
        if (err) {
          reject(err);
        }
      });
    },
    {
      onError(err, key, config) {
        toast({
          position: 'top',
          title: err.message,
          duration: 1500,
          status: 'error'
        });
      }
    }
  );

  const { trigger } = useSWRMutation(
    id ? `/admin/project/${id}/team/${teamId}` : null,
    (key, { arg }: { arg: Team.TeamData }) =>
      swrFetch(apiPatchTeamInfo(id as string, teamId as string, arg))
  );

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [file, setFile] = useState<undefined | File>();

  const { dataURL } = useFileReader(file);
  const { trigger: triggerUpload } = useUploadImage();

  const image = useMemo(() => {
    if (dataURL) return dataURL;
    if (data?.photo) return data.photo;
    return NoImage.src;
  }, [dataURL, data]);

  const { handleSubmit, register, watch, reset, getValues, control, setValue } =
    useForm<Team.TeamData>();

  const onClickCancel = () => {
    setIsEdit?.(!isEdit);
    reset();
    setFile(undefined);
  };

  const onSubmit = async (formInput: Team.TeamData) => {
    let newFormInput = { ...formInput };
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await triggerUpload(formData, {
        onSuccess: (data, key, config) => {
          if (data.status === 'Error') {
            toast({
              position: 'top',
              title: data.message,
              status: 'error',
              duration: 5000,
              isClosable: true
            });
          }
          if (data.status === 'Success') {
            newFormInput.photo = data.data.imageUrl;
            setValue('photo', data.data.imageUrl);
          }
        }
      });
    }
    trigger(newFormInput, {
      onSuccess(data, key, config) {
        setIsEdit?.(!isEdit);
        toast({
          position: 'top',
          title: '團隊資料更新成功',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    });
  };

  const getTeamType = (value: number) => {
    switch (value) {
      case 0:
        return '個人提案者';
      case 1:
        return '團隊提案者';
      default:
        break;
    }
  };

  useEffect(() => {
    if (data) {
      reset({
        type: data.type,
        title: data.title,
        introduction: data.introduction,
        taxId: data.taxId,
        address: data.address,
        serviceTime: data.serviceTime,
        representative: data.representative,
        email: data.email,
        phone: data.phone,
        website: data.website,
        facebook: data.facebook,
        instagram: data.instagram
      });
    }
  }, [data]);

  return (
    <>
      <Box
        className="rounded-lg"
        px={{ base: 3, md: 6 }}
        pt={{ base: 4, md: 6 }}
        pb={{ base: 6, md: 12 }}
        backgroundColor="white"
      >
        <Box className="flex justify-between border-b-[1px] border-gray-300 pb-3">
          <Heading as="h3" fontSize="2xl">
            團隊資料
          </Heading>
          <Button
            colorScheme="primary"
            variant="outline"
            display={{ base: isEdit ? 'none' : '' }}
            onClick={() => {
              setIsEdit(!isEdit);
            }}
          >
            編輯設定
          </Button>
        </Box>

        <Box as="form" onSubmit={handleSubmit(onSubmit)} className="flex">
          <FormControl>
            <p className="flex w-full items-center justify-end gap-x-4 py-2">
              <Icon boxSize={6} as={MdCameraEnhance} />
              <span className="font-semibold text-gray-500">
                上傳提案者/團隊圖片
              </span>
            </p>
            <Skeleton isLoaded={true}>
              <FormLabel
                mx="0"
                p="0"
                className="relative aspect-[10/7] w-full"
                cursor={isEdit ? 'pointer' : 'auto'}
              >
                <ImageFallback
                  src={image}
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
                  disabled={!isEdit}
                  onChange={(e) => {
                    setFile(e.target.files?.[0]);
                  }}
                ></Input>
              </FormLabel>
            </Skeleton>
          </FormControl>
          <Box className="mt-5 w-full pl-6">
            <FormItem
              label="提案者類型"
              placeholder="請選擇提案者類型"
              marginBottom={5}
            >
              <SwitchField
                text={getTeamType(getValues('type'))}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Select
                  placeholder="請選擇提案者類型"
                  {...register('type', {
                    required: '請選擇提案者類型'
                  })}
                >
                  <option value="0">個人提案者</option>
                  <option value="1">團隊提案者</option>
                </Select>
              </SwitchField>
            </FormItem>
            <FormItem
              label="提案者名稱"
              placeholder="請輸入提案者名稱"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('title')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('title', {
                    required: '請輸入提案者名稱'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="提案者介紹"
              placeholder="請輸入提案者介紹"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('introduction')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Textarea
                  {...register('introduction', {
                    required: '請輸入提案者介紹'
                  })}
                />
              </SwitchField>
            </FormItem>
            <FormItem
              label="統一編號"
              placeholder="請輸入統一編號"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('taxId')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('taxId', {
                    required: '請輸入統一編號'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="公司所在地"
              placeholder="請輸入公司所在地"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('address')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('address', {
                    required: '請輸入公司所在地'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="服務時間"
              placeholder="請輸入服務時間"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('serviceTime')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('serviceTime', {
                    required: '請輸入服務時間'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="代表人姓名"
              placeholder="請輸入代表人姓名"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('representative')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('representative', {
                    required: '請輸入代表人姓名'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="聯絡信箱"
              placeholder="請輸入聯絡信箱"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('email')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('email', {
                    required: '請輸入聯絡信箱'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="聯絡電話"
              placeholder="請輸入聯絡電話"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('phone')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('phone', {
                    required: '請輸入聯絡電話'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="Website"
              placeholder="請輸入Website"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('website')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input
                  {...register('website', {
                    required: '請輸入Website'
                  })}
                ></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="Facebook"
              placeholder="請輸入Facebook"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('facebook')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input {...register('facebook')}></Input>
              </SwitchField>
            </FormItem>
            <FormItem
              label="Instagram"
              placeholder="請輸入Instagram"
              marginBottom={5}
            >
              <SwitchField
                text={getValues('instagram')}
                isEdit={isEdit}
                isLoading={isLoading}
              >
                <Input {...register('instagram')}></Input>
              </SwitchField>
            </FormItem>
            {isEdit && (
              <div className="flex items-center justify-end gap-x-2 self-end">
                <Button variant="outline" onClick={onClickCancel}>
                  取消
                </Button>
                <Button type="submit" colorScheme="primary" variant="outline">
                  儲存
                </Button>
              </div>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TeamSetting;

TeamSetting.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>團隊資料</title>
      </Head>
      <ProjectWrap className="h-full bg-gray-100">{page}</ProjectWrap>
    </AdminLayout>
  );
};
