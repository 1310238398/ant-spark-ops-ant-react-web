import React, { PureComponent } from 'react';
import { Card, Form, Modal, Table, Row, Col, Button, Input, Select, Tag } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AdvertSpaceAdd from './AdvertSpaceAdd';
import AdvertSpaceView from './AdvertSpaceView';
import AdvertSpaceCS from './AdvertSpaceCS';
import PButton from '@/components/PermButton';
import styles from './AdvertSpace.less';
import ParkSelect from '@/components/ParkSelect';

@Form.create()
@connect(state => ({
  advertSpace: state.advertSpace,
}))
class AdvertSpace extends PureComponent {
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
    showPutInFrame: {
      visible: false,
      data: null,
    },
    selectedRowKeys: [],
    selectedRows: [],
  };

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
        type: 'advertSpace/queryAdverspaceList',
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
      type: 'advertSpace/queryAdverspaceList',
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

  // onModalCallback = () => {
  //   this.setState({ dataForm: false, dataFormID: '' });
  // };

  onDataFormCallback = result => {
    // this.setState({ dataForm: false, dataFormID: '' });
    if (result && result === 'ok') {
      this.props.dispatch({
        type: 'advertSpace/queryAdverspaceList',
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
    this.clearSelectRows();
  };

  onItemDelClick = item => {
    Modal.confirm({
      title: `确定删除【${item.name}】广告位吗？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.record_id),
    });
  };

  // 后台传值
  onDelOKClick = rec => {
    this.props.dispatch({
      type: 'advertSpace/cancle',
      recordId: rec,
    });
    this.clearSelectRows();
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

  // 投放广告
  onItemPutInClick = rec => {
    this.setState({
      showPutInFrame: {
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
    this.clearSelectRows();
  };

  closeAdvertSubFrame = () => {
    this.setState({
      showPutInFrame: {
        visible: false,
        data: null,
      },
    });
    this.clearSelectRows();
  };

  handleTableSelectRow = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
      selectedRows: rows,
    });
  };

  // 投放广告-传递数据
  saveSelectAdvert = (list, adSpace) => {
    this.props.dispatch({
      type: 'advertSpace/saveAdverSpace',
      params: { list, adSpace },
    });
    this.closeAdvertSubFrame();
  };

  /**
   * 查询数据
   * @param {*} pagination
   */
  queryListData(params, pagination) {
    this.props.dispatch({
      type: 'advertSpace/queryAdverspaceList',
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearchFormSubmit} layout="inline">
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="园区">{getFieldDecorator('park_id')(<ParkSelect />)}</Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="广告状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择">
                  <Select.Option value={1}>启用</Select.Option>
                  <Select.Option value={2}>停用</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col md={6} sm={24}>
            <Form.Item label="广告位编号">
              {getFieldDecorator('code')(<Input placeholder="请输入" />)}
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
      advertSpace: {
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
        title: '编号',
        dataIndex: 'code',
      },
      {
        title: '所属园区',
        dataIndex: 'park_name',
      },
      {
        title: '点击次数',
        dataIndex: 'click_number',
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
      {
        title: '广告倒计时',
        dataIndex: 'timer',
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
      <PageHeaderLayout title="广告位管理">
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
                selectedRows[0].status === 2 && (
                  <PButton
                    key="dele"
                    code="dele"
                    icon="delete"
                    type="danger"
                    onClick={() => this.onItemDelClick(selectedRows[0])}
                  >
                    删除
                  </PButton>
                ),
                <PButton
                  key="putIn"
                  code="putIn"
                  onClick={() => this.onItemPutInClick(selectedRows[0])}
                >
                  投放广告
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
          <AdvertSpaceAdd
            data={this.state.elemInfoFrame.data}
            mode={this.state.elemInfoFrame.mode}
            onAdvertSpaceCloseCallback={this.closeSubFrame}
          />
        )}
        {this.state.showElemInfoFrame.visible && (
          <AdvertSpaceView
            data={this.state.showElemInfoFrame.data}
            onCloseCallback={this.closeshowSubFrame}
          />
        )}
        {this.state.showPutInFrame.visible && (
          <AdvertSpaceCS
            data={this.state.showPutInFrame.data}
            onCloseCallback={this.closeAdvertSubFrame}
            onSelectcommCallback={this.saveSelectAdvert}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
export default AdvertSpace;
