import React, { PureComponent } from 'react';
// import { Modal, Tag, Button, Card,Table,Menu, Dropdown } from "antd";
import { Modal, Form, Input, Row, Col, Button, Radio } from 'antd';
import { connect } from 'dva';
import styles from './AdvertSpace.less';
import ParkSelect from '@/components/ParkSelect';
// import MultipleSelect from '@/components/MultipleSelect';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@Form.create()
@connect(state => ({
  advertSpace: state.advertSpace,
  advertSpaceService: state.advertSpaceService,
}))
class AdvertSpaceAdd extends PureComponent {
  componentDidMount() {
    if (this.props.data.record_id) {
      this.props.dispatch({
        type: 'advertSpace/queryAdvertSpaceOne',
        params: this.props.data.record_id,
      });
    } else {
      this.props.dispatch({
        type: 'advertSpace/savaDataElectrionOne',
        payload: {},
      });
    }
  }

  onDataoffCallback = () => {
    const {
      onAdvertSpaceCloseCallback,
      advertSpace: { formData: oldFormData },
    } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...oldFormData, ...values };
        if (formData.timer) {
          formData.timer = parseInt(formData.timer, 10);
        }
        // 保存数据
        if (this.props.mode === 1) {
          // 编辑
          formData.record_id = this.props.data.record_id;
          this.props.dispatch({
            type: 'advertSpace/EditElem',
            params: formData,
          });
          onAdvertSpaceCloseCallback();
        } else if (this.props.mode === 2) {
          // 新建
          this.props.dispatch({
            type: 'advertSpace/insertElem',
            params: formData,
          });
          onAdvertSpaceCloseCallback();
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
      advertSpace: { formData },
    } = this.props;
    const footerJsx = [
      <Button key="close" onClick={this.props.onAdvertSpaceCloseCallback}>
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
        title={mode === 1 ? '广告位编辑' : '广告位新建'}
        destroyOnClose
        maskClosable={false}
        onCancel={this.props.onAdvertSpaceCloseCallback}
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
              <FormItem {...formItemLayoutOne} label="编号">
                {getFieldDecorator('code', {
                  initialValue: formData.code,
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
          {/* <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="选择广告">
                {getFieldDecorator('advert_name', {
                  initialValue: formData.advert_name,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(<MultipleSelect />)}
              </FormItem>
            </Col>
          </Row> */}
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <Form.Item {...formItemLayout} label="所属园区">
                {getFieldDecorator('park_id', {
                  initialValue: formData.park_id,
                  rules: [
                    {
                      required: true,
                      message: '请选择所属园区',
                    },
                  ],
                })(<ParkSelect />)}
              </Form.Item>
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
                    <Radio value={2}>停用</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <FormItem {...formItemLayout} label="倒计时">
                {getFieldDecorator('timer', {
                  initialValue: formData.timer,
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
export default AdvertSpaceAdd;
