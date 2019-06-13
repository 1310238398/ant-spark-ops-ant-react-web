import React from 'react';
import { Modal, Form, Button } from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import styles from './AdvertSpace.less';

const { Description } = DescriptionList;
@Form.create()
class AdvertSpaceView extends React.PureComponent {
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
        title="广告位信息"
        width={600}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <DescriptionList size="large" col={1}>
          <Description term="名称">{data.name}</Description>
          <Description term="选择广告">{data.advert_name}</Description>
          <Description term="所属园区">{data.park_name}</Description>
          <Description term="状态">{data.status === 1 ? '启用' : '停用'}</Description>
          <Description term="点击次数">{data.click_number}</Description>
          <Description term="备注">{data.memo}</Description>
        </DescriptionList>
      </Modal>
    );
  }
}
export default AdvertSpaceView;
