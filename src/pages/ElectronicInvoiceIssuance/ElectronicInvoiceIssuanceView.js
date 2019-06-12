import React from 'react';
import { Modal, Form, Button } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import styles from './ElectronicInvoiceIssuance.less';

const { Description } = DescriptionList;
@Form.create()
class ElectronicInvoiceIssuanceView extends React.PureComponent {
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
        title="电子发票配置项信息"
        width={600}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <DescriptionList size="large" col={1}>
          {/* <Description term="所在园区">{data.park_name}</Description> */}
          <Description term="名称">{data.name}</Description>
          <Description term="税率">{data.rate}</Description>
          <Description term="税收销售方名称">{data.seller_name}</Description>
          {/* <Description term="编码">{data.code}</Description> */}
          <Description term="含税标志">{data.tax_included === 1 ? '含税' : '不含税'}</Description>
          {/* <Description term="税收分类名称">
            <DicShow pcode="ops$#dzfp" code={[data.tax_classification]} />
          </Description> */}
        </DescriptionList>
      </Modal>
    );
  }
}
export default ElectronicInvoiceIssuanceView;
