import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ActivityLog = ({ data }) => {
  const [event, setEvent] = useState([]);
  const [old, setOld] = useState([]);
  const [attribute, setAttribute] = useState([]);

  const newDateFormat = (date) => {
    const newDate = new Date(date);
    return `${newDate.getHours()}:${newDate.getMinutes()},  ${newDate.toDateString()}`;
  };

  useEffect(() => {
    const eventArr = [];
    const oldArr = [];
    const newArr = [];

    data.activities.map((item, index) => {
      if (item.event === 'created') {
        eventArr.push({ key: 'Status', value: 'Created', updated_at: `${newDateFormat(item.subject.properties.attributes.updated_at)}`, id: `${item.id}` });
      } else {
        Object.keys(item.subject.properties.old).forEach(function (key, indexObj) {
          if (key !== 'updated_at') {
            oldArr.push({ key, value: item.subject.properties.old[key], id: item.id, updated_at: newDateFormat(item.date) });
          }
        });
        Object.keys(item.subject.properties.attributes).forEach(function (key, indexObj) {
          if (key !== 'updated_at') {
            newArr.push({
              key,
              value: item.subject.properties.attributes[key],
              id: item.id,
              updated_at: newDateFormat(item.date),
            });
          }
        });
      }
      return eventArr;
    });

    setOld(oldArr);
    setAttribute(newArr);
    setEvent(eventArr);
  }, [data]);

  return (
    <>
      <Row>
        <Col xl="12" xxl="12">
          <h2 className="small-title">Activity Log</h2>
          <Card className="mb-5">
            <Card.Body className="mb-5">
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
                    <Row className="g-0 h-100 sh-lg-9 d-flex justify-content-center">
                      <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                        <Row className="g-0 h-100 align-content-center">
                          <Col xs="4" lg="4" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                            {item.causer !== null ? (
                              <NavLink to={`/users/detail/${item.causer.id}`}>
                                <button type="button" className="btn btn-primary">
                                  <div className="lh-1 text-alternate text-white">{item.causer.name}</div>
                                </button>
                              </NavLink>
                            ) : (
                              <div className="lh-1 text-alternate">N/A</div>
                            )}
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
                    <Row className="m-3">
                      <Col xl="12">
                        <h5>Updated at: {newDateFormat(item.date)}</h5>
                      </Col>
                    </Row>
                    {item.event === 'created' ? (
                      <Row className="m-3">
                        <Col xs="6" lg="6" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                          <div className="lh-1 text-alternate">
                            {event.map((eventItem, eventIndex) => (
                              <div key={eventIndex}>
                                {parseInt(eventItem.id, 10) === item.id && eventItem.key !== 'updated_at' ? (
                                  <>
                                    <span className="font-weight-bold text-primary">
                                      <span className="text-capitalize">{eventItem.key}</span>:{' '}
                                    </span>
                                    {eventItem.value}
                                  </>
                                ) : (
                                  ''
                                )}
                              </div>
                            ))}
                          </div>
                        </Col>
                        <Col xs="6" lg="6" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                          <div className="lh-1 text-alternate">
                            {event.map((eventItem, eventIndex) => (parseInt(eventItem.id, 10) === item.id ? eventItem.updated_at : ''))}
                          </div>
                        </Col>
                      </Row>
                    ) : (
                      <>
                        <Row className="m-3">
                          <h2 className="small-title">Old Values</h2>
                          <Col xs="6" lg="6" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                            <div className="lh-1 text-alternate">
                              {old.map((eventItem, eventIndex) => (
                                <div key={eventIndex}>
                                  {parseInt(eventItem.id, 10) === item.id ? (
                                    <div className="w-100 mb-2">
                                      <span className="font-weight-bold text-primary">
                                        <span className="text-capitalize">{eventItem.key.replaceAll('_', ' ')}</span>:{' '}
                                      </span>
                                      {eventItem.value === null ? 'Empty' : eventItem.value}
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              ))}
                            </div>
                          </Col>
                        </Row>
                        <Row className="m-3">
                          <h2 className="small-title">Updated Values</h2>

                          <Col xs="6" lg="6" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                            <div className="lh-1 text-alternate">
                              {attribute.map((eventItem, eventIndex) => (
                                <div key={eventIndex}>
                                  {parseInt(eventItem.id, 10) === item.id ? (
                                    <div className="w-100 mb-2">
                                      <span className="font-weight-bold text-primary">
                                        <span className="text-capitalize">{eventItem.key.replaceAll('_', ' ')}</span>:{' '}
                                      </span>
                                      {eventItem.value === null ? 'Empty' : eventItem.value}
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </div>
                              ))}
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
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
