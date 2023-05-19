import Head from 'next/head';
import Image from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  FormControl,
  FormErrorMessage,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  useToast
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Icon } from '@chakra-ui/react';
import { MdAccountCircle, MdVpnKey } from 'react-icons/md';
import bg from '@/assets/images/login-bg.jpg';
import { login } from '@/api';
import { safeAwait } from '@/utils';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store';

type FormInputs = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const router = useRouter();
  const toast = useToast();
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    const [err, res] = await safeAwait(login(data));
    if (err) {
      toast({
        position: 'top',
        title: '登入錯誤!',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
    if (res) {
      if (!res.data.roles.includes('admin')) {
        toast({
          position: 'top',
          title: '權限不足!',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        router.push('/');
      } else {
        setUserInfo(res.data);
        router.push('/admin/projects');
      }
    }
  };

  return (
    <>
      <Head>
        <title>後台登入-TripPlus+</title>
      </Head>
      <div className="flex h-screen w-screen items-center justify-center">
        <Image
          src={bg}
          alt="login"
          quality={100}
          placeholder="blur"
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        ></Image>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card
            className="backdrop-blur-sm backdrop-brightness-95 md:w-[500px]"
            variant="filled"
            bg="transparent"
          >
            <CardHeader py="12">
              <h2 className="text-center font-alkatra text-4xl font-bold text-primary">
                TripPlus+
              </h2>
            </CardHeader>
            <CardBody py="0">
              <Stack spacing={6} px="4">
                <FormControl isInvalid={!!errors.email}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon
                        as={MdAccountCircle}
                        className="mt-3"
                        boxSize={6}
                        color="gray.600"
                      />
                    </InputLeftElement>
                    <Input
                      bg="white"
                      size="lg"
                      placeholder="帳號"
                      type="email"
                      {...register('email', {
                        required: '請填入 E-mail!',
                        pattern: {
                          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: 'E-mail 格式錯誤'
                        }
                      })}
                    />
                  </InputGroup>
                  {!!errors.email && (
                    <FormErrorMessage className="visible">
                      {errors.email.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon
                        as={MdVpnKey}
                        className="mt-3"
                        boxSize={6}
                        color="gray.600"
                      />
                    </InputLeftElement>
                    <Input
                      bg="white"
                      size="lg"
                      placeholder="密碼"
                      type="password"
                      {...register('password', {
                        required: '請填入密碼!',
                        minLength: { value: 8, message: '密碼至少需要8碼' },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                          message:
                            '密碼至少需要包含1個大寫字母、1個小寫字母、1個數字'
                        }
                      })}
                    />
                  </InputGroup>
                  {!!errors.password && (
                    <FormErrorMessage>
                      {errors.password.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
            </CardBody>
            <CardFooter justify="center" py="12">
              <Button colorScheme="primary" type="submit" px="10">
                登入
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </>
  );
}
