import React, { useCallback } from "react";
import { Input, Button, DatePicker } from "antd";
import moment from "moment";
import { useMutation, useQuery } from "@apollo/client";
import { BooksData, Book } from "@/types/book";
import { ADD_BOOK, GET_BOOKS, UPDATE_BOOK } from "@/utils/graphql";
import PaginatedTable from "./PaginatedTable";
import BookForm from "./BookForm";

const { RangePicker } = DatePicker;

const BookTable: React.FC = () => {
  const { refetch } = useQuery<BooksData>(GET_BOOKS);
  const [openForm, setOpenForm] = React.useState(false);
  const [addBook, { data }] = useMutation(ADD_BOOK);
  const [updateBook, { data: updatedData }] = useMutation(UPDATE_BOOK);
  const [selectedBook, setSelectedBook] = React.useState<Book | null>(null);

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
        titleFilter: filters.title?.[0] || "",
        currentPage,
        currentLimit,
        startDate: filters.published_date?.[0]?.[0]?.format("YYYY-MM-DD"),
        endDate: filters.published_date?.[0]?.[1]?.format("YYYY-MM-DD"),
      });

      return {
        data: data.books.books,
        total: data.books.pageInfo.totalItems,
      };
    },
    [refetch, data, updatedData]
  );

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
        setSelectedKeys: (selectedKeys: string[]) => void;
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
    {
      title: "Rating",
      dataIndex: "average_rating",
      sorter: (a: Book, b: Book) => a.average_rating - b.average_rating,
    },
  ];

  const handleSubmit = async ({
    title,
    description,
    published_date,
  }: {
    title: string;
    description: string;
    published_date: string;
  }) => {
    try {
      if (selectedBook) {
        await updateBook({
          variables: {
            id: selectedBook.id,
            title,
            description: description || "",
            publishedDate: moment(published_date).format("YYYY-MM-DD"),
          },
        });
      } else {
        await addBook({
          variables: {
            title,
            description: description || "",
            publishedDate: moment(published_date).format("YYYY-MM-DD"),
          },
        });
      }
      setSelectedBook(null);
      setOpenForm(false);
    } catch (error) {
      console.error("Error adding book:", error);
      setOpenForm(false);
      setSelectedBook(null);
    }
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
          setSelectedBook(record);
          setOpenForm(true);
        }}
      />
      {openForm && (
        <BookForm
          visible={openForm}
          setVisible={setOpenForm}
          onCreate={handleSubmit}
          data={selectedBook}
          setDataToNull={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
};

export default BookTable;
