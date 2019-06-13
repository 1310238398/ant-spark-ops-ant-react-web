import React, { PureComponent } from 'react';
import { Card, Form, Modal, Table, Row, Col, Button, Input, Select, Tag } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AdvertisAdd from './AdvertisAdd';
import AdvertisView from './AdvertisView';
import PButton from '@/components/PermButton';
import { formatDate } from '@/utils/utils';
import styles from './Advertis.less';

@Form.create()
@connect(state => ({
  advertisService: state.advertisService,
  advertis: state.advertis,
}))
class Advertis extends PureComponent {
  state = {
    elemInfoFrame: {
      visible: false,
      data: null,
      mode: null,
    },
    showElemInfoFrame: {
      visible: false,
      data: null,
    },
    selectedRowKeys: [],
    selectedRows: [],
  };

  pagination = {};

  componentDidMount() {
    this.props.dispatch({
      type: 'advertisService/queryXfList',
    });
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
      this.clearSelectRows();
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

  onItemViewEdit = rec => {
    this.setState({
      elemInfoFrame: {
        visible: true,
        mode: 1,
        data: rec,
      },
    });
  };

  onDataFormCallback = result => {
    if (result && result === 'ok') {
      this.props.dispatch({
        type: 'advertis/queryelemList',
      });
    }
    this.clearSelectRows();
  };

  onAddClick = () => {
    this.setState({
      elemInfoFrame: {
        visible: true,
        mode: 2,
        data: { name: '', rate: 0, flag: 1, type_code: '', seller_id: '' },
      },
    });
  };

  closeSubFrame = () => {
    this.setState({
      elemInfoFrame: {
        visible: false,
        mode: null,
        data: null,
      },
    });
  };

  onItemDelClick = item => {
    Modal.confirm({
      title: `确定删除【${item.name}】广告吗？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.record_id),
    });
  };

  // 后台传值
  onDelOKClick = rec => {
    this.props.dispatch({
      type: 'advertis/cancle',
      recordId: rec,
    });
  };

  clearSelectRows = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      return;
    }
    this.setState({ selectedRowKeys: [], selectedRows: [] });
  };

  // 查看页面
  onItemViewView = rec => {
    this.setState({
      showElemInfoFrame: {
        visible: true,
        data: rec,
      },
    });
  };

  // 关闭查看页面
  closeshowSubFrame = () => {
    this.setState({
      showElemInfoFrame: {
        visible: false,
        data: null,
      },
    });
  };

  handleTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
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
    this.clearSelectRows();
  }

  renderSearchForm() {
    const {
      form: { getFieldDecorator },
      advertis: { xfList },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="销方">
              {getFieldDecorator('tax_number')(
                <Select placeholder="请选择">
                  {xfList.map(item => {
                    return (
                      <Select.Option key={item.record_id} value={item.record_id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleResetFormClick}>
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
      advertis: {
        tableData: { list, pagination },
        loading,
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '显示标题',
        dataIndex: 'title',
      },
      {
        title: '图片路径',
        dataIndex: 'img',
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
        title: '投放开始时间',
        dataIndex: 'delivery_start_time',
        render: val => <span>{formatDate(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '投放结束时间',
        dataIndex: 'delivery_end_time',
        render: val => <span>{formatDate(val, 'YYYY-MM-DD HH:mm:ss')}</span>,
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

    return (
      <PageHeaderLayout title="广告管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                <PButton
                  key="see"
                  code="see"
                  icon="see"
                  onClick={() => this.onItemViewView(selectedRows[0])}
                >
                  查看
                </PButton>,
                <PButton
                  key="edit"
                  code="edit"
                  onClick={() => this.onItemViewEdit(selectedRows[0])}
                >
                  编辑
                </PButton>,
                <PButton
                  key="dele"
                  code="dele"
                  icon="delete"
                  type="danger"
                  onClick={() => this.onItemDelClick(selectedRows[0])}
                >
                  删除
                </PButton>,
              ]}
            </div>
            <div>
              <Table
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleTableSelectRow,
                }}
                loading={loading}
                dataSource={list}
                columns={columns}
                onChange={this.onTableChange}
                pagination={paginationProps}
              />
            </div>
          </div>
        </Card>
        {this.state.elemInfoFrame.visible && (
          <AdvertisAdd
            data={this.state.elemInfoFrame.data}
            mode={this.state.elemInfoFrame.mode}
            onElectronicCloseCallback={this.closeSubFrame}
          />
        )}
        {this.state.showElemInfoFrame.visible && (
          <AdvertisView
            data={this.state.showElemInfoFrame.data}
            onCloseCallback={this.closeshowSubFrame}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
export default Advertis;
