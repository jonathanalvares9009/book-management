import { Book } from "@/types/book";
import { Form, Modal, Input } from "antd";
import React, { useState } from "react";

const BookForm = ({
  visible,
  setVisible,
  onCreate,
  data = null,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: (values: any) => void;
  data?: null | Book;
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
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
          <Input type="textarea" />
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
      </Form>
    </Modal>
  );
};

export default BookForm;
