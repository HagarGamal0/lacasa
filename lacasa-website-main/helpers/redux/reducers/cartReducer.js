import {
  CART_REQUEST,
  CART_SUCESS,
  CART_FAIL,
} from "../constants/cartConstants";

export const cartListReducer = (
  state = { loading: false, cart: false },
  action
) => {
  switch (action.type) {
    case CART_REQUEST:
      return { loading: true, cart: action.payload };
    case CART_SUCESS:
      return {
        loading: false,
        cart: action.payload,
        payment_action: action.payment_action,
      };
    case CART_FAIL:
      return { loading: false, cart: action.cart, error: action.payload };
    default:
      return state;
  }
};
