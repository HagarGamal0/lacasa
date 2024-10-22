import React from "react";
import { Container, Row, Col, Media, Form, Label, Input } from "reactstrap";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../helpers/API/API";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
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

const ContactDetail = ({ img, title, desc1, desc2 }) => {
  return (
    <li>
      <div className="contact-icon">
        <i className={`fa ${img}`} aria-hidden="true"></i>
        <h6>{t(title)}</h6>
      </div>
      <div className="media-body">
        <p>{t(desc1)}</p>
        <p>{t(desc2)}</p>
      </div>
    </li>
  );
};
const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { data, errors },
  } = useForm();
  const onSubmit = (data) => {
    API.create("/campains", data);
  };
  const { t } = useTranslation();
  return (
    <CommonLayout parent="home" title={t("Thank You")}>
      <section className="contact-page section-b-space">
        <Container>
          <Row className="p-2">
            <Col sm="8" className="d-flex mx-auto p-5 justify-content-center">
              <h2 style={{ textAlign: "center" }}>
                {t(
                  "Thank you for contacting us. We will get back to you as soon as possible."
                )}
              </h2>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Contact;
