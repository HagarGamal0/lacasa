import React from "react";
import { Container, Row, Col } from "reactstrap";

import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
const CommonLayout = dynamic(() => import("../components/shop/common-layout"));

const Page404 = () => {
  const { t } = useTranslation();
  return (
    <CommonLayout parent="home" title="Not Found">
      <section className="p-0">
        <Container>
          <Row>
            <Col sm="12">
              <div className="error-section">
                <h1>404</h1>
                <h2>{t("page not found")}</h2>
                <a href="/" className="btn btn-solid">
                  {t("back to home")}
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </CommonLayout>
  );
};
export default Page404;
