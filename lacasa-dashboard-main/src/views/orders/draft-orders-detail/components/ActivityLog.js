import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ActivityLog = ({ data }) => {

  return (
    <>
      <Row>
        <Col xl="12" xxl="12">
          <h2 className="small-title">Activity Log</h2>
          <Card className="mb-5">
            <Card.Body className="mb-n5">
              <div className="mb-5">
                <Row className="g-0 mb-2 d-none d-lg-flex">
                  <Col>
                    <Row className="g-0 h-100 custom-sort ps-5 pe-4 h-100">
                      <Col xs="4" lg="4" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                        <div className="text-muted text-small">CAUSER</div>
                      </Col>
                      <Col xs="4" lg="4" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                        <div className="text-muted text-small">EVENT</div>
                      </Col>
                      <Col xs="4" lg="4" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                        <div className="text-muted text-small">ID</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {data?.activities.map((item, index) => (
                  <Card className={`mb-2 `} key={index}>
                    <Row className="g-0 h-100 sh-lg-9 position-relative">
                      <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                        <Row className="g-0 h-100 align-content-center">
                          <Col xs="4" lg="4" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                            {item.causer !== null ?
                              <NavLink to={`/users/detail/${item.causer.id}`}>
                                <button type="button" className="btn btn-primary">
                                  <div className="lh-1 text-alternate text-white">{item.causer.name}</div>
                                </button>
                              </NavLink> : <div className="lh-1 text-alternate">N/A</div>}
                          </Col>
                          <Col xs="4" lg="4" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                            <div className="lh-1 text-alternate">{item.event}</div>
                          </Col>
                          <Col xs="4" lg="4" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                            <div className="lh-1 text-alternate">{item.id}</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>

                ))}


              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ActivityLog;
