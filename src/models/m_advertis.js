import { message } from 'antd';
import AdvertisService from '../services/s_advertis';

export default {
  namespace: 'advertis',
  state: {
    data: {},
    modalVisible: false,
    modalTitle: '',
    search: {},
    searchPutIN: {},
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
    xfList: [],
    noAdvertisList: [],
    PutinAdvertisList: [],
    NoPutinAdvertisList: [],
    putinAdvertisKeys: [],
  },
  effects: {
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
        const search = yield select(state => state.advertis.search);
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
        const pag = yield select(state => state.advertis.pagination);
        if (pag) {
          pagination = { ...pag };
        }
      }
      const result = yield call(AdvertisService.queryAdvertisPageStore, {
        ...param,
        ...pagination,
      });
      let dataResult = { list: [], pagination: {} };
      if (result.list) {
        dataResult = result;
      }
      yield put({
        type: 'setAdvertisTotal',
        payload: dataResult,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *EditAdvertis({ params }, { call, put }) {
      if (!params) {
        return;
      }
      // 编辑数据
      const response = yield call(AdvertisService.EditAdvertis, params);
      if (response.record_id && response.record_id !== '') {
        message.success('保存成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *insertAdvertis({ params }, { call, put }) {
      if (!params) {
        return;
      }
      // 插入数据
      const response = yield call(AdvertisService.insertAdvertis, params);
      if (response.record_id && response.record_id !== '') {
        message.success('新建成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *cancle({ recordId }, { call, put }) {
      const response = yield call(AdvertisService.deleAdvertisOff, recordId);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'queryelemList' });
      }
    },
    *queryAdvertisOne({ params }, { call, put }) {
      const response = yield call(AdvertisService.queryAdvertisOne, params);
      if (response) {
        response.link1 = decodeURIComponent(response.link)
          ? decodeURIComponent(response.link).substring(
              0,
              decodeURIComponent(response.link).indexOf('URL=') + 4
            )
          : '';
        response.link2 = decodeURIComponent(response.link)
          ? decodeURIComponent(response.link).substring(
              decodeURIComponent(response.link).indexOf('URL=') + 4,
              decodeURIComponent(response.link).length
            )
          : '';
      }
      yield put({
        type: 'savaDataElectrionOne',
        payload: response,
      });
    },
    // 获取全部广告-不分页
    *queryAdverList({ payload }, { call, put }) {
      const param = {
        q: 'list',
      };
      if (!payload) {
        const resultall = yield call(AdvertisService.queryAdvertisNoPage, param);
        let allData = resultall.list || [];
        allData = allData.map(v => {
          v.key = v.record_id;
          return v;
        });
        yield put({ type: 'saveAdverListNopage', payload: allData });
      } else {
        const param2 = { ...param, ...payload };
        const resultin = yield call(AdvertisService.queryAdvertisNoPage, param2);
        const inData = resultin.list || [];
        const inKeys = [];

        for (let i = 0; i < inData.length; i += 1) {
          inKeys.push(inData[i].record_id);
        }

        yield put({ type: 'savePutinAdvertisKeys', payload: inKeys });
      }
    },
  },
  reducers: {
    setAdvertisTotal(state, { payload }) {
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
    saveSearchputIN(state, { payload }) {
      return { ...state, searchPutIN: payload };
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
      return { ...state, formData: payload };
    },
    saveXFlist(state, { payload }) {
      return { ...state, xfList: payload };
    },
    saveAdverListNopage(state, { payload }) {
      return { ...state, noAdvertisList: payload };
    },
    savePutinAdvertisKeys(state, { payload }) {
      return { ...state, putinAdvertisKeys: payload };
    },
    saveAdverListPutIn(state, { payload }) {
      return { ...state, PutinAdvertisList: payload };
    },
    saveAdverListPutNotIn(state, { payload }) {
      return { ...state, NoPutinAdvertisList: payload };
    },
  },
};
