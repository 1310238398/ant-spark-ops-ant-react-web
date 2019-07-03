import React, { PureComponent } from 'react';

import { Modal, Tag, Button, Card, Table, Form, Transfer, message } from 'antd';
import { connect } from 'dva';
import difference from 'lodash/difference';
import styles from './AdvertSpace.less';

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          pagination={false}
          rowKey={record => record.record_id}
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

@Form.create()
@connect(state => ({
  advertis: state.advertis,
}))
class AdvertSpaceCS extends PureComponent {
  queryForm = null;

  pagination = {};

  componentDidMount() {
    this.props.dispatch({
      type: 'advertis/queryAdverList',
    });
    const ID = this.props.data.record_id;
    this.props.dispatch({
      type: 'advertis/queryAdverList',
      payload: { space_id: ID },
    });
  }

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
    this.queryListData(this.queryForm, this.pagination);
  };

  /**
   * 清空按钮点击事件
   */
  onBtnClearClick = () => {
    this.props.form.resetFields();
  };

  onSelectcommCallback = () => {
    const selectdata = this.props.advertis.putinAdvertisKeys;

    if (selectdata && selectdata.length > 0) {
      const selectAdvertisList = [];
      selectdata.map(v => {
        selectAdvertisList.push({ DeliveryAdvertisingID: v });
        return selectAdvertisList;
      });
      const listdata = { delivery_advertising_ids: selectAdvertisList };
      const spaceId = { space_id: this.props.data.record_id };
      const { onSelectcommCallback } = this.props;
      Modal.confirm({
        title: '操作确认',
        content: '确定要加入此广告吗？',
        okType: 'danger',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          onSelectcommCallback(listdata, spaceId);
        },
      });
    } else {
      message.error('请至少选择一项广告');
    }
  };

  onChange = nextTargetKeys => {
    this.props.dispatch({
      type: 'advertis/savePutinAdvertisKeys',
      payload: nextTargetKeys,
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
  }

  render() {
    const {
      advertis: { putinAdvertisKeys, noAdvertisList },
    } = this.props;
    const footerJsx = [
      <Button key="close" onClick={this.props.onCloseCallback}>
        关闭
      </Button>,
      <Button key="unauth" onClick={this.onSelectcommCallback}>
        选择
      </Button>,
    ];

    const leftTableColumns = [
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
    ];

    const rightTableColumns = [
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
    ];

    return (
      <Modal
        className={styles.frame}
        visible
        title="广告选择"
        destroyOnClose
        maskClosable={false}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <Card bordered={false}>
          <TableTransfer
            dataSource={noAdvertisList}
            titles={['未投放广告列表', '已投放广告列表']}
            targetKeys={putinAdvertisKeys}
            onChange={this.onChange}
            leftColumns={leftTableColumns}
            rightColumns={rightTableColumns}
          />
        </Card>
      </Modal>
    );
  }
}
export default AdvertSpaceCS;
