import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';

const Revenue = ({ data }) => {

  const [totalDiscounts, setTotalDiscounts] = useState();

  useEffect(() => {
    setTotalDiscounts(data?.payment_detail.discounts.coupons.value + data?.payment_detail.discounts.orange_discount.value + data?.payment_detail.discounts.payment_discount.value + data?.payment_detail.discounts.shipping_discount.value)
  }, [data])
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
                              {data?.payment_detail.down_payment}
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
                              {data?.payment_detail.valu_down_payment}
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
                              Remaining
                            </h6>
                            <span className="text-primary">
                              {data?.payment_detail.to_be_collected}
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
                              {data?.payment_detail.subtotal}
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
                              {data?.payment_detail.shipping_fees}
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
                              {totalDiscounts}
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
                              {data?.payment_detail.total}
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
