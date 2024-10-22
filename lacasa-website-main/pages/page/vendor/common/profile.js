import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import {
  detailsUser,
  signout,
  updateUserProfile,
} from "../../../../helpers/redux/actions/userActions";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import imageCompression from "browser-image-compression";
import API from "../../../../helpers/API/API";
import { useTranslation } from "react-i18next";
const Profile = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { data, errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const userUpdate = useSelector((state) => state.userUpdateProfile);
  const { errorUpdate } = userUpdate;
  const [cities, setCities] = useState([]);
  const [isedit, setIsedit] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  useEffect(() => {
    API.readAll(`/world/cities`)
      .then(async (response) => {
        await setCities(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const ChangeEdit = () => {
    setIsedit(!isedit);
    if (isPassword) setIsPassword(!isPassword);
  };

  const ChangePassword = () => {
    setIsPassword(!isPassword);
    setIsedit(!isedit);
  };

  const handlePDF = (e) => {
    setValue(`${e.target.name}`, e.target.files[0]);
  };

  const handleImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setValue("vendor[logo]", compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  var formData = new FormData();
  const onSubmit = async (data) => {
    formData.append(`name`, data.name);
    formData.append(`phone`, data.phone);
    formData.append(`vendor[company_name]`, data.company_name);
    formData.append(`vendor[street_address]`, data.street_address);
    formData.append(`vendor[city_id]`, data.city_id);
    formData.append(`vendor[commerical_registeration][]`, [
      data.commerical_registeration,
    ]);
    formData.append(`vendor[bank_name]`, data.bank_name);
    formData.append(
      `vendor[bank_account_owner_name]`,
      data.bank_account_owner_name
    );
    formData.append(`vendor[account_number]`, data.account_number);
    formData.append(`vendor[iban]`, data.iban);
    formData.append(`vendor[swift_code]`, data.swift_code);
    formData.append("_method", "PUT");
    const status = await dispatch(updateUserProfile(formData));
    await dispatch(detailsUser());
    if (status) {
      setIsedit(false);
    }
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card className="mt-0">
            <CardBody>
              <div className="dashboard-box">
                <div className="dashboard-title">
                  <h4>{t("Profile")}</h4>
                  {isedit ? (
                    <span onClick={ChangeEdit}>{t("cancel")}</span>
                  ) : (
                    <span onClick={ChangeEdit}>{t("Edit")}</span>
                  )}
                </div>
                <div className="dashboard-detail">
                  {isedit ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {isPassword ? (
                        <ul>
                          <li className="mt-5">
                            <h5>{t("Personal Information")}</h5>
                          </li>
                          <hr />
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Password")}</h6>
                              </div>
                              <div className="right">
                                <input
                                  type="password"
                                  {...register("password", {
                                    required: "Password field is required*",
                                    minLength: {
                                      value: 8,
                                      message:
                                        "The password must be more than 8 characters*",
                                    },
                                  })}
                                  className="form-control"
                                  placeholder={t("Password")}
                                />
                                {error?.errors?.password && (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "5px",
                                      color: "red",
                                    }}
                                  >
                                    {error.errors.password[0]}
                                  </p>
                                )}
                                {errorUpdate?.errors?.password && (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "5px",
                                      color: "red",
                                    }}
                                  >
                                    {errorUpdate.errors.password[0]}
                                  </p>
                                )}
                                <ErrorMessage
                                  errors={errors}
                                  name="password"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Password confirmation")}</h6>
                              </div>
                              <div className="right">
                                <input
                                  type="password"
                                  {...register("password_confirmation", {
                                    required:
                                      "Password confirmation field is required*",
                                    validate: (value) => {
                                      return (
                                        value === watch("password") ||
                                        "The passwords do not match"
                                      );
                                    },
                                  })}
                                  className="form-control"
                                  placeholder={t("Password confirmation")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="password_confirmation"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <button type="submit" className="btn btn-solid">
                              {t("Save")}
                            </button>
                          </li>
                        </ul>
                      ) : (
                        <ul>
                          <li className={"mt-5"}>
                            <h5>{t("Personal Information")}</h5>
                          </li>
                          <hr />
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Owner Name")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={user?.data.name}
                                  {...register("name", {
                                    required: "Name field is required*",
                                  })}
                                  placeholder={t("Full Name")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="name"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Phone number")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={user?.data.phone}
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
                                  placeholder={t("Phone number")}
                                />
                                {error?.errors?.phone && (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "5px",
                                      color: "red",
                                    }}
                                  >
                                    {error.errors.phone[0]}
                                  </p>
                                )}
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
                              </div>
                            </div>
                          </li>
                          <li className="mt-5">
                            <h5>{t("Company Information")}</h5>
                          </li>
                          <hr />
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Marketplace Name")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={user?.data.vendor.name}
                                  {...register("company_name", {
                                    required: "Company name field is required*",
                                  })}
                                  placeholder={t("Marketplace Name")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="company_name"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Street Address")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={user?.data.vendor.address}
                                  {...register("street_address", {
                                    required:
                                      "Street address field is required*",
                                  })}
                                  placeholder={t("Street Address")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="street_address"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("City")}</h6>
                              </div>
                              <div>
                                <select
                                  className="form-control"
                                  type="text"
                                  {...register("city_id", {
                                    required: "City field is required*",
                                  })}
                                >
                                  <option disabled>
                                    {t("Choose your city")}
                                  </option>
                                  {cities?.map((item, index) => (
                                    <option key={index} value={item.id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                <ErrorMessage
                                  errors={errors}
                                  name="city_id"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Logo")}</h6>
                              </div>
                              <div>
                                <input type="file" onChange={handleImage} />
                              </div>
                            </div>
                          </li>
                          <li className="d-flex mt-5">
                            <div className="details">
                              <div>
                                <h6>{t("Commerical Registeration")}</h6>
                                <input
                                  type={"file"}
                                  name={"commerical_registeration"}
                                  onChange={handlePDF}
                                />
                              </div>
                            </div>
                            <div className="details">
                              <div>
                                <h6>{t("Tax ID")}</h6>
                                <input
                                  type="file"
                                  name={"tax_id"}
                                  onChange={handlePDF}
                                />
                              </div>
                            </div>

                            <div className="details">
                              <div>
                                <h6>{t("Vat")}</h6>
                                <input
                                  type="file"
                                  name={"vat"}
                                  onChange={handlePDF}
                                />
                              </div>
                            </div>
                          </li>
                          <li className={"mt-5"}>
                            <h5>{t("Bank details")}</h5>
                          </li>
                          <hr />
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Bank Name")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={
                                    user?.data.vendor.bank_details?.bank_name
                                  }
                                  {...register("bank_name", {
                                    required: "Bank name field is required*",
                                  })}
                                  placeholder={t("Bank Name")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="bank_name"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Bank Account Owner Name")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={
                                    user?.data.vendor.bank_details
                                      ?.bank_account_owner_name
                                  }
                                  {...register("bank_account_owner_name", {
                                    required:
                                      "Bank account owner name field is required*",
                                  })}
                                  placeholder={t("Bank Account Owner Name")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="bank_account_owner_name"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left mt-auto mb-auto">
                                <h6>{t("Account number")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={
                                    user?.data.vendor.bank_details
                                      ?.account_number
                                  }
                                  {...register("account_number", {
                                    required: "Account name field is required*",
                                  })}
                                  placeholder={t("Account number")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="account_number"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Iban")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={
                                    user?.data.vendor.bank_details.iban
                                  }
                                  {...register("iban", {
                                    required: "Iban field is required*",
                                  })}
                                  placeholder={t("Iban")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="iban"
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
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <div className="left">
                                <h6>{t("Swift code")}</h6>
                              </div>
                              <div>
                                <input
                                  className="form-control"
                                  defaultValue={
                                    user?.data.vendor.bank_details?.swift_code
                                  }
                                  {...register("swift_code", {
                                    required: "Bank name field is required*",
                                  })}
                                  placeholder={t("Swift code")}
                                />
                                <ErrorMessage
                                  errors={errors}
                                  name="swift_code"
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
                              </div>
                            </div>
                          </li>

                          <li>
                            <button type="submit" className="btn btn-solid">
                              {t("Save")}
                            </button>
                          </li>
                          <hr />
                        </ul>
                      )}
                    </form>
                  ) : (
                    <ul>
                      <li>
                        <div className="row mt-5">
                          <div className="col-md-6 d-flex justify-content-start">
                            <h5>{t("Personal Information")}</h5>
                          </div>
                          <div className="col-md-6 d-flex justify-content-end">
                            <div className="dashboard-box">
                              <div
                                className="dashboard-title"
                                style={{ marginBottom: "0px" }}
                              >
                                <span onClick={ChangePassword}>
                                  {t("Change Password")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <hr />
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Owner Name")}</h6>
                          </div>
                          <div className="right">
                            <h6>{user?.data.name}</h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Email")}</h6>
                          </div>
                          <div className="right">
                            <h6>{user?.data.email}</h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Phone number")}</h6>
                          </div>
                          <div className="right">
                            <h6>{user?.data.phone}</h6>
                          </div>
                        </div>
                      </li>
                      <li className="mt-5">
                        <h5>{t("Company Information")}</h5>
                      </li>
                      <hr />
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Marketplace Name")}</h6>
                          </div>
                          <div className="right">
                            <h6>{user?.data.vendor.name}</h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Street Address")}</h6>
                          </div>
                          <div className="right">
                            <h6>{user?.data.vendor.address}</h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("City")}</h6>
                          </div>
                          <div className="right">
                            <h6>{user?.data.vendor.city}</h6>
                          </div>
                        </div>
                      </li>
                      <li className={"mt-5"}>
                        <h5>{t("Bank details")}</h5>
                      </li>
                      <hr />
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Bank name")}</h6>
                          </div>
                          <div className="right">
                            <h6>
                              {user?.data.vendor.bank_details?.bank_name
                                ? user?.data.vendor.bank_details.bank_name
                                : "N/A"}
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Bank Account Owner Name")}</h6>
                          </div>
                          <div className="right">
                            <h6>
                              {user?.data.vendor.bank_details
                                ?.bank_account_owner_name
                                ? user?.data.vendor.bank_details
                                    .bank_account_owner_name
                                : "N/A"}
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Account number")}</h6>
                          </div>
                          <div className="right">
                            <h6>
                              {user?.data.vendor.bank_details?.account_number
                                ? user?.data.vendor.bank_details.account_number
                                : "N/A"}
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Iban")}</h6>
                          </div>
                          <div className="right">
                            <h6>
                              {user?.data.vendor.bank_details?.iban
                                ? user?.data.vendor.bank_details.iban
                                : "N/A"}
                            </h6>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="details">
                          <div className="left">
                            <h6>{t("Swift code")}</h6>
                          </div>
                          <div className="right">
                            <h6>
                              {user?.data.vendor.bank_details?.swift_code
                                ? user?.data.vendor.bank_details.swift_code
                                : "N/A"}
                            </h6>
                          </div>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;
