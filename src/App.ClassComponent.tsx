import { Drawer, Table } from "antd";
import { PaginationProps } from "antd/lib/pagination";
import React from "react";
import reqwest from "reqwest";
import "./App.css";
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
class App extends React.Component {
  state = {
    data: [],
    pagination: { current: 1 },
    loading: false,
    selectedRowKeys: [],
    totalSelectedRowKeys: {},
    visible: false,
    disabled: true
  };

  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination: PaginationProps, filters, sorter) => {
    console.log({ pagination });
    const pager: PaginationProps = { ...this.state.pagination };
    pager.current = pagination.current;
    // handle selectedRowKey for current page , and totalSelectedRowKeys
    if (
      Object.keys(this.state.totalSelectedRowKeys).includes(
        pager.current.toString()
      )
    ) {
      this.setState({
        pagination: pager,
        selectedRowKeys: this.state.totalSelectedRowKeys[
          pager.current.toString()
        ]
      });
    } else {
      this.setState({
        pagination: pager,
        selectedRowKeys: []
      });
    }

    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };

  fetch = (params = {}) => {
    console.log("params:", params);
    this.setState({ loading: true });
    reqwest({
      url: "https://randomuser.me/api",
      method: "get",
      data: {
        results: 10,
        ...params
      },
      type: "json"
    }).then(data => {
      const pagination: PaginationProps = { ...this.state.pagination };
      // Read total count from server
      // pagination.total = data.totalCount;
      pagination.total = 200;
      this.setState({
        loading: false,
        data: data.results,
        pagination
      });
    });
  };

  onSelectChange = selectedRowKeys => {
    const copyTotalSelectedRowKeys = { ...this.state.totalSelectedRowKeys };
    copyTotalSelectedRowKeys[this.state.pagination.current] = selectedRowKeys;
    // check totalSectedRowKeys
    console.log(Object.values(copyTotalSelectedRowKeys));
    this.setState({
      selectedRowKeys,
      totalSelectedRowKeys: copyTotalSelectedRowKeys,
      visible: !!Object.values(copyTotalSelectedRowKeys).flat().length
    });
  };
  onClose = () => this.setState({ visible: false });

  render() {
    return (
      <>
        <Table
          columns={columns}
          rowSelection={{
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange
          }}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          rowKey={(record, index) => index.toString()}
        />
        <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          mask={false}
        >
          <p data-testid="selectedCount">
            {Object.values(this.state.totalSelectedRowKeys).flat().length}
          </p>
        </Drawer>
      </>
    );
  }
}

export default App;
