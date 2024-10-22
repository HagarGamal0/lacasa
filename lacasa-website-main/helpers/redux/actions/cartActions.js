import {
  CART_REQUEST,
  CART_SUCESS,
  CART_FAIL,
} from "../constants/cartConstants";
import API from "../../API/API";
import { toast } from "react-toastify";
import router from "next/router";

export const getCart = () => async (dispatch, getState) => {
  const {
    cartList: { cartList },
  } = getState();
  dispatch({ type: CART_REQUEST, payload: cartList });
  API.readAll("/carts")
    .then((res) => {
      dispatch({ type: CART_SUCESS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: CART_FAIL, payload: err });
    });
};

export const addToCart =
  (product, quantity, productsVariants) => async (dispatch, getState) => {
    const {
      cartList: { cart },
    } = getState();
    dispatch({ type: CART_REQUEST, payload: cart });
    if (product.attributes.length > 0) {
      if (product.attributes.length === Object.keys(productsVariants).length) {
        const att = [];
        const obj = {};
        Object.keys(productsVariants).map((key) => {
          if (key === "Fabric Color") {
            obj["fabric_color"] = productsVariants[key].toString();
          } else {
            att.push(productsVariants[key].value_id);
          }
        });
        if (cart.id)
          API.create(`/carts/${cart.id}`, {
            ...{ id: product.id, quantity: quantity, attributes: att },
            ...obj,
          })
            .then((res) => {
              dispatch({ type: CART_SUCESS, payload: res.data });
            })
            .catch((err) => {
              dispatch({ type: CART_FAIL, payload: err });
            });
      } else {
        dispatch({ type: CART_FAIL, payload: true, cart: cart });
      }
    } else {
      if (cart.id)
        API.create(`/carts/${cart.id}`, {
          id: product.id,
          quantity: quantity,
          attributes: [],
        })
          .then((res) => {
            dispatch({ type: CART_SUCESS, payload: res.data });
          })
          .catch((err) => {
            dispatch({ type: CART_FAIL, payload: err, cart: cart });
          });
    }
  };

export const deleteFromCart = (id) => async (dispatch, getState) => {
  const {
    cartList: { cart },
  } = getState();
  dispatch({ type: CART_REQUEST, payload: cart });
  if (cart.id)
    API.delete(`/carts/${cart.id}/items`, id)
      .then((res) => {
        dispatch({ type: CART_SUCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: CART_FAIL, payload: err, cart: cart });
      });
};

export const updateCart = (id, att) => async (dispatch, getState) => {
  const {
    cartList: { cart },
  } = getState();
  dispatch({ type: CART_REQUEST, payload: cart });
  if (cart.id)
    API.update(`/carts/${cart.id}/items/${id}`, att)
      .then((res) => {
        dispatch({ type: CART_SUCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: CART_FAIL, payload: err, cart: cart });
      });
};
export const calculateCart = (data) => async (dispatch, getState) => {
  console.log('Data received in calculateCart:', data); // Log the incoming data

  const {
    cartList: { cart },
  } = getState();

  dispatch({ type: CART_REQUEST, payload: cart });

  // Log the entire state to check for address
  const currentState = getState();
  console.log('Current state:', currentState);

  const payload = {
    ...data,
    payment_method: data.payment_method, // Ensure payment_method is included from data
    address: data.address || {}, // Provide a default empty object if address is undefined
  };

  console.log('Payload before sending:', payload); // Log the payload just before sending

  try {
    const res = await API.create(`/carts/${cart.id}/calculate`, payload);
    
    console.log('API Response:', res); // Log the full response

    if (res.errors) {
      dispatch({ type: CART_FAIL, payload: res.errors, cart });
    } else {
      dispatch({ type: CART_SUCESS, payload: res.data });
      window.gtag("event", "begin_checkout", {
        items: res.data.items,
      });
    }

  } catch (err) {
    console.error('Error calculating cart:', err); // Log the error for debugging
    dispatch({ type: CART_FAIL, payload: err.response?.data || err.message, cart });
  }
};

export const createCartOrder = (data) => async (dispatch, getState) => {
  const {
    cartList: { cart }
  } = getState();

  dispatch({ type: CART_REQUEST, payload: cart });
  API.create(`/carts/${cart.id}/purchase`, data)
    .then((res) => {
      if (res.errors) {
        if(document.getElementById("placeOrder")) document.getElementById("placeOrder").disabled = false;
        dispatch({ type: CART_FAIL, payload: res.errors, cart: cart });
      } else if (res.data?.code === 400) {
        if(document.getElementById("placeOrder")) document.getElementById("placeOrder").disabled = false;
        dispatch({ type: CART_FAIL, payload: res?.data?.message, cart: cart });
      } else {
        if (res.data.payment_action?.token) {
          dispatch({
            type: CART_SUCESS,
            payload: cart,
            payment_action: res.data.payment_action,
          });
          if(document.getElementById("placeOrder")) document.getElementById("placeOrder").disabled = false;
        } else {
          dispatch({ type: CART_SUCESS, payload: false });
          router.push({
            pathname: "/page/order-success",
            query: { order: res.data.order.id, status: true },
          });
          console.log(res);
          import("react-facebook-pixel")
            .then((x) => x.default)
            .then((ReactPixel) => {
              ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
              ReactPixel.track("Purchase", {
                value: res.data.order.payment_detail.total,
                currency: "EGP",
              });
            });
          window.gtag("event", "purchase", {
            transaction_id: res.data.order.id,
            value: res.data.order.payment_detail.total,
            items: res.data.order.items,
            currency: "EGP",
          });
          window.gtag("event", "conversion", {
            send_to: "AW-16498577431/Z0sKCMrC3J0ZEJegkbs9",
            transaction_id: res.data.order.id,
            value: res.data.order.payment_detail.total,
            currency: "EGP",
          });
          if(document.getElementById("placeOrder")) document.getElementById("placeOrder").disabled = false;
        }
      }
    })
    .catch((err) => {
      if(document.getElementById("placeOrder")) document.getElementById("placeOrder").disabled = false;
      dispatch({ type: CART_FAIL, payload: err, cart: cart });
    }).finally(() => {
      localStorage.removeItem("orderData");
    });
};
