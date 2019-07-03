import { stringify } from 'qs';
import request from '../utils/request';

const buRouter = 'advertising_spaces';
const putIn = 'advertising_deliveries';

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

  static async insertElem(params) {
    return request(`/v1/${buRouter}`, {
      method: 'POST',
      body: params,
    });
  }

  static async EditElem(params) {
    return request(`/v1/${buRouter}/${params.record_id}`, {
      method: 'PUT',
      body: params,
    });
  }

  static async deleOff(register) {
    return request(`/v1/${buRouter}/${register}`, {
      method: 'DELETE',
      body: '',
    });
  }

  static async queryElectronicSellePageStore(params) {
    return request(`/v1/${buRouter}?${stringify(params)}`);
  }

  static async queryXFlists(param) {
    return request(`/v1/${buRouter}?${stringify(param)}`);
  }

  static async insertSelleElem(params) {
    return request(`/v1/${buRouter}`, {
      method: 'POST',
      body: params,
    });
  }

  static async EditSelleElem(params) {
    return request(`/v1/${buRouter}/${params.record_id}`, {
      method: 'PUT',
      body: params,
    });
  }

  static async deleSelleOff(register) {
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
