import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Chip, InputLabel } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../../../../../../helpers/API/API";
import { Modal, ModalBody } from "reactstrap";
import { Done } from "../../../../../../../../services/script";
import Lottie from "react-lottie-player";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Coupone = ({ finalData, setData }) => {
  const cartItem = useSelector((state) => state.cartList);
  const { cart } = cartItem;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ shouldUnregister: true });
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    reset: reset1,
    setError: setError1,
    formState: { errors: errors1 },
  } = useForm();
  const [promoCodeValue, setPromoCodeValue] = React.useState(
    localStorage.getItem("promotions")
      ? JSON.parse(localStorage.getItem("promotions")).coupon.coupon_code
      : false
  );
  const [is_PromoCode, setIs_PromoCode] = React.useState(false);
  const [isPin, setIsPin] = React.useState(false);
  const [oraneDone, setOraneDone] = React.useState(false);
  const [modalOrange, setModalOrange] = useState(false);

  useEffect(() => {
    if (promoCodeValue) {
      setData({ ...finalData, ...{ coupon: promoCodeValue } });
    } else {
      setData({ ...finalData, ...{ coupon: null } });
    }
  }, [promoCodeValue]);

  const toggleOrange = () => {
    setModalOrange(!modalOrange);
  };

  const handleChangeCoupon = (data) => {
    console.log('this of handle copoun');
    if (cart.id)
      API.create(`/carts/${cart.id}/validate_coupons`, {
        coupon: data.coupon,
      })
        .then((response) => {
          if (response.status === "success") {
            setPromoCodeValue(data.coupon);
            setIs_PromoCode(true);
          } else {
            setError("coupon", { message: response.errors.coupon[0] });
          }
        })
        .catch((err) => console.log(err));
  };

  const handleOrangePoint = (data) => {
    if (data.pin) {
      API.create("/orange/redeem/voucher", data)
        .then(async (res) => {
          if (res.errors) {
            setError1("pin", { message: "Pin is incorrect" });
          } else {
            localStorage.setItem(
              "orangeVoucher",
              JSON.stringify(res.data.voucher)
            );
            setData({ ...finalData, ...{ voucher_id: res.data.voucher.id } });
            setOraneDone({ done: true, data: res.data.voucher });
          }
        })
        .catch((err) => console.log(err));
    } else {
      API.create("/orange/redeem", data)
        .then(async (res) => {
          if (res.errors) {
            setError1("points", { message: "Not enough points" });
          } else {
            setValue1("token", res.data.token);
            setValue1("request_id", res.data.request_id);
            setValue1("mobile", res.data.mobile);
            setIsPin(true);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="row">
        <div className="col-md-12">
          <h3 className={"mainTitle "}>{t("Discount information")}</h3>
        </div>
      </div>
      <form onSubmit={handleSubmit(handleChangeCoupon)}>
        <div className={"DiscountContainer"}>
          {is_PromoCode === false ? (
            <>
              <div className={`d-flex justify-content-between`}>
                <div className={"p-0 pr-2 pr-md-0"} style={{ width: "88%" }}>
                  <TextField
                    type={"text"}
                    className={"inputBtn"}
                    {...register("coupon", {
                      required: "",
                    })}
                    required
                    label={t("Enter your discount code")}
                    variant="filled"
                  />
                </div>
                <div className={"p-0"} style={{ width: "10%" }}>
                  <button
                    className={"btn p-0 checkoutButton"}
                    style={{  height: "100%",width: "100%" }}
                    type="submit"
                  >
                    <ArrowForwardIosIcon />
                  </button>
                </div>
              </div>
              <ErrorMessage
                errors={errors}
                name="coupon"
                render={({ message }) => (
                  <p className={"errorStyle mt-2"}>{message}</p>
                )}
              />
            </>
          ) : (
            <>
              <div className={" discountTagContainer"}>
                <Chip
                  icon={<LocalOfferIcon />}
                  {...register("coupon", {
                    required: "",
                  })}
                  label={promoCodeValue}
                  variant="outlined"
                  onDelete={() => {
                    setPromoCodeValue(false);
                    setIs_PromoCode(false);
                  }}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="coupon"
                render={({ message }) => (
                  <p className={"errorStyle mt-2"}>{message}</p>
                )}
              />
            </>
          )}
        </div>
      </form>
      <a
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          marginBlock:"20px"
        }}
        className={"d-flex align-items-end"}
        onClick={toggleOrange}
      >
        <img
          style={{ width: "20px" }}
          className={"mt-2 mr-2"}
          src="/assets/images/Orange_logo.png"
        />
        <p style={{ fontSize: "14px" }} className="m-0">
          {t("Use Orange Points")}
        </p>
      </a>
      <Modal
        size="md"
        style={{ maxWidth: "700px" }}
        isOpen={modalOrange}
        toggle={toggleOrange}
        centered
      >
        <form onSubmit={handleSubmit1(handleOrangePoint)}>
          <ModalBody className="p-3 p-md-5">
            <div className="d-flex align-items-center border-bottom">
              <img
                style={{ width: "80px", padding: "10px" }}
                src="/assets/images/Orange_logo.png"
              />
              <h2 style={{ fontSize: "18px" }}>{t("Orange Points")}</h2>
            </div>
            {oraneDone.done ? (
              <div className="p-2 p-md-3 text-center">
                <div className="d-flex justify-content-center">
                  <div
                    style={{
                      width: "200px",
                    }}
                  >
                    <Lottie
                      className="lottie"
                      loop={false}
                      animationData={Done}
                      play
                    />
                  </div>
                </div>
                <p>{t("Your points has been redeemed")}</p>
              </div>
            ) : (
              <div>
                <div className="p-2 p-md-3 text-center">
                  {isPin ? (
                    <p>
                      {t(
                        "Please enter the pin code which had send to your number"
                      )}
                    </p>
                  ) : (
                    <p>
                      {t(
                        "Please enter your phone number and redemption amount you would like to redeem off your Orange Points."
                      )}
                    </p>
                  )}
                </div>
                {isPin ? (
                  <div className="px-1 px-md-5">
                    <div className="row p-4 p-md-5">
                      <div className="col-12 mb-3 col-md-12 pl-md-1 mb-2">
                        <InputLabel className="mb-0" id="countryPickerLabel">
                          {t("Pin")}
                        </InputLabel>
                        <TextField
                          key={"pin"}
                          className="w-100 inputBtn"
                          type={"number"}
                          {...register1("pin", {
                            required: t("Pin is required*"),
                          })}
                          label=""
                          variant="filled"
                          required
                        />
                        <ErrorMessage
                          errors={errors1}
                          name="pin"
                          render={({ message }) => (
                            <p
                              style={{ fontSize: "14px", color: "red" }}
                              className={"errorStyle"}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-12 pl-md-1 mb-2 mt-2">
                        <button
                          type={"submit"}
                          className={"btn pt-3 pb-3 w-100"}
                          style={{
                            border: "0px",
                            background: "black",
                            color: "white",
                          }}
                        >
                          {t("Confirm")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-1 px-md-5">
                    <div className="row p-1 p--md-5">
                      <div className="col-12 mb-3 col-md-12 pl-md-1 mb-2">
                        <InputLabel className="mb-0" id="countryPickerLabel">
                          {t("Phone")}
                        </InputLabel>
                        <TextField
                          key={"mobile"}
                          className="w-100 inputBtn"
                          type={"number"}
                          {...register1("mobile", {
                            required: t("Mobile is required*"),
                          })}
                          label={t("Your phone number")}
                          variant="filled"
                          required
                        />
                        <ErrorMessage
                          errors={errors1}
                          name="mobile"
                          render={({ message }) => (
                            <p
                              style={{ fontSize: "14px", color: "red" }}
                              className={"errorStyle"}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-12 pl-md-1 mb-2">
                        <InputLabel className="mb-0" id="countryPickerLabel">
                          {t("Amount")}
                        </InputLabel>
                        <TextField
                          key={"points"}
                          className="w-100 inputBtn"
                          type={"number"}
                          {...register1("points", {
                            required: t("Points is required*"),
                          })}
                          label="EGP"
                          variant="filled"
                          required
                        />
                        <ErrorMessage
                          errors={errors1}
                          name="points"
                          render={({ message }) => (
                            <p
                              style={{ fontSize: "14px", color: "red" }}
                              className={"errorStyle"}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                      <div className="col-12 col-md-12 pl-md-1 mb-2 mt-2">
                        <button
                          type={"submit"}
                          className={"btn pt-3 pb-3 w-100"}
                          style={{
                            border: "0px",
                            background: "black",
                            color: "white",
                          }}
                        >
                          {t("Redeem")}
                        </button>
                        <div className="d-flex justify-content-center mt-2">
                          <button className="btn" onClick={toggleOrange}>
                            {t("Cancel")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
        </form>
      </Modal>
    </div>
  );
};
export default Coupone;
