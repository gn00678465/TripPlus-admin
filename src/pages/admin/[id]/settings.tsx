import { ReactElement } from 'react';
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
  Link
} from '@chakra-ui/react';
import type { BoxProps } from '@chakra-ui/react';
import { AdminLayout, Navbar, ImageFallback } from '@/components';
import useSwr from 'swr';
import { apiFetchProjectInfo } from '@/api';
import { safeAwait } from '@/utils';
import {
  useForm,
  UseFormReturn,
  FormProvider,
  useFormContext,
  Controller
} from 'react-hook-form';
import { MdCameraEnhance } from 'react-icons/md';
import dayjs from 'dayjs';
import NoImage from '@/assets/images/no-image.png';

interface SettingsBlockProps extends Omit<BoxProps, 'children'> {
  renderHeader?: JSX.Element;
  renderButton?: JSX.Element;
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}

const SettingsBlock = ({
  children,
  renderHeader,
  renderButton,
  ...rest
}: SettingsBlockProps) => {
  return (
    <Box backgroundColor="white" {...rest}>
      <Flex
        px={{ base: 2 }}
        py={{ base: 3 }}
        justifyContent="space-between"
        alignItems="center"
      >
        {renderHeader}
        {renderButton}
      </Flex>
      <Divider orientation="horizontal" />
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
    | keyof Project.FormKeyVisionSettings;
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
    <FormControl
      display={{ base: 'block', xs: 'flex', md: 'block', '2xl': 'flex' }}
      flexShrink={0}
      isInvalid={!!errors[path]}
      {...rest}
    >
      <FormLabel
        mb={{ base: 2, '2xl': 0 }}
        flexShrink={0}
        flexBasis={{ base: 'auto', xs: '125px', md: 'auto', '2xl': '125px' }}
      >
        {label}
      </FormLabel>
      {children}
      {showFeedback && !!errors[path] && (
        <FormErrorMessage className="visible">
          {errors[path]?.message as string}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

const KeyVisionSettings = () => {
  const { handleSubmit, register, ...rest } =
    useForm<Project.FormKeyVisionSettings>();

  const onSubmit = (data: Project.FormKeyVisionSettings) => {
    console.log(data);
  };

  return (
    <FormProvider handleSubmit={handleSubmit} register={register} {...rest}>
      <Box
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-y-2 p-2"
      >
        <FormControl>
          <p className="flex w-full items-center justify-end gap-x-4 py-2">
            <Icon boxSize={6} as={MdCameraEnhance} />
            <span className="font-semibold text-gray-500">上傳專案圖片</span>
          </p>
          <FormLabel
            mx="0"
            p="0"
            className="relative aspect-[10/7] w-full cursor-pointer"
          >
            <ImageFallback
              src={NoImage.src}
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
            ></Input>
          </FormLabel>
        </FormControl>
        <FormItem label="集資影片" placeholder="請填入集資影片" path="video">
          <Input size="sm" {...register('video')}></Input>
        </FormItem>
        <div className="flex items-center justify-end gap-x-2 self-end">
          <Button size="sm" variant="outline">
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
      </Box>
    </FormProvider>
  );
};

const BasicSettings = ({
  isEdit,
  isLoading
}: {
  isEdit?: boolean;
  isLoading?: boolean;
}) => {
  const methods = useForm<Project.FormBasicSettings>({});

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
        className="flex flex-col items-start gap-y-2 p-2"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="專案名稱" placeholder="請填入專案名稱" path="title">
          <Input
            size="sm"
            {...methods.register('title', {
              required: '請填入專案名稱'
            })}
          ></Input>
        </FormItem>
        <FormItem label="專案類型" path="title">
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
        </FormItem>
        <FormItem label="專案摘要" placeholder="請填入專案摘要" path="summary">
          <Input
            size="sm"
            {...methods.register('summary', {
              required: '請填入專案摘要'
            })}
          ></Input>
        </FormItem>
        <FormItem
          label="專案開始時間"
          placeholder="請選擇專案開始時間"
          path="startTime"
        >
          <Input
            size="sm"
            placeholder="選擇專案開始時間"
            type="date"
            {...methods.register('startTime', {
              required: '請選擇專案開始時間'
            })}
          />
        </FormItem>
        <FormItem
          label="專案結束時間"
          placeholder="請選擇專案結束時間"
          path="endTime"
        >
          <Input
            size="sm"
            placeholder="選擇專案結束時間"
            type="date"
            {...methods.register('endTime', {
              required: '請選擇專案結束時間'
            })}
          />
        </FormItem>
        <FormItem label="目標金額" path="target">
          <NumberInput size="sm" className="w-full" min={0}>
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
        </FormItem>
        <FormItem label="顯示預計目標金額" path="isShowTarget">
          <Switch size="sm" {...methods.register('isShowTarget')} />
        </FormItem>
        <FormItem label="專案網址" path="isShowTarget">
          <Input size="sm"></Input>
        </FormItem>
        <FormItem label="庫存限量標示" path="isLimit">
          <Switch size="sm" {...methods.register('isLimit')} />
        </FormItem>
        <Divider />
        <FormItem label="SEO描述(限 100 字內)" path="seoDescription">
          <Textarea
            size="sm"
            maxLength={100}
            placeholder="請填入SEO描述"
          ></Textarea>
        </FormItem>
        <Divider />
        <FormItem label="是否啟用" path="isAbled">
          <Switch {...methods.register('isAbled')} size="sm" />
        </FormItem>
        <div className="flex items-center justify-end gap-x-2 self-end">
          <Button size="sm" variant="outline">
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
      </Box>
    </FormProvider>
  );
};

const PaymentSettings = () => {
  const methods = useForm<Project.FormPaymentSettings>();

  const onSubmit = (data: Project.FormPaymentSettings) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Box
        as="form"
        className="flex flex-col items-start gap-y-2 p-2"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <FormItem label="付款方式" path="payment">
          <Controller
            name="payment"
            control={methods.control}
            render={() => (
              <RadioGroup>
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
          <Checkbox {...methods.register('isAllowInstallment')}>
            開啟信用卡分期
          </Checkbox>
        </FormItem>
        <FormItem label="ATM 付款" path="atmDeadline">
          <Flex className="gap-x-2" alignItems="center">
            <Text>有限繳款期限: 贊助後第</Text>
            <NumberInput
              flexShrink={0}
              size="sm"
              maxW={10}
              defaultValue={0}
              min={0}
            >
              <NumberInputField
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
            <NumberInput size="sm" maxW={10} min={0} max={15}>
              <NumberInputField
                {...methods.register('csDeadline', {
                  valueAsNumber: true
                })}
              />
            </NumberInput>
            <Text>天 23:59:59</Text>
          </Flex>
        </FormItem>
        <div className="flex items-center justify-end gap-x-2 self-end">
          <Button size="sm" variant="outline">
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
      </Box>
    </FormProvider>
  );
};

const TPListItem = ({
  label,
  children
}: {
  label: string;
  children: JSX.Element;
}) => {
  return (
    <ListItem>
      <div className="block items-center xs:flex md:block 2xl:flex">
        <Text
          flexShrink={0}
          w={{
            base: 'auto',
            xs: '125px',
            md: 'auto',
            '2xl': '125px'
          }}
        >
          {label}
        </Text>
        {children}
      </div>
    </ListItem>
  );
};

const ProjectPerView = () => {
  return (
    <List className="flex flex-col items-start gap-y-2 p-2">
      <TPListItem label="預覽連結">
        <Link w="full">xxxxx</Link>
      </TPListItem>
    </List>
  );
};

const ProjectInfo = () => {
  return (
    <List className="flex flex-col items-start gap-y-2 p-2">
      <TPListItem label="訂單總數">
        <Text w="full">3</Text>
      </TPListItem>
      <TPListItem label="交易成功人數">
        <Text w="full">3</Text>
      </TPListItem>
      <TPListItem label="待繳款金額/人數">
        <Text w="full">NT$0/0</Text>
      </TPListItem>
      <TPListItem label="集資進度">
        <Text w="full">1.00%</Text>
      </TPListItem>
      <TPListItem label="專案連結">
        <Link w="full">xxxxx</Link>
      </TPListItem>
    </List>
  );
};

const ProjectSettings = () => {
  const router = useRouter();
  const toast = useToast();

  const { id } = router.query;

  const { data, isLoading } = useSwr(
    id ? `/admin/project/${id}/info` : null,
    async () => {
      const [err, res] = await safeAwait(apiFetchProjectInfo(id as string));
      return new Promise((resolve, reject) => {
        if (res) {
          resolve(res);
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
        router.push('/admin/projects');
      }
    }
  );

  return (
    <>
      <Head>
        <title>專案管理</title>
      </Head>
      <Box
        px={{ base: 3, md: 10, lg: 20 }}
        pt={{ base: 10, lg: 20 }}
        pb={{ base: 3 }}
      >
        <Heading as="h2" size="xl" mb={{ base: 5, lg: 10 }} noOfLines={1}>
          專案管理
        </Heading>
        <Navbar></Navbar>
        <Flex
          w="full"
          flexDirection={{ base: 'column', lg: 'row' }}
          gap={{ base: 5 }}
        >
          <Flex w="full" flexDirection={{ base: 'column' }} gap={{ base: 5 }}>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  主視覺
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  編輯設定
                </Button>
              }
            >
              <KeyVisionSettings />
            </SettingsBlock>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  專案預覽
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  更新預覽網址
                </Button>
              }
            >
              <ProjectPerView />
            </SettingsBlock>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  專案資訊
                </Heading>
              }
            >
              <ProjectInfo />
            </SettingsBlock>
          </Flex>
          <Flex w="full" flexDirection={{ base: 'column' }} gap={{ base: 5 }}>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  基本設定
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  編輯設定
                </Button>
              }
            >
              <BasicSettings></BasicSettings>
            </SettingsBlock>
            <SettingsBlock
              renderHeader={
                <Heading as="h3" fontSize="2xl">
                  付款設定
                </Heading>
              }
              renderButton={
                <Button size="sm" colorScheme="primary" variant="outline">
                  編輯設定
                </Button>
              }
            >
              <PaymentSettings></PaymentSettings>
            </SettingsBlock>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default ProjectSettings;

ProjectSettings.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Box className="h-full bg-gray-200">{page}</Box>
    </AdminLayout>
  );
};
