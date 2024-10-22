import Image from "next/image";
import React from "react";
import { Container, Row, Col, Media } from "reactstrap";
import { useTranslation } from "react-i18next";
const ComingSoon = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="template-password">
        <div className="container">
          <div id="container" className="text-center">
            <section className="section-b-space mb-5 light-layout">
              <Container>
                <Row>
                  <Col md="12">
                    <div className="success-text">
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                      <h2>{t("thank you")}</h2>
                      <p>{t("Email has been verified")}</p>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
