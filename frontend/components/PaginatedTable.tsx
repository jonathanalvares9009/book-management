import React, { useState, useEffect, useCallback } from "react";
import { Table, TablePaginationConfig } from "antd";
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { ColumnsType } from "antd/es/table";

interface PaginatedTableProps<T> {
  columns: ColumnsType<T>;
  fetchData: (params: {
    currentPage: number;
    currentLimit: number;
    filters: Record<string, any>;
  }) => Promise<{
    data: T[];
    total: number;
  }>;
  initialPageSize?: number;
  onRowSelect: (record: T) => void;
}

function PaginatedTable<T extends object>({
  columns,
  fetchData,
  initialPageSize = 10,
  onRowSelect,
}: PaginatedTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchData({
        currentPage,
        currentLimit,
        filters,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, filters, fetchData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>
  ) => {
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    if (pagination.pageSize) {
      setCurrentLimit(pagination.pageSize);
    }
    setFilters(filters as Record<string, any>);
  };

  return (
    <Table<T>
      columns={columns}
      dataSource={data}
      loading={loading}
      onRow={(record) => ({
        onClick: () => {
          onRowSelect(record);
        },
      })}
      onChange={handleTableChange}
      pagination={{
        current: currentPage,
        pageSize: currentLimit,
        total: total,
        showSizeChanger: true,
      }}
      rowKey={(record) => (record as any).id || (record as any).key}
    />
  );
}

export default PaginatedTable;
