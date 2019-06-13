import React, { PureComponent } from 'react';
// import { Modal, Tag, Button, Card,Table,Menu, Dropdown } from "antd";
import { Modal, Form, Input, Row, Col, Button, Select } from 'antd';
import { connect } from 'dva';
import styles from './ElectronicInvoiceIssuance.less';
import ParkSelect from '@/components/ParkSelect';
// const { Option } = Select;
@Form.create()
@connect(state => ({
  electronicInvoic: state.electronicInvoic,
  electronicSellervoice: state.electronicSellervoice,
  electronicItem: state.electronicItem,
}))
class ElectronicItemAdd extends PureComponent {
  componentDidMount() {
    if (this.props.data.record_id) {
      this.props.dispatch({
        type: 'electronicItem/queryElectrioncOne',
        params: this.props.data.record_id,
      });
    }

    this.props.dispatch({
      type: 'electronicSellervoice/queryXfList',
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
          const zdetails = [];
          if (formData.details && formData.details.length > 0) {
            for (let i = 0; i < formData.details.length; i += 1) {
              zdetails.push({ invoice_config_id: formData.details[i] });
            }
          }
          delete formData.details;
          formData.details = zdetails;
          this.props.dispatch({
            type: 'electronicItem/EditElem',
            params: formData,
          });
          onElectronicCloseCallback();
        } else if (this.props.mode === 2) {
          // 新建
          const zdetails = [];
          if (formData.details && formData.details.length > 0) {
            for (let i = 0; i < formData.details.length; i += 1) {
              zdetails.push({ invoice_config_id: formData.details[i] });
            }
          }
          delete formData.details;
          formData.details = zdetails;

          this.props.dispatch({
            type: 'electronicItem/insertElem',
            params: formData,
          });
          onElectronicCloseCallback();
        }
      }
    });
  };

  handleXfData = value => {
    this.props.dispatch({
      type: 'electronicItem/queryPZList',
      params: { seller_id: value },
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

    const { getFieldDecorator } = this.props.form;
    const {
      mode,
      electronicSellervoice: { xfList },
      electronicItem: { electrioncOne, pzList },
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
        title={mode === 1 ? '电子发票业务配置项编辑' : '电子发票业务配置项新建'}
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
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="业务编号">
                {getFieldDecorator('code', {
                  initialValue: electrioncOne.code,
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
              <Form.Item {...formItemLayout} label="业务名称">
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
          </Row>

          <Row gutter={10} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属园区">
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
            <Col span={12}>
              <Form.Item {...formItemLayout} label="税收销售方名称">
                {getFieldDecorator('seller_id', {
                  initialValue: electrioncOne.seller_id,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择" onChange={this.handleXfData}>
                    {xfList.map(item => {
                      return (
                        <Select.Option key={item.record_id} value={item.record_id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...formItemLayout} label="开票配置项">
                {getFieldDecorator('details', {
                  initialValue: electrioncOne.details,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择" mode="multiple">
                    {pzList.map(item => {
                      return (
                        <Select.Option key={item.record_id} value={item.record_id}>
                          {item.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
    return resultJsx;
  }
}
export default ElectronicItemAdd;
