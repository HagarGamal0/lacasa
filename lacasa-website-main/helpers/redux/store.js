import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";

import {
  userDetailsReducer,
  userRegisterReducer,
  userSigninReducer,
  userUpdateProfileReducer,
  userForgetEmailReducer,
  userResetPasswordReducer,
} from "./reducers/userReducer";

import { cartListReducer } from "./reducers/cartReducer";

import { composeWithDevTools } from "redux-devtools-extension";

const reducer = combineReducers({
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  userForgetEmail: userForgetEmailReducer,
  userResetPassword: userResetPasswordReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  cartList: cartListReducer,
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
