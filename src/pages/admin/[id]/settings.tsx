import { ReactElement, useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Flex,
  Divider,
  Button,
  useToast,
  Input,
  Select,
  FormControl,
  FormControlProps,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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
  Center
} from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { AdminLayout, ProjectWrap, ImageFallback } from '@/components';
import useSwr from 'swr';
import { apiFetchProjectInfo } from '@/api';
import { safeAwait, currencyTWD } from '@/utils';
import {
  useForm,
  UseFormReturn,
  FormProvider,
  useFormContext,
  Controller
} from 'react-hook-form';
import { MdCameraEnhance } from 'react-icons/md';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import NoImage from '@/assets/images/no-image.png';
import { useFileReader } from '@/hooks';

dayjs.extend(utc);

interface SettingsBlockProps extends Omit<BoxProps, 'children'> {
  title: string;
  renderButton?: JSX.Element;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

const SettingsBlock = ({
  children,
  title,
  renderButton,
  ...rest
}: SettingsBlockProps) => {
  return (
    <Box
      className="rounded-lg"
      px={{ base: 3, md: 6 }}
      pt={{ base: 4, md: 6 }}
      pb={{ base: 6, md: 12 }}
      backgroundColor="white"
      {...rest}
    >
      <Flex mb={{ base: 6 }} justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="2xl">
          {title}
        </Heading>
        {renderButton}
      </Flex>
      {children}
    </Box>
  );
};

interface FormItem extends Omit<FormControlProps, 'children'> {
  children: JSX.Element | JSX.Element[];
  label: string;
  path:
    | keyof Project.FormBasicSettings
    | keyof Project.FormPaymentSettings
    | keyof Project.FormKeyVisionSettings
    | keyof Project.FormOptionSettings;
  showFeedback?: boolean;
}

const FormItem = ({
  children,
  label,
  path,
  showFeedback = true,
  ...rest
}: FormItem) => {
  const {
    formState: { errors }
  } = useFormContext();
  return (
    <FormControl flexShrink={0} isInvalid={!!errors[path]} {...rest}>
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
      {showFeedback && !!errors[path] && (
        <FormErrorMessage className="visible">
          {errors[path]?.message as string}
        </FormErrorMessage>
      )}
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
          pl={0}
          fontSize="md"
          lineHeight="32px"
        >
          {text}
        </Text>
      )}
    </Skeleton>
  );
};

interface SettingsProps {
  isEdit?: boolean;
  isLoading?: boolean;
  setEdit?: (arg: boolean) => void;
  projectData?: ApiProjectSettings.ProjectSettings;
}

const KeyVisionSettings = ({
  isEdit,
  isLoading,
  setEdit,
  projectData
}: SettingsProps) => {
  const methods = useForm<Project.FormKeyVisionSettings>();
  const [file, setFile] = useState<undefined | File>();

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

  const onSubmit = (data: Project.FormKeyVisionSettings) => {
    console.log(data);
  };

  useEffect(() => {
    if (projectData) {
      methods.reset({
        video: projectData.video
      });
    }
  }, [methods, projectData]);

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-y-2"
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
            text={methods.getValues('video')}
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
  projectData
}: SettingsProps) => {
  const methods = useForm<Project.FormBasicSettings>();

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
    console.log(data);
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
            text={methods.getValues('title')}
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
            text={
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
            text={methods.getValues('summary')}
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
            text={dayjs(methods.getValues('startTime'))
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
            text={dayjs(methods.getValues('endTime'))
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
            text={currencyTWD(methods.getValues('target'))}
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
          <Controller
            control={methods.control}
            name="isShowTarget"
            render={({ field: { value } }) => (
              <Switch
                colorScheme="primary"
                size="sm"
                checked={!!value}
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
        </FormItem>
        <FormItem label="專案網址" path="isShowTarget">
          <SwitchField
            text={methods.getValues('url')}
            isEdit={isEdit}
            isLoading={isLoading}
          >
            <Input size="sm" {...methods.register('url')}></Input>
          </SwitchField>
        </FormItem>
        <FormItem label="庫存限量標示" path="isLimit">
          <Controller
            control={methods.control}
            name="isLimit"
            render={({ field: { value } }) => (
              <Switch
                colorScheme="primary"
                size="sm"
                checked={!!value}
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
        </FormItem>
        <Divider />
        <FormItem label="SEO描述(限 100 字內)" path="seoDescription">
          <SwitchField
            text={methods.getValues('seoDescription')}
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
            >
              儲存
            </Button>
          </div>
        )}
      </Box>
    </FormProvider>
  );
};

const OptionsSettings = () => {
  const methods = useForm<Project.FormOptionSettings>();

  const onSubmit = (data: Project.FormOptionSettings) => {
    console.log(data);
  };
  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        className="flex flex-col items-start gap-y-5"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="是否啟用" path="isAbled">
          <Switch
            colorScheme="primary"
            size="sm"
            {...methods.register('isAbled')}
          />
        </FormItem>
      </Box>
    </FormProvider>
  );
};

const PaymentSettings = ({ isEdit, isLoading, setEdit }: SettingsProps) => {
  const methods = useForm<Project.FormPaymentSettings>();

  const onSubmit = (data: Project.FormPaymentSettings) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        className="flex flex-col items-start gap-y-5"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="付款方式" path="payment">
          <Controller
            name="payment"
            control={methods.control}
            render={() => (
              <RadioGroup colorScheme="primary">
                <Radio value="1" mr={2}>
                  只使用信用卡付款
                </Radio>
                <Radio value="2" mr={2}>
                  信用卡 + ATM付款 + 超商付款
                </Radio>
              </RadioGroup>
            )}
          ></Controller>
        </FormItem>
        <FormItem label="信用卡付款" path="isAllowInstallment">
          <Checkbox
            colorScheme="primary"
            {...methods.register('isAllowInstallment')}
          >
            開啟信用卡分期
          </Checkbox>
        </FormItem>
        <FormItem label="ATM 付款" path="atmDeadline">
          <Flex className="gap-x-2" alignItems="center">
            <Text>有限繳款期限: 贊助後第</Text>
            <NumberInput size="sm" maxW={10} defaultValue={5} min={0} max={15}>
              <NumberInputField
                p={2}
                {...methods.register('atmDeadline', {
                  valueAsNumber: true
                })}
              />
            </NumberInput>
            <Text>天 23:59:59</Text>
          </Flex>
        </FormItem>
        <FormItem label="超商付款" path="csDeadline">
          <Flex className="gap-x-2" alignItems="center">
            <Text>有限繳款期限: 贊助後第</Text>
            <NumberInput size="sm" maxW={10} defaultValue={5} min={0} max={15}>
              <NumberInputField
                p={2}
                {...methods.register('csDeadline', {
                  valueAsNumber: true
                })}
              />
            </NumberInput>
            <Text>天 23:59:59</Text>
          </Flex>
        </FormItem>
        {isEdit && (
          <div className="flex items-center justify-end gap-x-2 self-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEdit?.(!isEdit);
              }}
            >
              取消
            </Button>
            <Button
              size="sm"
              type="submit"
              colorScheme="primary"
              variant="outline"
            >
              儲存
            </Button>
          </div>
        )}
      </Box>
    </FormProvider>
  );
};

const TPListItem = ({
  label,
  children,
  isLoading
}: {
  label: string;
  children?: JSX.Element | string | number;
  isLoading?: boolean;
}) => {
  return (
    <ListItem py={1}>
      <div className="block w-full items-center xs:flex md:block 2xl:flex">
        <Text
          flexShrink={0}
          w={{
            base: 'auto',
            xs: '125px',
            md: 'auto',
            '2xl': '130px'
          }}
        >
          {label}
        </Text>
        <Skeleton flexGrow={1} isLoaded={!isLoading}>
          <Text>{children}</Text>
        </Skeleton>
      </div>
    </ListItem>
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

const ProjectSettings = () => {
  const router = useRouter();
  const toast = useToast();

  const [visionEdit, setVisionEdit] = useState(false);
  const [basicEdit, setBasicEdit] = useState(false);
  const [payEdit, setPayEdit] = useState(false);

  const { id } = router.query;

  const { data, isLoading } = useSwr(
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
            ></PaymentSettings>
          </SettingsBlock>
          <SettingsBlock title="專案啟用">
            <OptionsSettings></OptionsSettings>
          </SettingsBlock>
        </Flex>
      </Flex>
      <Center py={5}>
        <Button colorScheme="primary">轉為長期販售商品</Button>
      </Center>
    </>
  );
};

export default ProjectSettings;

ProjectSettings.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>專案管理</title>
      </Head>
      <ProjectWrap className="h-full bg-gray-100">{page}</ProjectWrap>
    </AdminLayout>
  );
};
