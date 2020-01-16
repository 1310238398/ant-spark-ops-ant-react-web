import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Tag } from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import styles from './Advertis.less';
import { formatDate } from '@/utils/utils';

import TagsShow from './TagsShow';

const { Description } = DescriptionList;
@Form.create()
@connect(state => ({
  advertis: state.advertis,
}))
class AdvertisView extends React.PureComponent {
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

  render() {
    const {
      data,
      advertis: { formData },
    } = this.props;
    console.log(formData);
    const footerJsx = [
      <Button key="close" onClick={this.props.onCloseCallback}>
        关闭
      </Button>,
    ];
    return (
      <Modal
        className={styles.frame}
        visible
        title="广告信息"
        width={600}
        onCancel={this.props.onCloseCallback}
        footer={footerJsx}
      >
        <DescriptionList size="large" col={1}>
          <Description term="名称">{data.name}</Description>
          <Description term="显示标题">{data.title}</Description>
          <Description term="图片路径">
            <img src={data.img} alt="" style={{ width: 60, height: 60 }} />
          </Description>
          <Description term="跳转链接">{decodeURIComponent(data.link)}</Description>
          <Description term="投放开始时间">
            {formatDate(data.delivery_start_time, 'YYYY-MM-DD HH:mm:ss')}
          </Description>
          <Description term="投放结束时间">
            {formatDate(data.delivery_end_time, 'YYYY-MM-DD HH:mm:ss')}
          </Description>
          <Description term="广告类型">{data.atype === 1 ? '图' : '图文'}</Description>
          <Description term="状态">{data.status === 1 ? '启用' : '停用'}</Description>
          <Description term="受众群体">
            {formData.ranges && <TagsShow value={formData.ranges} />}
          </Description>
          <Description term="点击次数" col={1}>
            {data.click_number.toString()}
          </Description>
          <Description term="备注">{data.memo}</Description>
        </DescriptionList>
      </Modal>
    );
  }
}
export default AdvertisView;
