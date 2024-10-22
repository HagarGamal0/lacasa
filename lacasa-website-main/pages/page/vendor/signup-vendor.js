import React, { useEffect, useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Input, Container, Row, Form, Label, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "../../../helpers/redux/actions/userActions";
import { useRouter } from "next/router";
import axios from "axios";
import { useTranslation } from "react-i18next";
import API from "../../../helpers/API/API";

const Register = (props) => {
  const {
    register,
    handleSubmit,
    formState: { data, errors },
  } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const userSignin = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userSignin;
  const {
    query: { prevURL },
  } = router;
  const [cities, setCities] = useState();

  useEffect(() => {
    API.readAll(`/world/cities`)
      .then((response) => {
        console.log("response", response);
        setCities(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  var formData = new FormData();
  const onSubmit = async (data) => {
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("vendor[email]", data.email);
    formData.append("vendor[company_name]", data.company_name);
    formData.append("vendor[street_address]", data.street_address);
    formData.append("vendor[city_id]", data.city_id);
    formData.append("vendor[logo]", data.logo[0]);
    await dispatch(
      registerAction(formData, "vendors", data.email, data.password)
    );
    if (!error) {
      router.push("/page/vendor/vendor-dashboard");
    }
  };

  const { t } = useTranslation();
  return (
    <CommonLayout parent="home" title="Register as vendor">
      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="12">
              <h3 className="end-ar">{t("create vendor account")}</h3>
              <div className="theme-card">
                <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                  <Row>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label for="name">{t("Full Name")}</Label>
                      </div>
                      <input
                        type="text"
                        {...register("name", {
                          required: t("Name field is required*"),
                        })}
                        className="form-control end-ar"
                        placeholder={t("Full Name")}
                      />
                      {error?.errors?.name && (
                        <p
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color: "red",
                          }}
                        >
                          {error.errors.name[0]}
                        </p>
                      )}
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
                    </Col>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label for="email">{t("Email")}</Label>
                      </div>
                      <input
                        type="email"
                        {...register("email", {
                          required: t("Email field is required*"),
                        })}
                        className="form-control end-ar"
                        placeholder={t("Email")}
                      />
                      {error?.errors?.email && (
                        <p
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color: "red",
                          }}
                        >
                          {error.errors.email[0]}
                        </p>
                      )}
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
                  </Row>
                  <Row>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label for="phone">{t("Phone Number")}</Label>
                      </div>
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
                          required: t("Phone field is required*"),
                          minLength: {
                            value: 11,
                            message: t(
                              "The phone number must be 11 characters*"
                            ),
                          },
                          maxLength: {
                            value: 11,
                            message: t(
                              "The phone number must be 11 characters*"
                            ),
                          },
                        })}
                        className="form-control form-number end-ar"
                        placeholder="ex:01200000000"
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
                    </Col>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label for="email">{t("Company Name")}</Label>
                      </div>
                      <input
                        type="text"
                        {...register("company_name", {
                          required: t("Company name field is required*"),
                        })}
                        className="form-control end-ar"
                        placeholder={t("Company Name")}
                      />
                      {error?.errors?.company_name && (
                        <p
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color: "red",
                          }}
                        >
                          {error.errors.company_name[0]}
                        </p>
                      )}
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
                    </Col>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label>{t("Street Address")}</Label>
                      </div>
                      <input
                        type="text"
                        {...register("street_address", {
                          required: t("Street address field is required*"),
                        })}
                        className="form-control end-ar"
                        placeholder={t("Password Confirmation")}
                      />
                      {error?.errors?.street_address && (
                        <p
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color: "red",
                          }}
                        >
                          {error.errors.street_address[0]}
                        </p>
                      )}

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
                    </Col>
                    <Col md="6 mb-3" className="select_input">
                      <div className="end-ar">
                        <Label>{t("City")}</Label>
                      </div>
                      <select
                        style={{ height: "55px" }}
                        type="text"
                        className="form-control end-ar"
                        {...register("city_id", {
                          required: t("City field is required*"),
                        })}
                      >
                        <option disabled>{t("Choose your city")}</option>
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
                    </Col>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label for="password">{t("Password")}</Label>
                      </div>
                      <input
                        type="password"
                        {...register(t("password"), {
                          required: t(t("Password field is required*")),
                          minLength: {
                            value: 8,
                            message: t(
                              t("The password must be more than 8 characters*")
                            ),
                          },
                        })}
                        className="form-control end-ar"
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
                    </Col>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label for="password">
                          {t("Password Confirmation")}
                        </Label>
                      </div>
                      <input
                        type="password"
                        {...register("password_confirmation", {
                          required: t(
                            "Password confirmation field is required*"
                          ),
                        })}
                        className="form-control end-ar"
                        placeholder={t("Password Confirmation")}
                      />
                      {error?.errors?.password_confirmation && (
                        <p
                          style={{
                            fontSize: "12px",
                            marginTop: "5px",
                            color: "red",
                          }}
                        >
                          {error.errors.password_confirmation[0]}
                        </p>
                      )}

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
                    </Col>
                  </Row>
                  <Row className="flex-ar">
                    <Col md="12 mb-3 flex-ar">
                      <Label>{t("Logo")}</Label>
                      <input
                        type="file"
                        style={{ border: "none" }}
                        {...register("logo", {
                          required: t("Logo field is required*"),
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="logo"
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
                  </Row>
                  <Row>
                    <Col md="12 mb-3 flex-ar">
                      <button type="submit" className="btn btn-solid">
                        {t("create account")}
                      </button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Register;
