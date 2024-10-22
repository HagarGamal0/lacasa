import React from "react";
import { Container, Row, Col, Media, Form, Label, Input } from "reactstrap";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../helpers/API/API";
import { useRouter } from "next/router";
const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);

const Campaign = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { data, errors },
  } = useForm();
  const onSubmit = (data) => {
    API.create("/campaigns", data).then((res) => {
      router.push("/page/account/thank-you-contact");
    });
  };

  return (
    <CommonLayout parent="home" title="Campaign">
      <section className="contact-page section-b-space">
        <Container>
          <Row className="p-2">
            <Col
              sm="4"
              className="d-flex mx-auto p-5"
              style={{ boxShadow: "0 0 12px 0 #9090909c" }}
            >
              <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                <Row>
                  <Col md="12 mb-3">
                    <Label>First Name</Label>
                    <input
                      {...register("name", {
                        required: "Name field is required*",
                      })}
                      type="text"
                      className="form-control"
                      placeholder="Enter Your Name"
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
                  </Col>
                  <Col md="12 mb-3">
                    <Label for="email">Email</Label>
                    <input
                      {...register("email", {
                        required: "Email field is required*",
                      })}
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
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
                  <Col md="12 mb-3">
                    <Label for="review">Phone number</Label>
                    <input
                      maxLength="11"
                      minLength="11"
                      onInput={(e) => {
                        e.target.value = e.target.value.toString().slice(0, 11);
                      }}
                      type="number"
                      {...register("phone", {
                        required: "Phone field is required*",
                        minLength: {
                          value: 11,
                          message: "The phone number must be 11 characters*",
                        },
                        maxLength: {
                          value: 11,
                          message: "The phone number must be 11 characters*",
                        },
                      })}
                      className="form-control"
                      id="review"
                      placeholder="Enter your number"
                      required=""
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
                  <Col md="12">
                    <button type="submit" className="btn btn-solid">
                      Send
                    </button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Campaign;
