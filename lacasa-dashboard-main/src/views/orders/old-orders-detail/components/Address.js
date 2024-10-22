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
                  <Col className="text-alternate">{`${data?.user.name}`}</Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="email" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{data?.address.email}</Col>
                </Row>
              </div>
              <div className="mb-5">
                <p className="text-small text-muted mb-2">SHIPPING ADDRESS</p>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="user" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{`${data?.address.first_name} ${data?.address.last_name}`}</Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="pin" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{`${data?.address.address}`}</Col>
                </Row>
                <Row className="g-0 mb-2">
                  <Col xs="auto">
                    <div className="sw-3 me-1">
                      <CsLineIcons icon="phone" size="17" className="text-primary" />
                    </div>
                  </Col>
                  <Col className="text-alternate">{data?.address.phone}</Col>
                </Row>
                {/* <Row className="mt-3">
                  <Col xl="6">
                  <Form.Label>Building No.</Form.Label>
                  <Form.Control type="number" onChange={handleAddressChange}/>
                  </Col>
                  <Col xl="6">
                  <Form.Label>Street</Form.Label>
                  <Form.Control type="text"  onChange={handleAddressChange}/>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col xl="6">
                  <Form.Label>Apartment No.</Form.Label>
                  <Form.Control type="number" onChange={handleAddressChange} />
                  </Col>
                  <Col xl="6">
                  <Form.Label>Floor No.</Form.Label>
                  <Form.Control type="number"   onChange={handleAddressChange}/>
                  </Col>
                </Row>
                <Row className="mt-5">
                <button type="button" className="btn btn-primary" onClick={onSubmitAddress}>Save</button>
                </Row> */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Address;
