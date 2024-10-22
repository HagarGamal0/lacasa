import React, { useEffect, useState } from "react";
import {
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../../../../../../helpers/API/API";
import { useSelector } from "react-redux";
import { set } from "lodash";
import { useTranslation } from "react-i18next";

const AddressInfo = ({
  data,
  register,
  unregister,
  reset,
  setValue,
  errors,
  passSelectedCity
}) => {
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const [chooseAddress, setChooseAddress] = React.useState(
    user ? "old" : "new"
  );
  const [addressData, setAddressData] = useState(true);
  const [selectedCity, setSelectedCity] = useState(1);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const address = JSON.parse(localStorage.getItem("orderData"));

  useEffect(async () => {
    API.readAll(`/world/cities`).then((response) => {
      setCities(response.data);
    });
    if (address) {
      setSelectedCity(address?.address?.city_id);
    }
  }, []);

  useEffect(() => {
    API.readAll(`/world/cities/${selectedCity}/areas`).then((response) => {
      setAreas(response.data);
    });
  }, [selectedCity]);

  const handleCity = async (e) => {
    setSelectedCity(e.target.value);
    passSelectedCity(e.target.value);
  };

  useEffect(() => {
    setChooseAddress("old");
    if (user) {
      const address = user?.data?.addressbook?.shipping?.filter(
        (address) => address.default
      )?.[0];
      setValue("address_id", address?.id);
      if (address) {
        setAddressData(address);
        setChooseAddress("old");
      } else {
        setValue("email", user.data.email);
        setValue("phone", user.data.phone);
        setChooseAddress("new");
      }
    } else {
      setChooseAddress("new");
    }
  }, []);

  useEffect(() => {
    if (address && !user) {
      setValue("address", address?.address.address);
      setValue("street", address?.address.street);
      setValue("first_name", address?.address.first_name);
      setValue("last_name", address?.address.last_name);
      setValue("building_no", address?.address.building_no);
      setValue("floor_no", address?.address.floor_no);
      setValue("apartment_no", address?.address.apartment_no);
      setValue("notes", address?.address.notes);
      setValue("city_id", address?.address.city_id);
      passSelectedCity(address?.address.city_id);
    }
  }, [address]);

  const handleChangeChooseAddress = async (e) => {
    if (e.target.value === "new") {
      await unregister("address_id");
      await reset();
      setChooseAddress("new");
      await setValue("email", user.data.email);
      await setValue("phone", user.data.phone);
    } else {
      await reset();
      localStorage.removeItem("orderData");
      setValue("address_id", parseInt(e.target.value));
      setAddressData(
        user?.data?.addressbook?.shipping?.filter(
          (address) => address.id === parseInt(e.target.value)
        )?.[0]
      );
      setChooseAddress("old");
    }
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="d-flex justify-content-between">
        <h3  className={" mt-4 mainTitle end-ar"}>
          {t("Address Information")}
        </h3>
      </div>
      {user && user?.data?.addressbook.shipping.length > 0 && (
        <div className="row">
          <div className="col-12 col-md-12 mb-2">
            <FormControl variant="filled" className={"inputBtn"}>
              <InputLabel id="countryPickerLabel">
                {t("My Addresses")}
              </InputLabel>
              <Select
                className={"w-100 addressSelectField"}
                {...register("address_id")}
                labelId="countryPickerLabel"
                id="countryPicker"
                label={t("My Addresses")}
                required
                defaultValue={
                  user?.data?.addressbook?.shipping?.filter(
                    (address) => address.default
                  )?.[0].id
                }
                onChange={handleChangeChooseAddress}
              >
                {user?.data?.addressbook.shipping.map((address, index) => (
                  <MenuItem value={JSON.stringify(address.id)}>
                    {address.address}
                  </MenuItem>
                ))}
                <MenuItem value={"new"}>{t("ADD NEW ADDRESS")}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      )}
      {chooseAddress === "new" ? (
        <div className="row">
          <div className="col-12 col-md-6 pr-md-1 mb-2">
            <TextField
              className="end-ar w-100 inputBtn end-ar"
              type={"text"}
              {...register("first_name", {
                required: t("First name is required*"),
              })}
              label={t("First name")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="first_name"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          <div className="col-12 col-md-6 pl-md-1 mb-2">
            <TextField
              className="end-ar w-100 inputBtn end-ar"
              type={"text"}
              {...register("last_name", {
                required: t("Last name is required*"),
              })}
              label={t("Last name")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="last_name"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          <div className="col-12 col-md-6  pr-md-1 mb-2">
            <FormControl variant="filled" className={"inputBtn"}>
              <InputLabel id="countryPickerLabel">{t("City")}</InputLabel>
              <Select
                className={"w-100 addressSelectField"}
                labelId="countryPickerLabel"
                id="countryPicker"
                label={t("City")}
                {...register("city_id", {
                  required: t("City is required*"),
                })}
                defaultValue={address?.address.city_id}
                required
                onChange={handleCity}
              >
                {cities?.map((city, index) => (
                  <MenuItem value={city.id}>{city.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-6  pl-md-1 mb-2">
            <FormControl variant="filled" className={"inputBtn"}>
              <InputLabel id="countryPickerLabel">{t("Area")}</InputLabel>
              <Select
                className={"w-100 addressSelectField"}
                {...register("area_id", {
                  required: t("Area is required*"),
                })}
                labelId="countryPickerLabel"
                label={t("Area")}
                required
              >
                {areas?.map((area, index) => (
                  <MenuItem value={area.id}>{area.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-12  mb-2">
            <TextField
              className="end-ar w-100 inputBtn"
              type={"text"}
              {...register("address", { required: t("Address is required*") })}
              label={t("Address")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="address"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          {/* <div className="col-12 col-md-6 mb-2"></div> */}
          <div className="col-12 col-md-6 pr-md-1 mb-2">
            <TextField
              className="end-ar w-100 inputBtn"
              type={"text"}
              {...register("street", { required: "Street name is required*" })}
              label={t("Street Name")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="street"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          <div className="col-12 col-md-6 pl-md-1 mb-2">
            <TextField
              className="end-ar w-100 inputBtn"
              type={"text"}
              {...register("apartment_no", {
                required: t("Apartment no. is required*"),
              })}
              label={t("Apartment no.")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="apartment_no"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          <div className="col-12 col-md-6 pr-md-1 mb-2">
            <TextField
              className="end-ar w-100 inputBtn"
              type={"text"}
              {...register("building_no", {
                required: t("Building no. is required*"),
              })}
              label={t("Building no.")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="building_no"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
          <div className="col-12 col-md-6 pl-md-1 mb-2">
            <TextField
              className="end-ar w-100 inputBtn"
              type={"text"}
              {...register("floor_no", { required: "Floor no. is required*" })}
              label={t("Floor no.")}
              variant="filled"
              required
            />
            <ErrorMessage
              errors={errors}
              name="floor_no"
              render={({ message }) => (
                <p className={"errorStyle"}>{message}</p>
              )}
            />
          </div>
        </div>
      ) : (
        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              {addressData && (
                <div className={"col-md-12"}>
                  <div>
                    <div>
                      <span>
                        {addressData.first_name + " " + addressData.last_name}
                      </span>
                    </div>
                    <div>
                      <span>{addressData.email}</span>
                    </div>
                    <div>
                      <span>
                        {addressData.building_no +
                          " " +
                          addressData.address +
                          ", " +
                          addressData.floor_no +
                          ", " +
                          addressData.apartment_no}
                      </span>
                    </div>
                    <div>
                      <span>{addressData.area + ", " + addressData.city}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default AddressInfo;
