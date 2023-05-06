import Head from 'next/head';
import { useEffect, useState, useRef, useMemo } from 'react';
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
  Select
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, Pagination, DropdownOptions } from './components';
import { MdAdd, MdArrowDropDown, MdOutlineSearch } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { IoNewspaperOutline } from 'react-icons/io5';
import { RiDashboard3Line } from 'react-icons/ri';
import { currency } from '@/utils';
import { useElementSize, usePagination } from '@/hooks';

type Data = {
  category: string;
  status: string;
  title: string;
  team: string;
  sum: number;
};

const data: Data[] = [
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '商品',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  },
  {
    category: '募資',
    status: '草稿',
    title: '台灣世界展望會「籃海計畫」用籃球教育翻轉偏鄉孩子人生...',
    team: '台灣世界展望會',
    sum: 100000
  }
];

const category: DropdownOptions[] = [
  {
    key: 'funding',
    label: '募資',
    onClick: () => {}
  }
];

const status: DropdownOptions[] = [
  {
    key: 'draft',
    label: '草稿',
    onClick: () => {}
  }
];

const AdminProjects = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [headerWidth, headerHeight] = useElementSize(headerRef);
  const [searchWidth, searchHeight] = useElementSize(searchRef);
  const [paginationWidth, paginationHeight] = useElementSize(paginationRef);

  const [pagination, setPagination] = usePagination({
    total: 100,
    defaultPage: 1,
    defaultPageSize: 10
  });

  const tableHeight = useMemo(() => {
    return windowSize.height - headerHeight - searchHeight - paginationHeight;
  }, [windowSize, headerHeight, searchHeight, paginationHeight]);

  const columnHelper = createColumnHelper<Data>();

  const columns = [
    columnHelper.accessor('status', {
      cell: (info) => info.getValue(),
      header: '狀態',
      size: 30
    }),
    columnHelper.accessor('category', {
      cell: (info) => renderCategoryTag(info.getValue()),
      header: '類型',
      size: 30
    }),
    columnHelper.accessor('title', {
      cell: (info) => info.getValue(),
      header: '專案名稱',
      size: 200
    }),
    columnHelper.accessor('team', {
      cell: (info) => info.getValue(),
      header: '提案團隊',
      size: 50
    }),
    columnHelper.accessor('sum', {
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
            aria-label=""
            size="sm"
            icon={<Icon as={RiDashboard3Line} />}
            variant="outline"
            onClick={() => {
              console.log(info);
            }}
          ></IconButton>
          <IconButton
            aria-label=""
            size="sm"
            icon={<Icon as={FiEdit} />}
            variant="outline"
            onClick={() => {
              console.log(info);
            }}
          ></IconButton>
          <IconButton
            aria-label=""
            size="sm"
            icon={<Icon as={IoNewspaperOutline} />}
            variant="outline"
            onClick={() => {
              console.log(info);
            }}
          ></IconButton>
        </div>
      ),
      header: () => <p className="text-center">Actions</p>,
      size: 60
    })
  ];

  function renderCategoryTag(value: string) {
    switch (value) {
      case '募資':
        return (
          <Tag colorScheme="primary" bgColor="primary.400">
            {value}
          </Tag>
        );
      case '商品':
        return (
          <Tag color="white" bgColor="gray.500">
            {value}
          </Tag>
        );
      default:
        return <Tag>{value}</Tag>;
    }
  }

  function from(page: number, size: number) {
    const f = (page - 1) * size + 1;
    return `${f} - ${f + size - 1}`;
  }

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  }

  function onCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      const handler = () => {
        setWindowSize(() => ({
          width: window.innerWidth,
          height: window.innerHeight
        }));
      };

      window.addEventListener('size', handler);

      handler();

      return () => {
        window.removeEventListener('size', handler);
      };
    }
  }, []);

  return (
    <>
      <Head>
        <title>專案列表</title>
      </Head>
      <div className="flex h-full w-full flex-col">
        <div
          ref={headerRef}
          className="flex items-center justify-between p-4 pt-12 md:px-12"
        >
          <Heading as="h2" size="xl" noOfLines={1}>
            專案列表
          </Heading>
          <Button
            leftIcon={<Icon as={MdAdd} className="text-xl" />}
            colorScheme="primary"
          >
            新增專案
          </Button>
        </div>
        <div ref={searchRef} className="flex bg-gray-200 p-4 py-2  sm:px-12">
          <div className="hidden sm:block sm:shrink-0 md:w-0 xl:w-3/5"></div>
          <div className="flex w-full flex-col items-center justify-end gap-y-1 sm:flex-row sm:gap-2 sm:gap-y-0">
            <Select
              className="w-full xs:w-1/3 xs:shrink-0"
              icon={<MdArrowDropDown />}
              placeholder="全部類型"
              onChange={onCategoryChange}
            >
              {category.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </Select>
            <Select
              className="w-full xs:w-1/3 xs:shrink-0"
              icon={<MdArrowDropDown />}
              placeholder="全部狀態"
              onChange={onStatusChange}
            >
              {status.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </Select>
            <InputGroup className="w-full xs:w-1/3 xs:shrink-0" width="auto">
              <Input placeholder="搜尋專案相關資料" bg="white" />
              <InputRightElement>
                <Icon as={MdOutlineSearch} />
              </InputRightElement>
            </InputGroup>
          </div>
        </div>
        <div className="grow bg-gray-100 p-4 sm:px-12">
          <Card borderRadius={2} variant="outline">
            <CardBody>
              <DataTable
                columns={columns}
                data={data}
                height={tableHeight - 90}
                pagination={pagination}
              ></DataTable>
              <div
                ref={paginationRef}
                className="mt-4 flex items-center justify-between px-3"
              >
                <p>
                  {from(pagination.page, pagination.pageSize)} of{' '}
                  {pagination.pageSize}
                </p>
                <Pagination
                  page={pagination.page}
                  pageCount={pagination.pageCount}
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  onPageChange={setPagination.setPage}
                  onPrevPage={setPagination.prev}
                  onNextPage={setPagination.next}
                ></Pagination>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminProjects;

AdminProjects.getLayout = function (page: ReactElement) {
  return <BlankLayout>{page}</BlankLayout>;
};
