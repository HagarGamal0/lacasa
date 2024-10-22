import React, { useState } from "react";
import Info from "./Info";
import Coupone from "./Coupone";
import PaymentMethod from "./PaymentMethod";
import Link from "next/link";
import router from "next/router";
import { TextField } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
const Payment = ({
  perrors,
  setPerrors,
  createOrder,
  data,
  setData,
  setState,
}) => {
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(true);
  const [recaptchaError, setRecaptchaError] = useState("");
  const cartItem = useSelector((state) => state.cartList);
  const { error, cart } = cartItem;
    const handleRecaptchaChange = (value) => {
        setIsRecaptchaVerified(true);
        setRecaptchaError("");
    };
  const [checkedTerms, setCheckedTerms] = useState(false);
  const handleNote = (e) => {
        setData({...data, ...{notes: e.target.value}});
  };

  const { t } = useTranslation();
  return (
    <div className="row">
      <div className="col-md-12">
        {/*{error ? (*/}
        {/*  <p style={{ fontSize: "17px", color: "red" }}>{error?.message}</p>*/}
        {/*) : (*/}
        {/*  ""*/}
        {/*)}*/}
        {/* <Info setState={setState} data={data} /> */}
      </div>
      <div className="col-md-12">
        <Coupone finalData={data} setData={setData} />
      </div>
      <div className="col-md-12">
        <PaymentMethod data={data} setData={setData} />
      </div>
      <div className="col-md-12 mt-3">
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

            <div className="mb-3 mt-4 d-flex justify-content-end">
                <button
                    type="button"
                    onClick={() => {
                        router.push(`/shop?category=&page=1&sale=0`);
                    }}
                    className={"btn p-0 "}
                    style={{textDecoration: "underline"}}
                >
                    {" "}
                    {t("Return to Shop")}
                </button>
                {Number(cart.shipping_fees) != 0 && !error ? (
                    <button
                        type="button"
                        id="placeOrder"
                        className={"btn px-5 pt-3 pb-3 ml-2 "}
                        style={{border: "0px", background: "black", color: "white"}}
                        onClick={() => {
                            if (
                                isRecaptchaVerified
                            ) {
                               createOrder(checkedTerms);
                            }else {
                                setRecaptchaError("Please complete the reCAPTCHA challenge.");
                            }
                        }}
                    >
                        {t("Place Order")}
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled
                        id="placeOrder"
                        className={"btn px-5 pt-3 pb-3 ml-2 "}
                        style={{border: "0px", background: "black", color: "white"}}
                        onClick={() => {
                        }}
                    >
                        {t("Place Order")}
                    </button>
                )}
            </div>
            {/* {cart?.shipping_fees == 0 && (
          <div style={{ color: "red", fontWeight: "900", textAlign: "end" }}>
            We can't proceed further with this Item as we didn’t deliver to this
            location
          </div>
        )} */}
        </div>
    </div>
  );
};
export default Payment;
