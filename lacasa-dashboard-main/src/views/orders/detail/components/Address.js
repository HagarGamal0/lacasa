import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const Address = ({ data }) => {
  return (
    <>
      <Row>
        <Col xl="12" xxl="12">
          <h2 className="small-title">Address</h2>
          <Card className="mb-5">
            <Card.Body className="mb-n5">
              <div className="mb-5">
                <p className="text-small text-muted mb-2">CUSTOMER</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="user" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{`${data?.shipping_details.consignee.name}`}</Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="email" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{data?.shipping_details.consignee.email}</Col>
                </Row>
				{data?.referral && <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="online-class" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{data?.referral}</Col>
                </Row>}
              </div>
              <div className="mb-5">
                <p className="text-small text-muted mb-2">SHIPPING ADDRESS</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="user" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{`${data?.shipping_details.shipping_address.first_name} ${data?.shipping_details.shipping_address.last_name}`}</Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="pin" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{`${data?.shipping_details.shipping_address.city}, ${data?.shipping_details.shipping_address.area}, ${data?.shipping_details.shipping_address.address}`}</Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="phone" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{data?.shipping_details.consignee.phone}</Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Address;
