import React, { PureComponent } from 'react';
// import { Modal, Tag, Button, Card,Table,Menu, Dropdown } from "antd";
import { Modal, Form, Input, Row, Col, Button, Radio, DatePicker, Tooltip, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PicturesWall from '../../../components/PicturesWall/PicturesWall';
import Audience from './Audience';
import SpecificationTag from './SpecificationTag';
import styles from './Advertis.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;
@Form.create()
@connect(state => ({
  advertis: state.advertis,
  advertisService: state.advertisService,
}))
class AdvertisAdd extends PureComponent {
  componentDidMount() {
    if (this.props.data.record_id) {
      this.props.dispatch({
        type: 'advertis/queryAdvertisOne',
        params: this.props.data.record_id,
      });
    } else {
      this.props.dispatch({
        type: 'advertis/savaDataElectrionOne',
        payload: {},
      });
    }
  }

  onDataoffCallback = () => {
    const {
      onAdvertisCloseCallback,
      advertis: { formData: oldFormData },
    } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = { ...oldFormData, ...values };
        if (formData.img && formData.img.length > 0) {
          formData.img = formData.img.join(',');
        }
        if (formData.link1 && formData.link2) {
          formData.link = formData.link1 + encodeURIComponent(formData.link2);
        } else {
          formData.link = '';
        }

        // 保存数据
        if (this.props.mode === 1) {
          // 编辑
          formData.record_id = this.props.data.record_id;
          this.props.dispatch({
            type: 'advertis/EditAdvertis',
            params: formData,
          });
          onAdvertisCloseCallback();
        } else if (this.props.mode === 2) {
          // 新建
          this.props.dispatch({
            type: 'advertis/insertAdvertis',
            params: formData,
          });
          onAdvertisCloseCallback();
        }
      }
    });
  };

  // 受众群体
  onAddClick=()=>{
    this.props.dispatch({
      type: 'advertis/changeFormVisibleStock',
      payload: true,
    });
  }

  handleDataFormSubmit = addlist => {
    const { form } = this.props;

    let ranges = form.getFieldValue('ranges');

    let exists = false;
    
    if(addlist){
      for (let i = 0; i < ranges.length; i += 1) {
        if (ranges[i].bu_value === addlist.bu_value) {
          exists = true;
          break;
        }
      }
    }
  
    if (!exists) {
      if(JSON.stringify(addlist) !== "{}"){
        ranges = [...ranges, addlist];
      }
      
     
    }
   
    form.setFieldsValue({ ranges });
    this.handleDataFormCancel();
  };

  handleDataFormCancel = () => {
    this.props.dispatch({
      type: 'advertis/changeFormVisibleStock',
      payload: false,
    });
  };

  renderDataForm() {
    const {
      advertis: { formVisibleStock },
    } = this.props;
    return (
      <Audience
        visible={formVisibleStock}
        onCancel={this.handleDataFormCancel}
        onSubmit={this.handleDataFormSubmit}
        closeBack={this.onProEditClose}
      />
    );
  }



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
      <Button key="close" onClick={this.props.onAdvertisCloseCallback}>
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
        onCancel={this.props.onAdvertisCloseCallback}
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
              <FormItem {...formItemLayoutOne} label="标题">
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
              <FormItem {...formItemLayoutOne} label="图片">
                {getFieldDecorator('img', {
                  initialValue: formData.img ? [formData.img] : [],
                  rules: [
                    {
                      required: true,
                      message: '请上传',
                    },
                  ],
                })(<PicturesWall num={1} bucket="park" listType="picture-card" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={20} type="flex" justify="space-between">
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label={
                  <span>
                    跳转前缀
                    <Tooltip title="(内部，外部，原生)">(内部，外部，原生)</Tooltip>
                  </span>
                }
              >
                {getFieldDecorator('link1', {
                  initialValue: formData.link1,
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(
                  <Select>
                    <Option value="jgt://jgtwebview/open?URL=">应用内部的(jgtwebview)</Option>
                    <Option value="jgt://h5app/open?URL=">应用外部的(h5app)</Option>
                    <Option value="jgt://jgtnative/open?URL=">应用原生(jgtnative)</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="跳转链接（UII）">
                {getFieldDecorator('link2', {
                  initialValue: formData.link2,
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
                  initialValue: formData.atype ? formData.atype : 1,
                  rules: [
                    {
                      required: true,
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
                  initialValue: formData.status ? formData.status : 1,
                  rules: [
                    {
                      required: true,
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
          <Row>
            <Col span={24}>
              <FormItem {...formItemLayoutOne} label="受众群体">
                {getFieldDecorator('memos', {
                  // initialValue: formData.memo,
                  // rules: [
                  //   {
                  //     required: false,
                  //     message: '请选择',
                  //   },s
                  // ],
                })(
                  <Button icon="plus" type="primary" onClick={() => this.onAddClick()}>
                    新增受众群体
                  </Button>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item {...formItemLayoutOne} label="受众群体列表">
                {getFieldDecorator('ranges', {
                  initialValue: formData.ranges || [],
                  rules: [
                    {
                      required: false,
                      message: '请选择',
                    },
                  ],
                })(<SpecificationTag />)}
              </Form.Item>
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
          {this.renderDataForm()}
        </Form>
      </Modal>
    );
    return resultJsx;
  }
}
export default AdvertisAdd;
