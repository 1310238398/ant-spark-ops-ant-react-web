import React, { PureComponent } from 'react';

import { Modal, Tag, Button, Card, Table, Form, Transfer } from 'antd';
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

  onSelectcommCallback = () => {
    const selectdata = this.props.advertis.putinAdvertisKeys;

    // if (selectdata && selectdata.length > 0) {
    const conten =
      selectdata && selectdata.length > 0
        ? '确定要加入此广告吗？'
        : '此广告位将暂时不进行投放广告？';
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
      content: conten,
      okType: 'danger',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        onSelectcommCallback(listdata, spaceId);
      },
    });
    // } else {
    //   message.error('请至少选择一项广告');
    // }
  };

  onChange = nextTargetKeys => {
    this.props.dispatch({
      type: 'advertis/savePutinAdvertisKeys',
      payload: nextTargetKeys,
    });
  };

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
            titles={['未投放广告列表', '待投放广告列表']}
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
