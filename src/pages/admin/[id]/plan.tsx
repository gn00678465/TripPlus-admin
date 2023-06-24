import { ReactElement, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { AdminLayout, ProjectWrap } from '@/components';
import ModalBox, { type ModalState } from '@/components/Modal';
import { SettingsBlock } from '@/components/Project';
import {
  Button,
  Flex,
  Box,
  useToast,
  FormLabel,
  Input,
  Text,
  FormControl,
  FormErrorMessage,
  Switch,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Skeleton,
  Stack
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useRouter } from 'next/router';
import { BiPlus } from 'react-icons/bi';
import { swrFetch } from '@/utils';
import {
  apiGetProjectPlan,
  apiPostProjectPlan,
  apiPatchProjectPlan,
  apiDeleteProjectPlan
} from '@/api';

const CKeditor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function ProjectContent() {
  const router = useRouter();
  const projId = router.query.id as string;
  const toast = useToast();
  const [content, setContent] = useState<string[]>([]);
  const [formIdx, setFormIdx] = useState<number | null>(null);
  const [planId, setPlanId] = useState<string | undefined>(undefined);

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: '',
    footer: null
  });

  const setOpenModal = (boolean: boolean): void => {
    setModal((state) => ({
      ...state,
      isOpen: boolean
    }));
  };

  const { data, mutate, isLoading } = useSWR(
    projId ? `/admin/project/${projId}/plan` : null,
    () => swrFetch(apiGetProjectPlan(projId)),
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        const fields = data.data.map((item) => {
          return {
            _id: item._id,
            title: item.title,
            content: item.content,
            price: item.price,
            isAllowMulti: item.isAllowMulti
          };
        });

        if (fields.length <= 0) {
          addPlan();
        }

        reset({
          fieldArray: fields
        });

        setContent(() => {
          return data.data.map((item) => {
            return item.content;
          });
        });
      }
    }
  );

  const { trigger: setNewPlan } = useSWRMutation(
    projId ? `/admin/project/${projId}/plan` : null,
    (key, { arg }: { arg: ApiProjectPlan.PlanBody }) =>
      swrFetch(apiPostProjectPlan(projId, arg)),
    {
      onSuccess: () => {
        toast({
          position: 'top',
          title: '已成功新增回饋方案',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      },
      onError: (err, key, config) => {
        toast({
          position: 'top',
          title: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );

  const { trigger: patchPlan } = useSWRMutation(
    projId && planId ? `/admin/project/${projId}/plan` : null,
    (key, { arg }: { arg: ApiProjectPlan.PlanBody }) =>
      swrFetch(apiPatchProjectPlan(projId, planId as string, arg)),
    {
      onSuccess: () => {
        toast({
          position: 'top',
          title: '已成功修改回饋方案',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      },
      onError: (err, key, config) => {
        toast({
          position: 'top',
          title: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );

  const { trigger: deletePlan } = useSWRMutation(
    projId ? `/admin/project/${projId}/plan/planId` : null,
    (key, { arg }: { arg: string }) =>
      swrFetch(apiDeleteProjectPlan(projId, arg)),
    {
      onSuccess: () => {
        toast({
          position: 'top',
          title: '已刪除回饋方案',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      },
      onError: (err, key, config) => {
        toast({
          position: 'top',
          title: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  );

  const addPlan = () => {
    append({
      title: '',
      price: 1,
      isAllowMulti: 1
    });
  };

  const changeContent = (data: string, index: number) => {
    setContent((state) => {
      state[index] = data;
      return state;
    });
  };

  const showRemovePlan = (index: number, planId: string | undefined) => {
    if (planId === undefined) {
      remove(index);
      return;
    }
    setModal(() => ({
      isOpen: true,
      content: '確定要刪除嗎?',
      footer: (
        <Button colorScheme="primary" onClick={() => removePlan(index, planId)}>
          確定
        </Button>
      )
    }));
  };

  const removePlan = (index: number, planId: string | undefined) => {
    remove(index);
    setContent((state) => state.filter((item, idx) => index !== idx));
    if (planId) deletePlan(planId);
    setOpenModal(false);
  };

  const clickSaveBtn = (index: number, planId: string | undefined) => {
    setFormIdx(index);
    setPlanId(planId);
  };

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm<Project.FormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fieldArray'
  });

  const onSubmit = (data: Project.FormValues) => {
    if (formIdx === null) return;
    if (content[formIdx] === undefined) {
      setContent((state) => {
        state[formIdx] = '';
        return state;
      });
    }
    if (!content[formIdx]) return;

    const payload = {
      title: data.fieldArray[formIdx].title,
      price: data.fieldArray[formIdx].price,
      content: content[formIdx],
      isAllowMulti: data.fieldArray[formIdx].isAllowMulti
    };

    if (planId) {
      patchPlan(payload);
      return;
    }

    setNewPlan(payload);
  };

  return (
    <>
      <SettingsBlock title="回饋方案">
        <Box as={'form'} onSubmit={handleSubmit(onSubmit)}>
          {isLoading && (
            <Stack>
              <Skeleton height="50px" />
              <Skeleton height="50px" />
              <Skeleton height="50px" />
            </Stack>
          )}
          {fields.map((field, index) => (
            <Flex
              key={field.id}
              borderBottom={1}
              borderStyle={'solid'}
              borderColor={'gray.200'}
              flexFlow={{ base: 'column', lg: 'row' }}
              my={6}
            >
              <Box
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight={500}
                w={{ base: 'full', lg: '24%' }}
                mt={1}
                flexShrink={0}
              >
                回饋選項 {index + 1}
              </Box>
              <Flex flexFlow={'column'} w={{ base: 'full', lg: '76%' }}>
                <Flex
                  justifyContent={'flex-end'}
                  order={{ base: 1, lg: 0 }}
                  mb={{ base: 6, lg: 0 }}
                >
                  <Box className="space-x-3">
                    <Button
                      type="submit"
                      bg={'primary.500'}
                      color={'white'}
                      _hover={{ bg: 'primary.600' }}
                      onClick={() => clickSaveBtn(index, field._id)}
                    >
                      儲存回饋選項
                    </Button>
                    <Button
                      bg={'error'}
                      color={'white'}
                      _hover={{ bg: '#DD3943' }}
                      onClick={() => showRemovePlan(index, field._id)}
                    >
                      刪除回饋選項
                    </Button>
                  </Box>
                </Flex>
                <Box mt={6}>
                  <FormControl
                    isInvalid={!!errors.fieldArray?.[index]?.title}
                    mb={10}
                  >
                    <FormLabel>回饋方案名稱</FormLabel>
                    <Input
                      type="text"
                      {...register(`fieldArray.${index}.title`, {
                        required: '請填入方案名稱'
                      })}
                      placeholder="請輸入方案名稱"
                    />
                    <Text
                      color={'gray.400'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                      mt={3}
                    >
                      長度限制 12
                      字，請單純描述品項，不要加入數量、價格、行銷字眼 (E.g. 85
                      折、免運、熱銷、最划算、前所未有、獨家)
                      等資訊，若品名不符規範遭 Facebook、Google
                      等廣告審查拒絕品項提交或警告，平台將逕行移除違反規範的宣傳字眼。
                    </Text>

                    {!!errors.fieldArray?.[index]?.title && (
                      <FormErrorMessage className="visible">
                        {errors.fieldArray[index]?.title?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors.fieldArray?.[index]?.price}
                    mb={10}
                  >
                    <FormLabel>價格</FormLabel>
                    <NumberInput defaultValue={1} min={1}>
                      <NumberInputField
                        {...register(`fieldArray.${index}.price`, {
                          required: '請填入價格',
                          validate: (value) => {
                            if (value <= 0) {
                              return '價格需大於 0';
                            }
                            return true;
                          }
                        })}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>

                    {!!errors.fieldArray?.[index]?.price && (
                      <FormErrorMessage className="visible">
                        {errors.fieldArray[index]?.price?.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl mb={10} isInvalid={content[index] === ''}>
                    <FormLabel>選項内容</FormLabel>
                    <CKeditor
                      value={content[index]}
                      name="content"
                      editorLoaded={true}
                      onChange={(data) => {
                        changeContent(data, index);
                      }}
                    />
                    <Text
                      color={'gray.400'}
                      fontSize={{ base: 'xs', md: 'sm' }}
                      mt={3}
                    >
                      僅供審核，之後可增加、刪減、或修改。
                    </Text>

                    <FormErrorMessage className="visible">
                      請填入選項内容
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl display="flex" alignItems="center" mb={10}>
                    <FormLabel htmlFor="email-alerts" mb="0">
                      允許購買多組
                    </FormLabel>
                    <Switch
                      id="email-alerts"
                      colorScheme="primary"
                      {...register(`fieldArray.${index}.isAllowMulti`)}
                    />
                  </FormControl>
                </Box>
              </Flex>
            </Flex>
          ))}

          <Box mt={6} textAlign={'center'}>
            <Button colorScheme="primary" variant="outline" onClick={addPlan}>
              <Icon as={BiPlus} mr={1} mb={1}></Icon>
              新增回饋選項
            </Button>
          </Box>
        </Box>
      </SettingsBlock>

      <ModalBox
        content={modal.content}
        isOpen={modal.isOpen}
        onClose={() => setOpenModal(false)}
        header="提醒"
        footer={modal.footer}
      ></ModalBox>
    </>
  );
}

ProjectContent.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>專案管理-回饋方案-TripPlus+</title>
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
