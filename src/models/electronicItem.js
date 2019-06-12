import { message } from 'antd';
import ElectronicInvoiceService from '../services/s_electronicInvoiceIssuance';

export default {
  namespace: 'electronicItem',
  state: {
    data: {},
    modalVisible: false,
    modalTitle: '',
    search: {},
    pagination: {},
    formData: {},
    formCallback() {},
    submitting: false,
    loading: false,
    elemState: [],
    tableData: {
      list: [],
      pagination: {},
    },
    electrioncOne: {},
    xfList: [],
  },
  effects: {
    // 请求字典表

    // *queryElectronicstatus(_, { put }) {
    // const result = yield call(StoreService.queryShopstatus);
    // if (!isObjectNullOrUndefinedOrEmpty(result)) {
    //   result.push({ code: '', name: '全部', key: '' });
    //   yield put({
    //     type: 'setElemstatue',
    //     payload: [...result],
    //   });
    // }
    // },
    *queryXfList(_, { call, put }) {
      const param = {
        q: 'list',
      };
      const result = yield call(ElectronicInvoiceService.queryXFlists, param);
      const response = result.list || [];
      yield put({ type: 'saveXFlist', payload: response });
    },
    *queryelemList({ params, pagination }, { call, put, select }) {
      let param = {
        q: 'page',
      };

      yield put({
        type: 'changeLoading',
        payload: true,
      });
      if (params) {
        param = { ...param, ...params };
        yield put({
          type: 'saveSearch',
          payload: param,
        });
      } else {
        const search = yield select(state => state.electronicSellervoice.search);
        if (search) {
          param = { ...param, ...search };
        }
      }
      if (pagination) {
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const pag = yield select(state => state.electronicSellervoice.pagination);
        if (pag) {
          pagination = { ...pag };
        }
      }
      const result = yield call(ElectronicInvoiceService.queryElectronicSellePageStore, {
        ...param,
        ...pagination,
      });
      let dataResult = { list: [], pagination: {} };
      if (result.list) {
        dataResult = result;
      }
      yield put({
        type: 'setBlackStatueTotal',
        payload: dataResult,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *EditElem({ params }, { call, put }) {
      if (!params) {
        return;
      }
      // 编辑数据
      const response = yield call(ElectronicInvoiceService.EditSelleElem, params);
      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *insertElem({ params }, { call, put }) {
      if (!params) {
        return;
      }
      // 插入数据
      const response = yield call(ElectronicInvoiceService.insertSelleElem, params);
      if (response.record_id && response.record_id !== '') {
        message.success('新建成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *cancle({ recordId }, { call, put }) {
      const response = yield call(ElectronicInvoiceService.deleSelleOff, recordId);
      if (response.status === 'ok') {
        message.success('删除成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *queryElectrioncOne({ params }, { call, put }) {
      const response = yield call(ElectronicInvoiceService.queryElectrioncOne, params);
      yield put({
        type: 'savaDataElectrionOne',
        payload: response,
      });
    },
  },
  reducers: {
    setBlackStatueTotal(state, { payload }) {
      return {
        ...state,
        tableData: {
          list: payload.list,
          pagination: payload.pagination,
        },
      };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    changeLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    setElemstatue(state, { payload }) {
      return { ...state, elemState: payload };
    },
    savaDataElectrionOne(state, { payload }) {
      return { ...state, electrioncOne: payload };
    },
    saveXFlist(state, { payload }) {
      return { ...state, xfList: payload };
    },
  },
};
