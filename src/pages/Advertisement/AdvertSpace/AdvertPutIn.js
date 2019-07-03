import React, { PureComponent } from 'react';

import { Modal, Tag, Button, Card, Table, Row, Col, Form, Input, message } from 'antd';
import { connect } from 'dva';
import FormItem from 'antd/lib/form/FormItem';
import styles from './AdvertSpace.less';

@Form.create()
@connect(state => ({
  advertis: state.advertis,
}))
class AdvertPutIn extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  queryForm = null;

  pagination = {};

  componentDidMount() {
    this.handleSearchFormSubmit();
  }

  handleSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }

    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      this.props.dispatch({
        type: 'advertis/queryelemList',
        params: values,
        pagination: {},
      });
    });
  };

  handleResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();

    this.props.dispatch({
      type: 'advertis/queryelemList',
      params: {},
      pagination: {},
    });
  };

  /**
   * 分页事件
   */
  onTableChange = pagination => {
    const params = this.queryForm;
    this.queryListData(params, pagination);
  };

  onBtnSearchClick = () => {
    this.pagination = {
      current: 1,
      pageSize: 10,
    };
    this.queryForm = this.props.form.getFieldsValue();
    this.queryForm.gender = this.props.arear;
    this.queryListData(this.queryForm, this.pagination);
  };

  /**
   * 清空按钮点击事件
   */
  onBtnClearClick = () => {
    this.props.form.resetFields();
  };

  // onSelectcommCallback = () => {
  //   const selectdata = [...this.state.selectedRowKeys];
  //   const { SelectcommCallback } = this.props;
  //   Modal.confirm({
  //     title: '操作确认',
  //     content: '确定要解除屏蔽此订单吗？',
  //     okType: 'danger',
  //     okText: '确定',
  //     cancelText: '取消',
  //     onOk() {
  //       SelectcommCallback(selectdata);
  //     },
  //   });
  // };

  selectRow = record => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
  };

  /**
   * 清空按钮点击事件
   */
  onBtnClearClick = () => {
    this.props.form.resetFields();
  };

  onSelectcommCallback = () => {
    const selectdata = [...this.state.selectedRowKeys];
    if (selectdata && selectdata.length > 0) {
      const listdata = { list: selectdata };
      const { onSelectcommCallback } = this.props;
      Modal.confirm({
        title: '操作确认',
        content: '确定要加入此广告吗？',
        okType: 'danger',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          onSelectcommCallback(listdata, this.props.data.record_id);
        },
      });
    } else {
      message.error('请至少选择一项广告');
    }
  };

  selectRow = record => {
    // const selectedRowKeys = [...this.state.selectedRowKeys];
    this.setState({
      selectedRowKeys: record,
    });
    //   const selectedRowKeys = [...this.state.selectedRowKeys];
    //   if (selectedRowKeys.indexOf(record.key) >= 0) {
    //     selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    //   } else {
    //     selectedRowKeys.push(record.key);
    //   }
    //   this.setState({ selectedRowKeys });
  };

  onSelectedRowKeysChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  /**
   * 查询数据
   * @param {*} pagination
   */
  queryListData(params, pagination) {
    this.props.dispatch({
      type: 'advertis/queryelemList',
      params,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  }

  render() {
    const {
      advertis: {
        tableData: { list, pagination },
        loading,
      },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const footerJsx = [
      <Button key="close" onClick={this.props.onCloseCallback}>
        关闭
      </Button>,
      <Button key="unauth" onClick={this.onSelectcommCallback}>
        选择
      </Button>,
    ];

    // 列定义
    // const colWidthShort = 100;
    // const colWidthNormal = 120;
    //   const list = [];
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '标题',
        dataIndex: 'title',
      },
      {
        title: '广告类型',
        dataIndex: 'atype',
        render: gender => {
          switch (gender) {
            case 1:
              return <Tag color="blue">图</Tag>;
            case 2:
              return <Tag color="blue">图文</Tag>;
            default:
              return null;
          }
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: gender => {
          switch (gender) {
            case 1:
              return <Tag color="blue">启用</Tag>;
            case 2:
              return <Tag color="blue">禁用</Tag>;
            default:
              return null;
          }
        },
      },
    ];
    // const {
    //   recommendedMerchandise: {
    //     CommClasslist
    //   },commodityManagement:{tableData: { list, pagination },}
    // } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => {
        return (
          <span>
            共{total}
            条记录
          </span>
        );
      },
      ...pagination,
    };
    // const { selectedRowKeys } = this.state;
    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectedRowKeysChange
    // };
    const rowSelection = {
      onChange: selectedRowKeys => {
        this.setState({
          selectedRowKeys,
        });
      },
      getCheckboxProps: record => ({
        disabled: record.recommend === true, // Column configuration not to be checked
        // recommend: record.recommend,
      }),
    };
    const resultJsx = (
      <Modal
        className={styles.frame}
        visible
        title="广告选择"
        destroyOnClose
        maskClosable={false}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <Form>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="广告名称">
                {getFieldDecorator('name', {})(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.onBtnSearchClick}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
                清空
              </Button>
            </Col>
          </Row>
        </Form>
        <Card bordered={false}>
          <Table
            rowSelection={rowSelection}
            dataSource={list}
            columns={columns}
            onChange={this.onTableChange}
            rowKey={record => record.goods_id}
            pagination={paginationProps}
            loading={loading}
            // onRow={record => ({
            //   onClick: () => {
            //     this.selectRow(record);
            //   }
            // })}
          />
        </Card>
      </Modal>
    );
    return resultJsx;
  }
}
export default AdvertPutIn;
