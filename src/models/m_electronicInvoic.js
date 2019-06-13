import { message } from 'antd';
import ElectronicInvoiceService from '../services/s_electronicInvoiceIssuance';

export default {
  namespace: 'electronicInvoic',
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
    EletronicData: {},
  },
  effects: {
    // 请求字典表

    *queryElectronicstatus(_, { call, put }) {
      const result = yield call(ElectronicInvoiceService.queryElectronicstatus);

      yield put({
        type: 'setElemstatue',
        payload: result,
      });
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
        const search = yield select(state => state.electronicInvoic.search);
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
        const pag = yield select(state => state.electronicInvoic.pagination);
        if (pag) {
          pagination = { ...pag };
        }
      }
      const result = yield call(ElectronicInvoiceService.queryElectronicPageStore, {
        ...param,
        ...pagination,
      });
      yield put({
        type: 'setBlackStatueTotal',
        payload: result,
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
      const response = yield call(ElectronicInvoiceService.EditElem, params);
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
      const response = yield call(ElectronicInvoiceService.insertElem, params);
      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *queryElectrioncOne({ params }, { call, put }) {
      const response = yield call(ElectronicInvoiceService.queryEletrioncOne, params);
      yield put({ type: 'savaEletricOneData', payload: response });
    },
    *cancle({ recordId }, { call, put }) {
      const response = yield call(ElectronicInvoiceService.deleOff, recordId);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'queryelemList' });
      }
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
    savaEletricOneData(state, { payload }) {
      return { ...state, EletronicData: payload };
    },
  },
};
