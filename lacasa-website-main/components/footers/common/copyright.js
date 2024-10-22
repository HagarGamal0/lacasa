import React, { Fragment } from "react";
import { Container, Row, Col, Media } from "reactstrap";
import visa from "../../../public/assets/images/icon/visa.png";
import mastercard from "../../../public/assets/images/icon/mastercard.png";
import all from "../../../public/assets/images/all.png";
import { useTranslation } from "react-i18next";

const CopyRight = ({ layout, fluid }) => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className={`sub-footer ${layout}`}>
        <Container fluid={fluid}>
          <Row>
            <Col xl="6" md="6" sm="12" />
            <Col xl="6" md="6" sm="12">
              <div className="payment-card-bottom">
                <ul>
                  <li>
                    <a href={null}>
                      <p className="accept_footer">{t('We Accept')}</p>
                      <Media className="footer_image_bottom" src={all} alt="" />
                    </a>
                  </li>

                  {/* <li>
                                        <a href="#"><Media src={paypal} alt="" /></a>
                                    </li>
                                    <li>
                                        <a href="#"><Media src={americanexpress} alt="" /></a>
                                    </li>
                                    <li>
                                        <a href="#"><Media src={discover} alt="" /></a>
                                    </li> */}
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

export default CopyRight;
