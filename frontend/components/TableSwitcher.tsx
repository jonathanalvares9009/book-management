import React from "react";
import { Tabs } from "antd";
import BookTable from "./BookTable";
import AuthorTable from "./AuthorTable";

const { TabPane } = Tabs;

const TableSwitcher: React.FC = () => {
  return (
    <Tabs defaultActiveKey="books">
      <TabPane tab="Books" key="books">
        <BookTable />
      </TabPane>
      <TabPane tab="Authors" key="authors">
        <AuthorTable />
      </TabPane>
    </Tabs>
  );
};

export default TableSwitcher;
