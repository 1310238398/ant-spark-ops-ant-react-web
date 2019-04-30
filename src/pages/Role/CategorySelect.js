import React, { PureComponent } from 'react';
import { Cascader } from 'antd';
import { query } from '@/services/dictionary';

const sep = '/';

function parseValue(value) {
  return value ? value.split(sep) : [];
}

export default class RoleSelectCategory extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: parseValue(props.value),
      data: [],
    };
  }

  componentDidMount() {
    query({ q: 'tree', parent_code: 'com$#EnterpriseCategory', level: '-1' }).then(data => {
      this.setState({ data: this.toTreeSelect(data.list) });
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, value: parseValue(nextProps.value) };
    }
    return state;
  }

  toTreeSelect = data => {
    if (!data) {
      return [];
    }
    const newData = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = { ...data[i], label: data[i].name, value: data[i].code };
      if (item.children && item.children.length > 0) {
        item.children = this.toTreeSelect(item.children);
      }
      newData.push(item);
    }
    return newData;
  };

  handleChange = value => {
    this.setState({ value });
    this.triggerChange(value);
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data.join(sep));
    }
  };

  render() {
    const { value, data } = this.state;

    return (
      <Cascader
        value={value}
        options={data}
        onChange={this.handleChange}
        placeholder="请选择所属分类"
        style={{ width: '100%' }}
      />
    );
  }
}
