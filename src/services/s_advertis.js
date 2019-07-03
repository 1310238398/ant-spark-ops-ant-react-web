import { stringify } from 'qs';
import request from '../utils/request';

const buRouter = 'advertisings';

const buRouterselles = 'invoice_seller_configs';

export default class AdvertisService {
  static async queryElectronicstatus() {
    return request(
      `/v1/dictionaries/tree?${stringify({
        root: `OPER$#invoice_type`,
      })}&level=1`
    );
  }

  static async queryAdvertisPageStore(params) {
    return request(`/v1/${buRouter}?${stringify(params)}`);
  }

  // 广告部分页--查询全部
  static async queryAdvertisNoPage(param) {
    return request(`/v1/${buRouter}?${stringify(param)}`);
  }

  static async insertAdvertis(params) {
    return request(`/v1/${buRouter}`, {
      method: 'POST',
      body: params,
    });
  }

  static async EditAdvertis(params) {
    return request(`/v1/${buRouter}/${params.record_id}`, {
      method: 'PUT',
      body: params,
    });
  }

  static async deleAdvertisOff(register) {
    return request(`/v1/${buRouter}/${register}`, {
      method: 'DELETE',
      body: '',
    });
  }

  static async queryElectronicSellePageStore(params) {
    return request(`/v1/${buRouterselles}?${stringify(params)}`);
  }

  static async queryXFlists(param) {
    return request(`/v1/${buRouterselles}?${stringify(param)}`);
  }

  static async insertSelleElem(params) {
    return request(`/v1/${buRouterselles}`, {
      method: 'POST',
      body: params,
    });
  }

  static async EditSelleElem(params) {
    return request(`/v1/${buRouterselles}/${params.record_id}`, {
      method: 'PUT',
      body: params,
    });
  }

  static async deleSelleOff(register) {
    return request(`/v1/${buRouterselles}/${register}`, {
      method: 'DELETE',
      body: '',
    });
  }

  static async queryAdvertisOne(params) {
    return request(`/v1/${buRouter}/${params}`);
  }

  static async queryElectrioncOne(params) {
    return request(`/v1/${buRouterselles}/${params}`);
  }
}
