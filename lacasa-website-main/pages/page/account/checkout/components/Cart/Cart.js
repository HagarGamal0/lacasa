import React, { useState } from "react";
import { Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useWindowDimensions from "../../../../../../helpers/hooks/useWindowDimensions";
import AnimateHeight from "react-animate-height";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const styles = {
  cartImage: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
};
const CartView = ({ cart, error }) => {
  const { t } = useTranslation();
  return (
    <div>
      {cart?.items.map((cartItem, index) => {
        return (
          <div key={index}>
            <div className="d-flex mb-3">
              <div className="mr-3">
                <img src={cartItem.image.url} style={styles.cartImage} />
              </div>
              <div className="d-flex justify-content-between w-100">
                <div>
                  <p className="m-0 mb-1">{cartItem.name}</p>
                  <span>
                    {cartItem.quantity} x{" "}
                    {cartItem.price
                      .toFixed(0)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    EGP
                  </span>
                </div>
                <div>
                  <span>
                    {(cartItem.quantity * cartItem.price)
                      .toFixed(0)
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                    EGP
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      <hr className="" />
      <div>
        <div className="d-flex flex-ar justify-content-between w-100">
          <h6>{t("subtotal")}</h6>
          <h6>
            {cart?.subtotal
              ?.toFixed(0)
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
            EGP
          </h6>
        </div>
        <div className="d-flex flex-ar justify-content-between w-100">
          <h6>{t("Shipping")}</h6>

          {cart?.shipping_fees === 0 ? (
            ""
          ) : (
            <>
              {cart?.shipping_fees ? (
                <h6>
                  {cart.shipping_fees
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                  EGP
                </h6>
              ) : (
                <h6>{t("Calculate shipping in the next step")}</h6>
              )}
            </>
          )}
        </div>

        {Object.values(cart.discounts).map((item) => {
          if (item.value > 0)
            return (
              <div className="d-flex justify-content-between w-100">
                <h6>{item.title}</h6>
                <h6 className="text-success">
                  {item.value
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                  EGP
                </h6>
              </div>
            );
        })}
        <hr />
        {cart.total_discounts > 0 && (
          <div className="d-flex justify-content-between w-100">
            <h6>{t("Total discounts")}</h6>
            <h6 className="text-success">
              {cart.total_discounts
                .toFixed(0)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
              EGP
            </h6>
          </div>
        )}
        <div className="d-flex flex-ar justify-content-between w-100">
          <h6 className="">{t("Total")}</h6>
          {cart ? (
            <h6>
              {cart?.total.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
              EGP
            </h6>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const cartItem = useSelector((state) => state.cartList);
  const { cart, error } = cartItem;
  const [height, setHeight] = useState(0);
  const { viewWidth } = useWindowDimensions();
  return (
    <>
      {viewWidth < 600 && cart ? (
        <>
          <div className={"showOrderSummaryContainer mb-2"}>
            <div className={"OrderSummaryButton"}>
              <Button
                id="showSummaryButton"
                aria-controls={height !== 0 ? "expandableCartArea" : undefined}
                aria-haspopup="true"
                aria-expanded={height !== 0 ? "true" : undefined}
                onClick={() => setHeight(height === 0 ? "auto" : 0)}
                endIcon={
                  height === 0 ? (
                    <KeyboardArrowDownIcon
                      className={styles.OrderSummaryfilterIcon}
                    />
                  ) : (
                    <KeyboardArrowUpIcon
                      className={styles.OrderSummaryfilterIcon}
                    />
                  )
                }
              >
                Order Summary
              </Button>
            </div>
            <div className={"OrderSummaryPrice"}>
              {cart ? (
                <h6>
                  {cart?.total
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                  EGP
                </h6>
              ) : null}
            </div>
          </div>
          <AnimateHeight id="expandableCartArea" duration={500} height={height}>
            <div className={"shoppingCartContainer"}>
              <div className="border p-2 mb-5" style={{ height: "100%" }}>
                {cart ? <CartView cart={cart} error={error} /> : null}
              </div>
            </div>
          </AnimateHeight>
        </>
      ) : (
        <div className="border-left pl-4 mb-5" style={{ height: "100%" }}>
          {cart ? <CartView cart={cart} error={error} /> : null}
        </div>
      )}
    </>
  );
};
export default Cart;
