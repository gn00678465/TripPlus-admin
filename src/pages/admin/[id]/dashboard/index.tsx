import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useRef, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Tag,
  BoxProps,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Divider,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import { AdminLayout, Chat } from '@/components';
// import { init, getInstanceByDom } from 'echarts';
// import type { EChartsOption, ECharts, SetOptionOpts } from 'echarts';
import useSWR from 'swr';
import { apiFetchDashboard } from '@/api';
import { swrFetch, numberWithCommas } from '@/utils';
import { categoryEnum } from '@/enums';

// const ChartsBlock = ({ ...rest }) => {
//   const chartRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     let chart: ECharts | undefined;
//     if (chartRef.current !== null) {
//       chart = init(chartRef.current);
//     }

//     function resizeChart() {
//       chart?.resize();
//     }
//     window.addEventListener('resize', resizeChart);
//     return () => {
//       chart?.dispose();
//       window.removeEventListener('resize', resizeChart);
//     };
//   }, []);

//   useEffect(() => {
//     const option: EChartsOption = {
//       grid: {
//         top: '24px',
//         bottom: '24px',
//         right: '4px'
//       },
//       xAxis: {
//         type: 'category',
//         data: ['Landing', 'Site', 'App', 'Board', 'Bill'],
//         axisLabel: {
//           color: '#1A1A1A',
//           interval: 1
//         }
//       },
//       yAxis: {
//         type: 'value',
//         min: 0,
//         max: 100,
//         interval: 25
//       },
//       series: [
//         {
//           data: [30, 40, 50, 60, 70],
//           type: 'bar',
//           barWidth: 16,
//           label: {
//             show: true,
//             position: 'top',
//             valueAnimation: true,
//             color: '#1A1A1A'
//           }
//         }
//       ],
//       color: ['#00BDBD', '#00C2FF']
//     };
//     // Update chart
//     if (chartRef.current !== null) {
//       const chart = getInstanceByDom(chartRef.current);
//       chart?.setOption(option);
//     }
//   }, []);

//   return (
//     <Box {...rest}>
//       <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>
//     </Box>
//   );
// };

interface DashboardBlockProps extends BoxProps {
  title: string;
}

const DashboardBlock = ({ title, children, ...rest }: DashboardBlockProps) => {
  return (
    <Box
      backgroundColor="white"
      px={{ base: 3, lg: 6, '2xl': 6 }}
      pt={{ base: 4, lg: 6, '2xl': 6 }}
      pb={{ base: 6, lg: 10, '2xl': 12 }}
      borderRadius={2}
      {...rest}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Heading
          fontSize={{ base: 'md', '2xl': 'xl' }}
          as="h4"
          color="gray.900"
          letterSpacing="1px"
        >
          {title}
        </Heading>
      </Flex>
      {children}
    </Box>
  );
};

interface CompareBox extends BoxProps {
  count?: number;
  header: string;
  compare: number;
}

const CompareBox = ({
  count = 0,
  header,
  compare = 0,
  ...rest
}: CompareBox) => {
  return (
    <Box
      className="space-y-1 xl:space-y-2"
      flexGrow={{ base: 1 }}
      textAlign="left"
      color="gray.900"
      {...rest}
    >
      <Text fontSize={{ base: 'xs', xl: 'sm' }}>{header}</Text>
      <Text
        fontSize={{ base: '2xl' }}
        mb={{ base: 1 }}
        lineHeight={{ base: '28px' }}
      >
        {count}
      </Text>
      <Text fontSize={{ base: 'xs', xl: 'sm' }}>
        和昨天比
        <span
          className={`ml-2 ${
            compare === 0
              ? 'text-gray-900'
              : compare > 0
              ? 'text-secondary'
              : 'text-error'
          }`}
        >{`${compare}%`}</span>
      </Text>
    </Box>
  );
};

interface CounterBoxProps extends BoxProps {
  count?: number;
  label: string;
}

const CounterBox = ({ count = 0, label, ...rest }: CounterBoxProps) => {
  return (
    <Box
      flexGrow={{ base: 1, '2xl': 0 }}
      textAlign="center"
      h={{ base: '51px', xl: '72px' }}
      {...rest}
    >
      <Text
        color="secondary.500"
        fontSize={{ base: '2xl', xl: '4xl' }}
        mb={{ base: 1, xl: 2 }}
        lineHeight={{ base: '28px', xl: '44px' }}
      >
        {numberWithCommas(count)}
      </Text>
      <Text
        color="gray.500"
        lineHeight={{ base: '18px', xl: '21px' }}
        fontWeight={{ base: 400 }}
        fontSize={{ base: 'xs', xl: 'sm' }}
      >
        {label}
      </Text>
    </Box>
  );
};

const ProjectDashboard = () => {
  const router = useRouter();
  const toast = useToast();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  const { data, mutate, error } = useSWR(
    id ? `/admin/project/${id}/content` : null,
    () => swrFetch(apiFetchDashboard(id as string)),
    {
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        setIsLoading(false);
      },
      onError(err: Service.FailedResult, key, config) {
        if (err.message === '路由資訊錯誤') {
          router.push('/admin/projects');
          toast({
            position: 'top',
            title: '登入錯誤!',
            description: '此專案不存在',
            status: 'error',
            duration: 5000,
            isClosable: true
          });
          setIsLoading(false);
        }
      }
    }
  );

  const category = useMemo(() => {
    if (data) {
      return categoryEnum.find(
        (item) => item.value === data.data.projectCategory
      )?.label;
    }
    return '-';
  }, [data]);

  return (
    <Box
      minH="calc(100vh)"
      w="full"
      backgroundColor="gray.100"
      px={{ base: 3, md: 8, xl: 16, '2xl': 20 }}
      pt={{ base: 10, xl: 16, '2xl': 20 }}
      pb={{ base: '76px' }}
      fontSize={{ base: 'sm', md: 'md' }}
      pos="relative"
    >
      <Flex
        alignItems={{ base: 'flex-start', '2xl': 'center' }}
        className="gap-x-3"
        mb={{ base: 5, lg: 10 }}
      >
        <Tag
          flexShrink={0}
          size="lg"
          px={{ base: 5 }}
          py={{ base: 2 }}
          variant="solid"
          color="secondary.500"
          backgroundColor="secondary.100"
        >
          募資
        </Tag>
        <h2 className="text-xl font-medium leading-6 tracking-[1px] text-gray-900 md:line-clamp-2 2xl:text-[28px] 2xl:font-bold 2xl:leading-8">
          {data?.data.projectTitle}
        </h2>
      </Flex>
      <Flex
        w="full"
        className="gap-y-4 2xl:gap-x-6"
        flexDirection={{ base: 'column', '2xl': 'row' }}
      >
        <Flex
          className="gap-y-4 2xl:gap-y-6"
          flexDirection={{ base: 'column' }}
          minW={{ base: 'full', '2xl': '910px' }}
        >
          <Skeleton isLoaded={!isLoading}>
            <DashboardBlock title="進行中的活動">
              <div className="my-6 flex flex-wrap gap-y-6">
                <CounterBox
                  flexBasis={{
                    base: 'calc(100% / 3)',
                    '2xl': 'calc(100% / 4)'
                  }}
                  borderRightWidth={{ base: '1px' }}
                  borderStyle={{ base: 'solid' }}
                  borderColor={{ base: 'gary.200' }}
                  count={data?.data.targetAmount}
                  label="募資目標金額"
                ></CounterBox>
                <CounterBox
                  flexBasis={{
                    base: 'calc(100% / 3)',
                    '2xl': 'calc(100% / 4)'
                  }}
                  borderRightWidth={{ base: '1px' }}
                  borderStyle={{ base: 'solid' }}
                  borderColor={{ base: 'gary.200' }}
                  label="累計贊助金額"
                  count={data?.data.accumulatedAmount}
                ></CounterBox>
                <CounterBox
                  flexBasis={{
                    base: 'calc(100% / 3)',
                    '2xl': 'calc(100% / 4)'
                  }}
                  label="累計贊助人數"
                  borderRightWidth={{ '2xl': '1px' }}
                  borderStyle={{ '2xl': 'solid' }}
                  borderColor={{ '2xl': 'gary.200' }}
                  count={data?.data.accumulatedSponsor}
                ></CounterBox>
                <CounterBox
                  flexBasis={{ base: 'calc(100% / 4)' }}
                  label="活動追蹤人數"
                  borderRightWidth={{ base: '1px', '2xl': 0 }}
                  borderStyle={{ base: 'solid' }}
                  borderColor={{ base: 'gary.200' }}
                  count={data?.data.followerAmount}
                ></CounterBox>
                <CounterBox
                  flexBasis={{
                    base: 'calc(100% / 4)'
                  }}
                  label="待付款訂單"
                  borderRightWidth={{ base: '1px' }}
                  borderStyle={{ base: 'solid' }}
                  borderColor={{ base: 'gary.200' }}
                  count={data?.data.unpaidOrder}
                ></CounterBox>
                <CounterBox
                  flexBasis={{
                    base: 'calc(100% / 4)'
                  }}
                  borderRightWidth={{ base: '1px' }}
                  borderStyle={{ base: 'solid' }}
                  borderColor={{ base: 'gary.200' }}
                  count={data?.data.paidOrder}
                  label="已付款訂單"
                ></CounterBox>
                <CounterBox
                  flexBasis={{
                    base: 'calc(100% / 4)'
                  }}
                  count={data?.data.shippedOrder}
                  label="已出貨訂單"
                ></CounterBox>
              </div>
            </DashboardBlock>
          </Skeleton>

          {/* <DashboardBlock title="數據中心">
            <Flex
              flexDirection={{ base: 'column', '2xl': 'row' }}
              mt={{ base: 6, '2xl': 12 }}
              columnGap={{ base: 0, '2xl': '60px' }}
            >
              <ChartsBlock
                mb={{ base: 6, '2xl': 0 }}
                w={{ base: 'full', '2xl': 'calc(100% / 2)' }}
                h={{ base: '240px' }}
              />
              <Grid
                w={{ base: 'full', '2xl': 'calc(100% / 2)' }}
                templateColumns="repeat(2, 1fr)"
                rowGap={{ base: 5, '2xl': 10 }}
                columnGap={{ base: 3, '2xl': 10 }}
              >
                <GridItem>
                  <CompareBox
                    header="不重複訪客數"
                    compare={-0.02}
                  ></CompareBox>
                </GridItem>
                <GridItem>
                  <CompareBox
                    header="不重複訪客數"
                    compare={+0.02}
                  ></CompareBox>
                </GridItem>
                <GridItem>
                  <CompareBox header="訂單" compare={0}></CompareBox>
                </GridItem>
                <GridItem>
                  <CompareBox header="訂單" compare={0}></CompareBox>
                </GridItem>
              </Grid>
            </Flex>
          </DashboardBlock> */}
        </Flex>
        <Skeleton flexGrow={1} isLoaded={!isLoading}>
          <DashboardBlock
            title="募資進度"
            alignSelf={{ '2xl': 'flex-start' }}
            pb={{ base: 6 }}
          >
            <Flex flexDirection="column" alignItems="center">
              <Tag
                flexShrink={0}
                alignSelf="flex-start"
                fontSize={{ base: 'xs', xl: 'sm' }}
                px={{ base: 2 }}
                py={{ base: 1 }}
                mt={{ base: 4 }}
                mb={{ base: 2 }}
                variant="solid"
                color="secondary.500"
                backgroundColor="secondary.100"
              >
                {category}
              </Tag>
              <Text
                color="gray.900"
                fontWeight={{ base: 400 }}
                letterSpacing={1}
                lineHeight={{ base: '21px' }}
                fontSize={{ base: 'sm', xl: 'md' }}
                alignSelf="flex-start"
              >
                {data?.data.projectTitle}
              </Text>
              <CircularProgress
                size="215px"
                value={data?.data.progressRate}
                color="primary.500"
                thickness="4px"
                my={{ base: 6 }}
              >
                <CircularProgressLabel className="space-y-1">
                  <Heading color="gray.900" fontSize={{ base: '36px' }}>
                    {data?.data.progressRate}%
                  </Heading>
                  <Text color="gray.500" fontSize={{ base: 'sm' }}>
                    目前已集資
                  </Text>
                </CircularProgressLabel>
              </CircularProgress>
              <Divider mb={{ base: 4 }} />
              {data?.data.countDownDays === 0 ? (
                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.900">
                  已結束
                </Text>
              ) : (
                <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.900">
                  倒數
                  <span className="mx-1 text-lg font-medium md:text-xl">
                    {data?.data.countDownDays}
                  </span>
                  天
                </Text>
              )}
            </Flex>
          </DashboardBlock>
        </Skeleton>
      </Flex>
      <Text
        className="hidden 2xl:block"
        color="gray.500"
        fontWeight={400}
        pos="absolute"
        bottom={10}
        left={20}
      >
        Copyright © 2023 TripPlus. All rights reserved.
      </Text>
      <Box
        pos={{ base: 'fixed', '2xl': 'absolute' }}
        bottom={0}
        left={{ base: 3, md: 'unset' }}
        right={{ base: 3, '2xl': 20 }}
      >
        <Chat />
      </Box>
    </Box>
  );
};

export default ProjectDashboard;

ProjectDashboard.getLayout = function (page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>Dashboard-TripPlus+</title>
      </Head>
      {page}
    </AdminLayout>
  );
};
