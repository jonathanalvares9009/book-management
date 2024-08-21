import React, { useCallback } from "react";
import { Input, Button, DatePicker } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { AuthorsData, Author } from "@/types/author";
import { ADD_AUTHOR, GET_AUTHORS } from "@/utils/graphql";
import PaginatedTable from "./PaginatedTable";
import AuthorForm from "./AuthorForm";
import moment from "moment";

const { RangePicker } = DatePicker;

const AuthorTable: React.FC = () => {
  const { refetch } = useQuery<AuthorsData>(GET_AUTHORS);
  const [addAuthor, { data, loading, error }] = useMutation(ADD_AUTHOR);
  const [openForm, setOpenForm] = React.useState(false);

  const fetchData = useCallback(
    async ({
      currentPage,
      currentLimit,
      filters,
    }: {
      currentPage: number;
      currentLimit: number;
      filters: Record<string, any>;
    }) => {
      const { data } = await refetch({
        nameFilter: filters.name?.[0] || "",
        currentPage,
        currentLimit,
        startDate: filters.born_date?.[0]?.[0]?.format("YYYY-MM-DD"),
        endDate: filters.born_date?.[0]?.[1]?.format("YYYY-MM-DD"),
      });

      return {
        data: data?.authors?.authors || [],
        total: data?.authors?.pageInfo?.totalItems || 0,
      };
    },
    [refetch, data]
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a: Author, b: Author) => a.name.localeCompare(b.name),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: string[]) => void;
        selectedKeys: string[];
        confirm: () => void;
        clearFilters: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search name"
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
    },
    {
      title: "Birth Date",
      dataIndex: "born_date",
      sorter: (a: Author, b: Author) =>
        new Date(a.born_date).getTime() - new Date(b.born_date).getTime(),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: string[]) => void;
        selectedKeys: string[];
        confirm: () => void;
        clearFilters: () => void;
      }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            value={selectedKeys[0] as any}
            onChange={(dates) => setSelectedKeys(dates ? [dates as any] : [])}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              clearFilters();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
    },
  ];

  const handleSubmit = async ({
    name,
    biography,
    born_date,
  }: {
    name: string;
    biography: string;
    born_date: string;
  }) => {
    console.log(name, biography, born_date);
    await addAuthor({
      variables: {
        name,
        biography: biography || "",
        bornDate: moment(born_date).format("YYYY-MM-DD"),
      },
    });
    setOpenForm(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            setOpenForm(true);
          }}
        >
          Add New
        </Button>
      </div>
      <PaginatedTable
        columns={columns as any}
        fetchData={fetchData}
        onRowSelect={(record) => {
          console.log("Selected row:", record);
        }}
      />
      {openForm && (
        <AuthorForm
          visible={openForm}
          setVisible={setOpenForm}
          onCreate={handleSubmit}
        />
      )}
    </div>
  );
};

export default AuthorTable;
