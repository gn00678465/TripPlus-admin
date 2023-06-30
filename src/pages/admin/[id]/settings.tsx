import { ReactElement, useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Divider,
  Button,
  useToast,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox,
  Text,
  Icon,
  List,
  ListItem,
  Link,
  Skeleton,
  Center,
  Tag
} from '@chakra-ui/react';
import { AdminLayout, ProjectWrap, ImageFallback } from '@/components';
import {
  SettingsBlock,
  FormItem,
  SwitchField,
  TPListItem
} from '@/components/Project';
import useSwr from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  apiFetchProjectInfo,
  apiPatchProjInfoSetting,
  apiPatchProjInfoPayment,
  apiPatchProjectImage,
  apiPatchProjectEnable,
  apiPostProjectTransform
} from '@/api';
import { safeAwait, currencyTWD, swrFetch } from '@/utils';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { MdCameraEnhance } from 'react-icons/md';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import NoImage from '@/assets/images/no-image.png';
import { useFileReader, useUploadImage } from '@/hooks';
import { statusEnum } from '@/enums';

dayjs.extend(utc);

interface SettingsProps {
  isEdit?: boolean;
  isLoading?: boolean;
  setEdit?: (arg: boolean) => void;
  projectData?: ApiProjectSettings.ProjectSettings;
  id?: string | string[];
}

const KeyVisionSettings = ({
  isEdit,
  isLoading,
  setEdit,
  projectData,
  id
}: SettingsProps) => {
  const methods = useForm<Project.FormKeyVisionSettings>();
  const [file, setFile] = useState<undefined | File>();
  const { trigger: triggerUpload } = useUploadImage();
  const toast = useToast();

  const { trigger, isMutating } = useSWRMutation(
    id ? `/admin/project/${id}/info/image` : null,
    (key, { arg }: { arg: Project.FormKeyVisionSettings }) =>
      swrFetch(apiPatchProjectImage(id as string, arg))
  );

  function onClickCancel() {
    setEdit?.(!isEdit);
    methods.reset();
    setFile(undefined);
  }

  const { dataURL } = useFileReader(file);

  const image = useMemo(() => {
    if (dataURL) return dataURL;
    if (projectData?.keyVision) return projectData.keyVision;
    return NoImage.src;
  }, [dataURL, projectData]);

  const onSubmit = async (formInput: Project.FormKeyVisionSettings) => {
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
            newFormInput.keyVision = data.data.imageUrl;
            methods.setValue('keyVision', data.data.imageUrl);
          }
        }
      });
    }
    trigger(newFormInput, {
      onSuccess(data, key, config) {
        setEdit?.(!isEdit);
        toast({
          position: 'top',
          title: '主視覺更新成功',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    });
  };

  useEffect(() => {
    if (projectData) {
      methods.reset({
        keyVision: projectData?.keyVision,
        video: projectData?.video
      });
    }
  }, [methods, projectData]);

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-y-2"
        pos="relative"
      >
        <FormControl>
          <p className="flex w-full items-center justify-end gap-x-4 py-2">
            <Icon boxSize={6} as={MdCameraEnhance} />
            <span className="font-semibold text-gray-500">上傳專案圖片</span>
          </p>
          <Skeleton isLoaded={!isLoading}>
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
        <FormItem label="集資影片" placeholder="請填入集資影片" path="video">
          <SwitchField
            content={methods.getValues('video')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Input size="sm" {...methods.register('video')}></Input>
          </SwitchField>
        </FormItem>
        {isEdit && (
          <div className="flex items-center justify-end gap-x-2 self-end">
            <Button size="sm" variant="outline" onClick={onClickCancel}>
              取消
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme="primary"
              variant="outline"
              isLoading={isMutating}
            >
              儲存
            </Button>
          </div>
        )}
      </Box>
    </FormProvider>
  );
};

const BasicSettings = ({
  isEdit,
  isLoading,
  setEdit,
  projectData,
  id
}: SettingsProps) => {
  const methods = useForm<Project.FormBasicSettings>();
  const toast = useToast();
  const { trigger, isMutating } = useSWRMutation(
    id ? `/admin/project/${id}/info/settings` : null,
    (key, { arg }: { arg: Project.FormBasicSettings }) =>
      swrFetch(apiPatchProjInfoSetting(id as string, arg))
  );

  useEffect(() => {
    if (projectData) {
      methods.reset({
        title: projectData.title,
        summary: projectData.summary,
        startTime: projectData.startTime,
        endTime: projectData.endTime,
        target: projectData.target,
        url: projectData.url,
        isLimit: projectData.isLimit,
        isShowTarget: projectData.isShowTarget,
        category: projectData.category,
        seoDescription: projectData.seoDescription
      });
    }
  }, [methods, projectData]);

  const onSubmit = (data: Project.FormBasicSettings) => {
    trigger(data, {
      onSuccess(data, key, config) {
        setEdit?.(!isEdit);
        toast({
          position: 'top',
          title: '基本設定更新成功',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    });
  };

  const categoryOptions = [
    {
      value: 0,
      label: '社會計畫'
    },
    {
      value: 1,
      label: '創新設計'
    },
    {
      value: 2,
      label: '精選商品'
    }
  ];

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        className="flex flex-col items-start gap-y-5"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="專案名稱" placeholder="請填入專案名稱" path="title">
          <SwitchField
            content={methods.getValues('title')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Input
              size="sm"
              {...methods.register('title', {
                required: '請填入專案名稱'
              })}
            ></Input>
          </SwitchField>
        </FormItem>
        <FormItem label="專案類型" path="title">
          <SwitchField
            content={
              categoryOptions.find(
                (item) => item.value === methods.getValues('category')
              )?.label
            }
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Select
              size="sm"
              placeholder="選擇專案類型"
              flexBasis="calc(100% - 137px)"
              {...methods.register('category', {
                required: '請選擇專案類型',
                valueAsNumber: true
              })}
            >
              {categoryOptions.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </SwitchField>
        </FormItem>
        <FormItem label="專案摘要" placeholder="請填入專案摘要" path="summary">
          <SwitchField
            content={methods.getValues('summary')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Input
              size="sm"
              {...methods.register('summary', {
                required: '請填入專案摘要'
              })}
            ></Input>
          </SwitchField>
        </FormItem>
        <FormItem
          label="專案開始時間"
          placeholder="請選擇專案開始時間"
          path="startTime"
        >
          <SwitchField
            content={dayjs(methods.getValues('startTime'))
              .utc(true)
              .format('YYYY-MM-DD HH:mm')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Controller
              control={methods.control}
              name="startTime"
              rules={{ required: '請選擇專案開始時間' }}
              render={() => (
                <Input
                  size="sm"
                  placeholder="選擇專案開始時間"
                  type="date"
                  value={dayjs(methods.getValues('startTime'))
                    .utc(true)
                    .format('YYYY-MM-DD')}
                  onChange={(e) => {
                    methods.setValue(
                      'startTime',
                      dayjs(e.target.value)
                        .startOf('day')
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                    );
                  }}
                />
              )}
            />
          </SwitchField>
        </FormItem>
        <FormItem
          label="專案結束時間"
          placeholder="請選擇專案結束時間"
          path="endTime"
        >
          <SwitchField
            content={dayjs(methods.getValues('endTime'))
              .utc(true)
              .format('YYYY-MM-DD HH:mm')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Controller
              control={methods.control}
              name="endTime"
              rules={{ required: '請選擇專案結束時間' }}
              render={({ field: { value } }) => (
                <Input
                  size="sm"
                  placeholder="選擇專案結束時間"
                  type="date"
                  value={dayjs(methods.getValues('endTime'))
                    .utc(true)
                    .format('YYYY-MM-DD')}
                  onChange={(e) => {
                    methods.setValue(
                      'endTime',
                      dayjs(e.target.value)
                        .endOf('day')
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                    );
                  }}
                />
              )}
            />
          </SwitchField>
        </FormItem>
        <FormItem label="目標金額" path="target">
          <SwitchField
            content={currencyTWD(methods.getValues('target'))}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <NumberInput size="sm" className="w-full" min={0} defaultValue={0}>
              <NumberInputField
                {...methods.register('target', {
                  required: '請輸入目標金額',
                  valueAsNumber: true
                })}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </SwitchField>
        </FormItem>
        <FormItem label="顯示預計目標金額" path="isShowTarget">
          <SwitchField
            content={!!methods.getValues('isShowTarget') ? '開啟' : '關閉'}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Controller
              control={methods.control}
              name="isShowTarget"
              render={({ field: { value } }) => (
                <Switch
                  colorScheme="primary"
                  size="sm"
                  isChecked={!!value}
                  isDisabled={!isEdit}
                  onChange={(e) => {
                    if (e.target.checked) {
                      methods.setValue('isShowTarget', 1);
                    } else {
                      methods.setValue('isShowTarget', 0);
                    }
                  }}
                />
              )}
            />
          </SwitchField>
        </FormItem>
        <FormItem label="專案網址" path="isShowTarget">
          <SwitchField
            content={methods.getValues('url')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Input size="sm" {...methods.register('url')}></Input>
          </SwitchField>
        </FormItem>
        <FormItem label="庫存限量標示" path="isLimit">
          <SwitchField
            content={!!methods.getValues('isLimit') ? '完整顯示' : '不顯示'}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Controller
              control={methods.control}
              name="isLimit"
              render={({ field: { value } }) => (
                <Switch
                  colorScheme="primary"
                  size="sm"
                  isChecked={!!value}
                  isDisabled={!isEdit}
                  onChange={(e) => {
                    if (e.target.checked) {
                      methods.setValue('isLimit', 1);
                    } else {
                      methods.setValue('isLimit', 0);
                    }
                  }}
                />
              )}
            />
          </SwitchField>
        </FormItem>
        <Divider />
        <FormItem label="SEO描述(限 100 字內)" path="seoDescription">
          <SwitchField
            content={
              !methods.getValues('seoDescription')
                ? '未設定'
                : methods.getValues('seoDescription')
            }
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Textarea
              size="sm"
              maxLength={100}
              placeholder="請填入SEO描述"
              {...methods.register('seoDescription')}
            ></Textarea>
          </SwitchField>
        </FormItem>
        {isEdit && (
          <div className="flex items-center justify-end gap-x-2 self-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEdit?.(!isEdit);
                methods.reset();
              }}
            >
              取消
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme="primary"
              variant="outline"
              isLoading={isMutating}
            >
              儲存
            </Button>
          </div>
        )}
      </Box>
    </FormProvider>
  );
};

const OptionsSettings = ({
  isEdit,
  isLoading,
  setEdit,
  projectData,
  id
}: SettingsProps) => {
  const methods = useForm<Project.FormOptionSettings>();
  const toast = useToast();
  const { trigger, isMutating } = useSWRMutation(
    id ? `/admin/project/${id}/info/abled` : null,
    (key, { arg }: { arg: Project.FormOptionSettings }) =>
      swrFetch(apiPatchProjectEnable(id as string, arg))
  );

  useEffect(() => {
    methods.reset({
      isAbled: projectData?.isAbled
    });
  }, [methods, projectData]);

  const onSubmit = (data: Project.FormOptionSettings) => {
    trigger(data, {
      onSuccess(data, key, config) {
        if (!data.data.isAbled) {
          toast({
            position: 'top',
            title: '專案已停用',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        } else {
          toast({
            position: 'top',
            title: '專案已啟用',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        }
        setEdit?.(!isEdit);
      },
      onError(err, key, config) {
        toast({
          position: 'top',
          title: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    });
  };

  function renderTag() {
    return !!methods.getValues('isAbled') ? (
      <Tag color="secondary.500" backgroundColor="secondary.300">
        已啟用
      </Tag>
    ) : (
      <Tag>未啟用</Tag>
    );
  }
  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        className="flex flex-col items-start gap-y-5"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="是否啟用" path="isAbled">
          <SwitchField
            isEdit={isEdit}
            isLoading={isLoading}
            content={renderTag}
          >
            <Controller
              control={methods.control}
              name="isAbled"
              render={({ field: { value } }) => (
                <Switch
                  colorScheme="primary"
                  size="sm"
                  isChecked={!!value}
                  isDisabled={!isEdit}
                  onChange={(e) => {
                    if (e.target.checked) {
                      methods.setValue('isAbled', 1);
                    } else {
                      methods.setValue('isAbled', 0);
                    }
                  }}
                />
              )}
            />
          </SwitchField>
        </FormItem>
        {isEdit && (
          <div className="flex items-center justify-end gap-x-2 self-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEdit?.(!isEdit);
                methods.reset();
              }}
            >
              取消
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme="primary"
              variant="outline"
              isLoading={isMutating}
            >
              儲存
            </Button>
          </div>
        )}
      </Box>
    </FormProvider>
  );
};

const PaymentSettings = ({
  isEdit,
  isLoading,
  setEdit,
  projectData,
  id
}: SettingsProps) => {
  const paymentOptions: { label: string; value: 0 | 1; disabled?: boolean }[] =
    [
      {
        label: '只使用信用卡付款',
        value: 0
      },
      {
        label: '信用卡 + ATM付款 + 超商付款',
        disabled: true,
        value: 1
      }
    ];
  const toast = useToast();
  const methods = useForm<Project.FormPaymentSettings>();

  const { trigger, isMutating } = useSWRMutation(
    id ? `/admin/project/${id}/info/payment` : null,
    (key, { arg }: { arg: Project.FormPaymentSettings }) =>
      swrFetch(apiPatchProjInfoPayment(id as string, arg))
  );

  useEffect(() => {
    methods.reset({
      atmDeadline: projectData?.atmDeadline,
      csDeadline: projectData?.csDeadline,
      isAllowInstallment: projectData?.isAllowInstallment,
      payment: projectData?.payment
    });
  }, [methods, projectData]);

  const watchPayment = methods.watch('payment');

  const onSubmit = (data: Project.FormPaymentSettings) => {
    trigger(data, {
      onSuccess(data, key, config) {
        toast({
          position: 'top',
          title: '付款設定更新成功',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        setEdit?.(!isEdit);
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        className="flex flex-col items-start gap-y-5"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="付款方式" path="payment">
          <SwitchField
            content={
              paymentOptions.find(
                (item) => item.value === methods.getValues('payment')
              )?.label
            }
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Controller
              name="payment"
              control={methods.control}
              rules={{
                required: '請選擇付款方式'
              }}
              render={({ field: { value } }) => (
                <RadioGroup
                  colorScheme="primary"
                  value={`${value}`}
                  onChange={(value) => {
                    methods.setValue('payment', parseFloat(value) as 0 | 1);
                  }}
                >
                  {paymentOptions.map((opt) => (
                    <Radio
                      key={opt.value}
                      value={`${opt.value}`}
                      mr={2}
                      isDisabled={opt?.disabled}
                    >
                      {opt.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            ></Controller>
          </SwitchField>
        </FormItem>
        <FormItem label="信用卡付款" path="isAllowInstallment">
          <SwitchField
            content={
              !!methods.getValues('isAllowInstallment')
                ? '可分期付款'
                : '不可分期付款'
            }
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Controller
              name="isAllowInstallment"
              control={methods.control}
              render={({ field: { value } }) => (
                <Checkbox
                  isChecked={!!value}
                  colorScheme="primary"
                  onChange={(e) => {
                    if (e.target.checked) {
                      methods.setValue('isAllowInstallment', 1);
                    } else {
                      methods.setValue('isAllowInstallment', 0);
                    }
                  }}
                >
                  開啟信用卡分期
                </Checkbox>
              )}
            ></Controller>
          </SwitchField>
        </FormItem>
        <FormItem label="ATM 付款" path="atmDeadline">
          <SwitchField
            content={
              methods.getValues('atmDeadline')
                ? `有限繳款期限: 贊助後第 ${methods.getValues(
                    'atmDeadline'
                  )} 天 23:59:59`
                : '未設定'
            }
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Flex className="gap-x-2" alignItems="center">
              <Text>有限繳款期限: 贊助後第</Text>
              <NumberInput
                size="sm"
                maxW={10}
                defaultValue={5}
                min={0}
                max={15}
                isDisabled={watchPayment === 0}
              >
                <NumberInputField
                  p={2}
                  {...methods.register('atmDeadline', {
                    valueAsNumber: true
                  })}
                />
              </NumberInput>
              <Text>天 23:59:59</Text>
            </Flex>
          </SwitchField>
        </FormItem>
        <FormItem label="超商付款" path="csDeadline">
          <SwitchField
            content={
              methods.getValues('csDeadline')
                ? `有限繳款期限: 贊助後第 ${methods.getValues(
                    'csDeadline'
                  )} 天 23:59:59`
                : '未設定'
            }
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Flex className="gap-x-2" alignItems="center">
              <Text>有限繳款期限: 贊助後第</Text>
              <NumberInput
                size="sm"
                maxW={10}
                defaultValue={5}
                min={0}
                max={15}
                isDisabled={watchPayment === 0}
              >
                <NumberInputField
                  p={2}
                  {...methods.register('csDeadline', {
                    valueAsNumber: true
                  })}
                />
              </NumberInput>
              <Text>天 23:59:59</Text>
            </Flex>
          </SwitchField>
        </FormItem>
        {isEdit && (
          <div className="flex items-center justify-end gap-x-2 self-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEdit?.(!isEdit);
                methods.reset();
              }}
            >
              取消
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme="primary"
              variant="outline"
              isLoading={isMutating}
            >
              儲存
            </Button>
          </div>
        )}
      </Box>
    </FormProvider>
  );
};

const ProjectPerView = ({ isLoading, projectData }: SettingsProps) => {
  return (
    <List className="flex flex-col items-start gap-y-5">
      <TPListItem isLoading={isLoading} label="預覽連結">
        {projectData?.url}
      </TPListItem>
    </List>
  );
};

const ProjectInfo = ({ isLoading, projectData }: SettingsProps) => {
  return (
    <List className="space-y-4">
      <TPListItem isLoading={isLoading} label="訂單總數">
        {projectData?.orderCount || '-'}
      </TPListItem>
      <TPListItem isLoading={isLoading} label="交易成功人數">
        {projectData?.orderSuccess || '-'}
      </TPListItem>
      <TPListItem isLoading={isLoading} label="待繳款金額/人數">
        {`NT${currencyTWD(projectData?.orderUnpaidAmount || 0)} / ${
          projectData?.orderUnpaidCount
        }`}
      </TPListItem>
      <TPListItem isLoading={isLoading} label="集資進度">
        {`${projectData?.progressRate ? projectData.progressRate : 0}%`}
      </TPListItem>
      <TPListItem isLoading={isLoading} label="專案連結">
        {projectData?.url}
      </TPListItem>
    </List>
  );
};

const TransformButton = ({ projectData, id }: SettingsProps) => {
  const toast = useToast();
  const router = useRouter();
  const { trigger } = useSWRMutation(
    id ? `/admin/project/${id}/transform` : null,
    (key) => swrFetch(apiPostProjectTransform(id as string))
  );

  function handleClick() {
    trigger(null, {
      onSuccess(data, key, config) {
        toast({
          position: 'top',
          title: data.message,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        router.push('/admin/projects');
      },
      onError(err, key, config) {
        toast({
          position: 'top',
          title: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    });
  }

  return (
    (projectData?.status === 'complete' &&
      (projectData.category === 1 || projectData.category === 2) && (
        <Center py={5}>
          <Button colorScheme="primary" onClick={handleClick}>
            轉為長期販售商品
          </Button>
        </Center>
      )) ||
    null
  );
};

const ProjectSettings = () => {
  const router = useRouter();
  const toast = useToast();

  const [visionEdit, setVisionEdit] = useState(false);
  const [basicEdit, setBasicEdit] = useState(false);
  const [payEdit, setPayEdit] = useState(false);
  const [optEdit, setOptEdit] = useState(false);

  const { id } = router.query;

  const { data, isLoading, mutate } = useSwr(
    id ? `/admin/project/${id}/info` : null,
    async () => {
      const [err, res] = await safeAwait(apiFetchProjectInfo(id as string));
      return new Promise<ApiProjectSettings.ProjectSettings>(
        (resolve, reject) => {
          if (res && res.status === 'Success') {
            resolve(res.data);
          }
          if (err) {
            reject(err);
          }
        }
      );
    },
    {
      onError(err, key, config) {
        toast({
          position: 'top',
          title: err.message,
          duration: 1500,
          status: 'error'
        });
        router.push('/admin/projects');
      }
    }
  );

  return (
    <>
      <Flex
        w="full"
        flexDirection={{ base: 'column', lg: 'row' }}
        gap={{ base: 5 }}
      >
        <Flex w="full" flexDirection={{ base: 'column' }} gap={{ base: 5 }}>
          <SettingsBlock
            title="主視覺"
            renderButton={
              <Button
                size="sm"
                colorScheme="primary"
                variant="outline"
                display={{ base: visionEdit ? 'none' : '' }}
                onClick={() => {
                  setVisionEdit(!visionEdit);
                }}
              >
                編輯設定
              </Button>
            }
          >
            <KeyVisionSettings
              isEdit={visionEdit}
              isLoading={isLoading}
              setEdit={setVisionEdit}
              projectData={data}
              id={id}
            />
          </SettingsBlock>
          <SettingsBlock
            title="專案預覽"
            renderButton={
              <Button size="sm" colorScheme="primary" variant="outline">
                更新預覽網址
              </Button>
            }
          >
            <ProjectPerView isLoading={isLoading} projectData={data} />
          </SettingsBlock>
          <SettingsBlock title="專案資訊">
            <ProjectInfo isLoading={isLoading} projectData={data} />
          </SettingsBlock>
        </Flex>
        <Flex w="full" flexDirection={{ base: 'column' }} gap={{ base: 5 }}>
          <SettingsBlock
            title="基本設定"
            renderButton={
              <Button
                size="sm"
                colorScheme="primary"
                variant="outline"
                display={{ base: basicEdit ? 'none' : '' }}
                onClick={() => {
                  setBasicEdit(!basicEdit);
                }}
              >
                編輯設定
              </Button>
            }
          >
            <BasicSettings
              isEdit={basicEdit}
              setEdit={setBasicEdit}
              isLoading={isLoading}
              projectData={data}
              id={id}
            ></BasicSettings>
          </SettingsBlock>
          <SettingsBlock
            title="付款設定"
            renderButton={
              <Button
                size="sm"
                colorScheme="primary"
                variant="outline"
                display={{ base: payEdit ? 'none' : '' }}
                onClick={() => {
                  setPayEdit(!payEdit);
                }}
              >
                編輯設定
              </Button>
            }
          >
            <PaymentSettings
              isEdit={payEdit}
              isLoading={isLoading}
              setEdit={setPayEdit}
              projectData={data}
              id={id}
            ></PaymentSettings>
          </SettingsBlock>
          <SettingsBlock
            title="專案啟用"
            renderButton={
              <Button
                size="sm"
                colorScheme="primary"
                variant="outline"
                display={{ base: optEdit ? 'none' : '' }}
                onClick={() => {
                  setOptEdit(!optEdit);
                }}
              >
                編輯設定
              </Button>
            }
          >
            <OptionsSettings
              isEdit={optEdit}
              isLoading={isLoading}
              setEdit={setOptEdit}
              projectData={data}
              id={id}
            ></OptionsSettings>
          </SettingsBlock>
        </Flex>
      </Flex>
      <TransformButton projectData={data} id={id} />
    </>
  );
};

export default ProjectSettings;

ProjectSettings.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>專案管理-專案資料-TripPlus+</title>
      </Head>
      <ProjectWrap
        minH="calc(100vh)"
        backgroundColor="gray.100"
        px={{ base: 3, xl: 20 }}
        pt={{ base: 10, xl: 20 }}
        fontSize={{ base: 'sm', md: 'md' }}
      >
        {page}
      </ProjectWrap>
    </AdminLayout>
  );
};
