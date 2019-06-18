import React from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon, Modal, Button } from 'antd';
import {authHeader} from '@/utils/request';
import styles from './PicturesWall.less';

const defaction = '/ops/web/v1/files';

export default class PicturesWall extends React.Component {
  static propTypes = {
    accept: PropTypes.string,
    bucket: PropTypes.string.isRequired,
    num: PropTypes.number,
    listType: PropTypes.oneOf(['picture-card', 'picture', 'text']),
    rich: PropTypes.object,
    showUploadList: PropTypes.bool,
    // value: PropTypes.arrayOf(PropTypes.string),
    action: PropTypes.string,
  };

  static defaultProps = {
    accept: '*',
    num: 3,
    rich: null,
    showUploadList: true,
    listType: 'text',
    //  value: undefined,
    action: defaction,
  };

  constructor(props) {
    super(props);
    const { value, num, action, name } = props;

    const filelist = [];
    this.validFilelist = [];
    if (value && value.length) {
      this.validFilelist = [...value];
      let i = -1;

      for (const item of value) {
        filelist.push({
          uid: `${i}`,
          name: item,
          status: 'done',
          url: item,
          thumbUrl: item,
        });
        i += -1;
      }
    }
    let fnum = 9;
    if (num > 0) {
      fnum = num;
    }
    let a = defaction;
    if (action) {
      a = action;
    }
    this.fileList = filelist;
    this.state = {
      action: a,
      previewVisible: false,
      previewImage: '',
      num: fnum,
      name: name || 'data',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { previewVisible } = this.state;
    if (previewVisible !== nextState.previewVisible) {
      return true;
    }

    if (nextProps.value) {
      const fileList = nextProps.value;
      if (fileList) {
        if (!this.isChg(fileList)) {
          // 无变化
          return null;
        }
        this.validFilelist = [...fileList];
        // 获取新增的文件列表
        const tmp = fileList.filter(item => !this.fileList.some(i => i.url === item));
        // 原来的文件列表
        const old = this.fileList;
        // 正在上传的文件列表
        const nodone = old.filter(item => item.status !== 'done');
        // 原来已经传完的文件列表,并且是以改变的值
        const done = old.filter(
          item => item.status === 'done' && fileList.some(i => item.url === i)
        );
        // 合并
        let i = -1;
        for (const item of tmp) {
          done.push({
            uid: `${i}`,
            name: item,
            status: 'done',
            url: item,
            thumbUrl: item,
          });
          i += -1;
        }
        done.sort((a, b) => {
          let ak = 0;
          let bk = 0;
          for (const key in fileList) {
            if (a.url === fileList[key]) {
              ak = key;
            } else if (b.url === fileList[key]) {
              bk = key;
            }
          }
          return ak - bk;
        });
        for (const item of nodone) {
          done.push(item);
        }
        this.fileList = done;
      }
    }
    return true;
  }

  triggerChange = ({ fileList }) => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      const tmp = fileList.filter(item => ({}.hasOwnProperty.call(item, 'url')));
      const out = tmp.map(item => {
        if ({}.hasOwnProperty.call(item, 'url')) {
          return item.url;
        }
        return '';
      });
      if (this.isChg(out)) {
        this.validFilelist = [...out];
        onChange(out);
      }
    }
  };

  isChg = fileList => {
    if (this.validFilelist.length !== fileList.length) {
      return true;
    }
    for (const key in fileList) {
      if (!this.validFilelist[key] || fileList[key] !== this.validFilelist[key]) {
        return true;
      }
    }
    return false;
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = info => {
    let { fileList } = info;

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    fileList = fileList.slice(-this.state.num);

    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      const out = { ...file };
      if (out.response) {
        // Component will show file.url as link
        out.url = out.response.url;
      }
      return out;
    });

    // 3. Filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (file.response) {
        return !!file.response.url;
      }
      return true;
    });
    // const oldList = this.state.fileList;
    // fileList = [...oldList, ...fileList];
    this.fileList = fileList;
    // this.setState({ fileList });
    this.forceUpdate();
    this.triggerChange({ fileList });
  };

  insertRich = previewImage => {
    const { rich } = this.props;
    if (!rich) {
      return;
    }
    rich.insertImages(previewImage);
    // const s = rich.current.getValue();
    // ContentUtils.insertMedias(s, [{ url: previewImage,type:"IMAGE",name: previewImage }]);
    // ContentUtils.insertText(s,"测试插入");
  };

  render() {
    const { previewVisible, previewImage, action, name } = this.state;
    const { listType, bucket, accept, rich, showUploadList, disabled } = this.props;
    const { fileList } = this;
    const uprop = {
      action,
      showUploadList,
      listType,
      fileList,
      data: { bucket },
      name,
      disabled,
      headers: {
        Authorization: authHeader(),
      },
    };
    if (accept) {
      uprop.accept = accept;
    }
    if (listType === 'picture-card') {
      const uploadButton = (
        <div key="rc-upload-upload">
          <Icon type="plus" />
          <div className={styles.antUploadText}>上传</div>
        </div>
      );
      const vprop = {};
      if (rich) {
        vprop.okText = '插入';
        vprop.onOk = () => this.insertRich(previewImage);
      } else {
        vprop.footer = null;
      }
      return (
        <div className="clearfix">
          <Upload {...uprop} onPreview={this.handlePreview} onChange={this.handleChange}>
            {fileList.length >= this.props.num ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} onCancel={this.handleCancel} {...vprop}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      );
    }
    if (listType === 'picture') {
      return (
        <div className="clearfix">
          <Upload {...uprop} onPreview={this.handlePreview} onChange={this.handleChange}>
            {fileList.length >= this.props.num ? null : (
              <Button>
                <Icon type="upload" /> 上传
              </Button>
            )}
          </Upload>
        </div>
      );
    }
    return (
      <div className="clearfix">
        <Upload {...uprop} onPreview={this.handlePreview} onChange={this.handleChange}>
          {fileList.length >= this.props.num ? null : (
            <Button>
              <Icon type="upload" /> 上传
            </Button>
          )}
        </Upload>
      </div>
    );
  }
}
