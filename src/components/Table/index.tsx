import { useState, useEffect } from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  Updater
} from '@tanstack/react-table';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  TableContainerProps,
  Text,
  Icon,
  Skeleton
} from '@chakra-ui/react';
import { SlDrawer } from 'react-icons/sl';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

export interface DataTableProps<T extends object> extends TableContainerProps {
  data: T[];
  columns: ColumnDef<T, any>[];
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
  };
  loading?: boolean;
  manualSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: (arg: SortingState | Updater<SortingState>) => void;
}

function SortArrows(sort?: 'asc' | 'desc') {
  return (
    <div className="relative">
      <Icon
        as={MdArrowDropUp}
        boxSize={5}
        position="absolute"
        bottom={-1.5}
        opacity={sort === 'asc' ? 1 : 0.5}
      />
      <Icon
        as={MdArrowDropDown}
        boxSize={5}
        position="absolute"
        top={-1.5}
        opacity={sort === 'desc' ? 1 : 0.5}
      />
    </div>
  );
}

export function DataTable<T extends object>({
  data,
  columns,
  height,
  pagination,
  onSortingChange,
  loading = false,
  manualSorting = false,
  ...rest
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (updater) => {
      setSorting(updater);
      onSortingChange?.(updater);
    },
    pageCount: pagination?.pageCount,
    state: {
      pagination: {
        pageIndex: pagination?.page || 1,
        pageSize: pagination?.pageSize || 10
      },
      sorting
    },
    manualPagination: true,
    manualSorting: manualSorting
  });

  function renderEmpty() {
    return (
      <Tr>
        <Td
          colSpan={columns.length}
          textAlign="center"
          color="gray.300"
          py="12"
        >
          <Icon as={SlDrawer} boxSize={16} />
          <Text mt="1">No Data</Text>
        </Td>
      </Tr>
    );
  }

  function renderSkeleton(columns: ColumnDef<T, any>[]) {
    return (
      <>
        <Tr>
          {columns.map((col, index) => {
            return (
              <Td key={index}>
                <Skeleton>
                  <Text>loading</Text>
                </Skeleton>
              </Td>
            );
          })}
        </Tr>
        <Tr>
          {columns.map((col, index) => {
            return (
              <Td key={index}>
                <Skeleton>
                  <Text>loading</Text>
                </Skeleton>
              </Td>
            );
          })}
        </Tr>
      </>
    );
  }

  return (
    <TableContainer overflowY="auto" {...rest}>
      <Table>
        <Thead position="sticky" top={0} bgColor="white" zIndex={1}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta: any = header.column.columnDef.meta;
                return (
                  <Th
                    fontSize="1rem"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    isNumeric={meta?.isNumeric}
                    style={{ width: `${header.column.getSize()}px` }}
                  >
                    <div className="flex items-center gap-x-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: SortArrows('asc'),
                        desc: SortArrows('desc')
                      }[header.column.getIsSorted() as string] ?? SortArrows()}
                    </div>
                  </Th>
                );
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody position="relative">
          {loading
            ? renderSkeleton(columns)
            : table.getRowModel().rows.length
            ? table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const meta: any = cell.column.columnDef.meta;
                    return (
                      <Td
                        key={cell.id}
                        isNumeric={meta?.isNumeric}
                        color="gray.500"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}
                </Tr>
              ))
            : renderEmpty()}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
