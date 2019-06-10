import React, { PureComponent } from 'react';
import { Select, Input } from 'antd';
import PicturesWall from '../PicturesWall/PicturesWall';

export default class MenuUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      lastValue: '',
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, value: nextProps.value || '' };
    }
    return null;
  }

  getLastValue = () => {
    const { value, lastValue } = this.state;
    if (lastValue) {
      return lastValue;
    } else if (value) {
      return value.indexOf('/') !== -1 ? '上传图片' : '手动输入';
    }
    return '手动输入';
  };

  handleInputChange = value => {
    this.setState({ value });
    this.triggerHandle(value);
  };

  PicturesChange = value => {
    let v = '';
    if (Array.isArray(value) && value.length > 0) {
      [v] = value;
    }
    this.setState({ value: v });
    this.triggerHandle(v);
  };

  handleChange = value => {
    this.setState({ lastValue: value });
  };

  triggerHandle = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { value } = this.state;
    const { Option } = Select;
    const lastValue = this.getLastValue();

    return (
      <React.Fragment>
        <Select value={lastValue} style={{ width: 150 }} onChange={this.handleChange}>
          <Option value="手动输入">手动输入</Option>
          <Option value="上传图片">上传图片</Option>
        </Select>

        <div style={{ marginTop: 10 }}>
          {lastValue === '手动输入' && (
            <Input placeholder="请输入图标标识" value={value} onChange={this.handleInputChange} />
          )}
          {lastValue === '上传图片' && (
            <PicturesWall
              value={value && value.indexOf('/') > -1 ? [value] : []}
              num={1}
              bucket="park"
              listType="picture-card"
              onChange={this.PicturesChange}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
