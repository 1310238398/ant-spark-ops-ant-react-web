import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Modal, TreeSelect, InputNumber, Row, Col } from 'antd';

@connect(({ dictionary }) => ({
  dictionary,
}))
@Form.create()
class DictionaryCard extends PureComponent {
  onOKClick = () => {
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...values };
        formData.sequence = parseInt(formData.sequence, 10);
        onSubmit(formData);
      }
    });
  };

  dispatch = action => {
    const { dispatch } = this.props;
    dispatch(action);
  };

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], title: data[i].name, value: data[i].record_id };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  render() {
    const {
      dictionary: { formVisible, formTitle, formData, submitting, treeData },
      form: { getFieldDecorator },
      onCancel,
    } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const formItemLayoutmome = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };
    return (
      <Modal
        title={formTitle}
        width={850}
        visible={formVisible}
        maskClosable={false}
        confirmLoading={submitting}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <Card bordered={false}>
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="字典名称">
                  {getFieldDecorator('name', {
                    initialValue: formData.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入字典名称',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="字典项上级">
                  {getFieldDecorator('parent_id', {
                    initialValue: formData.parent_id,
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={this.toTreeSelect(treeData)}
                      placeholder="请选择"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="字典编号">
                  {getFieldDecorator('code', {
                    initialValue: formData.code,
                    rules: [
                      {
                        required: true,
                        message: '请输入字典编号',
                      },
                    ],
                  })(<Input placeholder="请输入字典编号" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="排序值">
                  {getFieldDecorator('sequence', {
                    initialValue: formData.sequence ? formData.sequence.toString() : '1000000',
                    rules: [
                      {
                        required: true,
                        message: '请输入排序值',
                      },
                    ],
                  })(<InputNumber min={1} style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayoutmome} label="备注">
                  {getFieldDecorator('memo', {
                    initialValue: formData.memo,
                    rules: [
                      {
                        required: false,
                        message: '请输入',
                      },
                    ],
                  })(<Input.TextArea placeholder="请输入" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Modal>
    );
  }
}

export default DictionaryCard;
