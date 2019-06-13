import React, { PureComponent } from 'react';
// import { Modal, Tag, Button, Card,Table,Menu, Dropdown } from "antd";
import { Modal, Form, Input, Row, Col, Button, Radio, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './Advertis.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@Form.create()
@connect(state => ({
  advertis: state.advertis,
  advertisService: state.advertisService,
}))
class AdvertisAdd extends PureComponent {
  componentDidMount() {
    if (this.props.data.record_id) {
      this.props.dispatch({
        type: 'advertis/queryElectrioncOne',
        params: this.props.data.record_id,
      });
    }
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
            type: 'advertis/EditElem',
            params: formData,
          });
          onElectronicCloseCallback();
        } else if (this.props.mode === 2) {
          // 新建
          this.props.dispatch({
            type: 'advertis/insertElem',
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
      advertis: { formData },
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
        title={mode === 1 ? '广告编辑' : '广告新建'}
        destroyOnClose
        maskClosable={false}
        onCancel={this.props.onElectronicCloseCallback}
        footer={footerJsx}
      >
        <Form>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="名称">
                {getFieldDecorator('name', {
                  initialValue: formData.name,
                  rules: [
                    {
                      required: true,
                      message: '请输入',
                    },
                  ],
                })(<Input placeholder="请输入" maxLength={100} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="显示标题">
                {getFieldDecorator('title', {
                  initialValue: formData.title,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(<Input placeholder="请输入" maxLength={100} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="图片路径">
                {getFieldDecorator('img', {
                  initialValue: formData.img,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="跳转链接">
                {getFieldDecorator('link', {
                  initialValue: formData.link,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <FormItem {...formItemLayout} label="投放开始时间">
                {getFieldDecorator('delivery_start_time', {
                  initialValue: formData.delivery_start_time
                    ? moment(formData.delivery_start_time, 'YYYY-MM-DD HH:mm:ss')
                    : '',
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <DatePicker
                    placeholder="选择时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="投放结束时间">
                {getFieldDecorator('delivery_end_time', {
                  initialValue: formData.delivery_end_time
                    ? moment(formData.delivery_end_time, 'YYYY-MM-DD HH:mm:ss')
                    : '',
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(
                  <DatePicker
                    placeholder="选择时间"
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <FormItem {...formItemLayout} label="广告类型">
                {getFieldDecorator('atype', {
                  initialValue: formData.atype,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <RadioGroup value={formData.atype}>
                    <Radio value={1}>图</Radio>
                    <Radio value={2}>图文</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="状态">
                {getFieldDecorator('status', {
                  initialValue: formData.status,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <RadioGroup value={formData.status}>
                    <Radio value={1}>启用</Radio>
                    <Radio value={2}>禁用</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <FormItem {...formItemLayout} label="点击次数">
                {getFieldDecorator('click_number', {
                  initialValue: formData.click_number,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<Input placeholder="请输入" maxLength={100} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="备注">
                {getFieldDecorator('memo', {
                  initialValue: formData.memo,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<Input.TextArea rows={2} placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
    return resultJsx;
  }
}
export default AdvertisAdd;
