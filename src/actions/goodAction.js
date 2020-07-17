import {
  LOAD_GOODS,
  RECEIVE_GOODS
} from './types';

import {
  authError,
} from './index';
import goodService from '../services/goodService';

function loadGoods() {
  return {
    type: LOAD_GOODS
  }
}

function receiveGoods(goods) {
  return {
    type: RECEIVE_GOODS,
    goods
  }
}

function fetchGoods(adminId, token, good, pageNum, rows) {
  return async (dispatch) => {
    try {
      dispatch(loadGoods())
      const res = await goodService.all(adminId, token, good, pageNum, rows)
      return dispatch(receiveGoods(res.data.data))
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = 'Server error, please try again later'
        return dispatch(authError(errorMessage))
      }
      if (err.response.status === 401) {
        const errorMessage = 'Your login has expired, please log in again'
        return dispatch(authError(errorMessage))
      }
    }
  }
}


export {
  loadGoods,
  receiveGoods,
  fetchGoods
}
