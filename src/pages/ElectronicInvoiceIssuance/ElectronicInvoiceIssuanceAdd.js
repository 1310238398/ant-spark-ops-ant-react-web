import React, { PureComponent } from 'react';
// import { Modal, Tag, Button, Card,Table,Menu, Dropdown } from "antd";
import { Modal, Form, Input, Row, Col, Button, Radio, Select, InputNumber } from 'antd';
import { connect } from 'dva';
import styles from './ElectronicInvoiceIssuance.less';
import DictionaryCascader from '@/components/Dictionary/Cascader';
import ParkSelect from '@/components/ParkSelect';
// const { Option } = Select;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@Form.create()
@connect(state => ({
  electronicInvoic: state.electronicInvoic,
  electronicSellervoice: state.electronicSellervoice,
}))
class ElectronicInvoiceIssuanceAdd extends PureComponent {
  componentDidMount() {
    if (this.props.data.record_id) {
      this.props.dispatch({
        type: 'electronicInvoic/queryElectrioncOne',
        params: this.props.data.record_id,
      });
    }

    this.props.dispatch({
      type: 'electronicSellervoice/queryelemList',
      pagination: {
        current: 1,
        pageSize: 10,
      },
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
            type: 'electronicInvoic/EditElem',
            params: formData,
          });
          onElectronicCloseCallback();
        } else if (this.props.mode === 2) {
          // 新建
          this.props.dispatch({
            type: 'electronicInvoic/insertElem',
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

    const { getFieldDecorator } = this.props.form;
    const {
      mode,
      electronicSellervoice: {
        tableData: { list },
      },
      electronicInvoic: { EletronicData },
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
        title={mode === 1 ? '电子发票配置项编辑' : '电子发票配置项新建'}
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
              <Form.Item {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                  initialValue: EletronicData.name,
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
              <Form.Item {...formItemLayout} label="税率">
                {getFieldDecorator('rate', {
                  initialValue: EletronicData.rate,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<InputNumber placeholder="请输入" maxLength={100} style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={10} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="编码">
                {getFieldDecorator('code', {
                  initialValue: EletronicData.code,
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
              <Form.Item {...formItemLayout} label="税收分类名称">
                {getFieldDecorator('tax_classification', {
                  initialValue: EletronicData.tax_classification,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<DictionaryCascader code="ops$#dzfp" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="税收销售方名称">
                {getFieldDecorator('seller_id', {
                  initialValue: EletronicData.seller_id,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select placeholder="请选择">
                    {list.map(item => {
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
              <Form.Item {...formItemLayout} label="所属园区">
                {getFieldDecorator('park_id', {
                  initialValue: EletronicData.park_id,
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
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="单价含税标志">
                {getFieldDecorator('tax_included', {
                  initialValue: EletronicData.tax_included,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <RadioGroup value={EletronicData.tax_included}>
                    <Radio value={1}>是</Radio>
                    <Radio value={2}>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
    return resultJsx;
  }
}
export default ElectronicInvoiceIssuanceAdd;
