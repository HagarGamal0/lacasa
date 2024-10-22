import React, { useState } from 'react';
import { Row, Container, Col, Card, Button, Modal } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const Status = ({ data }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const newDateFormat = (date) => {
    const newDate = new Date(date);
    return `${newDate.getHours()}:${newDate.getMinutes()},  ${newDate.toDateString()}`;
  };

  function DiscountSummary(discounts) {
    const totalDiscount = Object.values(discounts).reduce((acc, { value }) => acc + value, 0);
    return totalDiscount;
  }

  const handlePrint = () => {
    const printContents = document.getElementById('invoice-container').innerHTML;
    const originalTitle = document?.title;
    const originalUrl = window.location.href;

    // Apply print-specific styles
    const style = `
    <style>
      @media print {
        @page {
          size: auto;   /* auto is the initial value */
          margin: 0;  /* this affects the margin in the printer settings */
      }
    }
    </style>
  `;
    document.body.innerHTML = style + printContents;
    document.title = '';
    window.print();
    document.body.innerHTML = printContents;
    document.title = originalTitle;
    window.location.href = originalUrl;
  };

  console.log(DiscountSummary);

  console.log(data);
  return (
    <>
      <Row>
        <Col xl="12" xxl="12">
          {/* Status Start */}
          <Row className="align-items-center">
            <Col sm="6">
              <h2 className="small-title">Status</h2>
            </Col>
            <Col sm="6" className="d-flex justify-content-end">
              <Button onClick={handleShow}>View Invoice</Button>
            </Col>
          </Row>
          <Row className="g-2 mb-5 mt-5">
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
                      <div className="text-primary">
                        {data?.payment_detail.total}
                        <span className="text-small text-primary">EGP</span>
                      </div>
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
                      {data?.transaction_detail.payment_id !== null ? (
                        <div className="text-primary">Transaction ID: {data?.transaction_detail.payment_id}</div>
                      ) : (
                        ''
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Status End */}
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose} animation={false} size="md">
        <Modal.Body id="invoice-container" style={{ padding: 0 }}>
          <Container>
            <img src="/img/invoice/invoiceBanner.png" className="w-100 mt-3" alt="invoice banner image" />
            <div className="mt-5">
              <span style={{ color: '#9f1c1c', fontWeight: '700', fontSize: '18px' }}>Ordered: </span>
              <span>{newDateFormat(data?.created_at)}</span>
            </div>
            <Row>
              <Col sm="6" className="mt-3">
                <div style={{ background: '#f4f4f4', padding: '20px 20px' }}>
                  <p>ORDER SUMMARY</p>
                  <div>
                    <span>Order No :</span>
                    <span>
                      <strong>#{data?.id} </strong>
                    </span>
                  </div>
                  <div>
                    <span>Order Total : </span>
                    <span>
                      <strong>{data?.payment_detail.total} EGP</strong>
                    </span>
                  </div>
                  <div>
                    <span>Payment Method :</span>
                    <span>
                      <strong>{data?.transaction_detail.type}</strong>
                    </span>
                  </div>
                </div>
              </Col>
              <Col sm="6" className="mt-3">
                <div style={{ background: '#f4f4f4', padding: '20px 10px' }}>
                  <p>SHIPPING ADDRESS</p>
                  <p>
                    <strong>{data?.shipping_details.consignee.name}</strong>
                  </p>
                  <p>
                    <strong>{data?.shipping_details.shipping_address.address}</strong>
                  </p>
                </div>
              </Col>
              <div className="mt-5  pb-3" style={{ borderBottom: '1px solid #000' }}>
                <h4 style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '10px 0' }}>Placed Items</h4>
                <Container>
                  {data?.items.map((item) => (
                    <>
                      <Row className="align-items-center pt-3 pb-3">
                        <Col xs="4">
                          <img src={item.image.url} alt="its an image" style={{ width: '100px' }} />
                        </Col>
                        <Col xs="4">
                          <span>Total Quantity : {item.quantity}</span>
                        </Col>
                        <Col xs="4">
                          <span>{item.price} EGP</span>
                        </Col>
                      </Row>
                    </>
                  ))}
                </Container>
              </div>
            </Row>
            <Row className="align-items-center mt-3">
              <Col xs="4" style={{ borderRight: '1px solid #000' }}>
                <img src="/img/invoice/logo.png" alt="lacasa logo" className="d-block mx-auto" />
              </Col>
              <Col xs="8" className="ps-5">
                <Row>
                  <Col xs="6">
                    <p>Subtotal</p>
                  </Col>
                  <Col xs="6">
                    <p>{data?.payment_detail?.subtotal} EGP</p>
                  </Col>
                </Row>
                <Row style={{ borderBottom: data?.payment_detail.discounts > 0 ? 'none' : '1px solid #000' }}>
                  <Col xs="6">
                    <p>Shipping Fees</p>
                  </Col>
                  <Col xs="6">
                    <p>{data?.payment_detail.shipping_fees} EGP</p>
                  </Col>
                </Row>
                {data?.payment_detail.discounts > 0 && (
                  <Row style={{ borderBottom: '1px solid #000' }}>
                    <Col xs="6">
                      <p>Total Discounts</p>
                    </Col>
                    <Col xs="6">
                      <p>{DiscountSummary(data.payment_detail.discounts)} EGP</p>
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col xs="6">
                    <p>Total</p>
                  </Col>
                  <Col xs="6">
                    <p>{data?.payment_detail.total} EGP</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <div style={{ backgroundColor: '#f4f4f4', padding: '10px', textAlign: 'center', width: '100%' }}>
          <a href="#">Return Policy</a>
          <span> | </span>
          <a href="#">Terms & Conditions</a>
          <span> | </span>
          <span>Support :</span>
          <a href="tel:01063117666">01063117666 </a>
          <a href="tel:01063113777"> 01063113777</a>
          <span> | </span>
          <a href="#">support@lacasa-egy.com</a>
          <button style={{ position: 'absolute', top: '8px', left: '32px' }} type="button" onClick={handlePrint}>
            Print
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Status;
