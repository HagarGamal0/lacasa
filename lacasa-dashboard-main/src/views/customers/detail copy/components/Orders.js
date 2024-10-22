import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const UserOrders = ({ orders }) => {
  return (
    <>
      <div className="d-flex justify-content-between">
        <h2 className="small-title">Recent Orders</h2>
      </div>
      <div className="mb-5">
        {orders?.map((item, index) => (
          <NavLink to={`/orders/detail/${item.id}`} key={item.id}>
            <Card className="mb-2" >
              <Card.Body className="sh-16 sh-md-8 py-0">
                <Row className="g-0 h-100 align-content-center">
                  <Col xs="6" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 h-md-100">
                    <div className="text-muted text-small d-md-none">Id</div>
                    <NavLink to="/orders/detail" className="text-truncate h-100 d-flex align-items-center">
                      {item.id}
                    </NavLink>
                  </Col>
                  <Col xs="6" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0">
                    <div className="text-muted text-small d-md-none">Price</div>
                    <div className="text-alternate">
                      <span>
                        <span className="text-small">EGP</span>
                        {item.payment_detail.total}
                      </span>
                    </div>
                  </Col>
                  <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0">
                    <div className="text-muted text-small d-md-none">Payment</div>
                    <div className="text-alternate">{item.transaction_detail.type}</div>
                  </Col>

                </Row>
              </Card.Body>
            </Card>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default UserOrders;
