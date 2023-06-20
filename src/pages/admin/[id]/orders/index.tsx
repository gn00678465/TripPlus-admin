import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useRef, useMemo } from 'react';
import { useImmerReducer } from 'use-immer';
import { debounce } from 'lodash-es';
import type { ReactElement } from 'react';
import { AdminLayout, ModalContainer } from '@/components';
import {
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  Card,
  CardBody,
  Icon,
  Tag,
  IconButton,
  Flex,
  Box,
  useDisclosure,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, Pagination } from '@/components';
import { MdOutlineSearch, MdCheckCircle } from 'react-icons/md';
import { IoMdOptions } from 'react-icons/io';
import { currencyTWD, swrFetch, utc2Local } from '@/utils';
import { useElementSize, usePagination, useWindowSize } from '@/hooks';
import useSwr from 'swr';
import { apiFetchOrders } from '@/api';
import { useForm } from 'react-hook-form';

const SearchForm = () => {
  const { register } = useForm();

  return (
    <Box as="form" className="space-y-2">
      <FormControl>
        <FormLabel>訂單狀態</FormLabel>
        <Input type="email" />
      </FormControl>
      <FormControl>
        <FormLabel>付款狀態</FormLabel>
        <Input type="email" />
      </FormControl>
      <FormControl>
        <FormLabel>訂購日</FormLabel>
        <Input type="email" />
      </FormControl>
      <FormControl>
        <FormLabel>出貨日</FormLabel>
        <Input type="email" />
      </FormControl>
    </Box>
  );
};

const AdminOrder = () => {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const compositionLockRef = useRef<boolean>(false);

  const windowSize = useWindowSize({});
  const [headerW, headerH] = useElementSize(headerRef);
  const [toolbarW, toolbarH] = useElementSize(toolbarRef);
  const [paginationW, paginationH] = useElementSize(paginationRef);

  const { id } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [total, setTotal] = useState(0);

  const [isLargeMobile] = useMediaQuery('(min-width: 375px)', {
    ssr: true,
    fallback: false
  });
  const [isLargeDesktop] = useMediaQuery('(min-width: 1024px)', {
    ssr: true,
    fallback: false
  });

  const [pagination, setPagination] = usePagination({
    total,
    defaultPage: 1,
    defaultPageSize: 10
  });

  interface QueryState {
    query?: null | string;
    status?: null | string;
    type?: null | string;
  }

  interface QueryAction {
    type: 'setQuery' | 'setStatus' | 'setType';
    payload: string;
  }

  const initQuery: QueryState = {};
  const [query, dispatch] = useImmerReducer(
    (draft: QueryState, action: QueryAction) => {
      const actionMap = {
        setQuery: (payload: string) => {
          if (payload) {
            draft.query = payload;
          } else {
            delete draft.query;
          }
        },
        setStatus: (payload: string) => {
          if (payload) {
            draft.status = payload;
          } else {
            delete draft.status;
          }
        },
        setType: (payload: string) => {
          if (payload) {
            draft.type = payload;
          } else {
            delete draft.type;
          }
        }
      };

      const has = action.type in actionMap;
      has && actionMap[action.type](action.payload);
    },
    initQuery
  );

  const qs = useMemo(() => {
    const params = {
      page: pagination.page,
      limit: pagination.pageSize,
      ...query
    };
    return new URLSearchParams(params as any).toString();
  }, [pagination, query]);

  // query
  const { data: orderListData, isLoading } = useSwr(
    id ? `/admin/project/${id}/orderList` : null,
    () => swrFetch(apiFetchOrders(id as string)),
    {
      onSuccess(data, key, config) {
        setTotal(data.data.total);
      }
    }
  );

  const tableHeight = useMemo(() => {
    if (isLargeDesktop) {
      return windowSize.height - headerH - toolbarH - paginationH - 64;
    }
    return 'auto';
  }, [windowSize, headerH, toolbarH, paginationH, isLargeDesktop]);

  const columnHelper = createColumnHelper<ApiProjectOrders.Order>();

  const columns = [
    columnHelper.accessor('transactionId', {
      cell: (info) => info.getValue(),
      header: '訂單',
      size: 60
    }),
    columnHelper.accessor('buyerName', {
      cell: (info) => info.getValue(),
      header: '訂購人',
      size: 30
    }),
    columnHelper.accessor('shipmentStatus', {
      cell: (info) => renderOrderStatusTag(info.getValue()),
      header: '訂單狀態',
      size: 50
    }),
    columnHelper.accessor('paymentStatus', {
      cell: (info) => renderPaymentStatusTag(info.getValue()),
      header: '付款狀態',
      size: 50
    }),
    columnHelper.accessor('shipment', {
      cell: (info) => renderShipTag(info.getValue()),
      header: '配送方式',
      size: 50
    }),
    columnHelper.accessor('createdAt', {
      cell: (info) =>
        utc2Local(info.getValue()).format('YYYY 年 MM 月 DD 日 HH:mm'),
      header: '訂購日',
      size: 50
    }),
    columnHelper.accessor('shipDate', {
      cell: (info) =>
        utc2Local(info.getValue()).format('YYYY 年 MM 月 DD 日 HH:mm'),
      header: '出貨日',
      size: 50
    }),
    columnHelper.accessor('total', {
      cell: (info) => currencyTWD(info.getValue()),
      header: '總金額',
      size: 50,
      meta: {
        isNumeric: true
      }
    }),
    columnHelper.accessor('note', {
      cell: (info) => info.getValue(),
      header: '備註',
      size: 60
    })
  ];

  function renderOrderStatusTag(value: number) {
    switch (value) {
      case 0:
        return <Text>未出貨</Text>;
      case 1:
        return <Text>出貨中</Text>;
      case 2:
        return (
          <Text
            display="flex"
            alignItems="center"
            columnGap={1}
            color="primary.500"
          >
            <Icon as={MdCheckCircle} boxSize={4} />
            已抵達
          </Text>
        );
      default:
        return <Text color="error">錯誤</Text>;
    }
  }

  function renderPaymentStatusTag(value: number) {
    switch (value) {
      case 0:
        return (
          <Text fontWeight="semibold" color="orange">
            未付款
          </Text>
        );
      case 1:
        return (
          <Text
            display="flex"
            alignItems="center"
            columnGap={1}
            fontWeight="semibold"
            color="primary.500"
          >
            <Icon as={MdCheckCircle} boxSize={4} />
            已付款
          </Text>
        );
      default:
        return (
          <Text fontWeight="semibold" color="error">
            錯誤
          </Text>
        );
    }
  }

  function renderShipTag(value: number) {
    switch (value) {
      case 0:
        return <Text>宅配</Text>;
      case 1:
        return <Text>超商貨到付款</Text>;
      default:
        return <Text color="error">錯誤</Text>;
    }
  }

  function from(page: number, size: number) {
    const f = (page - 1) * size + 1;
    return `${f} - ${f + size - 1}`;
  }

  const debounceInputQ = debounce(function (e) {
    if (compositionLockRef.current) return;
    dispatch({ type: 'setQuery', payload: e.target.value });
  }, 200);

  return (
    <>
      <Head>
        <title>訂單列表-TripPlus+</title>
      </Head>
      <Flex h="full" w="full" flexDirection="column">
        <div
          ref={headerRef}
          className="flex shrink-0 items-center justify-between p-3 pt-12 md:px-12"
        >
          <Heading as="h2" size="xl" noOfLines={1}>
            訂單列表
          </Heading>
        </div>
        <div
          ref={toolbarRef}
          className="shrink-0 bg-gray-200 p-3 sm:px-12  md:flex"
        >
          <div className="flex w-full items-center justify-end gap-y-3 sm:flex-row sm:gap-2 sm:gap-y-0">
            <IconButton
              aria-label="optional"
              variant="ghost"
              order={{ base: 2, lg: 1 }}
              icon={<Icon as={IoMdOptions} boxSize={5} />}
              onClick={onOpen}
            />
            <InputGroup
              order={{ base: 1, lg: 2 }}
              w={{ base: 'full', xs: '33%', md: '25%', xl: '20%' }}
            >
              <Input
                placeholder="搜尋訂單"
                bg="white"
                onChange={debounceInputQ}
                onCompositionStart={(e) => {
                  compositionLockRef.current = true;
                }}
                onCompositionEnd={(e) => {
                  compositionLockRef.current = false;
                  debounceInputQ(e);
                }}
              />
              <InputRightElement>
                <Icon as={MdOutlineSearch} />
              </InputRightElement>
            </InputGroup>
          </div>
        </div>
        <Box
          flexGrow={1}
          px={{ base: 3, md: 12 }}
          py={{ base: 3 }}
          backgroundColor="gray.100"
        >
          <Card h="full">
            <CardBody h="full" position="relative">
              <DataTable
                h="auto"
                maxH={tableHeight}
                columns={columns}
                data={orderListData?.data.items || []}
                pagination={pagination}
                loading={isLoading}
              ></DataTable>
              <div
                ref={paginationRef}
                className="absolute inset-x-0 bottom-0 flex w-full flex-col items-center justify-center gap-y-2 px-5 pb-5 pt-4 md:flex-row md:justify-between"
              >
                <p>
                  {from(pagination.page, pagination.pageSize)} of {total}
                </p>
                <Pagination
                  page={pagination.page}
                  pageCount={pagination.pageCount}
                  siblingsCount={1}
                  size={isLargeMobile ? 'sm' : 'xs'}
                  variant="ghost"
                  colorScheme="primary"
                  shape="circle"
                  onPageChange={setPagination.setPage}
                  onPrevPage={() => setPagination.prev(1)}
                  onNextPage={() => setPagination.next(1)}
                ></Pagination>
              </div>
            </CardBody>
          </Card>
        </Box>
      </Flex>
      <ModalContainer show={isOpen} title="搜尋訂單" onClose={onClose}>
        <SearchForm />
      </ModalContainer>
    </>
  );
};

export default AdminOrder;

AdminOrder.getLayout = function (page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
