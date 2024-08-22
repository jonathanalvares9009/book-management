import { Author } from "@/types/author";
import { Form, Modal, Input, Radio } from "antd";
import React, { useState } from "react";

const AuthorForm = ({
  visible,
  setVisible,
  onCreate,
  data = null,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCreate: (values: any) => void;
  data?: null | Author;
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
      title={data ? "Edit Author" : "Create a new author"}
      okText="Ok"
      onCancel={() => {
        setVisible(false);
      }}
      onOk={handleCreate}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Author name is required!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="biography" label="Biography">
          <Input type="textarea" />
        </Form.Item>

        <Form.Item
          name="born_date"
          label="Born On"
          rules={[
            {
              required: true,
              message: "Birth day is required!",
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuthorForm;
