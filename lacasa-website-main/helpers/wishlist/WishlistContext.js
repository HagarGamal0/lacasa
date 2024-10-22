import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const Context = createContext({
  wishlistItems: Function,
  addToWish: Function,
  removeFromWish: Function,
});

const getLocalWishlistItems = () => {
  try {
    const list = localStorage.getItem("wishlist");
    if (list === null) {
      return [];
    } else {
      return JSON.parse(list);
    }
  } catch (err) {
    return [];
  }
};

export const Provider = (props) => {
  const [wishlistItems, setWishlistItems] = useState(getLocalWishlistItems());

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWish = (item) => {
    const index = wishlistItems.findIndex((wish) => wish.id === item.id);
    if (index === -1) {
      toast.success("Product Added Successfully !");
      setWishlistItems([...wishlistItems, item]);
    } else {
      toast.warn("This Product Already Added !");
    }
  };

  const removeFromWish = (item) => {
    setWishlistItems(wishlistItems.filter((e) => e.id !== item.id));
    toast.error("Product Removed Successfully !");
  };

  return (
    <Context.Provider
      value={{
        wishlistItems: wishlistItems,
        addToWish: addToWish,
        removeFromWish: removeFromWish,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};

export {
  Context as WishlistContext,
  Provider as WishlistContextProvider,
} from "./WishlistContext";
