import React, { useState } from "react";
import CommonLayout from "../../../components/shop/common-layout";
import { Container, Row, Form, Input, Col } from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDispatch, useSelector } from "react-redux";
import { userForgetEmail } from "../../../helpers/redux/actions/userActions";
import { useRouter } from "next/router";
const ForgetPwd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [confirmed, setConfirmed] = useState(false);

  const onSubmit = async ({ email }) => {
    const state = await dispatch(userForgetEmail(email));
    if (state) {
      setConfirmed(true);
    }
  };

  return (
    <CommonLayout parent="home" title="Forget Password">
      <section className="pwd-page section-b-space">
        <Container>
          <Row>
            {confirmed ? (
              <Col lg="6" className="m-auto">
                <h2>Please Check Your Email</h2>
              </Col>
            ) : (
              <Col lg="6" className="m-auto">
                <h2>Forget Your Password</h2>
                <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                  <Row>
                    <Col md="12">
                      <input
                        {...register("email", {
                          required: "Email field is required*",
                        })}
                        type="text"
                        className="form-control"
                        id="email"
                        placeholder="Enter Your Email"
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
                      Submit
                    </button>
                  </Row>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default ForgetPwd;
