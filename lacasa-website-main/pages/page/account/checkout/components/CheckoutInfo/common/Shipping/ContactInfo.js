import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../../../../../../../helpers/redux/actions/userActions";
import $ from "jquery";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import PhoneVerified from "../../../PhoneVerified/PhoneVerified";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import LoaderLogo from "../../../../../../../../components/Loader/loder";
import axios from "axios";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../../../../../../helpers/firebase/firebaseConfig";

const ContactInfo = ({ register, setValue, errors, isPhoneVerified, setIsPhoneVerified }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const address = JSON.parse(localStorage.getItem("orderData"));

  useEffect(() => {
    if (address && !user) {
      setValue("email", address?.address.email);
      setValue("phone", address?.address.phone);
    }
	setValue("referral", address?.address.referral);
  }, [address]);

  useEffect(() => {
    // $("#inputField").on("mousewheel", function (e) {
    //   $(e.target).blur();
    // });
  });

  const logOut = () => {
    dispatch(signout());
    window.location.reload();
  };

  const [phoneNumberEntered, setPhoneNumberEntered] = useState(address?.address?.phone);
  const [phoneVerifiedModel, setPhoneVerifiedModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isPhoneNumberVerified = JSON.parse(localStorage.getItem("phoneNumberVerified"));
  const [confirm, setConfirm] = useState(null);
  const [verifyProvider, setVerifyProvider] = useState("API");

  const sendOTPByFirebase = async () => {
    let recaptcha;
    setIsLoading(true);
    try {
      recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        "+2" + phoneNumberEntered,
        recaptcha
      );
      setConfirm(confirmation);
      toast.success(t("OTP successfully sent"));
      setPhoneVerifiedModel(true);
      document.querySelectorAll('.input_recaptcha')[0]?.remove();
      document.querySelector(".recaptcha-wrapper").innerHTML = '<div id="recaptcha" className="input_recaptcha"></div>'
    } catch (error) {
      switch (error.code) {
        case "auth/too-many-requests":
          toast.error(t("Too many requests. Please try again later."));
          break;
        case "auth/invalid-phone-number":
          toast.error(t("The phone number is invalid."));
          break;
        default:
          toast.error(t("Something went wrong. Please try again later."));
          break;
      }
      console.log(error);
      document.querySelectorAll('.input_recaptcha')[0]?.remove();
      document.querySelector(".recaptcha-wrapper").innerHTML = '<div id="recaptcha" className="input_recaptcha"></div>'
    } finally {
      recaptcha = null;
      document.querySelectorAll('.input_recaptcha')[0]?.remove();
      document.querySelector(".recaptcha-wrapper").innerHTML = '<div id="recaptcha" className="input_recaptcha"></div>'
      document.querySelector(".recaptcha-wrapper").innerHTML = '<div id="recaptcha" className="input_recaptcha"></div>';
      setIsLoading(false);
    }
  }

  const sendOTP = async () => {
    if (isPhoneNumberVerified?.phoneNumber == phoneNumberEntered) {
      setIsPhoneVerified(true);
      toast.success(t("Phone number verified successfully!"));
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('phone', phoneNumberEntered);
      const response = await axios.post(`${process.env.NEXT_APP_BASE_URL}/request_otp`, formData);
      
      // successfully
      if (response.data?.status === "otp_sent" && JSON.parse(response.data?.sms?.body).Code == "4901") {
        toast.success(t("OTP successfully sent"));
        setVerifyProvider("API");
        setPhoneVerifiedModel(true);
      }
      else if (response.data?.status === "otp_sent" && JSON.parse(response.data?.sms?.body).code == "4905") {
        setVerifyProvider("FIREBASE");
        await sendOTPByFirebase();
        setPhoneVerifiedModel(true);
      }
      // verified once
      else if (response.data?.status === "verified") {
        setIsPhoneVerified(true);
        toast.success(t("Phone number verified successfully!"));
      }
      else {
        toast.error(t("There is an error, please try again later"));
      }
    } catch (error) {
      toast.error(t("There is an error, please try again later"));
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {
        isLoading && (
          <div className="loader-wrapper" style={{ background: "#000000a1" }}>
            <div className="loader"><LoaderLogo /></div>
          </div>
        )
      }
      {phoneVerifiedModel &&
        <PhoneVerified
          setPhoneVerifiedModel={setPhoneVerifiedModel}
          phoneNumberEntered={phoneNumberEntered}
          setIsPhoneVerified={setIsPhoneVerified}
          setIsLoading={setIsLoading}
          confirm={confirm}
          verifyProvider={verifyProvider}
        />
      }
      <div className="d-flex justify-content-between">
        <h3 style={{ width: "100%" }} className={"mainTitle end-ar"}>
          {t("Contact Information")}
        </h3>
      </div>
      {user ? (
        <div className={"card mb-2"}>
          <div className={"card-body"}>
            <div className={"d-flex align-items-center"}>
              <div>
                <img
                  className="account-image"
                  src={"/assets/images/accountImage.png"}
                ></img>
              </div>
              <div>
                <div>
                  <span>{user?.data?.email}</span>
                  <br />
                  <p className={"btn p-0 lightTitle"} onClick={() => toggle()}>
                    {t("Logout")}
                  </p>
                </div>
                <Modal isOpen={modal} toggle={toggle} centered>
                  <ModalHeader toggle={toggle}>{t("Logging Out")}</ModalHeader>
                  <ModalBody className="p-4">
                    {t("Do you want to logout?")}
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      className={"btn btn-solid mr-2"}
                      onClick={logOut}
                      color="secondary"
                    >
                      {t("Yes")}
                    </Button>
                    <Button
                      className={"btn btn-solid mr-2"}
                      color="secondary"
                      onClick={toggle}
                    >
                      {t("No")}
                    </Button>
                  </ModalFooter>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      ) : (

        <div className="row">
          <div className="col-12  mb-2">
            <TextField
              className="w-100 inputBtn"
              type={"email"}
              defaultValue={address?.address.email}
              {...register("email", {
                required: t("Email address is required*"),
              })}
              label={t("Email")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          <div className="col-12  mb-2 phoneVerifyInput" style={{ display: "flex", alignItems: "center" }}>
            
            <span className="phone-code">
              +2
            </span>
            <div className="phone-holder" style={{ flexGrow: "1" }}>
              <div>
                <TextField
                  maxLength="11"
                  minLength="11"
                  type="text"
				          keyboardType='numeric'
                  className={"inputBtn w-100"}
				          value={phoneNumberEntered}
                  defaultValue={address?.address.phone}
                  {...register("phone", {
                    required: t("Phone field is required*"),
                    minLength: {
                      value: 11,
                      message: t("The phone number must be 11 digits"),
                    },
                    maxLength: {
                      value: 11,
                      message: t("The phone number must be 11 digits"),
                    },
                  })}
                  label={t("phone") + " ex: (01234567890)"}
                  variant="filled"
                  required
                  onChange={(e) => setPhoneNumberEntered(e.target.value.replace(/[^0-9]/g, ''))}
                />
                {/* <span >
                  {
                    isPhoneVerified ?
                      (
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" fill="green" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" /></svg>

                      )
                      :
                      (
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" fill="#ff0000" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg>
                      )
                  }
                </span> */}
              </div>
              {/* <button
                type="button"
                className={`btn px-x pt-2 pb-2 ml-2  checkoutButton`}
                onClick={async () => {
                  if (phoneNumberEntered && phoneNumberEntered.length < 11) {
                    toast.info(t("You must enter the phone number!"))
                    return;
                  }
                  const egyptPhoneNumberRegex = /^0[0-9]{10}$/;
                  if (!egyptPhoneNumberRegex.test(phoneNumberEntered)) {
                    toast.info(t("Please enter a valid phone number from Egypt!"));
                    return;
                  }
                  sendOTP();
                }}
              >
                {t("Verify phone")}
              </button> */}
              
            </div>
            <ErrorMessage
              errors={errors}
              name="phone"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          
          </div>
          {!isPhoneVerified && 
          <div className="col-12 mb-2" id="verifyHint">
            <small className={"errorStyle"}>Please, verify your phone number first </small>
          </div>}

         
          
          <div className="recaptcha-wrapper">
            <div id="recaptcha" className="input_recaptcha"></div>
          </div>
        
          
        </div>

      )}
	  <div className="row">
		<Col>
			<TextField
				type="text"
				className="w-100 inputBtn"
				{...register("referral")}
				label={t("Referral")}
				defaultValue={address?.referral}
        variant="filled"
				/>
		</Col>
	  </div>
    </>
  );
};
export default ContactInfo;
