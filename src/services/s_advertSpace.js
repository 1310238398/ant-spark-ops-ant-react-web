import { stringify } from 'qs';
import request from '../utils/request';

const buRouter = 'ad_spaces';
const putIn = 'ad_deliveries';

export default class AdvertSpaceService {
  static async queryElectronicstatus() {
    return request(
      `/v1/dictionaries/tree?${stringify({
        root: `OPER$#invoice_type`,
      })}&level=1`
    );
  }

  static async queryAdvertSpacePageStore(params) {
    return request(`/v1/${buRouter}?${stringify(params)}`);
  }

  static async insertAdvertSpace(params) {
    return request(`/v1/${buRouter}`, {
      method: 'POST',
      body: params,
    });
  }

  static async EditAdvertSpace(params) {
    return request(`/v1/${buRouter}/${params.record_id}`, {
      method: 'PUT',
      body: params,
    });
  }

  static async deleAdvertSpace(register) {
    return request(`/v1/${buRouter}/${register}`, {
      method: 'DELETE',
    });
  }

  static async queryEletrioncOne(params) {
    return request(`/v1/${buRouter}/${params}`);
  }

  static async queryAdvertSpaceOne(params) {
    return request(`/v1/${buRouter}/${params}`);
  }

  static async savePutInAdvertList(params) {
    return request(`/v1/${putIn}`, {
      method: 'POST',
      body: params,
    });
  }
}
