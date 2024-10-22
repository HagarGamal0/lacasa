import React from "react";
import CommonLayout from "../../../components/shop/common-layout";
import WishlistPage from "./common/wishlist-page";
import { ToastContainer } from "react-toastify";

const Wishliat = () => {
  return (
    <CommonLayout parent="home" title="Wishlist">
      <WishlistPage />
      <ToastContainer position="bottom-center" closeOnClick autoClose={2000} />
    </CommonLayout>
  );
};

export default Wishliat;
