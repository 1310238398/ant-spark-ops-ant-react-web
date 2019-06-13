import React from 'react';
import { Modal, Form, Button } from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import styles from './Advertis.less';

const { Description } = DescriptionList;
@Form.create()
class AdvertisView extends React.PureComponent {
  render() {
    const { data } = this.props;
    const footerJsx = [
      <Button key="close" onClick={this.props.onCloseCallback}>
        关闭
      </Button>,
    ];
    return (
      <Modal
        className={styles.frame}
        visible
        title="广告信息"
        width={600}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <DescriptionList size="large" col={1}>
          <Description term="名称">{data.name}</Description>
          <Description term="显示标题">{data.title}</Description>
          <Description term="图片路径">{data.img}</Description>
          <Description term="跳转链接">{data.link}</Description>
          <Description term="投放开始时间">{data.delivery_start_time}</Description>
          <Description term="投放结束时间">{data.delivery_end_time}</Description>
          <Description term="广告类型">{data.atype === 1 ? '图' : '图文'}</Description>
          <Description term="状态">{data.status === 1 ? '启用' : '停用'}</Description>
          <Description term="点击次数">{data.click_number}</Description>
          <Description term="备注">{data.memo}</Description>
        </DescriptionList>
      </Modal>
    );
  }
}
export default AdvertisView;
