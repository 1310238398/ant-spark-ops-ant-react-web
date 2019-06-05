import React, { PureComponent } from 'react';
// import { Modal, Tag, Button, Card,Table,Menu, Dropdown } from "antd";
import { Modal, Form, Input, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import styles from './ElectronicInvoiceIssuance.less';
import ParkSelect from '@/components/ParkSelect';
import { checkPhoneNum } from '@/utils/utils';
// const { Option } = Select;
const FormItem = Form.Item;
@Form.create()
@connect(state => ({
  electronicSellervoice: state.electronicSellervoice,
}))
class ElectronicSellervoiceAdd extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'electronicSellervoice/queryElectrioncOne',
      params: this.props.data.record_id,
    });
  }

  onDataoffCallback = () => {
    const { onElectronicCloseCallback } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };

        // 保存数据
        if (this.props.mode === 1) {
          // 编辑
          formData.record_id = this.props.data.record_id;
          this.props.dispatch({
            type: 'electronicSellervoice/EditElem',
            params: formData,
          });
          onElectronicCloseCallback();
        } else if (this.props.mode === 2) {
          // 新建
          this.props.dispatch({
            type: 'electronicSellervoice/insertElem',
            params: formData,
          });
          onElectronicCloseCallback();
        }
      }
    });
  };

  /**
   * 界面渲染
   */
  render() {
    // Item布局
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formItemLayoutOne = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const {
      mode,
      electronicSellervoice: { electrioncOne },
    } = this.props;
    const footerJsx = [
      <Button key="close" onClick={this.props.onElectronicCloseCallback}>
        关闭
      </Button>,
      <Button key="unauth" onClick={this.onDataoffCallback}>
        保存
      </Button>,
    ];

    const resultJsx = (
      <Modal
        className={styles.frame}
        visible
        title={mode === 1 ? '电子发票销售方配置项编辑' : '电子发票销售方配置项新建'}
        destroyOnClose
        maskClosable={false}
        onCancel={this.props.onElectronicCloseCallback}
        footer={footerJsx}
      >
        {/* {
                    this.state.bigImagefading ? <div  className={styles.popoverbackdrop}  onClick={() => this.hideBigImagefading()}>
                    <img className={styles.imgresponsive} src={this.state.ShowUrlfading} />
                    </div> : null
                } */}
        <Form>
          <Row gutter={5} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                  initialValue: electrioncOne.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" maxLength={100} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="税号">
                {getFieldDecorator('tax_number', {
                  initialValue: electrioncOne.tax_number,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" maxLength={100} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={5} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="电话">
                {getFieldDecorator('tel', {
                  initialValue: electrioncOne.tel,
                  rules: [
                    {
                      required: false,
                      message: '请输入',
                    },
                    { validator: checkPhoneNum },
                  ],
                })(<Input placeholder="请输入" maxLength={100} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="开票人">
                {getFieldDecorator('issuer', {
                  initialValue: electrioncOne.issuer,
                  rules: [
                    {
                      required: false,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={5} type="flex" justify="space-between">
            <Col span={24}>
              <Form.Item {...formItemLayoutOne} label="所属园区">
                {getFieldDecorator('park_id', {
                  initialValue: electrioncOne.park_id,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<ParkSelect />)}
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={5} type="flex" justify="space-between">
            <Col span={24}>
              <Form.Item {...formItemLayoutOne} label="编码">
                {getFieldDecorator('code', {
                  initialValue: electrioncOne.code,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          </Row> */}
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="开户行及账号">
                {getFieldDecorator('account', {
                  initialValue: electrioncOne.account,
                  rules: [
                    {
                      required: false,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="地址">
                {getFieldDecorator('address', {
                  initialValue: electrioncOne.address,
                  rules: [
                    {
                      required: false,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
    return resultJsx;
  }
}
export default ElectronicSellervoiceAdd;
