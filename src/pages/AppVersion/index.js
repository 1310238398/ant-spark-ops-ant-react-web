import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Button, Table, Modal, Badge, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import PButton from '@/components/PermButton';
import AppVersionModal from './Modal';

import { formatDate } from '@/utils/utils';

import styles from './index.less';

@connect(state => ({
  loading: state.loading.models.appVersion,
  appVersion: state.appVersion,
}))
@Form.create()
class AppVersion extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    this.dispatch({
      type: 'appVersion/fetch',
      search: {},
      pagination: {},
    });
  }

  onItemDisableClick = item => {
    this.dispatch({
      type: 'appVersion/changeStatus',
      payload: { record_id: item.record_id, status: 2 },
    });
  };

  onItemEnableClick = item => {
    this.dispatch({
      type: 'appVersion/changeStatus',
      payload: { record_id: item.record_id, status: 1 },
    });
  };

  onItemEditClick = item => {
    this.dispatch({
      type: 'appVersion/loadForm',
      payload: {
        type: 'E',
        id: item.record_id,
      },
    });
  };

  onAddClick = () => {
    this.dispatch({
      type: 'appVersion/loadForm',
      payload: {
        type: 'A',
      },
    });
  };

  onDelOKClick(id) {
    this.dispatch({
      type: 'appVersion/del',
      payload: { record_id: id },
    });
    this.clearSelectRows();
  }

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  onItemDelClick = item => {
    Modal.confirm({
      title: `确定删除【应用版本数据：${item.name}】？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.record_id),
    });
  };

  onTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  onTableChange = pagination => {
    this.dispatch({
      type: 'appVersion/fetch',
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  };

  onResetFormClick = () => {
    const { form } = this.props;
    form.resetFields();
    this.dispatch({
      type: 'appVersion/fetch',
      search: {},
      pagination: {},
    });
  };

  onSearchFormSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      this.dispatch({
        type: 'appVersion/fetch',
        search: values,
        pagination: {},
      });
      this.clearSelectRows();
    });
  };

  onDataFormSubmit = data => {
    this.dispatch({
      type: 'appVersion/submit',
      payload: data,
    });
    this.clearSelectRows();
  };

  onDataFormCancel = () => {
    this.dispatch({
      type: 'appVersion/changeFormVisible',
      payload: false,
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  renderDataForm() {
    return <AppVersionModal onCancel={this.onDataFormCancel} onSubmit={this.onDataFormSubmit} />;
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.onSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={8} sm={24}>
            <Form.Item label="设备类型">
              {getFieldDecorator('device_type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="Android">Android</Select.Option>
                  <Select.Option value="iPhone">iPhone</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="版本号">
              {getFieldDecorator('version')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">正常</Select.Option>
                  <Select.Option value="2">停用</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={8} sm={24}>
            <Form.Item label="标题">
              {getFieldDecorator('title')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.onResetFormClick}>
                  重置
                </Button>
              </span>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      loading,
      appVersion: {
        data: { list, pagination },
      },
    } = this.props;

    const { selectedRows, selectedRowKeys } = this.state;

    const columns = [
      {
        title: '设备类型',
        dataIndex: 'device_type',
        width: 150,
      },
      {
        title: '版本号',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '升级标题',
        dataIndex: 'title',
      },
      {
        title: '升级状态',
        dataIndex: 'upgrade',
        width: 150,
        render: val => {
          let title = '可选升级';
          if (val === 20) {
            title = '强制升级';
          }
          return <span>{title}</span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: val => {
          if (val === 1) {
            return <Badge status="success" text="启用" />;
          }
          return <Badge status="error" text="停用" />;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 150,
        render: val => <span>{formatDate(val, 'YYYY-MM-DD HH:mm')}</span>,
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => <span>共{total}条</span>,
      ...pagination,
    };

    const breadcrumbList = [
      { title: '系统管理' },
      { title: '应用版本', href: '/system/appversion' },
    ];

    return (
      <PageHeaderLayout title="应用版本" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="edit"
                  code="edit"
                  icon="edit"
                  onClick={() => this.onItemEditClick(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="del"
                  code="del"
                  icon="delete"
                  type="danger"
                  onClick={() => this.onItemDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
                selectedRows[0].status === 2 && (
                  <PButton
                    key="enable"
                    code="enable"
                    icon="check"
                    onClick={() => this.onItemEnableClick(selectedRows[0])}
                  >
                    启用
                  </PButton>
                ),
                selectedRows[0].status === 1 && (
                  <PButton
                    key="disable"
                    code="disable"
                    icon="stop"
                    type="danger"
                    onClick={() => this.onItemDisableClick(selectedRows[0])}
                  >
                    禁用
                  </PButton>
                ),
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.onTableSelectRow,
                }}
                loading={loading}
                rowKey={record => record.record_id}
                dataSource={list}
                columns={columns}
                pagination={paginationProps}
                onChange={this.onTableChange}
                size="small"
              />
            </div>
          </div>
        </Card>
        {this.renderDataForm()}
      </PageHeaderLayout>
    );
  }
}

export default AppVersion;
