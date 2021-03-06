import { stringify } from 'qs';
import request from '../utils/request';

const buRouter = 'invoice_configs';

const buRouterselles = 'invoice_seller_configs';

const buRouterconfig = 'invoice_bu_configs';
export default class ElectronicInvoiceService {
  static async queryElectronicstatus() {
    return request(
      `/v1/dictionaries/tree?${stringify({
        root: `OPER$#invoice_type`,
      })}&level=1`
    );
  }

  static async queryElectronicPageStore(params) {
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

  static async queryEletrioncOne(params) {
    return request(`/v1/${buRouter}/${params}`);
  }

  static async queryElectrioncOne(params) {
    return request(`/v1/${buRouterselles}/${params}`);
  }

  static async queryInvoiceBuConfigsList(params) {
    return request(`/v1/${buRouterconfig}/?${stringify(params)}`);
  }

  static async queryInvoiceBuConfigsOne(params) {
    return request(`/v1/${buRouterconfig}/${params}`);
  }

  static async EditInvoiceBuElem(params) {
    return request(`/v1/${buRouterconfig}/${params.record_id}`, {
      method: 'PUT',
      body: params,
    });
  }

  static async insertInvoiceBuElem(params) {
    return request(`/v1/${buRouterconfig}`, {
      method: 'POST',
      body: params,
    });
  }

  static async deleInvoiceBuOff(register) {
    return request(`/v1/${buRouterconfig}/${register}`, {
      method: 'DELETE',
      body: '',
    });
  }

  static async queryPzlist(param) {
    return request(`/v1/${buRouter}/?${stringify(param)}`);
  }
}
