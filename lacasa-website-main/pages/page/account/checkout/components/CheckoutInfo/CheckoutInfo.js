import React, { useState, useEffect , useRef  } from "react";
import { useForm } from "react-hook-form";
import { Modal, ModalFooter, Button, ModalBody , Tooltip , Spinner
} from "reactstrap";
import { TextField } from "@mui/material";
import Link from "next/link";
import Breadcrumb from "./common/Breadcrumbs";
import Shipping from "./common/Shipping/Shipping";
import Payment from "./common/Shipping/Payment";
import ContactInfo from "./common/Shipping/ContactInfo";
import AddressInfo from "./common/Shipping/AddressInfo";
import Coupone from "./common/Shipping/Coupone";
import PaymentMethod from "./common/Shipping/PaymentMethod";

import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateCart,
  createCartOrder,
} from "../../../../../../helpers/redux/actions/cartActions";
import { useTranslation } from "react-i18next";
import { BorderRight } from "@mui/icons-material";

const CheckoutInfo = ({
  passSelectedCity
}) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cartList);
  const cartloading = cartItem.loading;
  const { payment_action } = cartItem;
  const [state, setState] = useState("shipping");
  const [data, setData] = useState();
  const [perrors, setPerrors] = useState(false);
  const [modal, setModal] = useState(false);
  const [orderData, setOrderData] = useState();
  const errorListRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // useEffect(() => {
  //   if (cartItem?.error && Object.values(cartItem?.error).length > 0) {
  //     errorListRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //       inline: "nearest",
  //     });
  //     errorListRef.current.focus();

  //   }
  // }, [cartItem?.error]);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    if (payment_action) toggle();
  }, [payment_action]);

  useEffect(() => {
    if (localStorage.getItem("orangeVoucher")) {
      setData({
        ...data,
        ...{ voucher_id: JSON.parse(localStorage.getItem("orangeVoucher")).id },
      });
    }
  }, []);

  // useEffect(() => {
  //   if (data?.payment_method) {
  //     dispatch(calculateCart(data));
  //   }
  // }, [data]);

  useEffect(() => {
    cartloading = cartItem.loading;
  }, [cartItem]);
  
  useEffect(() => {
    if (isRecaptchaVerified) {
		createOrder(checkedTerms);
	} else {
		setRecaptchaError("Please complete the reCAPTCHA challenge.");
	}
  }, [orderData]);

  useEffect(() => {
    passSelectedCity(selectedCity);
  }, [selectedCity]);
  
  const createOrder = (checkedTerms) => {
    if (checkedTerms) {
      document.getElementById("placeOrder").disabled = true;
      dispatch(createCartOrder(orderData));
    } else {
      setPerrors({ ...perrors, ...{ CheckedTerms: true } });
    }
  };
  // -------------------------------From shipping-----------------------------------
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggletool = () => setTooltipOpen(!tooltipOpen);
 
  const {
    register,
    unregister,
    setValue,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ shouldUnregister: true });
  // const cartItem = useSelector((state) => state.cartList);

  const { error, cart } = cartItem;
  const onSubmit = (shippingData) => {
  const preparedData = { ...data };

  // Handle address selection
  if (shippingData?.address_id === "new") {
    delete shippingData.address_id; // No existing address
  }

  // Populate preparedData with either existing or new address
  preparedData.address = shippingData.address_id
    ? { id: parseInt(shippingData.address_id, 10) } // Existing address
    : {
        email: shippingData.email,
        first_name: shippingData.first_name,
        last_name: shippingData.last_name,
        phone: shippingData.phone,
        street: shippingData.street,
        building_no: shippingData.building_no,
        floor_no: shippingData.floor_no,
        apartment_no: shippingData.apartment_no,
        notes: shippingData.notes || null,
        area_id: parseInt(shippingData.area_id, 10),
        city_id: parseInt(shippingData.city_id, 10),
        default: true,
        type: "shipping",
      };

  // Add additional fields if they exist
  ['wallet_number', 'coupon', 'voucher_id', 'notes'].forEach(field => {
    if (shippingData[field]) {
      preparedData[field] = shippingData[field];
    }
  });

  console.log("Prepared data to send:", preparedData);
  dispatch(calculateCart(preparedData)); // Dispatch to Redux
  setData(preparedData); // Update local state
  setState("payment"); // Move to the payment step
};
  
  const [isPhoneVerified, setIsPhoneVerified] = useState(true);

  const [userLogged, setUserLogged] = useState(true);
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  useEffect(async () => {
    if (localStorage.getItem("userInfo")) {
      setUserLogged(true);
      setIsPhoneVerified(true)
    }
  }, [user]);
// ------------------------------------------------------------
  // -------------------------------From Payment-----------------------------------
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(true);
  const [recaptchaError, setRecaptchaError] = useState("");
  // const cartItem = useSelector((state) => state.cartList);
  // const { error, cart } = cartItem;
    const handleRecaptchaChange = (value) => {
        setIsRecaptchaVerified(true);
        setRecaptchaError("");
    };
  const [checkedTerms, setCheckedTerms] = useState(false);
  const handleNote = (e) => {
          setData({...data, ...{notes: e.target.value}});
  };
  const handleScroll=()=>{
    const el = document.getElementById("verify_section_scroll");
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
// ------------------------------------------------------------

  const { t } = useTranslation();

  return (
    <div >

      {cartItem?.error && cartItem.error?.product && (
        <div
            ref={errorListRef}
          className="end-ar"
          style={{ color: "red", fontWeight: "900", textAlign: "end" }}
        >
          {`${t("We can't proceed further with")}${cartItem.error?.product}${t( "as we didn’t deliver to" )} ${cartItem.error?.City}`}
        </div>
      )}
      {/*{cartItem?.error && cartItem.error?.error && (*/}
      {/*  <div*/}
      {/*    className="end-ar"*/}
      {/*    style={{ color: "red", fontWeight: "900", textAlign: "end" }}*/}
      {/*  >*/}
      {/*    {`${cartItem.error?.error[0]}`}*/}
      {/*  </div>*/}
      {/*)}*/}
      {/* {cartItem?.error && (
          // <ul  style={{ color: "red", fontWeight: "900", textAlign: "center" }}>

            <ul
                ref={errorListRef} // Attach the ref to the ul element
                style={{
                  color: "red",
                  fontWeight: "900",
                  textAlign: "center",
                  outline: "none", // Ensure that the outline is removed for better styling
                }}
                tabIndex={-1} // Ensure the element can receive focus
            >
            {Object.values(cartItem?.error).map((error, index) => (
                <li  key={index}>{error}</li>
            ))}

          </ul>
      )} */}
      {/*{cartItem?.error*/}
      {/*    ? Object.values(cartItem?.error).map((error) => (*/}
      {/*        <div*/}
      {/*            className="end-ar"*/}
      {/*            style={{color: "red", fontWeight: "900", textAlign: "center"}}*/}
      {/*        >*/}
      {/*          {error}*/}
      {/*        </div>*/}
      {/*  ))*/}
      {/*  : null}*/}
      <Head>
        <title>Shipping | Lacasa</title>
      </Head>

      <div className={"CheckoutInfoContainer mt-5"}>
        
        <div className="row">
          <div className="col-12 col-md-12">
            <h3>{cartItem?.erros}</h3>
           
            {/* <Breadcrumb state={t(state)} setState={setState} /> */}
          </div>
        </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row flex-ar">
          {/* {state === "shipping" ? ( */}
            <div className="col-12 col-xl-6 containborder" style={{borderRight:"1px solid #eee"}} >
              {/* <Shipping data={data} setData={setData} setState={setState} /> */}
      
        <div className="row">         
          <div className="col-12" id="verify_section_scroll">
            <h2 className="checkout-title mb-4 ">
                <span class="step">.2.</span>
                {t("Checkout Information")} 
            </h2>
            <ContactInfo
              register={register}
              getValues={getValues}
              setValue={setValue}
              watch={watch}
              errors={errors}
              isPhoneVerified={isPhoneVerified}
              setIsPhoneVerified={setIsPhoneVerified}
            />
          </div>
          <div className="col-12">
            <AddressInfo
              passSelectedCity={setSelectedCity}
              unregister={unregister}
              reset={reset}
              getValues={getValues}
              setValue={setValue}
              register={register}
              errors={errors}
            />
          </div>
        </div>
        {/* <div
          style={{ gap: "10px" }}
          className="mb-3 mt-4 d-flex flex-ar  justify-content-end"
        >
          <button
            type="button"
            onClick={() => {
              router.push(`/shop?category=&page=1&sale=0`);
            }}
            className={"btn p-0 "}
            style={{ textDecoration: "underline" }}
          >
            {t("Return to Shop")}
          </button>

          <Button
          id={'verifyphone'}
            type="submit"
            className="btn px-4 pt-3 pb-3 ml-2"
            style={{ border: "0px", background: "black", color: "white", cursor: `${isPhoneVerified ? "" : "not-allowed"}` }}
            disabled={!userLogged || !isPhoneVerified}
            >
            {t("Continue to payment")}
          </Button>
          {!isPhoneVerified &&
          <Tooltip
            placement={'top'}
            isOpen={tooltipOpen}
            target={'verifyphone'}
            toggle={toggletool}
            style={{fontSize:"12px"}}
          >
            Please, verify your phone number first
          </Tooltip>
          } 
        </div> */}
     
           
            </div>
          {/* ) : ( */}
            <div className="col-12 col-xl-6">
              {/* <Payment
                setPerrors={setPerrors}
                perrors={perrors}
                createOrder={createOrder}
                setData={setData}
                data={data}
                setState={setState}
              /> */}

              <div className="row">
      <div className="col-md-12">
        <h2 className="checkout-title mb-4 ">
          <span class="step">.3.</span>
          {t("Payment options")} 
        </h2>
        {/*{error ? (*/}
        {/*  <p style={{ fontSize: "17px", color: "red" }}>{error?.message}</p>*/}
        {/*) : (*/}
        {/*  ""*/}
        {/*)}*/}
        {/* <Info setState={setState} data={data} /> */}
      </div>
      <div className="col-12 ">
        <Coupone finalData={data} setData={setData} />
      </div>
      <div className="col-12 "></div>
      <div className="col-12 ">
        <PaymentMethod data={data} setData={setData} />
      </div>
      <div className="col-12 "></div>
      <div className="col-12  mt-3">
        <TextField
          className="w-100 inputBtn"
          type={"text"}
          onChange={handleNote}
          label={t("Note (Optional)")}
          variant="filled"
        />
      </div>
        <div className="col-md-12 mt-3">
            <div className="d-flex">
                <input
                    type="checkbox"
                    style={{height: 20}}
                    id={"checking"}
                    className={"mr-1"}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setCheckedTerms(true);
                            setPerrors({...perrors, ...{CheckedTerms: false}});
                        } else {
                            setCheckedTerms(false);
                        }
                    }}
                />
                <label for="checking">
                    {t("By checking this box you agree to the")}{" "}
                    <Link href={"/terms-conditions"} passHref>
                        <a
                            style={{color: "blue"}}
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
                            style={{color: "blue"}}
                            target={"_blank"}
                            rel="noopener noreferrer"
                        >
                            {t("return policy")}
                        </a>
                    </Link>
                </label>
            </div>
            {perrors?.CheckedTerms && (
                <p style={{fontSize: "12px", color: "red"}}>
                    {t("Please accept our terms and conditions")}
                </p>
            )}
            {perrors?.errors && (
                <>
                    {perrors.errors.map((error) => {
                        return <p style={{fontSize: "12px", color: "red"}}>{error}</p>;
                    })}
                </>
            )}

            
            {/* {cart?.shipping_fees == 0 && (
          <div style={{ color: "red", fontWeight: "900", textAlign: "end" }}>
            We can't proceed further with this Item as we didn’t deliver to this
            location
          </div>
        )} */}
        </div>
    </div>

            </div>
          {/* )} */}
            <div className="col-12">
              <div className="mb-3 mt-4 d-flex justify-content-end">
                <button
                    type="button"
                    onClick={() => {
                        router.push(`/shop?category=&page=1&sale=0`);
                    }}
                    className={"btn btn-solid "}
                >
                    {" "}
                    {t("Return to Shop")}
                </button>
                {/* {Number(cart.shipping_fees)}&{JSON.stringify(error)} */}
                {Number(cart.shipping_fees) != 0 && !error ? (
                  
                    <Button
                        id="placeOrder"
                        className={"btn px-5 pt-3 pb-3 ml-2 checkoutSubmit"}
                        disabled={cartloading}
                        type={!isPhoneVerified ? "button"  : "submit"}
                        onClick={() => {if(!isPhoneVerified) handleScroll()}}
                    >
                    {cartloading ? <Spinner className="m-0"> Loading... </Spinner> : t("Place Order")}
                    </Button>
                ) : (
                  <>
                    <Button
                        disabled={!userLogged || cartloading}
                        id="placeOrder"
                        className={"btn px-5 pt-3 pb-3 ml-2 checkoutSubmit"}
                        type={!isPhoneVerified ? "button"  : "submit"}
                        onClick={() => {if(!isPhoneVerified) handleScroll()}}
                    >
                    {cartloading ? <Spinner className="m-0"> Loading... </Spinner> : t("Place Order") }
                    </Button>
                    {!isPhoneVerified &&
                    <Tooltip
                      placement={'top'}
                      isOpen={tooltipOpen}
                      target={'placeOrder'}
                      toggle={toggletool}
                      style={{fontSize:"12px"}}
                    >
                      Please, verify your phone number first
                    </Tooltip>}
                  </>
                )}
            </div>
            </div>
        </div>
      </form>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalBody style={{ height: "100%" }}>
          {payment_action?.token === "error" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20vh",
              }}
            >
              <h5>{t("Error try again later")}</h5>
            </div>
          ) : (
            <iframe
              className="iframe_payment"
              src={payment_action?.iframe_url}
              name={"iframe_a"}
              height={"700px"}
              width={"100%"}
              title={"Iframe Example"}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-solid btn-custom"
            color="secondary"
            onClick={toggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default CheckoutInfo;
