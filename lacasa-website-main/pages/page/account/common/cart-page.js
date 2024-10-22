import React, { useState, useEffect } from "react";
import $ from "jquery";
import Link from "next/link";
import { Container, Row, Col, Media, Input } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCart,
  deleteFromCart,
} from "../../../../helpers/redux/actions/cartActions";
import { useTranslation } from "react-i18next";
import CheckoutInfo from "../checkout/components/CheckoutInfo/CheckoutInfo";
import Cart from "../checkout/components/Cart/Cart";
import {
  CART_SUCESS
} from "../../../../helpers/redux/constants/cartConstants";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartList);
  const { cart } = cartItem;
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    $("#inputField").on("mousewheel", function (e) {
      $(e.target).blur();
    });
  });

  useEffect(() => {
    cart?.items?.map((item) => {
      delete item.estimated_delivery;
      item.shipping_rules.map((rule) => {
        if(rule.city.id == selectedCity)
          item.estimated_delivery = rule.is_disabled ? false : rule.estimated_delivery;
      })
    })
    dispatch({ type: CART_SUCESS, payload: cart })
  }, [selectedCity]);

  const handleQtyUpdate = (item, quantity) => {
    if (quantity >= 1) {
      dispatch(updateCart(item.id, { quantity: quantity }));
    } else {
      dispatch(deleteFromCart(item.id));
    }
  };

  const { t } = useTranslation();

  return (
    <div>
      {cart && cart?.items.length > 0 ? (
        <section className="cart-section section-b-space">
          <Container>
            <div className="cart-buttons d-flex justify-content-between align-items-center flex-wrap mb-5 p-0">
              <h2 className="checkout-title">
                <span class="step">.1.</span>
                Review Your Order
              </h2>
                <Link href={`/shop`}>
                  <a className="btn btn-solid">{t("continue shopping")}</a>
                </Link>

              {/* <Col xs="6">
                <Link href={`/page/account/checkout`}>
                  <a className="btn btn-solid">{t("checkout")}</a>
                </Link>
              </Col> */}
            </div>
            <Row>
              <Col sm="12">
                <table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th class="text-left" scope="col">{t("image")}</th>
                      <th class="text-left" scope="col">{t("product name")}</th>
                      <th scope="col">{t("price")}</th>
                      <th scope="col">{t("quantity")}</th>
                      <th scope="col">{t("total")}</th>
                      <th scope="col">{t("action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.items?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Link
                              href={{
                                pathname: `/product-details/${item.slug}`,
                              }}
                            >
                              <a>
                                <Media
                                  src={item.image ? item.image.url : ""}
                                  alt=""
                                />
                              </a>
                            </Link>
                          </td>
                          <td>
                            <Link href={`/product-details/` + item.slug}>
                              {item.name}
                            </Link>
                            <br/>
                            {
                              item.estimated_delivery === false ?
                              <span class="badge badge-danger">{t("Shipping not available for your address.")}</span>
                              :
                              item.estimated_delivery ? <span class="badge badge-primary">Estimated delivery: {item.estimated_delivery}</span> : ''
                            }
                            
                            <div className="mobile-cart-content row">
                              <div className="col-xs-3">
                                <div className="qty-box">
                                  <div className="input-group"></div>
                                </div>
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  {parseInt(item.price)
                                    .toFixed(0)
                                    .replace(
                                      /(\d)(?=(\d{3})+(?!\d))/g,
                                      "$1,"
                                    )}{" "}
                                  EGP
                                </h2>
                              </div>
                              <div className="col-xs-3">
                                <h2 className="td-color">
                                  <a href="#" className="icon">
                                    <i
                                      className="fa fa-trash"
                                      onClick={() =>
                                        dispatch(deleteFromCart(item.id))
                                      }
                                    ></i>
                                  </a>
                                </h2>
                              </div>
                            </div>
                          </td>
                          <td class="text-center">
                            <h2>
                              {parseInt(item.price)
                                .toFixed(0)
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                              EGP
                            </h2>
                          </td>
                          <td class="text-center">
                            <div className="qty-box">
                              <div className="input-group">
                                <span className="input-group-prepend">
                                  <button
                                    type="button"
                                    className="btn quantity-left-minus"
                                    onClick={() =>
                                      handleQtyUpdate(item, item.quantity - 1)
                                    }
                                    data-type="minus"
                                    data-field=""
                                  >
                                    {item.quantity > 1 ? (
                                      <i className="fa fa-minus"></i>
                                    ) : (
                                      <i className="fa fa-trash"></i>
                                    )}
                                  </button>
                                </span>
                                <Input
                                  disabled
                                  type="text"
                                  id={"inputField"}
                                  name="quantity"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    dispatch(addToCart(item, e.target.value))
                                  }
                                  className="form-control input-number"
                                />
                                <span className="input-group-prepend">
                                  <button
                                    type="button"
                                    className="btn quantity-right-plus"
                                    onClick={() =>
                                      handleQtyUpdate(item, item.quantity + 1)
                                    }
                                    data-type="plus"
                                    data-field=""
                                  >
                                    <i className="fa fa-plus"></i>
                                  </button>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td class="text-center">
                            <h2 className="td-color">
                              {parseInt(item.total)
                                .toFixed(0)
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                              EGP
                            </h2>
                          </td>
                          <td class="text-center">
                            <i
                              style={{ cursor: "pointer" }}
                              className="fa fa-trash"
                              onClick={() => dispatch(deleteFromCart(item.id))}
                            ></i>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <table className="table cart-table table-responsive-md">
                  <tfoot>
                    <tr>
                      <td>{t("subtotal :")}</td>
                      <td>
                        <h2>
                          {parseInt(cart?.subtotal)
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                          {" EGP"}
                        </h2>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
            
            <div className="checkoutPage container">
          <div className={"row wrap-reverse"}>
            <div className="col-12">
              <CheckoutInfo passSelectedCity={setSelectedCity} />
            </div>
            
          </div>
        </div>

          </Container>
        </section>
      ) : (
        <section className="cart-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <div>
                  <div className="col-sm-12 empty-cart-cls text-center">
                    <Media
                      src={cart}
                      className="img-fluid mb-4 mx-auto"
                      alt=""
                    />
                    <h3>
                      <strong>{t("Your Cart is Empty")}</strong>
                    </h3>
                    <h4>{t("Explore more shortlist some items.")}</h4>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default CartPage;
