import React from 'react';
import { Modal, Form, Button } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import styles from './ElectronicInvoiceIssuance.less';

const { Description } = DescriptionList;
@Form.create()
class ElectronicSellervoiceView extends React.PureComponent {
  // componentDidMount() {
  //   const { data } = this.props;
  // }

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
        title="电子发票销售方配置项信息"
        width={600}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <DescriptionList size="large" col={1}>
          <Description term="所在园区">{data.park_name}</Description>
          <Description term="名称">{data.name}</Description>
          <Description term="税号">{data.tax_number}</Description>
          <Description term="电话">{data.tel}</Description>
          <Description term="地址">{data.address}</Description>
          <Description term="开户行及账号">{data.account}</Description>
          <Description term="开票人">{data.issuer}</Description>
          <Description term="身份认证ID">{data.auth_id}</Description>
        </DescriptionList>
      </Modal>
    );
  }
}
export default ElectronicSellervoiceView;
