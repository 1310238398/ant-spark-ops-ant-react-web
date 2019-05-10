import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, InputNumber, Select } from 'antd';

@connect(state => ({
  appVersion: state.appVersion,
}))
@Form.create()
class AppVersionModal extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.duration = parseInt(formData.duration, 10);
        formData.upgrade = parseInt(formData.upgrade, 10);
        formData.status = parseInt(formData.status, 10);
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  render() {
    const {
      onCancel,
      appVersion: { formTitle, formVisible, formData, submitting },
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title={formTitle}
        width={600}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Form>
          <Form.Item {...formItemLayout} label="设备类型">
            {getFieldDecorator('device_type', {
              initialValue: formData.device_type,
              rules: [
                {
                  required: true,
                  message: '请选择设备类型',
                },
              ],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Select.Option value="Android">Android</Select.Option>
                <Select.Option value="iPhone">iPhone</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="版本号">
            {getFieldDecorator('name', {
              initialValue: formData.name,
              rules: [
                {
                  required: true,
                  message: '请输入版本号',
                },
              ],
            })(<Input placeholder="请输入版本号" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="标题">
            {getFieldDecorator('title', {
              initialValue: formData.title,
              rules: [
                {
                  required: true,
                  message: '请输入版本号',
                },
              ],
            })(<Input placeholder="请输入标题" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="描述">
            {getFieldDecorator('description', {
              initialValue: formData.description,
            })(<Input.TextArea rows={4} placeholder="请输入描述" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="下载链接">
            {getFieldDecorator('link', {
              initialValue: formData.link,
            })(<Input placeholder="请输入下载链接" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="提示间隔(分钟)">
            {getFieldDecorator('duration', {
              initialValue: formData.duration ? formData.duration.toString() : '0',
            })(<InputNumber min={0} style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="升级状态">
            {getFieldDecorator('upgrade', {
              initialValue: formData.upgrade ? formData.upgrade.toString() : '10',
            })(
              <Radio.Group>
                <Radio value="10">可选升级</Radio>
                <Radio value="20">强制升级</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="状态">
            {getFieldDecorator('status', {
              initialValue: formData.status ? formData.status.toString() : '1',
            })(
              <Radio.Group>
                <Radio value="1">正常</Radio>
                <Radio value="2">停用</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default AppVersionModal;
