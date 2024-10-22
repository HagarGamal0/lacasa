import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import api from '../../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const Cart = ({ data }) => {

  const [error, setError] = useState();
  const [downPayment, setDownPayment] = useState(0)
  const onSubmit = async (e, prodID) => {
    api
      .updateShipping(
        `/vendor/orders/${data.id}/products/${prodID}/status`,
        { _method: "PATCH", status: e.target.value }
      )
      .then((response) => {
        if (response.errors) {
          setError(response.errors);
        } else {
          toast.success("Order status is updated!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dPayment = (e) => {
    setDownPayment(e.target.value)
  }
  const handleDownpayment = () => {

    api
      .updateShipping(
        `/orders/${data.id}`,
        { _method: "PATCH", down_payment: downPayment }
      )
      .then((response) => {
        toast.success('Product Down Payment Updated!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });

  }
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
          <h2 className="small-title">Cart</h2>
          <Card className="mb-5">
            <Card.Body>
              <div className="mb-5">
                {data?.products.map((item, index) => (
                  <Row className=" mb-5 mt-5" key={index}>
                    <Col xs="auto">
                      <NavLink to={`/products/detail/${item.slug}`}>
                        <img src={item.images[0].url} className="card-img rounded-md h-100 sw-15" alt="thumb" />
                      </NavLink>
                    </Col>
                    <Col>
                      <div className="ps-4 pt-0 pb-0 pe-0 h-100">
                        <Row className="g-0 h-100 justify-content-between">
                          <Col xs="7" className="d-flex flex-column mb-2" id={`description${index}`}>
                            <h4 className="text-capitalize">{item.name}</h4>
                            <Form.Select onChange={(e) => onSubmit(e, item.id)}>
                              <option hidden>{item.status}</option>
                              <option value="Processing">
                                Processing
                              </option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pending payment">
                                Pending payment
                              </option>
                              <option value="Delivered">Delivered</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Returned">Returned</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Refunded">Refunded</option>
                              <option value="Delivered failed">
                                Delivered failed
                              </option>
                            </Form.Select>

                            {item.attributes.options > 0 && item.attributes.options.map((attribute, attrIndex) => (
                              <Row key={attrIndex} className="mt-3">
                                <Col xl="4">
                                  <h6>
                                    <span className="font-weight-bold">Attribute: </span>
                                    {attribute.key}
                                  </h6>
                                </Col>
                                <Col xl="5">
                                  <h6>
                                    <span className="font-weight-bold">Value: </span>
                                    {attribute.value}
                                  </h6>
                                </Col>
                                <Col xl="3">
                                  <h6>
                                    <span className="font-weight-bold">Price: </span>
                                    {attribute.price}<span className="text-small text-primary">EGP</span>
                                  </h6>
                                </Col>
                              </Row>
                            ))}
                            <Row className="mt-1">
                              <Col xl="6">
                                <span className="font-weight-bold">Quantity: </span>
                                {item.attributes.quantity}
                              </Col>
                              <Col xl="6">
                                <span className="font-weight-bold">Subtotal: </span>
                                {item.attributes.subtotal}<span className="text-small text-primary">EGP</span>
                              </Col>
                            </Row>
                          </Col>
                          <Col xs="4" className="d-flex flex-column mb-2 shadow-sm p-3 mb-5 bg-white rounded" >
                            <h6><span className="font-weight-bold">Price: </span> {item.price} <span className="text-small text-muted">EGP X {item.quantity}</span></h6>
                            <h6><span className="font-weight-bold">Shipping Fees: </span> {item.shipping_fees} <span className="text-small text-muted">EGP</span></h6>
                            <h6><span className="font-weight-bold">Coupon Discount: </span> {item.coupon_discount} <span className="text-small text-muted">EGP</span></h6>
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
                <Row>
                  <Col xl="6">
                    <div className="d-flex justify-content-around align-items-center">
                      <h5>Down Payment</h5>
                      <Form.Control type="number" className="w-50" defaultValue={data?.down_payment === null ? 0 : data?.down_payment} onChange={dPayment} />
                    </div>
                  </Col>
                  <Col xl="6" className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary" onClick={handleDownpayment}>Save Down Payment</button>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Cart;
