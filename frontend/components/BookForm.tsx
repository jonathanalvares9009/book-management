import { AuthorsData } from "@/types/author";
import { Book } from "@/types/book";
import { GET_AUTHORS } from "@/utils/graphql";
import { useQuery } from "@apollo/client";
import { Form, Modal, Input, Select, Spin } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const BookForm = ({
  visible,
  setVisible,
  onCreate,
  data = null,
  setDataToNull,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: (values: any) => void;
  setDataToNull: () => void;
  data?: null | Book;
}) => {
  const [form] = Form.useForm();
  const {
    data: authorsData,
    loading: authorsLoading,
    error: authorsError,
  } = useQuery<AuthorsData>(GET_AUTHORS);

  React.useEffect(() => {
    if (data) {
      form.setFieldsValue({ ...data, author_id: data?.author?.id || "" });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleCreate = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      visible={visible}
      title={data ? "Edit Book" : "Create a new book"}
      okText="Ok"
      onCancel={() => {
        setDataToNull();
        setVisible(false);
      }}
      onOk={handleCreate}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Book title is required!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="published_date"
          label="Published On"
          rules={[
            {
              required: true,
              message: "Published on is required!",
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item name="author_id" label="Author">
          {authorsLoading ? (
            <Spin />
          ) : authorsError ? (
            <div>Error loading authors: {authorsError.message}</div>
          ) : authorsData && authorsData.authors ? (
            <Select>
              {authorsData.authors?.authors?.map((author) => (
                <Option key={author.id} value={author.id}>
                  {author.name}
                </Option>
              ))}
            </Select>
          ) : (
            <div>No authors available</div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookForm;
