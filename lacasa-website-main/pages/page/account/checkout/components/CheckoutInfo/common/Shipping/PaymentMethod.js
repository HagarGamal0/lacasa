import React, { useContext, useState, useEffect } from "react";
import {
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import API from "../../../../../../../../helpers/API/API";
import CartContext from "../../../../../../../../helpers/cart";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Modal, Box, TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import valu from "../../../../../../../../public/assets/images/ValU.png";
import sympl from "../../../../../../../../public/assets/images/sympl.png";
import cod from "../../../../../../../../public/assets/images/cod.png";
import nbe from "../../../../../../../../public/assets/images/nbe.jpg";
import cib from "../../../../../../../../public/assets/images/cib.png";
import bm from "../../../../../../../../public/assets/images/bm.png";
import bdc from "../../../../../../../../public/assets/images/bdc.jpg";
import misr from "../../../../../../../../public/assets/images/bm.png";
import souhoola from "../../../../../../../../public/assets/images/SouhoolaLogo.jpeg";
import forsa from "../../../../../../../../public/assets/images/ForsaLogo.png";
import aman from "../../../../../../../../public/assets/images/aman.png";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const PaymentMethod = ({ data, setData }) => {
  const cartItem = useSelector((state) => state.cartList);
  const { cart } = cartItem;

  const [paymentMethod, setPaymentMethod] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletModal, setWalletModal] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    API.readAll(`/carts/${cart?.id}/available_payment_methods`)
      .then((response) => {
        setData({ ...data, ...{ payment_method: response.data[0].id } });
        setPaymentMethod(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSelectWallet = (e) => {
    const result = e.target.value.split(/[.\-=/_]/);
    setWalletModal(true);
  };

  const handleChangePayment = (e) => {
    const result = e.target.value.split(/[.\-=/_]/);
    setData({ ...data, ...{ payment_method: parseInt(result[1]) } });
  };

  const handleWalletSubmit = () => {
    if (phoneNumber?.length === 11) {
      setData({
        ...data,
        payment_method: paymentMethod.filter(
          (item) => item.name === "wallet"
        )[0]?.id,
        wallet_number: phoneNumber,
      });
      setWalletModal(false);
    } else {
      if (phoneNumber.length !== 11) {
        setData({
          ...data,
          payment_method: paymentMethod[0].id,
        });
        toast.error("Invalid phone number", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
  const handleClose = () => {
    setWalletModal(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleWalletSubmit();
    }
  };
  const { t } = useTranslation();
  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h3 className={"mainTitle"}>{t("Payment Method")}</h3>
        </div>
      </div>
      <div>
        <FormControl className={"deliveryContainer"}>
          {paymentMethod.length > 0 && (
            <>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={`payment-${paymentMethod[0]?.id}-1`}
                name="radio-buttons-group"
              >
                {paymentMethod.map((item, index) => (
                  <>
                    {item.name === "cod" ||
                    item.name === "valu" ||
                    item.name === "sympl" ||
                    item.name === "aman" ||
                    item.name === "forsa" ||
                    item.name === "sohoula" ||
                    item.name === "wallet" ? (
                      <FormControlLabel
                        style={{
                          height: 50,
                          borderBottom: "1px solid #838383",
                        }}
                        className={"radio"}
                        value={`payment-${item.id}-1`}
                        control={
                          <Radio
                            onChange={
                              item.name === "wallet"
                                ? handleSelectWallet
                                : handleChangePayment
                            }
                            onClick={
                              item.name === "wallet"
                                ? handleSelectWallet
                                : handleChangePayment
                            }
                          />
                        }
                        label={
                          <Typography sx={{ width: "100%" }}>
                            <div className="d-flex w-100 align-items-center justify-content-between">
                              <div className="d-flex">
                                <p>
                                  {t(item.display_name)}{" "}
                                  {item.id ===
                                    paymentMethod.filter(
                                      (item) => item.name === "wallet"
                                    )[0]?.id && data?.wallet_number
                                    ? `(${data?.wallet_number})`
                                    : ""}
                                </p>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: item.title,
                                  }}
                                />
                              </div>
                              <div>
                                {(() => {
                                  switch (item.name) {
                                    case "cod":
                                      return (
                                        <img
                                          style={{
                                            marginRight: "10px",
                                            width: "50px",
                                            height: "20px",
                                          }}
                                          src={cod}
                                        />
                                      );
                                    case "valu":
                                      return (
                                        <img
                                          style={{
                                            marginRight: "10px",
                                            width: "50px",
                                            height: "20px",
                                          }}
                                          src={valu}
                                        />
                                      );
                                    case "sympl":
                                      return (
                                        <img
                                          style={{
                                            marginRight: "10px",
                                            width: "50px",
                                            height: "20px",
                                          }}
                                          src={sympl}
                                        />
                                      );
                                    case "aman":
                                      return (
                                        <img
                                          style={{
                                            marginRight: "10px",
                                            width: "50px",
                                            height: "25px",
                                            objectFit: "contain",
                                          }}
                                          src={aman}
                                        />
                                      );
                                    case "forsa":
                                      return (
                                        <img
                                          style={{
                                            marginRight: "10px",
                                            width: "50px",
                                            height: "30px",
                                            objectFit: "contain",
                                          }}
                                          src={forsa}
                                        />
                                      );
                                    case "sohoula":
                                      return (
                                        <img
                                          style={{
                                            marginRight: "10px",
                                            width: "50px",
                                            height: "30px",
                                            objectFit: "contain",
                                          }}
                                          src={souhoola}
                                        />
                                      );
                                    case "wallet":
                                      return "";
                                    default:
                                  }
                                })()}
                              </div>
                            </div>
                          </Typography>
                        }
                      />
                    ) : (
                      <Accordion
                        style={{ margin: "0" }}
                        expanded={expanded === `panel${index}`}
                        onChange={handleChange(`panel${index}`)}
                      >
                        <AccordionSummary
                          style={{ height: 50, minHeight: 50 }}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                        >
                          <div className="d-flex w-100 align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                              <p className="mr-3">{t(item.display_name)}</p>

                              <div
                                dangerouslySetInnerHTML={{ __html: item.title }}
                              />
                            </div>
                            <div>
                              {item.name === "paymob" && (
                                <>
                                  <img
                                    style={{
                                      marginLeft: "10px",
                                      width: "30px",
                                      height: "20px",
                                    }}
                                    src={nbe}
                                  />
                                  <img
                                    style={{
                                      marginLeft: "10px",
                                      width: "30px",
                                      height: "20px",
                                    }}
                                    src={cib}
                                  />
                                  <img
                                    style={{
                                      marginLeft: "10px",
                                      width: "30px",
                                      height: "20px",
                                    }}
                                    src={bm}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </AccordionSummary>
                        <AccordionDetails style={{ padding: 0 }}>
                          {item.name === "paymob" ? (
                            <div>
                              <div>
                                <FormControlLabel
                                  className={"radio"}
                                  value={`payment-${item.id}-1`}
                                  control={
                                    <Radio onChange={handleChangePayment} />
                                  }
                                  label={
                                    <>
                                      <p className="m-0">{`${t("NBE")} ${t(
                                        "Cards"
                                      )}`}</p>
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "30px",
                                          height: "20px",
                                        }}
                                        src={nbe}
                                      />
                                    </>
                                  }
                                />
                              </div>
                              <div>
                                <FormControlLabel
                                  className={"radio"}
                                  value={`payment-${item.id}-2`}
                                  control={
                                    <Radio onChange={handleChangePayment} />
                                  }
                                  label={
                                    <>
                                      <p className="m-0">{`${t("CIB")} ${t(
                                        "Cards"
                                      )}`}</p>
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "30px",
                                          height: "20px",
                                        }}
                                        src={cib}
                                      />
                                    </>
                                  }
                                />
                              </div>
                              <div>
                                <FormControlLabel
                                  className={"radio"}
                                  value={`payment-${item.id}-3`}
                                  control={
                                    <Radio onChange={handleChangePayment} />
                                  }
                                  label={
                                    <>
                                      <p className="m-0">{`${t("BDC")} ${t(
                                        "Cards"
                                      )}`}</p>
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "30px",
                                          height: "20px",
                                        }}
                                        src={bdc}
                                      />
                                    </>
                                  }
                                />
                              </div>
                              <div>
                                <FormControlLabel
                                  className={"radio"}
                                  value={`payment-${item.id}-4`}
                                  control={
                                    <Radio onChange={handleChangePayment} />
                                  }
                                  label={
                                    <>
                                      <p className="m-0">{`${t("Misr")} ${t(
                                        "Cards"
                                      )}`}</p>
                                      <img
                                        style={{
                                          marginLeft: "10px",
                                          width: "30px",
                                          height: "20px",
                                        }}
                                        src={misr}
                                      />
                                    </>
                                  }
                                />
                              </div>
                            </div>
                          ) : null}
                        </AccordionDetails>
                      </Accordion>
                    )}
                    {index !== paymentMethod.length - 1 ? (
                      <hr style={{ color: "black !important" }} />
                    ) : (
                      <></>
                    )}
                  </>
                ))}
              </RadioGroup>
            </>
          )}
        </FormControl>
      </div>
      <Modal
        open={walletModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p>Please Enter Your Wallet Phone Number</p>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-basic"
              label="Phone Number"
              defaultValue={data?.wallet_number}
              variant="outlined"
              size="small"
              onChange={(e) => setPhoneNumber(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="outlined" onClick={handleWalletSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};
export default PaymentMethod;
