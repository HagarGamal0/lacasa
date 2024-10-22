import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);
const CheckoutPage = dynamic(() => import("./common/checkout-page"));
const Checkout = () => {
  const router = useRouter();
  const status = router.query.status;

  useEffect(() => {
    const cartTotal = JSON.parse(localStorage.getItem("cartList"));
    var totalCart = 0;
    cartTotal.map(async (item) => {
      totalCart += item.total;
    });
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
        ReactPixel.track("InitiateCheckout", {
          num_items: cartTotal.length,
          value: totalCart,
          currency: "EGP",
        });
      });
  }, []);

  return (
    <>
      <CommonLayout parent="home" title="Checkout">
        {status === "false" ? (
          <Container>
            <div
              style={{
                background: "transparent",
                border: "2px solid red",
                height: "80px",
              }}
              className={"mt-3 promotionContainer"}
            >
              <div style={{ color: "red" }} className={"discountTitle"}>
                {router.query.message}
              </div>
            </div>
          </Container>
        ) : (
          ""
        )}
        <CheckoutPage />
      </CommonLayout>
    </>
  );
};

export default Checkout;
