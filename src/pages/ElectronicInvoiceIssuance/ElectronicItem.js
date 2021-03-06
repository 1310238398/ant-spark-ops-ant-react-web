import React, { PureComponent } from 'react';
import { Card, Form, Modal, Table, Row, Col, Button, Input } from 'antd';
// import TableList from '../../components/TableList';
// import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ElectronicItemAdd from './ElectronicItemAdd';
import PButton from '@/components/PermButton';
import styles from './ElectronicInvoiceIssuance.less';
// import ParkSelect from '@/components/ParkSelect';

@Form.create()
@connect(state => ({
  electronicItem: state.electronicItem,
}))
class ElectronicItem extends PureComponent {
  state = {
    elemInfoFrame: {
      visible: false,
      data: null,
      mode: null,
    },
    selectedRowKeys: [],
    selectedRows: [],
  };

  pagination = {};

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'electronicInvoic/queryElectronicstatus',
    // });
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
        type: 'electronicItem/queryelemList',
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
      type: 'electronicItem/queryelemList',
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
        type: 'electronicItem/queryelemList',
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
      title: `确定删除【${item.name}】配置项吗？`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.onDelOKClick.bind(this, item.record_id),
    });
  };

  // 后台传值
  onDelOKClick = rec => {
    this.props.dispatch({
      type: 'electronicItem/cancle',
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
      type: 'electronicItem/queryelemList',
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
          {/* <Col md={6} sm={24}>
            <Form.Item label="园区">{getFieldDecorator('ParkID')(<ParkSelect />)}</Form.Item>
          </Col> */}
          <Col md={6} sm={24}>
            <Form.Item label="编号">
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
      electronicItem: {
        tableData: { list, pagination },
        loading,
      },
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    const columns = [
      {
        title: '业务编号',
        dataIndex: 'code',
      },
      {
        title: '业务名称',
        dataIndex: 'name',
      },
      {
        title: '园区',
        dataIndex: 'park_name',
      },
      {
        title: '销方',
        dataIndex: 'seller_name',
      },
      {
        title: '开票配置项+code',
        dataIndex: 'details',
        render: value => {
          let j = '';
          if (value && value.length > 0) {
            for (let i = 0; i <= value.length; i += 1) {
              if (value[i]) {
                j = `${j}[${value[i].invoice_config_name},${value[i].invoice_config_code}]`;
              }
            }

            return j;
          } else {
            return '';
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
      <PageHeaderLayout title="电子发票业务配置项">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSearchForm()}</div>
            <div className={styles.tableListOperator}>
              <PButton code="add" icon="plus" type="primary" onClick={() => this.onAddClick()}>
                新建
              </PButton>
              {selectedRows.length === 1 && [
                // <PButton
                //   key="see"
                //   code="see"
                //   icon="see"
                //   onClick={() => this.onItemViewView(selectedRows[0])}
                // >
                //   查看
                // </PButton>,
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
          <ElectronicItemAdd
            data={this.state.elemInfoFrame.data}
            mode={this.state.elemInfoFrame.mode}
            onElectronicCloseCallback={this.closeSubFrame}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
export default ElectronicItem;
