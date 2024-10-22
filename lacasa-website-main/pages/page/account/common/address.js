import { Container, Row, Col, Form, Label, Collapse } from "reactstrap";
import { useEffect, useState, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../../../../helpers/redux/actions/userActions";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../../helpers/API/API";
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
  } = useForm();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(1);
  const [areas, setAreas] = useState([]);
  const [collapse, setCollapse] = useState(true);

  const toggle = () => setCollapse(!collapse);

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

  const handleDefaulLocal = async (e) => {
    const arr = [];
    if (addresses) {
      for (let i = 0; i < addresses.length; i++) {
        if (i == e.target.value) {
          arr.push({ ...addresses[i], ...{ default: true } });
        } else {
          arr.push({ ...addresses[i], ...{ default: false } });
        }
      }
    }
    await localStorage.setItem("addresses", JSON.stringify(arr));
    setAddresses(JSON.parse(localStorage.getItem("addresses")));
    checkout.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onSubmit = async (data) => {
    if (isLoggedIn) {
      API.create(`/addressbooks`, { ...{ type: "shipping" }, ...data }).then(
        (response) => {
          dispatch(detailsUser());
        }
      );
    } else {
      const arr = [];
      if (addresses) {
        for (let i = 0; i < addresses.length; i++) {
          arr.push({ ...addresses[i], ...{ default: false } });
        }
      }
      arr.push({ ...{ type: "shipping" }, ...data });
      await localStorage.setItem("addresses", JSON.stringify(arr));
      await setAddresses(JSON.parse(localStorage.getItem("addresses")));
      checkout.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleDelete = (id) => {
    API.delete("/addressbooks", id)
      .then((response) => dispatch(detailsUser()))
      .catch((err) => console.log(err));
  };
  const { t } = useTranslation();
  return (
    <Col lg={col ? col : "9"}>
      <div className="dashboard-right-n">
        <div className="dashboard">
          <div>
            <div className="page-title">
              <h2>Address Book</h2>
            </div>
            {errorOrder ? (
              <p style={{ fontSize: "18px", marginTop: "5px", color: "red" }}>
                Please add your address
              </p>
            ) : (
              ""
            )}
            <section className="pt-4 pb-3">
              <div>
                <div className="box">
                  {loading ? (
                    <div className="loader-wrapper1">
                      <div className="loader1" />
                    </div>
                  ) : (
                    <>
                      {isLoggedIn ? (
                        <Row>
                          {user?.data?.addressbook.shipping.length > 0 && (
                            <div className="box-title mb-3">
                              <h3>{t("My Addresses")}</h3>
                            </div>
                          )}
                          {user?.data?.addressbook.shipping.map(
                            (address, index) => (
                              <Col key={index} sm="6" className={"mb-2"}>
                                <Row className={"address-container"}>
                                  <Col xs="10" className={"d-flex pl-0 pr-0"}>
                                    <div className={"vertical-center"}>
                                      <h6 style={{ color: "black" }}>
                                        {address.first_name} {address.last_name}
                                      </h6>
                                      <h6>
                                        Address: {address.address},
                                        {address.city},{address.area}
                                        <br />
                                      </h6>
                                      <h6>
                                        Phone Number: {address.phone}
                                        <br />
                                      </h6>
                                    </div>
                                  </Col>
                                  <Col
                                    xs="2"
                                    className={"d-flex justify-content-end"}
                                  >
                                    <div className={"vertical-center"}>
                                      <div className="trash-btn postition-relative">
                                        <a
                                          href="#"
                                          onClick={() =>
                                            handleDelete(address.id)
                                          }
                                        >
                                          <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                          ></i>
                                        </a>
                                      </div>
                                      {/* {address.default === true && <p>Defualt</p>} */}
                                      <input
                                        type="radio"
                                        name="default"
                                        checked={address.default === true}
                                        value={address.id}
                                        onClick={handleDefault}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            )
                          )}
                        </Row>
                      ) : (
                        <Row>
                          {addresses?.length > 0 && (
                            <div className="box-title mb-3">
                              <h3>{t("My Addresses")}</h3>
                            </div>
                          )}
                          {addresses?.map((address, index) => (
                            <Col key={index} sm="6" className={"mb-2"}>
                              <Row className={"address-container"}>
                                <Col xs="10" className={"d-flex"}>
                                  <div className={"vertical-center"}>
                                    <h6 style={{ color: "black" }}>
                                      {address.first_name} {address.last_name}
                                    </h6>
                                    <h6>
                                      Address: {address.address},{address.city},
                                      {address.area}
                                      <br />
                                    </h6>
                                    <h6>
                                      Phone Number: {address.phone}
                                      <br />
                                    </h6>
                                  </div>
                                </Col>
                                <Col
                                  xs="2"
                                  className={"d-flex justify-content-end"}
                                >
                                  <div className={"vertical-center"}>
                                    {/* {address.default === true && <p>Defualt</p>} */}
                                    <input
                                      type="radio"
                                      name="default"
                                      checked={address.default === true}
                                      value={index}
                                      onClick={handleDefaulLocal}
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          ))}
                        </Row>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
            <section className="contact-page register-page section-b-space">
              <Container>
                <Row>
                  <Col sm="12">
                    <h3 onClick={toggle}>
                      ADD ADDRESS{" "}
                      {collapse ? (
                        <i className={`fa fa-angle-up`}></i>
                      ) : (
                        <i className={`fa fa-angle-down`}></i>
                      )}{" "}
                    </h3>
                    <Collapse isOpen={collapse}>
                      <Form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-2 theme-form"
                      >
                        <Row>
                          <Col md="6 mb-3">
                            <Label for="first_name">First Name</Label>
                            <input
                              type="text"
                              {...register("first_name", {
                                required: "First name field is required*",
                              })}
                              className="form-control"
                              placeholder="First Name"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="first_name"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="last_name">Last Name</Label>
                            <input
                              type="text"
                              {...register("last_name", {
                                required: "Last name field is required*",
                              })}
                              className="form-control"
                              placeholder="Last Name"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="last_name"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="email">email</Label>
                            <input
                              type="email"
                              {...register("email", {
                                required: "Email field is required*",
                              })}
                              className="form-control"
                              placeholder="Email"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="email"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="Phone">Phone</Label>
                            <input
                              maxLength="11"
                              minLength="11"
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .toString()
                                  .slice(0, 11);
                              }}
                              type="number"
                              {...register("phone", {
                                required: "Phone field is required*",
                                minLength: {
                                  value: 11,
                                  message:
                                    "The phone number must be 11 characters*",
                                },
                                maxLength: {
                                  value: 11,
                                  message:
                                    "The phone number must be 11 characters*",
                                },
                              })}
                              className="form-control"
                              placeholder="Phone Number"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="phone"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>

                          <Col md="6 mb-3" className="select_input">
                            <Label for="review">City</Label>
                            <select
                              onChange={handleCity}
                              style={{ height: "55px" }}
                              className="form-control"
                              size="1"
                            >
                              <option hidden>Choose city</option>
                              {cities.map((city, index) => (
                                <option key={index} value={city.id}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                          </Col>
                          <Col md="6 mb-3" className="select_input">
                            <Label for="review">Area</Label>
                            <select
                              style={{ height: "55px" }}
                              {...register("area_id", {
                                required: "Area field is required*",
                              })}
                              className="form-control"
                              size="1"
                            >
                              {/* <option key={0} hidden>Choose city</option> */}
                              {areas.map((area, index) => (
                                <option key={index + 1} value={area.id}>
                                  {area.name}
                                </option>
                              ))}
                            </select>
                            <ErrorMessage
                              errors={errors}
                              name="area_id"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="address">Address</Label>
                            <input
                              type="text"
                              {...register("address", {
                                required: "Address field is required*",
                              })}
                              className="form-control"
                              placeholder="Address"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="address"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="street_name">Street Name</Label>
                            <input
                              type="text"
                              {...register("street", {
                                required: "street name field is required*",
                              })}
                              className="form-control"
                              placeholder="Street name"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="street"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="apartment_no">Apartment number</Label>
                            <input
                              type="text"
                              {...register("apartment_no", {
                                required: "Apartment number field is required*",
                              })}
                              className="form-control"
                              placeholder="Apartment number"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="apartment_no"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="building_no">Building Number</Label>
                            <input
                              type="text"
                              {...register("building_no", {
                                required: "Building number field is required*",
                              })}
                              className="form-control"
                              placeholder="Building number"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="building_no"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="floor_no">Floor no.</Label>
                            <input
                              type="text"
                              {...register("floor_no", {
                                required: "Floor no. field is required*",
                              })}
                              className="form-control"
                              placeholder="Floor no."
                            />
                            <ErrorMessage
                              errors={errors}
                              name="floor_no"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>

                          {col === "12" ? (
                            <Col hidden md="12 mb-5" className="select_input">
                              <input
                                hidden
                                type="checkbox"
                                id="default"
                                name="default"
                                checked={1}
                                {...register("default")}
                                className={"mr-2"}
                              />
                              <Label for="default"> Make as defualt</Label>
                            </Col>
                          ) : (
                            <Col md="12 mb-5" className="select_input">
                              <input
                                type="checkbox"
                                id="default"
                                name="default"
                                {...register("default")}
                                className={"mr-2"}
                              />
                              <Label for="default"> Make as defualt</Label>
                            </Col>
                          )}
                          <div className="col-md-12">
                            <button
                              className="btn btn-sm btn-solid"
                              type="submit"
                              id={"submitAddress"}
                            >
                              Add Address
                            </button>
                          </div>
                        </Row>
                      </Form>
                    </Collapse>
                  </Col>
                </Row>
              </Container>
            </section>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default Address;
