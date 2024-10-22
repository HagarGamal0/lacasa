import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import api from "../../../../API/API";

import "react-toastify/dist/ReactToastify.css";

const Cart = ({ data }) => {
  const [error, setError] = useState();
  const [downPayment, setDownPayment] = useState(0);
  const [note, setNote] = useState("");
  const onSubmit = async (e, prodID) => {
    api
      .updateShipping(`/orders/${data.id}`, {
        _method: "PATCH",
        status: e.target.value,
        products: [prodID],
        notes: note,
      })
      .then((response) => {
        toast.success("Product Status Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setNote("");
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dPayment = (e) => {
    setDownPayment(e.target.value);
  };
  const handleDownpayment = () => {
    api
      .updateShipping(`/orders/${data.id}`, {
        _method: "PATCH",
        down_payment: downPayment,
      })
      .then((response) => {
        toast.success("Product Down Payment Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Row>
        <Col xl="12" xxl="12">
          {/* Cart Start */}
          <h2 className="small-title">Cart</h2>
          <Card className="mb-5">
            <Card.Body>
              <div className="mb-5">
                {data?.items.map((item, index) => (
                    <Row className=" mb-5 mt-5" key={index}>
                      <NavLink to={`/products/detail/${item.slug}`}>
                        <Col xs="auto">
                          <h2 className="small-title">{item.id}</h2>
                          <img
                              src={item.image.url}
                              className="card-img rounded-md h-100 sw-15"
                              alt="thumb"
                          />
                        </Col>
                      </NavLink>

                      <Col>
                        <div className="ps-4 pt-0 pb-0 pe-0 h-100">
                          <Row className="g-0 h-100 justify-content-between">
                            <Col
                                xs="7"
                                className="d-flex flex-column mb-2"
                                id={`description${index}`}
                            >
                              <h4 className="text-capitalize mt-3">
                                {item.vendor.name} - {item.name}
                              </h4>
                              <Form.Select onChange={(e) => onSubmit(e, item.id)}>
                                <option hidden>{item.status}</option>
                                <option value="Pending Payment">
                                  Pending Payments
                                </option>
                                <option value="Customer Confirmed">
                                  Customer Confirmed
                                </option>
                                <option value="Processing">Processing</option>
                                <option value="Ready To Ship">
                                  Ready To Ship
                                </option>
                                <option value="Rejected">Rejected</option>
                                <option value="Returned">Returned</option>
                                <option value="Refunded">Refunded</option>
                                {item.status === "Ready To Ship" ? (
                                    <option value="Shipped">Shipped</option>
                                ) : (
                                    ""
                                )}

                                {/* <option value="Refunded">Refunded</option>
                              <option value="Delivered failed">Delivered failed</option> */}
                              </Form.Select>

                              <Form.Control
                                  className="mt-1 mb-1"
                                  type="text"
                                  defaultValue="Optional Note"
                                  onChange={(e) => setNote(e.target.value)}
                              />
                              <h6 className="mt-3">
                                <span className="font-weight-bold">Vendor: </span>
                                {item.vendor.name}
                              </h6>
                              {item.attributes.map((attribute, attrIndex) => (
                                  <Row key={attrIndex} className="mt-3">
                                    <Col xl="6">
                                      <h6>
                                    <span className="font-weight-bold">
                                      Attribute:{" "}
                                    </span>
                                        {attribute.attribute}
                                      </h6>
                                    </Col>
                                    <Col xl="6">
                                      <h6>
                                    <span className="font-weight-bold">
                                      Value:{" "}
                                    </span>
                                        {attribute.value}
                                      </h6>
                                    </Col>
                                  </Row>
                              ))}
                              {item.discounts.length !== 0 ? (
                                  <Row className="mt-3">
                                    {item.discounts.coupons ? (
                                        <h6>
                                    <span className="font-weight-bold">
                                      Coupon Discount:{" "}
                                    </span>{" "}
                                          {item.discounts.coupons.title === null
                                              ? "N/A"
                                              : item.discounts.coupons.title}{" "}
                                          - {item.discounts.coupons.value}
                                          <span className="text-small text-muted">
                                      EGP
                                    </span>
                                        </h6>
                                    ) : (
                                        ""
                                    )}
                                    {item.discounts.orange_discount ? (
                                        <h6>
                                    <span className="font-weight-bold">
                                      Orange Discount:{" "}
                                    </span>{" "}
                                          {item.discounts.orange_discount.title ===
                                          null
                                              ? "N/A"
                                              : item.discounts.orange_discount
                                                  .title}{" "}
                                          - {item.discounts.orange_discount.value}
                                          <span className="text-small text-muted">
                                      EGP
                                    </span>
                                        </h6>
                                    ) : (
                                        ""
                                    )}
                                    {item.discounts.payment_discount ? (
                                        <h6>
                                    <span className="font-weight-bold">
                                      Payment Discount:{" "}
                                    </span>{" "}
                                          {item.discounts.payment_discount?.title ===
                                          null
                                              ? "N/A"
                                              : item.discounts.payment_discount
                                                  .description}{" "}
                                          - {item.discounts.payment_discount?.value}
                                          <span className="text-small text-muted">
                                      EGP
                                    </span>
                                        </h6>
                                    ) : (
                                        ""
                                    )}
                                    {item.discounts.shipping_discount ? (
                                        <h6>
                                    <span className="font-weight-bold">
                                      Shipping Discount:{" "}
                                    </span>{" "}
                                          {item.discounts.shipping_discount?.title ===
                                          null
                                              ? "N/A"
                                              : item.discounts.shipping_discount
                                                  .description}{" "}
                                          - {item.discounts.shipping_discount?.value}
                                          <span className="text-small text-muted">
                                      EGP
                                    </span>
                                        </h6>
                                    ) : (
                                        ""
                                    )}
                                  </Row>
                              ) : (
                                  ""
                              )}
                              {item.shipping_rules !== null ? (
                                  <Row className="mt-3">
                                    <h6>
                                  <span className="font-weight-bold">
                                    Shipping Rules
                                  </span>
                                    </h6>
                                    <h6>
                                  <span className="font-weight-bold">
                                    {item.shipping_rules.city.name}
                                  </span>{" "}
                                      - {item.shipping_rules.estimated_delivery} |{" "}
                                      {item.shipping_rules.fee}
                                      <span className="text-small text-muted">
                                    EGP
                                  </span>
                                    </h6>
                                    <h6>
                                  <span className="font-weight-bold">
                                    Shipping Provider:
                                  </span>{" "}
                                      {item.shipping_provider.name}
                                    </h6>
                                  </Row>
                              ) : (
                                  ""
                              )}
                            </Col>

                            <Col
                                xs="4"
                                className="mb-2 shadow-sm p-3 mb-5 bg-white rounded"
                            >
                              <div className="d-flex flex-column ">
                                <h6>
                                <span className="font-weight-bold text-primary">
                                  Price:{" "}
                                </span>
                                  <span className="text-primary">
                                  {" "}
                                    {item.price}
                                </span>{" "}
                                  <span className="text-small text-muted">
                                  EGP X{" "}
                                    <span className="text-primary">
                                    {item.quantity}
                                  </span>
                                </span>
                                </h6>
                                <h6>
                                <span className="font-weight-bold text-primary">
                                  Shipping Fees:{" "}
                                </span>{" "}
                                  <span className="text-primary">
                                  {item.shipping_fees}{" "}
                                </span>
                                  <span className="text-small text-muted">
                                  EGP
                                </span>
                                </h6>
                                <h6>
                                <span className="font-weight-bold text-primary">
                                  Discount:{" "}
                                </span>
                                  <span className="text-primary">
                                  {item.total_discounts}
                                </span>{" "}
                                  <span className="text-small text-muted">
                                  EGP
                                </span>
                                </h6>
                                <h6>
                                <span className="font-weight-bold text-primary">
                                  Total:{" "}
                                </span>
                                  <span className="text-primary">
                                  {item.total}
                                </span>{" "}
                                  <span className="text-small text-muted">
                                  EGP
                                </span>
                                </h6>
                                <h6 className="mt-5">
                                <span className="font-weight-bold text-primary">
                                  LC Commission:{" "}
                                </span>
                                  <span className="text-primary">
                                  {" "}
                                    {item.commission}
                                </span>
                                  <span className="text-small text-muted">
                                  EGP
                                </span>
                                </h6>
                                <h6>
                                <span className="font-weight-bold text-primary">
                                  Vendor Revenue:{" "}
                                </span>
                                  <span className="text-primary">
                                  {" "}
                                    {item.vendor_revenue}
                                </span>
                                  <span className="text-small text-muted">
                                  EGP
                                </span>
                                </h6>
                              </div>
                            </Col>
                            <h2 className="small-title">Notes</h2>
                            <Row className="g-0 mb-2 d-none d-lg-flex">
                              <Col>
                                <Row className="g-0 h-100 custom-sort ps-5 pe-4 h-100">
                                  <Col
                                      xs="3"
                                      lg="3"
                                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                                  >
                                    <div className="text-muted text-small">
                                      USERS
                                    </div>
                                  </Col>
                                  <Col
                                      xs="3"
                                      lg="3"
                                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                                  >
                                    <div className="text-muted text-small">
                                      STATUS
                                    </div>
                                  </Col>
                                  <Col
                                      xs="6"
                                      lg="6"
                                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                                  >
                                    <div className="text-muted text-small">
                                      NOTE
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>

                            <Col
                                xs="12"
                                className="shadow-sm p-3 bg-white rounded overflow-auto"
                            >
                              <div className="d-flex flex-column ">
                                {item?.status_history.map(
                                    (status, statusIndex) => (
                                        <Card className={`mb-2 `} key={index}>
                                          <Row className="g-0 h-100 sh-lg-9 position-relative">
                                            <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                                              <Row className="g-0 h-100 align-content-center">
                                                <Col
                                                    xs="3"
                                                    lg="3"
                                                    className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                                                >
                                                  <NavLink
                                                      to={`/users/detail/${status.user.id}`}
                                                  >
                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                    >
                                                      <div className="lh-1 text-alternate text-white">
                                                        {status.user.name}
                                                      </div>
                                                    </button>
                                                  </NavLink>
                                                </Col>
                                                <Col
                                                    xs="3"
                                                    lg="3"
                                                    className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                                                >
                                                  <div className="lh-1 text-alternate">
                                                    {status.status}
                                                  </div>
                                                </Col>
                                                <Col
                                                    xs="6"
                                                    lg="6"
                                                    className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                                                >
                                                  <div className="lh-1 text-alternate">
                                                    {status.notes !== null
                                                        ? status.notes
                                                        : "N/A"}
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </Card>
                                    )
                                )}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <hr className="mt-5"/>
                    </Row>
                ))}
                <Row>
                  <Col xl="6">
                    <div className="d-flex justify-content-around align-items-center">
                      <h5>Down Payment</h5>
                      <Form.Control
                        type="number"
                        className="w-50"
                        defaultValue={data?.payment_detail.down_payment}
                        onChange={dPayment}
                      />
                    </div>
                  </Col>
                  <Col xl="6" className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleDownpayment}
                    >
                      Save Down Payment
                    </button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
          {/* Cart End */}
        </Col>
      </Row>
    </>
  );
};

export default Cart;
