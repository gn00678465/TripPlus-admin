import Head from 'next/head';
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
  Input
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { Icon } from '@chakra-ui/react';
import { MdAccountCircle, MdVpnKey } from 'react-icons/md';

type FormInputs = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>後台登入-TripPlus+</title>
      </Head>
      <div className="flex h-screen w-screen items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="w-[500px]" variant="filled">
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
                      placeholder="account"
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
                      placeholder="password"
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
