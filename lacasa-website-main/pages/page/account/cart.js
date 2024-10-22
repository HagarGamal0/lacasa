import React from "react";
import CartPage from "./common/cart-page";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);
const Wishliat = () => {
  const { t } = useTranslation();
  return (
    <CommonLayout parent="home" title={t("cart checkout")}>
      <CartPage />
      <ToastContainer position="bottom-center" closeOnClick autoClose={2000} />
    </CommonLayout>
  );
};

export default Wishliat;
