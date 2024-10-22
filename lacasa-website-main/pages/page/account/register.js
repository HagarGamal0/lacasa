import React,{ useParams, useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Input, Container, Row, Form, Label, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "../../../helpers/redux/actions/userActions";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
const Register = (props) => {
    const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
    const [recaptchaError, setRecaptchaError] = useState("");
    const handleRecaptchaChange = (value) => {
        setIsRecaptchaVerified(true);
        setRecaptchaError("");
    };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const userSignin = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userSignin;
  const {
    query: { prevURL },
  } = router;
  const onSubmit = async (data) => {
      if (
          data.name.trim() !== "" &&
          data.email.trim() !== "" &&
          data.phone.trim() !== "" &&
          data.password.trim() !== "" &&
          data.password_confirmation.trim() !== "" &&
          isRecaptchaVerified
      ) {
          const state = await dispatch(registerAction(data, "users"));
          if (state) {
              if ("/page/account/login" === prevURL) {
                  history.go(-2);
              } else {
                  router.back();
              }
          }
      }else {
          setRecaptchaError("Please complete the reCAPTCHA challenge.");
      }

  };

  const { t } = useTranslation();
  return (
    <CommonLayout parent={t("home")} title={t("Register")}>
      <section className="register-page section-b-space">
        <Container>
          <Row>
            <Col lg="12">
              <h3 className="end-ar">{t("create account")}</h3>
              <div className="theme-card">
                <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                  <Row>
                    <Col md="6 mb-3">
                      <div className="flex-ar">
                        <Label className="end-ar" for="name">
                          {t("Full Name")}
                        </Label>
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
                        placeholder={t("ex:01200000000")}
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
                        <Label for="password">{t("Password")}</Label>
                      </div>
                      <input
                        type="password"
                        {...register("password", {
                          required: "Password field is required*",
                          minLength: {
                            value: 8,
                            message: t(
                              "The password must be more than 8 characters*"
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
                  </Row>
                  <Row>
                    <Col md="6 mb-3">
                      <div className="end-ar">
                        <Label className="end-ar" for="password">
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
                    <Row>
                        <Col md="6 mb-3">
                            <ReCAPTCHA
                                sitekey="6LfOt1EpAAAAAF0WASwRRqW1G6tbZsOdibsLEXjS"
                                onChange={handleRecaptchaChange}
                            />
                            {recaptchaError && (
                                <p style={{ fontSize: "12px", marginTop: "5px", color: "red" }}>
                                    {recaptchaError}
                                </p>
                            )}
                        </Col>
                    </Row>
                  <Row>
                    <Col md="6 mb-3">
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
