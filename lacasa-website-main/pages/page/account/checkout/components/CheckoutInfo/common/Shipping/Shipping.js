import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import { Helmet } from "react-helmet";
import { Button , Tooltip} from "reactstrap";
import router from "next/router";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Shipping = ({ data, setData, setState }) => {
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
  const cartItem = useSelector((state) => state.cartList);

  const { cart } = cartItem;

  const onSubmit = (shippingData) => {
    if (shippingData?.address_id === "new") {
      delete shippingData.address_id;
    }
    var orderData;
    if (shippingData?.address_id) {
      delete data?.address;
      orderData = {
        address: { id: shippingData?.address_id },
		referral: shippingData.referral,
      };
    } else {
      delete data?.address_id;
      orderData = {
        address: {
          email: shippingData.email,
          first_name: shippingData.first_name,
          last_name: shippingData.last_name,
          phone: shippingData.phone,
          address: shippingData.address,
          street: shippingData.street,
          building_no: shippingData.building_no,
          floor_no: shippingData.floor_no,
          apartment_no: shippingData.apartment_no,
          notes: shippingData.notes,
          area_id: shippingData.area_id,
          city_id: shippingData.city_id,
          default: 1,
          type: "shipping",
        },
		referral: shippingData.referral,
      };
      localStorage.setItem("orderData", JSON.stringify(orderData));
    }
    setData({ ...data, ...orderData });
    setState("payment");
  };

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [userLogged, setUserLogged] = useState(true);
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  useEffect(async () => {
    if (localStorage.getItem("userInfo")) {
      setUserLogged(true);
      setIsPhoneVerified(true)
    }
  }, [user]);

  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>Shipping | Lacasa</title>
      </Head>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12">
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
              unregister={unregister}
              reset={reset}
              getValues={getValues}
              setValue={setValue}
              register={register}
              errors={errors}
            />
          </div>
        </div>
        <div
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
        </div>
      </form>
    </>
  );
};
export default Shipping;
