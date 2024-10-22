import React, { Fragment } from "react";
import Link from "next/link";
import CartHeader from "../headers/common/cart-header";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const CartContainer = ({ icon }) => {
  const cartItem = useSelector((state) => state.cartList);
  const { cart } = cartItem;
  const { t } = useTranslation();
  return (
    <Fragment>
      {cart ? (
        <li className="onhover-div mobile-cart">
          {cart?.items.length > 0 && (
            <div className="cart-qty-cls">{cart?.items.length}</div>
          )}
          <div className="d-flex align-items-center">
            <div
              className="desktop-display"
              dangerouslySetInnerHTML={{ __html: icon }}
            />
            <i className="fa fa-shopping-cart"></i> 
            <span className="cart_mobile_text this ">Cart</span>
          </div>
          <ul className="show-div shopping-cart">
            {cart?.items.map((item, index) => (
              <CartHeader key={index} item={item} total={cart?.subtotal} />
            ))}
            {cart?.items.length > 0 ? (
              <div
                style={{
                  position: "sticky",
                  bottom: 0,
                  left: 0,
                  background: "white",
                }}
              >
                <li>
                  <div className="total">
                    <h5>
                      {t("subtotal :")}{" "}
                      <span>
                        {parseInt(cart?.subtotal)
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                        EGP
                      </span>
                    </h5>
                  </div>
                </li>
                <li>
                  <div className="buttons view-cart">
                    <Link href={`/page/account/cart`}>
                      <a style={{ padding: "5px" }} className="btn btn-solid">
                        {t("view cart")}
                      </a>
                    </Link>
                    {/* <Link href={`/page/account/checkout`}>
                      <a
                        style={{ padding: "5px" }}
                        className="checkout btn btn-solid"
                      >
                        {t("checkout")}
                      </a>
                    </Link> */}
                  </div>
                </li>
              </div>
            ) : (
              <li>
                <h5>{t("Your cart is currently empty.")}</h5>
              </li>
            )}
          </ul>
        </li>
      ) : null}
    </Fragment>
  );
};

export default CartContainer;
