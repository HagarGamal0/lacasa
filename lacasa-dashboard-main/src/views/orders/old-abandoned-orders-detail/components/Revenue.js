import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';

const Revenue = ({ data }) => {

  const [totalDiscounts, setTotalDiscounts] = useState();

  return (
    <>
      <Row>
        <Col xl="12" xxl="12">
          <h2 className="small-title">Revenue</h2>
          <Card className="mb-5">
            <Card.Body>
              <Row>
                <Col xl="12">
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1" />
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Down Payment
                            </h6>
                            <span className="text-primary">
                              {data?.down_payment === null ? 0 : data?.down_payment}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              ValU Down Payment
                            </h6>
                            <span className="text-primary">
                              {data?.valu_down_payment === null ? 0 : data?.valu_down_payment}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Lacasa Commission
                            </h6>
                            <span className="text-primary">
                              {data?.lacasa_commission}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>

                  </Row>
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative" />
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Vendor Revenue
                            </h6>
                            <span className="text-primary">
                              {data?.vendor_revenue}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>

                  </Row>
                </Col>

                <Col xl="12">
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1" />
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Subtotal
                            </h6>
                            <span className="text-primary">
                              {data?.subtotal}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Shipping Fees
                            </h6>
                            <span className="text-primary">
                              {data?.shipping_fees}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Discount
                            </h6>
                            <span className="text-primary">
                              {data?.discounts.total}
                              <span className="text-small text-primary">EGP</span>
                            </span>

                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="g-0">
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                        <div className="line-w-1 bg-separator h-100 position-absolute" />
                      </div>
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      <div className="w-100 d-flex h-100 justify-content-center position-relative" />
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="p-0 pt-1 heading text-start text-primary">
                              Total
                            </h6>
                            <span className="text-primary">
                              {data?.total}
                              <span className="text-small text-primary">EGP</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>


              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Revenue;
