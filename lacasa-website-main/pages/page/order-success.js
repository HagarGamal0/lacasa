import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import CartContext from "../../helpers/cart";
import API from "../../helpers/API/API";
import router from "next/router";
import moment from "moment";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);

const OrderSuccess = () => {
  const cartContext = useContext(CartContext);
  const cartItems = cartContext.state;
  const removeFromCart = cartContext.removeFromCart;
  const id = router.query.order;
  const [data, setData] = useState(false);
  useEffect(async () => {
    if (localStorage.getItem("orangeVoucher")) {
      localStorage.removeItem("orangeVoucher");
    }
    API.read("/orders", id)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(async () => {
    await cartItems.map((item) => {
      removeFromCart(item, true);
    });
  }, [cartItems]);

  const { t } = useTranslation();
  return (
    <CommonLayout parent="home" title={t("order success")}>
      <section className="section-b-space mb-5 light-layout">
        <Container>
          <Row>
            <Col md="12">
              <div className="success-text">
                <i className="fa fa-check-circle" aria-hidden="true"></i>
                <h2>{t("Thank you")}</h2>
                <p>{t("Order has been placed")}</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {data ? (
        <section className="section-b-space mb-5">
          <Container>
            <Row>
              <Col lg="8">
                <div className="product-order">
                  <h3>your order details</h3>

                  {data?.items?.map((item, i) => (
                    <Row className="product-order-detail" key={i}>
                      <Col xs="4" md={3}>
                        <Media
                          src={item.image.url}
                          alt=""
                          className="img-fluid blur-up lazyload"
                        />
                      </Col>
                      <Col xs="4" md={3} className="order_detail">
                        <div>
                          <h6>product name</h6>
                          <h6>{item.name}</h6>
                        </div>
                      </Col>
                      <Col xs="4" md={1} className="order_detail">
                        <div>
                          <h6>Quantity</h6>
                          <h6>{item.quantity}</h6>
                        </div>
                      </Col>
                      <Col xs="4" md={2} className="order_detail">
                        <div>
                          <h6>price</h6>
                          <h6>
                            {item.price
                              ?.toFixed(0)
                              ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                            EGP
                          </h6>
                        </div>
                      </Col>
                      <Col xs="4" md={3} className="order_detail">
                        <div>
                          <h6>Shipping fees</h6>
                          <h6>
                            {Number(item?.shipping_fees || 0)
                              ?.toFixed(0)
                              ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                            EGP
                          </h6>
                        </div>
                      </Col>
                    </Row>
                  ))}
                  <div className="total-sec">
                    <div className="d-flex justify-content-between w-100">
                      <h6>{"Subtotal"}</h6>
                      <h6>
                        {data?.payment_detail?.subtotal
                          ?.toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                        EGP
                      </h6>
                    </div>
                    {Object.values(data?.payment_detail?.discounts).map(
                      (item) => {
                        if (item.value > 0)
                          return (
                            <div className="d-flex justify-content-between w-100">
                              <h6>{item.title}</h6>
                              <h6 className="text-success">
                                {item.value
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </h6>
                            </div>
                          );
                      }
                    )}
                  </div>
                  <div className="final-total">
                    <div className="d-flex justify-content-between w-100">
                      <h6>{"Shipping fees"}</h6>
                      {data?.payment_detail?.shipping_fees ? (
                        <h6>
                          {Number(data?.payment_detail?.shipping_fees || 0)
                            ?.toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                          EGP
                        </h6>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="d-flex justify-content-between w-100">
                      <h6>{"Total"}</h6>
                      <h6>
                        {data?.payment_detail?.total
                          ?.toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                        EGP
                      </h6>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg="4" className="d-flex justify-content-center">
                <Row className="order-success-sec justify-content-center">
                  <Col sm="6">
                    <h4>summary</h4>
                    <ul className="order-detail">
                      <li>order #: {data?.id}</li>
                      <li>
                        Order Date:{" "}
                        {moment(data?.created_at).format("MMM Do YY")}
                      </li>
                      <li>
                        Order Total:{" "}
                        {data?.payment_detail.total
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                        EGP
                      </li>
                    </ul>
                  </Col>
                  <Col sm="6">
                    <h4>shipping address</h4>
                    <ul className="order-detail">
                      <li>
                        {data?.shipping_details.shipping_address?.address}
                      </li>
                      <li>
                        {data?.shipping_details.shipping_address?.area},{" "}
                        {data?.shipping_details.shipping_address?.city}
                      </li>
                      <li>
                        Contact No.{" "}
                        {data?.shipping_details.shipping_address?.phone}
                      </li>
                    </ul>
                  </Col>
                  <Col sm="12" className="payment-mode">
                    <h4>payment method</h4>
                    <p>{data?.transaction_detail?.type}</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      ) : null}
    </CommonLayout>
  );
};

export default OrderSuccess;
