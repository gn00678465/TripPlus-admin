import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useRef, useMemo, Dispatch, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { debounce } from 'lodash-es';
import type { ReactElement } from 'react';
import { AdminLayout, ModalContainer, ModalContainerProps } from '@/components';
import {
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  Card,
  CardBody,
  Icon,
  IconButton,
  Flex,
  Box,
  useDisclosure,
  FormControl,
  FormLabel,
  Text,
  Select
} from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, Pagination } from '@/components';
import { MdOutlineSearch, MdCheckCircle } from 'react-icons/md';
import { IoMdOptions } from 'react-icons/io';
import { currencyTWD, swrFetch, utc2Local } from '@/utils';
import {
  useElementSize,
  usePagination,
  usePaginationState,
  useWindowSize
} from '@/hooks';
import useSwr from 'swr';
import { apiFetchOrders } from '@/api';
import { shipmentEnum, paymentStatusEnum } from '@/enums';
import { SortingState } from '@tanstack/react-table';

interface SearchFormModalProps
  extends Pick<ModalContainerProps, 'show' | 'onClose' | 'onOk'> {
  query: QueryState;
  onDispatch: Dispatch<QueryAction>;
}

interface QueryState {
  query?: string;
  status?: string;
  paidStatus?: string;
  orderDate?: string;
  shipDate?: string;
}

interface QueryAction {
  type:
    | 'setQuery'
    | 'setStatus'
    | 'setPaidStatus'
    | 'setOrderDate'
    | 'setShipDate';
  payload: string;
}

const SearchFormModal = ({
  show,
  query,
  onClose,
  onOk,
  onDispatch
}: SearchFormModalProps) => {
  return (
    <ModalContainer
      show={show}
      title="搜尋訂單"
      cancelText="取消"
      okText="搜尋"
      onOk={onOk}
      onClose={onClose}
    >
      <Box className="space-y-2">
        <FormControl>
          <FormLabel>訂單狀態</FormLabel>
          <Select
            placeholder="全部"
            defaultValue={query.status}
            onChange={(e) => {
              onDispatch({ type: 'setStatus', payload: e.target.value });
            }}
          >
            {shipmentEnum.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>付款狀態</FormLabel>
          <Select
            placeholder="全部"
            defaultValue={query.paidStatus}
            onChange={(e) => {
              onDispatch({ type: 'setPaidStatus', payload: e.target.value });
            }}
          >
            {paymentStatusEnum.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>訂購日</FormLabel>
          <Input
            type="date"
            defaultValue={query.orderDate}
            onChange={(e) => {
              onDispatch({ type: 'setOrderDate', payload: e.target.value });
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>出貨日</FormLabel>
          <Input
            type="date"
            defaultValue={query.shipDate}
            onChange={(e) => {
              onDispatch({ type: 'setShipDate', payload: e.target.value });
            }}
          />
        </FormControl>
      </Box>
    </ModalContainer>
  );
};

function useQueryParams() {
  const initQuery: QueryState = {};
  return useImmerReducer((draft: QueryState, action: QueryAction) => {
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
      setPaidStatus: (payload: string) => {
        if (payload) {
          draft.paidStatus = payload;
        } else {
          delete draft.paidStatus;
        }
      },
      setOrderDate: (payload: string) => {
        if (payload) {
          draft.orderDate = payload;
        } else {
          delete draft.orderDate;
        }
      },
      setShipDate: (payload: string) => {
        if (payload) {
          draft.shipDate = payload;
        } else {
          delete draft.shipDate;
        }
      }
    };

    const has = action.type in actionMap;
    has && actionMap[action.type](action.payload);
  }, initQuery);
}

function useQueryString(
  pagination: usePaginationState,
  query: QueryState,
  sorting: SortingState
) {
  const [sort] = sorting;

  let sortObj: Record<string, string> = {};

  if (sort) {
    switch (sort.id) {
      case 'transactionId':
        sortObj.sortOrder = sort.desc ? 'desc' : 'asc';
        break;
      case 'buyerName':
        sortObj.sortBuyer = sort.desc ? 'desc' : 'asc';
        break;
      case 'shipment':
        sortObj.sortStatus = sort.desc ? 'desc' : 'asc';
        break;
      case 'paymentStatus':
        sortObj.sortPaidStatus = sort.desc ? 'desc' : 'asc';
        break;
      case 'shipment':
        sortObj.sortShipment = sort.desc ? 'desc' : 'asc';
        break;
      case 'orderDate':
        sortObj.sortOrderDate = sort.desc ? 'desc' : 'asc';
        break;
      case 'shipDate':
        sortObj.sortShipDate = sort.desc ? 'desc' : 'asc';
        break;
      case 'total':
        sortObj.sortTotal = sort.desc ? 'desc' : 'asc';
        break;
      default:
        sortObj = {};
        break;
    }
  } else {
    sortObj = {};
  }

  const params = {
    page: pagination.page,
    limit: pagination.pageSize,
    ...query,
    ...sortObj
  };

  return new URLSearchParams(params as any).toString();
}

const AdminOrder = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
  const [sorting, setSorting] = useState<SortingState>([]);

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

  const [query, dispatch] = useQueryParams();

  const qs = useQueryString(pagination, query, sorting);

  // query
  const { data: orderListData, mutate } = useSwr(
    id ? `/admin/project/${id}/orderList` : null,
    () => swrFetch(apiFetchOrders(id as string, qs)),
    {
      suspense: isOpen,
      revalidateOnFocus: false,
      onSuccess(data, key, config) {
        setIsLoading(false);
        setTotal(data.data.total);
      }
    }
  );

  useEffect(() => {
    setIsLoading(true);
    mutate();
  }, [pagination, mutate]);

  useEffect(() => {
    setIsLoading(true);
    mutate();
  }, [sorting, mutate]);

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
        info.getValue()
          ? utc2Local(info.getValue()).format('YYYY 年 MM 月 DD 日 HH:mm')
          : '-',
      header: '訂購日',
      size: 50
    }),
    columnHelper.accessor('shipDate', {
      cell: (info) =>
        info.getValue()
          ? utc2Local(info.getValue()).format('YYYY 年 MM 月 DD 日 HH:mm')
          : '-',
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
    columnHelper.display({
      id: 'note',
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
    window.setTimeout(async () => {
      setIsLoading(true);
      await mutate();
    }, 210);
  }, 200);

  return (
    <>
      <Head>
        <title>訂單列表-TripPlus+</title>
      </Head>
      <Flex h="full" minHeight="calc(100vh)" w="full" flexDirection="column">
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
          h="full"
        >
          <Card h="full">
            <CardBody
              h="full"
              position="relative"
              pb={{ base: `${paginationH}px` }}
            >
              <DataTable
                h="full"
                minH={tableHeight}
                columns={columns}
                data={orderListData?.data.items || []}
                pagination={pagination}
                loading={isLoading}
                manualSorting={true}
                onSortingChange={(value) => {
                  setSorting(value);
                }}
              />
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
      <SearchFormModal
        show={isOpen}
        onClose={onClose}
        query={query}
        onDispatch={dispatch}
        onOk={async () => {
          setIsLoading(true);
          onClose();
          await mutate();
        }}
      />
    </>
  );
};

export default AdminOrder;

AdminOrder.getLayout = function (page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
