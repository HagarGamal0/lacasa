import React from "react";
import {
  svgFreeShipping,
  svgservice,
  svgoffer,
  svgpayment,
} from "../../../services/script";
import { Container, Row, Col } from "reactstrap";
import MasterServiceContent from "./MasterServiceConternt";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import fast from "../../../public/assets/images/fast.png";
import services from "../../../public/assets/images/services.png";
import payment from "../../../public/assets/images/payment.png";

const ServiceLayout = ({ sectionClass }) => {
  const { t } = useTranslation();
  const Data = [
    {
      link: svgFreeShipping,
      image: { src: "/assets/images/fast.png" },
      title: "fast shipping",
      service: t("fast shipping all over egypt"),
    },
    {
      link: svgservice,
      image: { src: "/assets/images/services.png" },
      title: "24 X 7 service",
      service: t("online service for new customer"),
    },
    {
      link: svgpayment,
      image: { src: "/assets/images/payment.png" },
      title: "online payment",
      service: t("new online special festival offer"),
      lastChild: true,
    },
  ];

  return (
    <Container>
      <section className={sectionClass}>
        <Row>
          <Col
            lg="4"
            md="4"
            xs="4"
            className="service-block footer_services mb-2"
          >
            <img src={fast} />
            <div class="mt-4 media-body">
              <h4>{t("fast shipping")}</h4>
            </div>
          </Col>
          <Col
            lg="4"
            md="4"
            xs="4"
            className="service-block footer_services mb-2"
          >
            <img src={services} />
            <div class="mt-4 media-body">
              <h4>{t("24 X 7 service")}</h4>
            </div>
          </Col>
          <Col
            lg="4"
            md="4"
            xs="4"
            className="service-block footer_services mb-2"
          >
            <img src={payment} />
            <div class="mt-4 media-body">
              <h4>{t("online payment")}</h4>
            </div>
          </Col>
        </Row>
        {/* <Row className="flex-ar">
          {Data.map((data, index) => {
            return (
              <Col
                lg="4"
                md="6"
                xs="12"
                style={{ marginTop: "0" }}
                className="service-block footer_services mb-2"
                key={index}
              >
                <img src={data.image.src} />
                <MasterServiceContent
                  // link={data?.link}
                  title={t(data.title)}
                  // service={window.innerWidth > 700 ? data.service : null}
                />
              </Col>
            );
          })}
        </Row> */}
      </section>
    </Container>
  );
};

export default ServiceLayout;
