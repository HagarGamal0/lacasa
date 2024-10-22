import React, {useEffect, useState} from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector } from "react-redux";
import {
  signin,
  detailsUser,
} from "../../../helpers/redux/actions/userActions";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const userSignin = useSelector((state) => state.userSignin);
  const { loading, userInfo, error } = userSignin;
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user) router.push("/");
  }, []);

  const onSubmit = async ({ email, password }) => {
    if (
        email.trim() !== "" &&
        password.trim() !== "" &&
        isRecaptchaVerified
    ) {
      const state = await dispatch(signin(email, password));
      await dispatch(detailsUser());
      if (state && state?.data.user.type === "Vendor") {
        if (router.query.active) {
          router.push({
            pathname: `/page/vendor/vendor-dashboard`,
            query: { active: 4 },
          });
        } else {
          router.push("/page/vendor/vendor-dashboard");
        }
      } else {
          if(state?.code === 200){
              router.replace("/page/account/dashboard");
          }else {
              router.replace("/page/account/login");
          }
      }
    }else {
      setRecaptchaError(t("Please complete the reCAPTCHA challenge."));
    }

  };

  const { t } = useTranslation();

  return (
    <CommonLayout parent="home" title="Login">
      <section className="login-page section-b-space">
        <Container>
          <Row>
            <Col lg="6">
              <h3>{t("Login")}</h3>
              <div className="theme-card">
                <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                  <div className="form-group mb-3 end-ar">
                    <Label for="email">{t("Email")}</Label>
                    <input
                        type="email"
                        {...register("email", {
                          required: t("Email field is required*"),
                        })}
                        className="form-control end-ar"
                        placeholder={t("Email")}
                    />
                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({message}) => (
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
                  <div className="form-group mb-3 end-ar">
                    <Label for="password">{t("Password")}</Label>
                    <input
                        type="password"
                        {...register("password", {
                          required: t("Password field is required*"),
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
                          {error?.errors?.password[0]}
                        </p>
                    )}

                    <ErrorMessage
                        errors={errors}
                        name="password"
                        render={({message}) => (
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
                    {error?.message && (
                        <p
                            style={{
                              fontSize: "12px",
                              marginTop: "5px",
                              color: "red",
                            }}
                        >
                          {error.message}
                        </p>
                    )}
                  </div>

                  <div className="form-group mb-3 end-ar">
                    <ReCAPTCHA
                        sitekey="6LfOt1EpAAAAAF0WASwRRqW1G6tbZsOdibsLEXjS"
                        onChange={handleRecaptchaChange}
                    />
                    {recaptchaError && (
                        <p style={{fontSize: "12px", marginTop: "5px", color: "red"}}>
                          {recaptchaError}
                        </p>
                    )}
                  </div>

          <button type="submit" className="btn btn-solid">
                    {t("Login")}
                  </button>
                </Form>
                <div className="mt-2">
                  <Link href="/page/account/forget-pwd">
                    {t("Forget Password?")}
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg="6" className="right-login">
              <h3 className="end-ar">{t("New Customer")}</h3>
              <div className="theme-card authentication-right">
                <h6 className="title-font end-ar">{t("Create an Account")}</h6>
                <p className="end-ar">
                  {t(
                    "Sign up for a free account at our store. Registration is quick"
                  )}{" "}
                  {t(
                    " and easy. It allows you to be able to order from our shop. To"
                  )}
                  {t("start shopping click register.")}
                </p>
                <Link
                  href={{
                    pathname: "/page/account/register",
                    query: { prevURL: "/page/account/login" },
                  }}
                >
                  <button className="btn btn-solid">
                    {t("Create an Account")}
                  </button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Login;
