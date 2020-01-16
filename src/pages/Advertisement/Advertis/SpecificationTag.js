import React, { PureComponent } from 'react';

import { Tag } from 'antd';
import { query } from '@/services/dictionary';

class SpecificationTag extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tags: props.value ? props.value : [],
      tagData: [],
    };
  }

  componentDidMount() {
    query({ q: 'tree', parent_code: 'ops$#role_category', level: -1 }).then(data => {
      this.setState({ tagData: data.list });
    });
  }

  static getDerivedStateFromProps(nextProps, state) {
    if ('value' in nextProps) {
      return { ...state, tags: nextProps.value };
    }
    return state;
  }

  handleClose = removedTag => {
    const { tags } = this.state;
    const ntags = tags.filter(tag => tag.bu_value !== removedTag);
    this.setState({ tags: ntags });
    this.triggerChange(ntags);
  };

  triggerChange = data => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(data);
    }
  };

  /**
   * 渲染标签数据：
   * tag：标签数据（示例：70$#40）
   * data: 字典树数据
   * 实现逻辑：
   * 1. 将标签以$#拆分为数组
   * 2. 遍历所有标签数据，然后查找字典树中一级的code，匹配之后存储其name
   * 3. 如果字典树含有子级，则遍历子级数组的code，匹配之后存储其name
   */
  renderTag = (tag, data) => {
    if (!tag || !data || data.length === 0) {
      return null;
    }
    const names = [];
    const tags = tag.split('$#');
    let tdata = [...data];
    for (let i = 0; i < tags.length; i += 1) {
      for (let j = 0; j < tdata.length; j += 1) {
        if (tdata[j].code === tags[i]) {
          names.push(tdata[j].name);
          if (tdata[j].children) {
            tdata = [...tdata[j].children];
          }
          break;
        }
       
      }
    }

    return <span>{names.join('/')}</span>;
  };

  render() {
    const { tags, tagData } = this.state;

    return (
      <div>
        {tags &&
          tagData.length > 0 &&
          tags.map(tag => {
            return (
              <Tag key={tag.bu_value} closable onClose={() => this.handleClose(tag.bu_value)}>
                {this.renderTag(tag.bu_value, tagData)}
              </Tag>
            );
          })}
      </div>
    );
  }
}

export default SpecificationTag;
