import {
  FETCH_TOKEN,
  SET_CURRENT_USER,
  AUTH_ERROR
} from './types';
import {
  ADMIN_ID,
  TOKEN
} from '../constants';
import * as utils from '../utils';
import authService from '../services/authService';
import { signIn, signOut, authOnChange } from '../firebase';

function fetchToken() {
  return {
    type: FETCH_TOKEN
  }
}

function setCurrentUser(admin) {
  return {
    type: SET_CURRENT_USER,
    admin
  }
}

function authError(error) {
  utils.removeStorage(ADMIN_ID)
  utils.removeStorage(TOKEN)
  return {
    type: AUTH_ERROR,
    payload: error
  }
}


function signin(username, password) {
  return async (dispatch) => {
    try {
      dispatch(fetchToken())

      // const res = await authService.post(username, password)

      // if (res.status === 201 && res.data.code === 100) {
      //   console.log(res)
      //   const token = res.data.data.token
      //   const adminId = res.data.data.userId

      //   utils.setStorage(TOKEN, token)
      //   utils.setStorage(ADMIN_ID, adminId)

      //   return dispatch(setCurrentUser({
      //     adminId,
      //     token
      //   }))
      // }
     await signIn(username,password);
    } catch (err) {
      if (err.response === undefined) {
        const errorMessage = 'Server error, please try again later'
        return dispatch(authError(errorMessage))
      }
      return dispatch(authError(err.message));
    }
  }
}


function signout() {
  return async dispatch => {
    utils.removeStorage(TOKEN)
    await signOut();
    dispatch(setCurrentUser({}))
  }
}
function syncLoggedUser(){
  return async dispatch=>{
   await authOnChange().then((user) => dispatch(setCurrentUser(user))).catch((error)=>{
     return dispatch(authError(error.message));
   })
  }
}

export {
  setCurrentUser,
  authError,
  signin,
  signout,
  syncLoggedUser
}
