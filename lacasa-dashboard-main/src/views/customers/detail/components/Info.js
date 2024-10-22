import React from 'react';
import { Row, Col, Button, Dropdown, Card, Badge, Form } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

const UserInfo = ({ data }) => {
  return (
    <>
      <h2 className="small-title">Info</h2>
      <Card className="mb-5">
        <Card.Body className="mb-n5">
          <div className="d-flex align-items-center flex-column mb-5">
            <div className="mb-5 d-flex align-items-center flex-column">
              <div className="sw-6 sh-6 mb-3 d-inline-block bg-primary d-flex justify-content-center align-items-center rounded-xl">
                <div className="text-white">{data?.name.split(' ').map(word => word[0]).join('')}</div>
              </div>
              <div className="h5 mb-1">{data?.name}</div>
              <div className="text-muted">
                <CsLineIcons icon="pin" className="me-1" />
                <span className="align-middle">{data?.addressbook.shipping[0] === undefined ? "No Address Available" : data?.addressbook.shipping[0].city}, {data?.addressbook.shipping[0] === undefined ? "" : data?.addressbook.shipping[0].area}</span>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <Row className="g-0 align-items-center mb-2">
              <Col xs="auto">
                <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                  <CsLineIcons icon="flag" className="text-primary" />
                </div>
              </Col>
              <Col className="ps-3">
                <Row className="g-0">
                  <Col>
                    <div className="sh-5 d-flex align-items-center lh-1-25">Type</div>
                  </Col>
                  <Col xs="auto">
                    <div className="sh-5 d-flex align-items-center">{data?.type}</div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="g-0 align-items-center mb-2">
              <Col xs="auto">
                <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                  <CsLineIcons icon="boxes" className="text-primary" />
                </div>
              </Col>
              <Col className="ps-3">
                <Row className="g-0">
                  <Col>
                    <div className="sh-5 d-flex align-items-center lh-1-25">Order Count</div>
                  </Col>
                  <Col xs="auto">
                    <div className="sh-5 d-flex align-items-center">{data?.analytics.orders_count}</div>
                  </Col>
                </Row>
              </Col>
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
              <Col className="text-alternate">{data?.name}</Col>
            </Row>
            <Row className="g-0 mb-2">
              <Col xs="auto">
                <div className="sw-3 me-1">
                  <CsLineIcons icon="pin" size="17" className="text-primary" />
                </div>
              </Col>
              <Col className="text-alternate">{data?.addressbook.shipping[0] === undefined ? "No Address Available" : data?.addressbook.shipping[0].city}, {data?.addressbook.shipping[0] === undefined ? "" : data?.addressbook.shipping[0].area}, {data?.addressbook.shipping[0] === undefined ? "" : data?.addressbook.shipping[0].address}</Col>
            </Row>
            <Row className="g-0 mb-2">
              <Col xs="auto">
                <div className="sw-3 me-1">
                  <CsLineIcons icon="phone" size="17" className="text-primary" />
                </div>
              </Col>
              <Col className="text-alternate">{data?.phone}</Col>
            </Row>
            <Row className="g-0 mb-2">
              <Col xs="auto">
                <div className="sw-3 me-1">
                  <CsLineIcons icon="email" size="17" className="text-primary" />
                </div>
              </Col>
              <Col className="text-alternate">{data?.email}</Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UserInfo;
