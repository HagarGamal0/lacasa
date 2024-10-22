import React from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Input, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector } from "react-redux";
import { userResetPassword } from "../../../helpers/redux/actions/userActions";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
const ForgetPwd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = router.query;

  const onSubmit = async ({ password, password_confirmation }) => {
    const state = await dispatch(
      userResetPassword(token, password, password_confirmation)
    );
    if (state) router.push("/");
  };
  const { t } = useTranslation();

  return (
    <CommonLayout parent="home" title="Forget Password">
      <section className="pwd-page section-b-space">
        <Container>
          <Row>
            <Col lg="6" className="m-auto">
              <h2>{t("New Password")}</h2>
              <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                <Row>
                  <Col md="12">
                    <input
                      {...register("password", {
                        required: t("New password field is required*"),
                      })}
                      type="password"
                      className="form-control"
                      placeholder={t("Enter Your New Password")}
                      required=""
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
                    <input
                      {...register("password_confirmation", {
                        required: t("Password confirmation field is required*"),
                      })}
                      type="password"
                      className="form-control"
                      placeholder="Password confirmation"
                      required=""
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
                  <button type="submit" className="btn btn-solid">
                    {t("Submit")}
                  </button>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default ForgetPwd;
