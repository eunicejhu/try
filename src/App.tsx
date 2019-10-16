import { Drawer, Table } from "antd";
import { PaginationProps } from "antd/lib/pagination";
import React, { lazy, Suspense, useEffect, useState } from "react";
import reqwest from "reqwest";
import "./App.css";

const DashboardComponent = lazy(() => import("./components/Dashboard"));
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: "20%"
  },
  {
    title: "Gender",
    dataIndex: "gender",
    filters: [
      { text: "Male", value: "male" },
      { text: "Female", value: "female" }
    ],
    width: "20%"
  },
  {
    title: "Email",
    dataIndex: "email"
  }
];
const App: React.FC = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1
  } as PaginationProps);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalSelectedRowKeys, setTotalSelectedRowKeys] = useState({});
  const [visible, setVisible] = useState(false);
  const [clickDrawerCount, setClickDrawerCount] = useState(0);

  useEffect(() => {
    fetch();
  }, []);

  const handleTableChange = (pagination: PaginationProps, filters, sorter) => {
    console.log({ pagination });
    const pager: PaginationProps = { ...pagination };
    pager.current = pagination.current;
    setPagination(pager);
    // handle selectedRowKey for current page , and totalSelectedRowKeys
    if (Object.keys(totalSelectedRowKeys).includes(pager.current.toString())) {
      setSelectedRowKeys(totalSelectedRowKeys[pager.current.toString()]);
    } else {
      setSelectedRowKeys([]);
    }
    fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };

  const fetch = (params = {}) => {
    console.log("params:", params);
    setLoading(true);
    reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      data: {
        results: 10,
        ...params
      },
      type: "json"
    }).then(data => {
      const copyPagination: PaginationProps = { ...pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      copyPagination.total = 200;
      setLoading(false);
      setData(data.results);
      setPagination(copyPagination);
    });
  };

  const onSelectChange = selectedRowKeys => {
    const copyTotalSelectedRowKeys = { ...totalSelectedRowKeys };
    copyTotalSelectedRowKeys[pagination.current] = selectedRowKeys;
    // check totalSectedRowKeys
    console.log(Object.values(copyTotalSelectedRowKeys));
    setSelectedRowKeys(selectedRowKeys);
    setTotalSelectedRowKeys(copyTotalSelectedRowKeys);
    setVisible(!!Object.values(copyTotalSelectedRowKeys).flat().length);
  };
  const onClose = () => {
    setVisible(false);
  };

  const updateClickDrawerCount = () => {
    setClickDrawerCount(clickDrawerCount + 1);
  };

  return (
    <>
      <Suspense fallback={<div>loading Dashboard</div>}>
        <DashboardComponent
          updateClickDrawerCount={updateClickDrawerCount}
        ></DashboardComponent>
      </Suspense>
      <Table
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        rowKey={(record, index) => index.toString()}
      />
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        mask={false}
      >
        <p data-testid="selectedCount">
          {Object.values(totalSelectedRowKeys).flat().length}
        </p>
      </Drawer>
    </>
  );
};

export default App;
