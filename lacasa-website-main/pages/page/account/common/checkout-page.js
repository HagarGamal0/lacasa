import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Button,
  Collapse,
} from "reactstrap";
import { useForm } from "react-hook-form";
import CartContext from "../../../../helpers/cart";
import visa2 from "../../../../public/assets/images/visa2.png";
import valu from "../../../../public/assets/images/ValU.png";
import cod from "../../../../public/assets/images/cod.png";
import nbe from "../../../../public/assets/images/nbe.jpg";
import cib from "../../../../public/assets/images/cib.png";
import bm from "../../../../public/assets/images/bm.png";
import bdc from "../../../../public/assets/images/bdc.jpg";
import { useRouter } from "next/router";
import { detailsUser } from "../../../../helpers/redux/actions/userActions";
import API from "../../../../helpers/API/API";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Link from "next/link";

const Address = dynamic(() => import("./address"));

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartCont = useContext(CartContext);
  const [cartItemsCheckout, setCartItemsCheckout] = useState(cartCont.state);
  const cartItems = cartCont.state;
  const cartTotal = cartCont.cartTotal;
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    reset: reset1,
  } = useForm();
  const [modal, setModal] = useState(false);
  const [modalOrange, setModalOrange] = useState(false);
  const [token, setToken] = useState();
  const [payment, setPayment] = useState({ id: 1 });
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [errorOrder, setErrorOrder] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState(
    router.query.errors ? router.query.errors : false
  );
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses"))
  );
  const [couponCode, setCouponCode] = useState("");
  const [productPrice, setProductPrice] = useState({});
  const [errors, setErrors] = useState({});
  const [doneOrange, setDoneOrange] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedTermsError, setCheckedTermsError] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const toggleOrange = () => {
    setModalOrange(!modalOrange);
  };
  const toggleCollapse = async (index) => {
    if (index === collapse) {
      await setCollapse(0);
    } else {
      setCollapse(index);
    }
  };
  const address = useRef(null);
  const checkout = useRef(null);
  useEffect(() => {
    const arr = [];
    cartItems.map((item) => {
      arr.push({ id: item.id });
    });

    API.create("/orders/available_payment_methods", { products: arr })
      .then((response) => {
        setPaymentMethod(response.data);
      })
      .catch((err) => console.log(err));
    dispatch(detailsUser());
  }, []);

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  useEffect(() => {
    const products = [];
    cartItems?.map((item) => {
      if (item.variants) {
        const arr = [];
        var fabric_color = false;
        for (var i in item.variants) {
          if (i === "Fabric Color") {
            fabric_color = item.variants[i];
          } else {
            arr.push(parseInt(item.variants[i].value_id));
          }
        }
        products.push({
          id: item.id,
          quantity: item.qty,
          attributes: arr,
          fabric_color: fabric_color ? fabric_color : "",
        });
      } else {
        products.push({ id: item.id, quantity: item.qty });
      }
    });
    if (user?.data?.addressbook.shipping.length > 0) {
      setErrorOrder(false);
      const addressId = (user?.data?.addressbook.shipping.filter(
        (item) => item.default === true
      ))[0].id;
      API.create("/update_cart", {
        coupon: couponCode,
        payment_method: payment.id,
        address_id: addressId,
        products: products,
      })
        .then((response) => {
          setProductPrice(response);
          if (response.products) {
            var total = 0;
            var arr = [];
            response.products.map((item, index) => {
              arr.push({
                ...cartItems[index],
                ...{ estimated_delivery: item.estimated_delivery },
              });
              total += item.shipping_fees;
            });
            setCartItemsCheckout(arr);
            setErrors({});
            window.gtag("event", "begin_checkout", {
              items: cartItems,
              coupon: couponCode,
            });
          } else {
            setErrors(response.errors);
          }
        })
        .catch((err) => console.log(err));
    } else if (addresses) {
      setErrorOrder(false);
      const address = addresses.filter((item) => item.default === true)[0];
      API.create("/update_cart", {
        coupon: couponCode,
        payment_method: payment.id,
        address: address,
        products: products,
      })
        .then((response) => {
          setProductPrice(response);
          if (response.products) {
            var arr = [];
            response.products.map((item, index) => {
              arr.push({
                ...cartItems[index],
                ...{ estimated_delivery: item.estimated_delivery },
              });
            });
            setCartItemsCheckout(arr);
            setErrors({});
            window.gtag("event", "begin_checkout", {
              items: cartItems,
              coupon: couponCode,
            });
          } else {
            setErrors(response.errors);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user, addresses, cartItems, couponCode]);

  const submitAddress = useRef();

  const onSubmit = async (e) => {
    setErrorCheckout(false);
    const products = [];
    cartItems?.map((item) => {
      if (item.variants) {
        const arr = [];
        var fabric_color = false;
        for (var i in item.variants) {
          if (i === "Fabric Color") {
            fabric_color = item.variants[i];
          } else {
            arr.push(parseInt(item.variants[i].value_id));
          }
        }
        products.push({
          id: item.id,
          quantity: item.qty,
          attributes: arr,
          fabric_color: fabric_color ? fabric_color : "",
        });
      } else {
        products.push({ id: item.id, quantity: item.qty });
      }
    });
    if (user) {
      if (!(user?.data?.addressbook.shipping.length > 0)) {
        await submitAddress.current.submit();
        functionSubmitAddressUser(products);
      } else {
        functionSubmitAddressUser(products);
      }
    } else {
      if (!addresses) {
        await submitAddress.current.submit();
        await setTimeout(async () => {
          await setAddresses(JSON.parse(localStorage.getItem("addresses")));
          functionSubmitAddressGuest(
            products,
            JSON.parse(localStorage.getItem("addresses"))
          );
        }, 500);
      } else {
        functionSubmitAddressGuest(products, addresses);
      }
    }
  };

  const functionSubmitAddressUser = async (products) => {
    document.getElementById("placeOrder").disabled = true;
    if (user?.data?.addressbook.shipping.length > 0 && checkedTerms) {
      const addressId = (user?.data.addressbook.shipping.filter(
        (item) => item.default === true
      ))[0].id;
      API.create("/orders", {
        coupon: couponCode,
        payment_method: payment.id,
        address_id: addressId,
        products: products,
        notes: remarks === "" ? null : remarks,
      })
        .then(async (response) => {
          if (response.data.payment_action === null) {
            await router.push({
              pathname: "/page/order-success",
              query: { order: response.data.order.id, status: true },
            });
            import("react-facebook-pixel")
              .then((x) => x.default)
              .then((ReactPixel) => {
                ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
                ReactPixel.track("Purchase", {
                  value: response.data.order.subtotal,
                  currency: "EGP",
                });
              });
            window.gtag("event", "purchase", {
              transaction_id: response.data.order.id,
              value: response.data.order.total,
              items: response.data.order.products,
              currency: "EGP",
            });
            window.gtag("event", "conversion", {
              send_to: "AW-16498577431/Z0sKCMrC3J0ZEJegkbs9",
              transaction_id: response.data.order.id,
              value: response.data.order.total,
              currency: "EGP",
            });
          } else {
            await setToken(response.data.payment_action.token);
            await setModal(!modal);
          }
        })
        .catch((err) => console.log(err));
      setErrorOrder(false);
    } else {
      if (user?.data?.addressbook.shipping.length > 0) {
        setCheckedTermsError(true);
        document.getElementById("placeOrder").disabled = false;
      } else {
        document.getElementById("placeOrder").disabled = false;
        address.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const functionSubmitAddressGuest = async (products, addresses) => {
    document.getElementById("placeOrder").disabled = true;
    if (addresses && checkedTerms) {
      const address = addresses.filter((item) => item.default === true)[0];
      API.create("/orders", {
        coupon: couponCode,
        payment_method: payment.id,
        address: address,
        products: products,
        notes: remarks === "" ? null : remarks,
      })
        .then(async (response) => {
          if (response.data.payment_action === null) {
            await router.push({
              pathname: "/page/order-success",
              query: { order: response.data.order.id, status: true },
            });
            import("react-facebook-pixel")
              .then((x) => x.default)
              .then((ReactPixel) => {
                ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
                ReactPixel.track("Purchase", {
                  value: response.data.order.subtotal,
                  currency: "EGP",
                });
              });
            window.gtag("event", "purchase", {
              transaction_id: response.data.order.id,
              value: response.data.order.total,
              items: response.data.order.products,
              currency: "EGP",
            });
            window.gtag("event", "conversion", {
              send_to: "AW-16498577431/Z0sKCMrC3J0ZEJegkbs9",
              transaction_id: response.data.order.id,
              value: response.data.order.total,
              currency: "EGP",
            });
          } else {
            await setToken(response.data.payment_action.token);
            await setModal(!modal);
          }
        })
        .catch((err) => console.log(err));
      setErrorOrder(false);
    } else {
      if (addresses) {
        setCheckedTermsError(true);
        document.getElementById("placeOrder").disabled = false;
      } else {
        document.getElementById("placeOrder").disabled = false;
        address.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const toggle = () => {
    if (modal) {
      document.getElementById("placeOrder").disabled = false;
    }
    setModal(!modal);
  };

  const checkhandle = (value) => {
    setPayment(value);
  };

  const handleChangeCoupon = () => {
    const products = [];
    cartItems?.map((item) => {
      if (item.variants) {
        const arr = [];
        for (var i in item.variants) {
          arr.push({ key: i, value: item.variants[i] });
        }
        products.push({ id: item.id, quantity: item.qty, attributes: arr });
      } else {
        products.push({ id: item.id, quantity: item.qty });
      }
    });
    API.create(`/coupons/validate`, {
      coupon: document.getElementById("couponInput").value,
      products: products,
    })
      .then(async (response) => {
        if (response.subtotal) {
          await setCouponCode(document.getElementById("couponInput").value);
          setErrors({});
        } else {
          setErrors(response.errors);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOrangePoint = (data) => {
    if (data.pin) {
      API.create("/orange/redeem/voucher", data)
        .then(async (res) => {
          if (res.errors) {
            setDoneOrange(false);
            setErrors({ orangeError: "In correct pin" });
          } else {
            setModalOrange(false);
            localStorage.setItem("voucher", JSON.stringify(res.data.voucher));
          }
        })
        .catch((err) => console.log(err));
    } else {
      API.create(data.pin ? "/orange/redeem/voucher" : "/orange/redeem", data)
        .then(async (res) => {
          if (res.errors) {
            setDoneOrange(false);
            setErrors({ orangeError: "No enough points." });
          } else {
            setValue1("request_id", res.data.request_id);
            setValue1("token", res.data.token);
            setErrors({ orangeError: false });
            setDoneOrange(true);
          }
        })
        .catch((err) => console.log(err));
    }
    API.create(data.pin ? "/orange/redeem/voucher" : "/orange/redeem", data)
      .then(async (res) => {
        if (res.errors) {
          setDoneOrange(false);
          setErrors({ orangeError: "No enough points." });
        } else {
          setValue1("request_id", res.data.request_id);
          setValue1("token", res.data.token);
          setErrors({ orangeError: false });
          setDoneOrange(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="section-b-space">
      <Container>
        <div className="checkout-page">
          <div className="checkout-form">
            <Row>
              {user ? (
                <Col lg="6" sm="12" xs="12">
                  <div ref={address}>
                    <Address
                      submitAddress={submitAddress}
                      checkout={checkout}
                      errorOrder={errorOrder}
                      col={"12"}
                      isLoggedIn={true}
                    />
                  </div>
                </Col>
              ) : (
                <Col lg="6" sm="12" xs="12">
                  <div ref={address}>
                    <Address
                      submitAddress={submitAddress}
                      checkout={checkout}
                      errorOrder={errorOrder}
                      col={"12"}
                      isLoggedIn={false}
                      addresses={addresses}
                      setAddresses={setAddresses}
                    />
                  </div>
                </Col>
              )}
              <Col lg="6" sm="12" xs="12">
                {cartItemsCheckout &&
                cartItemsCheckout.length > 0 &&
                cartTotal > 0 ? (
                  <div ref={checkout} className="checkout-details">
                    <div className="order-box">
                      <div className="title-box">
                        <div>
                          Product <span>Total</span>
                        </div>
                      </div>
                      <ul className="qty">
                        {cartItemsCheckout.map((item, index) => (
                          <li key={index}>
                            {item.name} × {item.qty}{" "}
                            <span>
                              {/* {symbol} */}
                              {item.total
                                .toFixed(0)
                                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                              EGP
                            </span>
                            {item.estimated_delivery ? (
                              <p>
                                Estimated Delivery: {item.estimated_delivery}
                              </p>
                            ) : (
                              ""
                            )}
                          </li>
                        ))}
                      </ul>
                      <ul className="sub-total">
                        <li>
                          Subtotal
                          <span className="count">
                            {productPrice?.original_subtotal ? (
                              <div>
                                <div>
                                  {productPrice.original_subtotal
                                    .toFixed(0)
                                    .replace(
                                      /(\d)(?=(\d{3})+(?!\d))/g,
                                      "$1,"
                                    )}{" "}
                                  EGP
                                </div>
                              </div>
                            ) : (
                              <label>
                                {cartTotal
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </label>
                            )}
                          </span>
                        </li>
                        {!(
                          productPrice?.original_shipping ===
                          productPrice?.shipping_fees
                        ) && (
                          <li>
                            Shipping before discount{" "}
                            <span style={{ color: "black" }} className="count">
                              {productPrice?.original_shipping ? (
                                <div>
                                  <div>
                                    +
                                    {productPrice.original_shipping
                                      .toFixed(0)
                                      .replace(
                                        /(\d)(?=(\d{3})+(?!\d))/g,
                                        "$1,"
                                      )}{" "}
                                    EGP
                                  </div>
                                </div>
                              ) : (
                                <label>
                                  {productPrice?.original_shipping === 0
                                    ? ""
                                    : "Shipping calculated based on address"}
                                </label>
                              )}
                            </span>
                          </li>
                        )}

                        {/* {productPrice?.shipping_discount ? (
                          <li>
                            Shipping discount{" "}
                            <span style={{ color: "green" }} className="count">
                              <div>
                                -
                                {productPrice.shipping_discount
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </div>
                            </span>
                          </li>
                        ) : (
                          ""
                        )} */}
                        <li>
                          Total shipping{" "}
                          <span style={{ color: "black" }} className="count">
                            {productPrice?.shipping_fees ? (
                              <div>
                                <div>
                                  +
                                  {productPrice.shipping_fees
                                    .toFixed(0)
                                    .replace(
                                      /(\d)(?=(\d{3})+(?!\d))/g,
                                      "$1,"
                                    )}{" "}
                                  EGP
                                </div>
                              </div>
                            ) : (
                              <label>
                                {productPrice?.shipping_fees === 0
                                  ? "Free Shipping"
                                  : "Shipping calculated based on address"}
                              </label>
                            )}
                          </span>
                        </li>
                        {errors?.city ? (
                          <p style={{ fontSize: "12px", color: "red" }}>
                            {errors.city[0]}
                          </p>
                        ) : (
                          ""
                        )}
                        {productPrice?.coupon_discount ? (
                          <li>
                            Discount{" "}
                            <span style={{ color: "green" }} className="count">
                              <div>
                                -
                                {productPrice.coupon_discount
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </div>
                            </span>
                          </li>
                        ) : (
                          ""
                        )}
                        {productPrice?.flash_sale_discount ? (
                          <li>
                            Flash sale discount{" "}
                            <span style={{ color: "green" }} className="count">
                              <div>
                                -
                                {productPrice.flash_sale_discount
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </div>
                            </span>
                          </li>
                        ) : (
                          ""
                        )}

                        <li>
                          Promo code:{" "}
                          <Row>
                            <Col xs="8">
                              <input
                                id={"couponInput"}
                                style={{ height: "50px" }}
                                className="form-control"
                                placeholder="Coupon Code"
                              />
                            </Col>
                            <Col xs="4">
                              <Button
                                onClick={handleChangeCoupon}
                                className="btn-solid btn"
                              >
                                Apply
                              </Button>
                            </Col>
                          </Row>
                          <Row>
                            <Col xs="12">
                              <a
                                style={{
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  textDecoration: "underline",
                                }}
                                onClick={toggleOrange}
                              >
                                Use Orange points
                              </a>
                              <Modal
                                isOpen={modalOrange}
                                toggle={toggleOrange}
                                centered
                              >
                                <form
                                  onSubmit={handleSubmit1(handleOrangePoint)}
                                >
                                  <ModalHeader toggle={toggleOrange}>
                                    Orange Points
                                  </ModalHeader>
                                  <ModalBody className="p-4">
                                    <input
                                      {...register1("mobile")}
                                      style={{ height: "50px" }}
                                      className="mb-2 form-control"
                                      placeholder="Phone number"
                                    />
                                    <input
                                      {...register1("points")}
                                      style={{ height: "50px" }}
                                      className=" mb-2 form-control"
                                      placeholder="Points"
                                    />
                                    {doneOrange && (
                                      <input
                                        {...register1("pin")}
                                        style={{ height: "50px" }}
                                        className="mb-2 form-control"
                                        placeholder="Pin"
                                      />
                                    )}

                                    {errors?.orangeError && (
                                      <p
                                        style={{
                                          fontSize: "14px",
                                          color: "red",
                                        }}
                                      >
                                        {errors?.orangeError}
                                      </p>
                                    )}
                                    {/* {doneOrange && <p style={{ fontSize: '14px', color: "green" }} >congratulations your points have been redeemed</p>} */}
                                  </ModalBody>
                                  <ModalFooter>
                                    <button
                                      type={"submit"}
                                      style={{ cursor: "pointer" }}
                                      className="btn btn-solid "
                                      color="secondary"
                                    >
                                      Use Point
                                    </button>
                                    <Button
                                      style={{ cursor: "pointer" }}
                                      className="btn-solid "
                                      color="secondary"
                                      onClick={toggleOrange}
                                    >
                                      Cancel
                                    </Button>
                                  </ModalFooter>
                                </form>
                              </Modal>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              {errors?.coupon ? (
                                <p style={{ fontSize: "12px", color: "red" }}>
                                  {errors.coupon[0]}
                                </p>
                              ) : (
                                ""
                              )}
                            </Col>
                          </Row>
                        </li>
                      </ul>
                      <ul className="total">
                        {productPrice.total_discounts ? (
                          <li>
                            Total discount{" "}
                            <span style={{ color: "green" }} className="count">
                              <div>
                                -
                                {productPrice.total_discounts
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </div>
                            </span>
                          </li>
                        ) : (
                          ""
                        )}
                        <li>
                          Total{" "}
                          <span className="count">
                            {(productPrice?.total
                              ? productPrice.total
                              : cartTotal
                            )
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                            EGP
                          </span>
                        </li>

                        <li>
                          <textarea
                            style={{
                              height: "100px",
                              padding: "20px",
                              fontSize: "14px",
                            }}
                            placeholder={"Remarks (optional)"}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </li>
                      </ul>
                    </div>
                    <div className="payment-box">
                      <div className="upper-box">
                        <div className="payment-options">
                          {/* <ul>
                            {paymentMethod.map((item, index) => (
                              <div key={index}>
                                <h3 >{item.title}
                                  {item.name === "cod" &&
                                    <img style={{ marginLeft: "10px", width: '40px' }} src={cod} />
                                  }
                                  {item.name === "paymob" &&
                                    <img style={{ marginLeft: "10px", width: '50px' }} src={visa2} />
                                  }
                                  {item.name === "valu" &&
                                    <img style={{ marginLeft: "10px", width: '50px' }} src={valu} />
                                  }
                                </h3>

                                <li>
                                  <div className="radio-option paypal">
                                    <input
                                      type="radio"
                                      name="payment-group"
                                      id={`payment-${item.id}`}
                                      defaultChecked={index === 0 ? true : false}
                                      onClick={() => checkhandle(item)}
                                    />
                                    <label htmlFor={`payment-${item.id}`}>
                                      {item.display_name}
                                    </label>
                                  </div>
                                </li>
                              </div>
                            ))}
                          </ul> */}

                          {/* <ul>
                            {paymentMethod.map((item, index) => (
                              <>
                                <h3 style={{ cursor: "pointer" }} onClick={() => { toggleCollapse(index + 1) }}>{item.title}</h3>
                                <Collapse isOpen={(collapse === (index + 1)) ? true : false}>
                                <li>
                                        <div className="radio-option paypal">
                                          <input
                                            type="radio"
                                            name="payment-group"
                                            id={`payment-${item.id}`}
                                            defaultChecked={index === 0 ? true : false}
                                            onClick={() => checkhandle(item)}
                                          />
                                          <label htmlFor={`payment-${item.id}`}>
                                            {item.display_name}
                                          </label>
                                        </div>
                                      </li>
                                </Collapse>
                              </>
                            ))}
                          </ul> */}
                          <ul>
                            {paymentMethod.map((item, index) => (
                              <div key={index}>
                                <h3
                                  style={{
                                    cursor: "pointer",
                                    width: "100%",
                                    border: "1px solid #cacaca7a",
                                    borderRadius: "10px",
                                    backgroundColor: "white",
                                    padding: "10px",
                                  }}
                                  onClick={() => {
                                    toggleCollapse(index + 1);
                                  }}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: item.title,
                                    }}
                                  />
                                  <i
                                    className={`fa fa-arrow-down arrow-payment ${
                                      collapse === index + 1 ? "isRotated" : ""
                                    }`}
                                    aria-hidden="true"
                                    style={{ marginRight: "20px" }}
                                  />

                                  {item.name === "cod" && (
                                    <img
                                      style={{
                                        marginLeft: "10px",
                                        width: "40px",
                                      }}
                                      src={cod}
                                    />
                                  )}
                                  {item.name === "paymob" && (
                                    <>
                                      {item.title === "Installment" ? (
                                        <img
                                          style={{
                                            marginLeft: "10px",
                                            width: "50px",
                                          }}
                                          src={bdc}
                                        />
                                      ) : (
                                        <img
                                          style={{
                                            marginLeft: "10px",
                                            width: "50px",
                                          }}
                                          src={visa2}
                                        />
                                      )}
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "50px",
                                        }}
                                        src={nbe}
                                      />
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "50px",
                                        }}
                                        src={cib}
                                      />
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "50px",
                                        }}
                                        src={bm}
                                      />
                                    </>
                                  )}
                                  {item.name === "valu" && (
                                    <img
                                      style={{
                                        marginLeft: "10px",
                                        width: "50px",
                                      }}
                                      src={valu}
                                    />
                                  )}
                                </h3>
                                <div style={{ padding: "10px" }}>
                                  <Collapse
                                    isOpen={
                                      collapse === index + 1 ? true : false
                                    }
                                  >
                                    {item.name === "paymob" ? (
                                      <>
                                        {item.title === "Installment" ? (
                                          <>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-1`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-1`}
                                                >
                                                  Bank Misr Credit Cards
                                                  Installments
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={bm}
                                                />
                                              </div>
                                            </li>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-2`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-2`}
                                                >
                                                  CIB Credit Cards Installments
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={cib}
                                                />
                                              </div>
                                            </li>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-3`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-3`}
                                                >
                                                  NBE Credit Cards Installments
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={nbe}
                                                />
                                              </div>
                                            </li>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-4`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-4`}
                                                >
                                                  Installments using BDC
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={bdc}
                                                />
                                              </div>
                                            </li>
                                          </>
                                        ) : (
                                          <>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-1`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-1`}
                                                >
                                                  Pay with NBE Bank Cards
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={nbe}
                                                />
                                              </div>
                                            </li>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-2`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-2`}
                                                >
                                                  Pay with CIB Bank Cards
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={cib}
                                                />
                                              </div>
                                            </li>
                                            <li>
                                              <div className="radio-option paypal">
                                                <input
                                                  type="radio"
                                                  name="payment-group"
                                                  id={`payment-${item.id}-3`}
                                                  defaultChecked={
                                                    index === 0 ? true : false
                                                  }
                                                  onClick={() =>
                                                    checkhandle(item)
                                                  }
                                                />
                                                <label
                                                  htmlFor={`payment-${item.id}-3`}
                                                >
                                                  Pay with Bank Cards
                                                </label>
                                                <img
                                                  style={{
                                                    marginLeft: "10px",
                                                    width: "50px",
                                                  }}
                                                  src={visa2}
                                                />
                                              </div>
                                            </li>
                                          </>
                                        )}
                                      </>
                                    ) : (
                                      <li>
                                        <div className="radio-option paypal">
                                          <input
                                            type="radio"
                                            name="payment-group"
                                            id={`payment-${item.id}`}
                                            defaultChecked={
                                              index === 0 ? true : false
                                            }
                                            onClick={() => checkhandle(item)}
                                          />
                                          <label htmlFor={`payment-${item.id}`}>
                                            {item.display_name}
                                          </label>
                                        </div>
                                      </li>
                                    )}
                                  </Collapse>
                                </div>
                              </div>
                            ))}
                          </ul>
                          {/* <span className="image_visa">
                            <Media src={visa} alt="" />
                          </span> */}
                        </div>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          id={"checking"}
                          className={"mr-1"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCheckedTerms(true);
                              setCheckedTermsError(false);
                            } else {
                              setCheckedTerms(false);
                            }
                          }}
                        />
                        <label for="checking">
                          {t(" By checking this box you agree to the")}{" "}
                          <Link href={"/terms-conditions"} passHref>
                            <a
                              style={{ color: "blue" }}
                              target={"_blank"}
                              rel="noopener noreferrer"
                            >
                              {t("terms and conditions")}
                            </a>
                          </Link>{" "}
                          {t("and")}{" "}
                          <Link href={"/return-policy"} passHref>
                            <a
                              href={"/return-policy"}
                              style={{ color: "blue" }}
                              target={"_blank"}
                              rel="noopener noreferrer"
                            >
                              {t("return policy")}
                            </a>
                          </Link>
                        </label>
                      </div>
                      {checkedTermsError && (
                        <p style={{ fontSize: "12px", color: "red" }}>
                          {t("Please accept our terms and conditions")}
                        </p>
                      )}

                      {true ? (
                        <p style={{ fontSize: "12px", color: "red" }}>
                          {errorCheckout}
                        </p>
                      ) : (
                        ""
                      )}
                      <div className="text-right">
                        <button
                          id={"placeOrder"}
                          onClick={onSubmit}
                          className="btn-solid btn"
                        >
                          {t("Place Order")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <h4>{t("Your cart is empty")}</h4>
                )}
              </Col>
            </Row>
          </div>
        </div>
        <Modal isOpen={modal} toggle={toggle} centered>
          <ModalHeader toggle={toggle}>Payment</ModalHeader>
          <ModalFooter style={{ height: "100%" }}>
            <iframe
              className={"iframe_payment"}
              src={`https://accept.paymob.com/api/acceptance/iframes/${payment.iframe_id}?payment_token=${token}`}
              name="iframe_a"
              height="700px"
              width="100%"
              title="Iframe Example"
            ></iframe>
            <Button
              className="btn-solid btn-custom"
              color="secondary"
              onClick={toggle}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </section>
  );
};

export default CheckoutPage;
