import React, { PureComponent } from 'react';
import { Card, Form, Modal, Tag, Table } from 'antd';
// import TableList from '../../components/TableList';
// import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';
import DicShowNew from '../../components/Dictionary/DicShowNew';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ElectronicInvoiceIssuanceAdd from './ElectronicInvoiceIssuanceAdd';
import ElectronicInvoiceIssuanceView from './ElectronicInvoiceIssuanceView';
import PButton from '@/components/PermButton';
import styles from './ElectronicInvoiceIssuance.less';

@Form.create()
@connect(state => ({
  electronicInvoic: state.electronicInvoic,
}))
class ElectronicInvoiceIssuance extends PureComponent {
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
    // this.props.dispatch({
    //   type: 'electronicInvoic/queryElectronicstatus',
    // });
    this.onSearchFormSubmit();
  }

  onSearchFormSubmit = () => {
    this.pagination = {
      current: 1,
      pageSize: 10,
    };
    this.queryForm = this.props.form.getFieldsValue();
    // if (this.queryForm.create_date) {
    //   const ranges = this.queryForm.create_date;
    //   this.queryForm.start_date = ranges[0].unix();
    //   this.queryForm.end_date = ranges[1].unix();
    // } else {
    //   this.queryForm.start_date = '';
    //   this.queryForm.end_date = '';
    // }
    // delete this.queryForm.create_date;
    this.queryListData(this.queryForm, this.pagination);
  };

  handleFormReset = () => {
    this.props.form.resetFields();
  };

  /**
   * 分页事件
   */
  onTableChange = pagination => {
    const params = this.queryForm;
    this.queryListData(params, pagination);
  };

  onItemViewView = rec => {
    this.setState({
      showElemInfoFrame: {
        visible: true,
        data: rec,
      },
    });
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
        type: 'electronicInvoic/queryelemList',
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

  closeshowSubFrame = () => {
    this.setState({
      showElemInfoFrame: {
        visible: false,
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
      type: 'electronicInvoic/cancle',
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
      type: 'electronicInvoic/queryelemList',
      params,
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
    this.clearSelectRows();
  }

  render() {
    const {
      electronicInvoic: {
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
        title: '税率',
        dataIndex: 'rate',
      },
      {
        title: '单位含税标志',
        dataIndex: 'tax_included',
        render: gender => {
          switch (gender) {
            case 1:
              return <Tag color="blue">含税</Tag>;
            case 2:
              return <Tag color="blue">不含税</Tag>;
            default:
              return null;
          }
        },
      },
      {
        title: '税收分类名称',
        dataIndex: 'tax_classification',
        render: val => {
          return <DicShowNew root="ops$#dzfp" code={val} />;
        },
      },
      {
        title: '税收销售方名称',
        dataIndex: 'seller_name',
      },
      {
        title: '编码',
        dataIndex: 'code',
      },
      {
        title: '所在园区',
        dataIndex: 'park_name',
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
      <PageHeaderLayout title="电子发票配置项">
        <Card bordered={false}>
          <div className={styles.tableList}>
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
          <ElectronicInvoiceIssuanceAdd
            data={this.state.elemInfoFrame.data}
            mode={this.state.elemInfoFrame.mode}
            onElectronicCloseCallback={this.closeSubFrame}
          />
        )}
        {this.state.showElemInfoFrame.visible && (
          <ElectronicInvoiceIssuanceView
            data={this.state.showElemInfoFrame.data}
            onCloseCallback={this.closeshowSubFrame}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
export default ElectronicInvoiceIssuance;
