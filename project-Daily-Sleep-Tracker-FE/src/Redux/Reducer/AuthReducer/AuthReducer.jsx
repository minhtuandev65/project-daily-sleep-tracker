// dự án quản lý giấc ngủ

import { SET_LOGIN, SET_GET_MY_PROFILE } from "../../type/AuthType/AuthType";

const initialState = {
  user: null,
  userProfile: null,
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGIN: {
      return { ...state, user: action.payload };
    }
    case SET_GET_MY_PROFILE: {
      return { ...state, userProfile: action.payload };
    }
    default:
      return state;
  }
};
