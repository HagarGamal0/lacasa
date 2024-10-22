import React from 'react';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { Card, Col, Row } from 'react-bootstrap';

const Status = ({ data }) => {
  return (
    <>
      <Row>
        <Col xl="12" xxl="12">
          {/* Status Start */}
          <h2 className="small-title">Status</h2>
          <Row className="g-2 mb-5">
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="tag" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Order Id</div>
                      <div className="text-primary">{data?.id}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="dollar" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Total</div>
                      <div className="text-primary">{data?.payment_detail.total}<span className="text-small text-primary">EGP</span></div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="calendar" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Creation Date</div>
                      <div className="text-primary">{data?.created_at.split('T')[0]}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm="6">
              <Card className="sh-13 sh-lg-15 sh-xl-14">
                <Card.Body className="h-100 py-3 d-flex align-items-center">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto" className="pe-3">
                      <div className="border border-primary sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <CsLineIcons icon="wallet" className="text-primary" />
                      </div>
                    </Col>
                    <Col>
                      <div className="d-flex align-items-center lh-1-25">Payment Type</div>
                      <div className="text-primary">{data?.transaction_detail.type}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Status End */}
        </Col>
      </Row>
    </>
  );
};

export default Status;
