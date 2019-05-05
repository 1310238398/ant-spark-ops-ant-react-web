import { message } from 'antd';
import * as dictionaryService from '@/services/dictionary';

export default {
  namespace: 'dictionary',
  state: {
    search: {},
    pagination: {},
    data: {
      list: [],
      pagination: {},
    },
    submitting: false,
    formType: '',
    formTitle: '',
    formID: '',
    formVisible: false,
    formData: {},
    treeData: [],
    expandedKeys: [],
  },
  effects: {
    *loadTree(_, { put, select }) {
      yield yield put({ type: 'fetchTree' });
      const treeData = yield select(state => state.dictionary.treeData);
      const expandedKeys = [];
      if (treeData.length > 0) {
        expandedKeys.push(treeData[0].record_id);
      }
      yield put({
        type: 'saveExpandedKeys',
        payload: expandedKeys,
      });
    },
    *fetch({ search, pagination }, { call, put, select }) {
      let params = {
        q: 'page',
      };

      if (search) {
        params = { ...params, ...search };
        yield put({
          type: 'saveSearch',
          payload: search,
        });
      } else {
        const s = yield select(state => state.dictionary.search);
        if (s) {
          params = { ...params, ...s };
        }
      }

      if (pagination) {
        params = { ...params, ...pagination };
        yield put({
          type: 'savePagination',
          payload: pagination,
        });
      } else {
        const p = yield select(state => state.dictionary.pagination);
        if (p) {
          params = { ...params, ...p };
        }
      }

      const response = yield call(dictionaryService.query, params);
      yield put({
        type: 'saveData',
        payload: response,
      });
    },
    *loadForm({ payload }, { put, select }) {
      yield put({
        type: 'changeFormVisible',
        payload: true,
      });

      yield [
        put({
          type: 'saveFormType',
          payload: payload.type,
        }),
        put({
          type: 'saveFormTitle',
          payload: '新建字典',
        }),
        put({
          type: 'saveFormID',
          payload: '',
        }),
        put({
          type: 'saveFormData',
          payload: {},
        }),
        put({ type: 'fetchTree' }),
      ];

      if (payload.type === 'E') {
        yield [
          put({
            type: 'saveFormTitle',
            payload: '编辑字典',
          }),
          put({
            type: 'saveFormID',
            payload: payload.id,
          }),
          put({
            type: 'fetchForm',
            payload: { record_id: payload.id },
          }),
        ];
      } else {
        const search = yield select(state => state.dictionary.search);
        yield put({
          type: 'saveFormData',
          payload: { parent_id: search.parent_id ? search.parent_id : '' },
        });
      }
    },
    *fetchForm({ payload }, { call, put }) {
      const response = yield call(dictionaryService.get, payload);
      yield put({
        type: 'saveFormData',
        payload: response,
      });
    },
    *submit({ payload }, { call, put, select }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });

      const params = { ...payload };
      const formType = yield select(state => state.dictionary.formType);
      let success = false;
      let response;
      if (formType === 'E') {
        params.record_id = yield select(state => state.dictionary.formID);
        response = yield call(dictionaryService.update, params);
      } else {
        response = yield call(dictionaryService.create, params);
      }
      if (response.record_id && response.record_id !== '') {
        success = true;
      }

      yield put({
        type: 'changeSubmitting',
        payload: false,
      });

      if (success) {
        message.success('保存成功');
        yield put({
          type: 'changeFormVisible',
          payload: false,
        });

        yield put({ type: 'fetchTree' });
        yield put({ type: 'fetch' });
      }
    },
    *del({ payload }, { call, put }) {
      const response = yield call(dictionaryService.del, payload);
      if (response.status === 'OK') {
        message.success('删除成功');
        yield put({ type: 'fetchTree' });
        yield put({ type: 'fetch' });
      }
    },
    *fetchTree({ payload }, { call, put }) {
      let params = {
        q: 'tree',
      };
      if (payload) {
        params = { ...params, ...payload };
      }
      const response = yield call(dictionaryService.query, params);
      const list = response.list || [];
      yield put({
        type: 'saveTreeData',
        payload: list,
      });
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, data: payload };
    },
    saveSearch(state, { payload }) {
      return { ...state, search: payload };
    },
    savePagination(state, { payload }) {
      return { ...state, pagination: payload };
    },
    changeFormVisible(state, { payload }) {
      return { ...state, formVisible: payload };
    },
    saveFormType(state, { payload }) {
      return { ...state, formType: payload };
    },
    saveFormTitle(state, { payload }) {
      return { ...state, formTitle: payload };
    },
    saveFormID(state, { payload }) {
      return { ...state, formID: payload };
    },
    saveFormData(state, { payload }) {
      return { ...state, formData: payload };
    },
    changeSubmitting(state, { payload }) {
      return { ...state, submitting: payload };
    },
    saveTreeData(state, { payload }) {
      return { ...state, treeData: payload };
    },
    saveExpandedKeys(state, { payload }) {
      return { ...state, expandedKeys: payload };
    },
  },
};
