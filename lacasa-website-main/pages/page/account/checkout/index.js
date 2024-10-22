import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

const CommonLayout = dynamic(() =>
  import("../../../../components/shop/common-layout")
);
const Cart = dynamic(() => import("./components/Cart/Cart"));
const CheckoutInfo = dynamic(() =>
  import("./components/CheckoutInfo/CheckoutInfo")
);

const Checkout = () => {


  return (
    <>
      <CommonLayout parent="home" removeBreadcrubs={true} title="Checkout">
        <div className="checkoutPage container">
          <div className={"row wrap-reverse"}>
            <div className="col-12 col-md-8 order-1">
              <CheckoutInfo />
            </div>
            <div className="col-12 col-md-4 order-md-1">
              <Cart />
            </div>
          </div>
        </div>
        <ToastContainer />


      </CommonLayout>
    </>
  );
};
export default Checkout;
