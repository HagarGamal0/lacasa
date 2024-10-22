import React, { useState } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import api from '../../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const Shipment = ({ data }) => {

  const onSubmit = async (e, prodID) => {

    api
      .updateShipping(
        `/orders/${data.id}`,
        { _method: "PATCH", status: e.target.value, 'products': [prodID] }
      )
      .then((response) => {
        toast.success('Product Status Updated!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitShipment = async (e, shipID) => {

    api
      .updateShipping(
        `/orders/${data.id}/shipments/${shipID}`,
        { _method: "PATCH", status: e.target.value }
      )
      .then((response) => {
        toast.success('Shipment Status Updated!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Row>
        <Col xl="12" xxl="12">
          {/* Cart Start */}
          <h2 className="small-title">Shipment</h2>
          {data?.shipments.map((shipment, shipIndex) => (

            <Card className="mb-5" key={shipment.id}>
              <Card.Header>
                <Row>
                  <Col xl="4"><h4>Shipment Status</h4></Col>
                  <Col xl="8">
                    <Form.Select onChange={(e) => submitShipment(e, shipment.id)}>
                      <option hidden>Choose...</option>
                      <option value="Arrived">Arrived</option>
                      <option value="Failed To Deliver">Failed To Deliver</option>
                      {/* <option value="Refunded">Refunded</option>
                              <option value="Delivered failed">Delivered failed</option> */}
                    </Form.Select>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <div className="mb-5">
                  {shipment.items.map((item, index) => (
                    <Row className=" mb-5 mt-5" key={index}>
                      <Col xs="auto">
                        <img src={item.image.url} className="card-img rounded-md h-100 sw-15" alt="thumb" />
                      </Col>
                      <Col>
                        <div className="ps-4 pt-0 pb-0 pe-0 h-100">
                          <Row className="g-0 h-100 justify-content-between">
                            <Col xs="7" className="d-flex flex-column mb-2" id={`description${index}`}>
                              <h4 className="text-capitalize">{item.name}</h4>
                              <Form.Select onChange={(e) => onSubmit(e, item.id)}>
                                <option hidden>{item.status}</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Returned">Returned</option>
                                <option value="Refunded">Refunded</option>
                                {/* <option value="Refunded">Refunded</option>
                              <option value="Delivered failed">Delivered failed</option> */}
                              </Form.Select>
                              {item.attributes.map((attribute, attrIndex) => (
                                <Row key={attrIndex} className="mt-3">
                                  <Col xl="6">
                                    <h6>
                                      <span className="font-weight-bold">Attribute: </span>
                                      {attribute.attribute}
                                    </h6>
                                  </Col>
                                  <Col xl="6">
                                    <h6>
                                      <span className="font-weight-bold">Value: </span>
                                      {attribute.value}
                                    </h6>
                                  </Col>
                                </Row>
                              ))}
                              <Row className="mt-3">
                                <h6><span className="font-weight-bold">Coupon Discount: </span> {item.discounts.coupons.title === null ? "N/A" : item.discounts.coupons.title} - {item.discounts.coupons.value}<span className="text-small text-muted">EGP</span></h6>
                                <h6><span className="font-weight-bold">Orange Discount: </span> {item.discounts.orange_discount.title === null ? "N/A" : item.discounts.orange_discount.title} - {item.discounts.orange_discount.value}<span className="text-small text-muted">EGP</span></h6>
                                <h6><span className="font-weight-bold">Payment Discount: </span> {item.discounts.payment_discount.title === null ? "N/A" : item.discounts.payment_discount.description} - {item.discounts.payment_discount.value}<span className="text-small text-muted">EGP</span></h6>
                                <h6><span className="font-weight-bold">Shipping Discount: </span> {item.discounts.shipping_discount.title === null ? "N/A" : item.discounts.shipping_discount.description} - {item.discounts.shipping_discount.value}<span className="text-small text-muted">EGP</span></h6>
                              </Row>
                              {item.shipping_rules !== null ?
                                <Row className="mt-3">
                                  <h6><span className="font-weight-bold">Shipping Rules</span></h6>
                                  <h6><span className="font-weight-bold">{item.shipping_rules.city.name}</span> - {item.shipping_rules.estimated_delivery} | {item.shipping_rules.fee}<span className="text-small text-muted">EGP</span></h6>
                                </Row> : ""}
                            </Col>

                            <Col xs="4" className="d-flex flex-column mb-2 shadow-sm p-3 mb-5 bg-white rounded" >
                              <h6><span className="font-weight-bold">Price: </span> {item.price} <span className="text-small text-muted">EGP X {item.quantity}</span></h6>
                              <h6><span className="font-weight-bold">Shipping Fees: </span> {item.shipping_fees} <span className="text-small text-muted">EGP</span></h6>
                              <h6><span className="font-weight-bold">Discount: </span> {item.total_discounts} <span className="text-small text-muted">EGP</span></h6>
                              <h6><span className="font-weight-bold">Total: </span> {item.total} <span className="text-small text-muted">EGP</span></h6>
                              <h6 className="mt-5"><span className="font-weight-bold">LC Commission: </span> {item.commission}<span className="text-small text-muted">EGP</span></h6>
                              <h6><span className="font-weight-bold">Vendor Revenue: </span> {item.vendor_revenue}<span className="text-small text-muted">EGP</span></h6>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <hr className="mt-5" />
                    </Row>
                  ))}


                </div>
              </Card.Body>
            </Card>
          ))}
          {/* Cart End */}
        </Col>
      </Row>
    </>
  );
};

export default Shipment;
