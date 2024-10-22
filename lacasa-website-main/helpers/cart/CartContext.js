import React, { useState, useEffect } from "react";
import Context from "./index";
import { toast } from "react-toastify";
var _ = require("lodash");
import API from "../API/API";
import { useTranslation } from "react-i18next";

const getLocalCartItems = () => {
  try {
    const list = localStorage.getItem("cartList");
    if (list === null) {
      return [];
    } else {
      return JSON.parse(list);
    }
  } catch (err) {
    return [];
  }
};

const CartProvider = (props) => {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState(getLocalCartItems());
  const [cartTotal, setCartTotal] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [validate, setValidate] = useState(true);
  const [stock, setStock] = useState(t("InStock"));
  const [variants, setVariants] = useState();

  useEffect(() => {
    if (validate) {
      const Total = cartItems.reduce((a, b) => a + b.total, 0);
      const data = [];
      cartItems.map((item) => {
        data.push({ id: item.id, quantity: item.qty });
      });
      if (data.length > 0)
        API.create("/validate_cart", { products: data })
          .then((res) => {
            setValidate(false);
            var temp = [...cartItems];
            if (res.data.inactive.length > 0) {
              res.data.inactive.map((item) => {
                temp = temp.filter((cartItem) => cartItem.id !== item.id);
              });
            }
            setCartItems(temp);
            localStorage.setItem("cartList", JSON.stringify(temp));
          })
          .catch((err) => console.log(err));
      setCartTotal(Total);
    }
  }, [cartItems]);

  const addToCart = async (item, quantity) => {
    setValidate(true);

    window.gtag("event", "add_to_cart", {
      items: [item],
    });
    toast.success("Product Added Successfully !");
    const index = await cartItems.findIndex((itm) => itm.id === item.id);
    await cartItems.map((itm) => {
      setVariants(_.isEqual(itm.variants, item.variants));
    });

    setVariants(
      cartItems.findIndex((itm) => _.isEqual(itm.variants, item.variants))
    );

    if (index !== -1) {
      if (
        cartItems.findIndex((itm) => _.isEqual(itm.variants, item.variants)) !==
        -1
      ) {
        const tempQty = parseInt(quantity) + cartItems[index].qty;
        cartItems[index] = {
          ...item,
          qty: tempQty,
          total: item.price_after_sale * tempQty,
        };
        setCartItems([...cartItems]);
      } else {
        const product = {
          ...item,
          qty: parseInt(quantity),
          total: item.price_after_sale * parseInt(quantity),
        };
        setCartItems([...cartItems, product]);
      }
    } else {
      const product = {
        ...item,
        qty: parseInt(quantity),
        total: item.price_after_sale * parseInt(quantity),
      };
      setCartItems([...cartItems, product]);
    }

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
        ReactPixel.track("AddToCart", {
          value: item.price_after_sale,
          currency: "EGP",
        });
      });
    setQuantity(1);
  };

  const removeFromCart = (item, status) => {
    setValidate(true);
    if (!status) {
      toast.error("Product Removed Successfully !");
    }
    if (item.variants) {
      setCartItems(
        cartItems.filter((e) => !_.isEqual(e.variants, item.variants))
      );
    } else {
      setCartItems(cartItems.filter((e) => e.id !== item.id));
    }
    window.gtag("event", "remove_from_cart", {
      items: [item],
    });
  };

  const minusQty = () => {
    setValidate(true);

    if (quantity > 1) {
      setQuantity(quantity - 1);
      setStock(t("InStock"));
    }
  };

  const plusQty = () => {
    setValidate(true);

    setQuantity(quantity + 1);
  };

  const updateQty = (item, quantity) => {
    setValidate(true);

    if (quantity >= 1) {
      const index = cartItems.findIndex((itm) => itm.id === item.id);
      if (index !== -1) {
        cartItems[index] = {
          ...item,
          qty: parseInt(quantity),
          total: item.price_after_sale * parseInt(quantity),
        };
        setCartItems([...cartItems]);
        toast.info("Product Quantity Updated !");
      } else {
        const product = {
          ...item,
          qty: parseInt(quantity),
          total:
            (item.price - (item.price * item.discount) / 100) *
            parseInt(quantity),
        };
        setCartItems([...cartItems, product]);
        toast.success("Product Added Updated !");
      }
    } else {
      toast.error("Enter Valid Quantity !");
    }
  };

  return (
    <Context.Provider
      value={{
        ...props,
        state: cartItems,
        cartTotal,
        setQuantity,
        quantity,
        stock,
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        plusQty: plusQty,
        minusQty: minusQty,
        updateQty: updateQty,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export default CartProvider;
