import React, { PureComponent } from 'react';

import { Modal } from 'antd';
import DictionaryCascader from '@/components/Dictionary/Cascader';

class Audience extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.formData ? props.formData : {},
      address: {},
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('formData' in nextProps) {
      return { ...state, data: nextProps.formData ? nextProps.formData : {} };
    }
    return state;
  }

  // 点击取消
  onCancelClick = () => {
    const { callback } = this.props;
    callback();
  };

  // 点击确定
  onOKClick = () => {
    const { address } = this.state;
    this.props.onSubmit(address);
  };


  // 选择
  handleFormChange = (fields) => {
    this.setState({
      address: {
        bu_value: fields,
        bu_type:"10",
      },
    });
  };

  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal
        title="选择受众群体"
        width={500}
        visible={visible}
        maskClosable={false}
        destroyOnClose
        onOk={this.onOKClick}
        onCancel={onCancel}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc( 100vh - 158px )', overflowY: 'auto' }}
      >
        <div>
          <DictionaryCascader
            code="ops$#role_category"
            level="-1"
            onChange={this.handleFormChange}
          />
        </div>
      </Modal>
    );
  }
}

export default Audience;
