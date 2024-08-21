import React, { useState, useEffect, useCallback } from "react";
import { Input, Table, TablePaginationConfig, Button, DatePicker } from "antd";
import { useQuery } from "@apollo/client";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import moment from "moment";
import { BooksData, Book } from "@/types/book";
import { GET_BOOKS } from "@/utils/graphql";

const { RangePicker } = DatePicker;

const PaginatedTable: React.FC = () => {
  const [titleFilter, setTitleFilter] = useState("");
  const [dateRange, setDateRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);

  const { loading, error, data, refetch } = useQuery<BooksData>(GET_BOOKS, {
    variables: {
      titleFilter,
      currentPage,
      currentLimit,
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleTitleFilter = useCallback((value: string) => {
    setTitleFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleDateRangeFilter = useCallback(
    (dates: [moment.Moment | null, moment.Moment | null]) => {
      setDateRange(dates);
      setCurrentPage(1); // Reset to first page when filtering
    },
    []
  );

  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<Book> | SorterResult<Book>[],
      extra: TableCurrentDataSource<Book>
    ) => {
      if (filters?.title && filters.title.length > 0) {
        handleTitleFilter(filters.title[0] as string);
      }
      if (pagination.current) {
        setCurrentPage(pagination.current);
      }
      if (pagination.pageSize) {
        setCurrentLimit(pagination.pageSize);
      }
    },
    [handleTitleFilter]
  );

  useEffect(() => {
    refetch();
  }, [titleFilter, dateRange, currentPage, currentLimit, refetch]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      showSorterTooltip: true,
      sorter: (a: Book, b: Book) => a.title.localeCompare(b.title),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (keys: string[]) => void;
        selectedKeys: string[];
        confirm: () => void;
        clearFilters: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search title"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      onFilter: (value: string, record: Book) =>
        record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Published Date",
      dataIndex: "published_date",
      sorter: (a: Book, b: Book) =>
        new Date(a.published_date).getTime() -
        new Date(b.published_date).getTime(),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (keys: any[]) => void;
        selectedKeys: any[];
        confirm: () => void;
        clearFilters: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={dateRange}
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates] : []);
              handleDateRangeFilter(
                dates as [moment.Moment | null, moment.Moment | null]
              );
            }}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => {
              confirm();
              handleDateRangeFilter(dateRange);
            }}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              handleDateRangeFilter([null, null]);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "average_rating",
      sorter: (a: Book, b: Book) => a.average_rating - b.average_rating,
    },
  ];

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Table<Book>
      columns={columns}
      dataSource={data?.books.books}
      loading={loading}
      onChange={onChange}
      pagination={{
        current: currentPage,
        pageSize: currentLimit,
        total: data?.books.pageInfo.totalItems,
        showSizeChanger: true,
      }}
      rowKey="title"
    />
  );
};

export default PaginatedTable;
