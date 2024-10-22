import React from "react";
import { Container, Row, Col, Media, Form, Label, Input } from "reactstrap";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../helpers/API/API";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);
const Data = [
  {
    img: "fa-phone",
    title: "Contact us",
    desc1: "+2 01063117666",
  },
  {
    img: "fa-map-marker",
    title: "ADDRESS",
    desc1:
      "Lacasa is an e-commerce platform operating online only that helps furnish houses for customers by choosing the right tools, colors and furniture to decorate and complete their dream homes.",
  },
  {
    img: "fa-envelope-o",
    title: "Email",
    desc1: "marketing@lacasa-egy.com",
    desc2: "info@lacasa-egy.com",
  },
];

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { data, errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = (data) => {
    API.create("/contactus", data).then((res) => {
      router.push("/page/account/thank-you-contact");
    });
  };
  const { t } = useTranslation();
  return (
    <CommonLayout parent="home" title="Contact">
      <section className="contact-page section-b-space">
        <Container>
          <Row className="mt-5">
            <Col sm="12">
              <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                <Row>
                  <Col md="6">
                    <div className="end-ar">
                      <Label>{t("First name")}</Label>
                    </div>
                    <input
                      {...register("first_name", {
                        required: t("First name field is required*"),
                      })}
                      type="text"
                      className="form-control end-ar"
                      placeholder={t("Enter Your First Name")}
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
                  <Col md="6">
                    <div className="end-ar">
                      <Label for="last_name">{t("Last name")}</Label>
                    </div>
                    <input
                      {...register("last_name", {
                        required: t("Last name field is required*"),
                      })}
                      type="text"
                      className="form-control end-ar"
                      placeholder={t("Enter Your Last Name")}
                      required=""
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
                  <Col md="6">
                    <div className="end-ar">
                      <Label for="review">{t("Phone number")}</Label>
                    </div>
                    <input
                      maxLength="11"
                      minLength="11"
                      onInput={(e) => {
                        e.target.value = e.target.value.toString().slice(0, 11);
                      }}
                      type="number"
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
                      className="form-control end-ar"
                      id="review"
                      placeholder={t("Enter your number")}
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
                  <Col md="6">
                    <div className="end-ar">
                      <Label for="email">{t("Email")}</Label>
                    </div>
                    <input
                      {...register("email", {
                        required: t("Email field is required*"),
                      })}
                      type="email"
                      className="form-control end-ar"
                      id="email"
                      placeholder={t("Email")}
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
                  <Col md="12">
                    <div className="end-ar">
                      <Label for="review">{t("Write Your Message")}</Label>
                    </div>
                    <textarea
                      {...register("message", {
                        required: t("Message field is required*"),
                      })}
                      className="form-control end-ar"
                      placeholder={t("Write Your Message")}
                      id="exampleFormControlTextarea1"
                      rows="6"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="message"
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
                      {t("Send")}
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

export default Contact;
