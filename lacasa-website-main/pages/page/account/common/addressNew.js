import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "reactstrap";
import { useEffect, useState, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../../../../helpers/redux/actions/userActions";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../../helpers/API/API";
import addButton from "../../../../public/assets/images/svgImg/addButton.svg";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const Address = ({
  col,
  isLoggedIn,
  addresses,
  setAddresses,
  errorOrder,
  checkout,
  submitAddress,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(1);
  const [areas, setAreas] = useState([]);
  const [collapse, setCollapse] = useState(true);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  useImperativeHandle(submitAddress, () => ({
    submit() {
      document.getElementById("submitAddress").click();
    },
  }));

  useEffect(async () => {
    API.readAll(`/world/cities`).then((response) => {
      setCities(response.data);
    });
  }, []);

  useEffect(async () => {
    if (user?.data?.addressbook.shipping.length > 0 || addresses?.length > 0) {
      await setCollapse(false);
    }
  }, [user, addresses]);

  useEffect(() => {
    API.readAll(`/world/cities/${selectedCity}/areas`).then((response) => {
      setAreas(response.data);
    });
  }, [selectedCity]);

  const handleCity = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleDefault = async (e) => {
    API.create(`/addressbooks/${e.target.value}`, {
      _method: "PUT",
      type: "shipping",
      default: "1",
    }).then(async (response) => {
      await dispatch(detailsUser());
    });
  };

  const handleDelete = (id) => {
    API.delete("/addressbooks", id)
      .then((response) => dispatch(detailsUser()))
      .catch((err) => console.log(err));
  };

  const onSubmit = async (data) => {
    API.create(`/addressbooks`, {
      ...{ type: "shipping", default: 1 },
      ...data,
    }).then((response) => {
      if (!response.errors) {
        dispatch(detailsUser());
        reset();
        toggle();
      }
    });
  };
  const { t } = useTranslation();

  return (
    <Col lg={col ? col : "8"}>
      <div className="row row-flex">
        {user?.data?.addressbook.shipping.map((address, index) => (
          <div className="col-md-4" style={{ marginBottom: "30px" }}>
            <div className="dashboard-right-n">
              <div className="dashboard">
                <div style={{ minHeight: "200px" }}>
                  <div className="mb-3">
                    <h4>{address.first_name + " " + address.last_name}</h4>
                    <h6>{address.email}</h6>
                  </div>
                  <div>
                    <p className="p-0 m-0">{address.address}</p>
                  </div>
                  <div>
                    <p className="p-0 m-0">{address.city}</p>
                  </div>
                  <div>
                    <p>
                      {t("contact No.")} {address.phone}
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-end">
                  {/* <button type="button" className={"btn px-4"} style={{ border: "0px", background: 'black', color: "white" }} >edit</button> */}
                  <button
                    type="button"
                    className={"btn px-4 "}
                    onClick={() => {
                      handleDelete(address.id);
                    }}
                    style={{
                      border: "1px solid black",
                      background: "transperant",
                      color: "black",
                    }}
                  >
                    {t("Delete")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="col-md-4">
          <div className="dashboard-right-n">
            <div
              className="dashboard d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
              <div
                className="text-center"
                onClick={toggle}
                style={{ cursor: "pointer" }}
              >
                <img src={addButton} className={"mb-1"} />
                <h5>{t("Add Address")}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggle}>{t("Add address")}</ModalHeader>
          <ModalBody className="p-4">
            <div className="row">
              <div className="col-12 col-md-6 pr-md-1 mb-2">
                <TextField
                  className="w-100 inputBtn"
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
                  className="w-100 inputBtn"
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
              <div className="col-12 col-md-6 pr-md-1 mb-2">
                <TextField
                  defaultValue={""}
                  className="w-100 inputBtn"
                  type={"email"}
                  {...register("email", { required: t("Email is required*") })}
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
              <div className="col-12 col-md-6 pl-md-1 mb-2">
                <TextField
                  maxLength="11"
                  minLength="11"
                  id={"inputField"}
                  type="number"
                  className={"inputBtn w-100"}
                  defaultValue={""}
                  {...register("phone", {
                    required: t("Phone field is required*"),
                    minLength: {
                      value: 11,
                      message: t("The phone number must be 11 characters*"),
                    },
                    maxLength: {
                      value: 11,
                      message: t("The phone number must be 11 characters*"),
                    },
                  })}
                  label={t("Phone")}
                  variant="filled"
                  required
                />
                <ErrorMessage
                  errors={errors}
                  name="phone"
                  render={({ message }) => (
                    <p className={"errorStyle"}>{message}</p>
                  )}
                />
              </div>
              <div className="col-12 col-md-6  pr-md-1 mb-2">
                <FormControl variant="filled" className={"w-100"}>
                  <InputLabel id="countryPickerLabel">{t("City")}</InputLabel>
                  <Select
                    className={"w-100 addressSelectField"}
                    labelId="countryPickerLabel"
                    id="countryPicker"
                    label={t("City")}
                    {...register("city_id", {
                      required: t("City is required*"),
                    })}
                    required
                    onChange={handleCity}
                  >
                    {cities?.map((city, index) => (
                      <MenuItem value={city.id}>{city.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 col-md-6 pl-md-1 mb-2">
                <FormControl variant="filled" className={"w-100"}>
                  <InputLabel id="countryPickerLabel">{t("Area")}</InputLabel>
                  <Select
                    className={"w-100 addressSelectField"}
                    {...register("area_id", {
                      required: t("Area is required*"),
                    })}
                    labelId="countryPickerLabel"
                    id="countryPicker"
                    label="City"
                    required
                  >
                    {areas?.map((area, index) => (
                      <MenuItem value={area.id}>{area.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-12 col-md-12 mb-2">
                <TextField
                  className="w-100 inputBtn"
                  type={"text"}
                  {...register("address", {
                    required: t("Address is required*"),
                  })}
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
              <div className="col-12 col-md-6 pr-md-1 mb-2">
                <TextField
                  className="w-100 inputBtn"
                  type={"text"}
                  {...register("street", {
                    required: t("Street name is required*"),
                  })}
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
                  className="w-100 inputBtn"
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
                  className="w-100 inputBtn"
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
                  className="w-100 inputBtn"
                  type={"text"}
                  {...register("floor_no", {
                    required: t("Floor no. is required*"),
                  })}
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
          </ModalBody>
          <ModalFooter className="border-0">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={() => {
                  toggle();
                }}
                className={"btn p-0 "}
                style={{ textDecoration: "underline" }}
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className={"btn px-4 pt-3 pb-3 ml-2"}
                style={{ border: "0px", background: "black", color: "white" }}
              >
                {t("Save change")}
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </Col>
  );
};

export default Address;
