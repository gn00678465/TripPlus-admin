import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useMemo, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { debounce } from 'lodash-es';
import type { ReactElement } from 'react';
import { BlankLayout } from '@/components';
import {
  Heading,
  Button,
  InputGroup,
  InputRightElement,
  Input,
  Card,
  CardBody,
  Icon,
  Tag,
  IconButton,
  Select,
  Flex,
  Box,
  Link
} from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';
import { createColumnHelper, SortingState } from '@tanstack/react-table';
import { DataTable, Pagination, LogoutBtn } from '@/components';
import { MdAdd, MdArrowDropDown, MdOutlineSearch } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { IoNewspaperOutline } from 'react-icons/io5';
import { RiDashboard3Line } from 'react-icons/ri';
import { currency, safeAwait } from '@/utils';
import {
  useElementSize,
  usePagination,
  useWindowSize,
  usePaginationState
} from '@/hooks';
import useSwr from 'swr';
import { apiFetchProjects } from '@/api';
import { useTeamStore } from '@/store';

interface SelectOptions {
  value: string;
  label: string;
}

interface QueryState {
  query?: null | string;
  status?: null | string;
  type?: null | string;
}

interface QueryAction {
  type: 'setQuery' | 'setStatus' | 'setType';
  payload: string;
}

const type: SelectOptions[] = [
  {
    value: 'project',
    label: '募資'
  },
  {
    value: 'product',
    label: '商品'
  }
];

const status: SelectOptions[] = [
  {
    value: 'draft',
    label: '草稿'
  },
  {
    value: 'progress',
    label: '進行中'
  },
  {
    value: 'complete',
    label: '已結束'
  }
];

function handleQueryString(
  pagination: usePaginationState,
  query: QueryState,
  sorting: SortingState
) {
  const [sort] = sorting;

  let sortObj: Record<string, string> = {};

  if (sort) {
    switch (sort.id) {
      case 'status':
        sortObj.sortStatus = sort.desc ? 'desc' : 'asc';
        break;
      case 'type':
        sortObj.sortType = sort.desc ? 'desc' : 'asc';
        break;
      case 'title':
        sortObj.sortTitle = sort.desc ? 'desc' : 'asc';
        break;
      case 'teamId':
        sortObj.sortTeam = sort.desc ? 'desc' : 'asc';
        break;
      case 'target':
        sortObj.sortSum = sort.desc ? 'desc' : 'asc';
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

const AdminProjects = () => {
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const compositionLockRef = useRef<boolean>(false);

  const windowSize = useWindowSize({});
  const [headerW, headerH] = useElementSize(headerRef);
  const [toolbarW, toolbarH] = useElementSize(toolbarRef);
  const [paginationW, paginationH] = useElementSize(paginationRef);

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
  const [sorting, setSorting] = useState<SortingState>([]);

  const qs = useMemo(
    () => handleQueryString(pagination, query, sorting),
    [pagination, query, sorting]
  );

  // query
  const { data: projectListData, isLoading } = useSwr(
    ['/admin/projects', qs],
    async ([key, qs]) => {
      const [err, data] = await safeAwait(apiFetchProjects(qs));
      return new Promise<ApiProject.ProjectList>((resolve, reject) => {
        if (data) {
          resolve(data.data || []);
        }
        if (err) {
          reject(err);
        }
      });
    },
    {
      onSuccess(data, key, config) {
        setTotal(data.total);
      }
    }
  );

  const tableHeight = useMemo(() => {
    if (isLargeDesktop) {
      return windowSize.height - headerH - toolbarH - paginationH - 64;
    }
    return 'auto';
  }, [windowSize, headerH, toolbarH, paginationH, isLargeDesktop]);

  const { setTeamId } = useTeamStore();

  const columnHelper = createColumnHelper<ApiProject.ProjectItem>();

  const columns = [
    columnHelper.accessor('status', {
      cell: (info) => renderStatusTag(info.getValue()),
      header: '狀態',
      size: 30
    }),
    columnHelper.accessor('type', {
      cell: (info) => renderTypeTag(info.getValue()),
      header: '類型',
      size: 30
    }),
    columnHelper.accessor('title', {
      cell: (info) => (
        <Link
          href={`/admin/${info.row.original._id}/dashboard`}
          as={NextLink}
          onClick={() => setTeamId(info.row.original.teamId._id)}
        >
          {info.getValue()}
        </Link>
      ),
      header: '專案名稱',
      size: 200
    }),
    columnHelper.accessor('teamId', {
      cell: (info) => (
        <Link
          href={`/admin/${info.row.original._id}/team`}
          as={NextLink}
          onClick={() => setTeamId(info.row.original.teamId._id)}
        >
          {info.getValue().title}
        </Link>
      ),
      header: '提案團隊',
      size: 50
    }),
    columnHelper.accessor('target', {
      cell: (info) => currency(info.getValue(), 'zh-TW', 'TWD'),
      header: '集資金額',
      size: 60,
      meta: {
        isNumeric: true
      }
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className="flex items-center justify-center gap-x-2">
          <IconButton
            aria-label="Dashboard"
            title="Dashboard"
            size="sm"
            icon={<Icon as={RiDashboard3Line} />}
            variant="outline"
            onClick={() => {
              setTeamId(info.row.original.teamId._id);
              router.push(`/admin/${info.row.original._id}/dashboard`);
            }}
          ></IconButton>
          <IconButton
            aria-label="專案管理"
            title="專案管理"
            size="sm"
            icon={<Icon as={FiEdit} />}
            variant="outline"
            onClick={() => {
              setTeamId(info.row.original.teamId._id);
              router.push(`/admin/${info.row.original._id}/settings`);
            }}
          ></IconButton>
          <IconButton
            aria-label="訂單管理"
            title="訂單管理"
            size="sm"
            icon={<Icon as={IoNewspaperOutline} />}
            variant="outline"
            onClick={() => {
              setTeamId(info.row.original.teamId._id);
              router.push(`/admin/${info.row.original._id}/orders`);
            }}
          ></IconButton>
        </div>
      ),
      header: () => <p className="text-center">Actions</p>,
      size: 60
    })
  ];

  function renderStatusTag(value: string) {
    switch (value) {
      case 'draft':
        return (
          <Tag color="white" bgColor="gray.500">
            草稿
          </Tag>
        );
      case 'progress':
        return (
          <Tag color="white" bgColor="gray.500">
            進行中
          </Tag>
        );
      case 'complete':
        return (
          <Tag color="white" bgColor="gray.500">
            已結束
          </Tag>
        );
      default:
        return <Tag>錯誤</Tag>;
    }
  }

  function renderTypeTag(value: string) {
    switch (value) {
      case 'project':
        return (
          <Tag colorScheme="primary" bgColor="primary.500" color="white">
            募資
          </Tag>
        );
      case 'product':
        return (
          <Tag color="white" bgColor="gray.500">
            商品
          </Tag>
        );
      default:
        return <Tag>錯誤</Tag>;
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

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: 'setStatus', payload: e.target.value });
  }

  function onTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    dispatch({ type: 'setType', payload: e.target.value });
  }

  return (
    <>
      <Head>
        <title>專案列表-TripPlus+</title>
      </Head>
      <LogoutBtn position="absolute" top={2} right={10} />
      <Flex h="full" w="full" flexDirection="column">
        <div
          ref={headerRef}
          className="flex shrink-0 items-center justify-between p-3 pt-12 md:px-12"
        >
          <Heading as="h2" size="xl" noOfLines={1}>
            專案列表
          </Heading>
          <NextLink href="/admin/project" passHref legacyBehavior>
            <Button
              as="a"
              leftIcon={<Icon as={MdAdd} className="text-xl" />}
              colorScheme="primary"
            >
              新增專案
            </Button>
          </NextLink>
        </div>
        <div
          ref={toolbarRef}
          className="shrink-0 bg-gray-200 p-3 sm:px-12  md:flex"
        >
          <div className="hidden sm:block sm:shrink-0 md:w-0 xl:w-1/2"></div>
          <div className="flex w-full flex-col items-center justify-end gap-y-3 sm:flex-row sm:gap-2 sm:gap-y-0">
            <Select
              className="w-full xs:w-1/3 xs:shrink-0 md:w-1/4"
              icon={<MdArrowDropDown />}
              placeholder="全部類型"
              onChange={onTypeChange}
            >
              {type.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            <Select
              className="w-full xs:w-1/3 xs:shrink-0 md:w-1/4"
              icon={<MdArrowDropDown />}
              placeholder="全部狀態"
              onChange={onStatusChange}
            >
              {status.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            <InputGroup className="w-full xs:w-1/3 md:w-2/4">
              <Input
                placeholder="搜尋專案相關資料"
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
                data={projectListData?.items || []}
                pagination={pagination}
                loading={isLoading}
                manualSorting={true}
                onSortingChange={setSorting}
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
    </>
  );
};

export default AdminProjects;

AdminProjects.getLayout = function (page: ReactElement) {
  return <BlankLayout position="relative">{page}</BlankLayout>;
};
