import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const ActivityLog = ({ data }) => {
  const [events, setEvents] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loading, setLoading] = useState(true);

  const newDateFormat = (date) => {
    const newDate = new Date(date);
    return `${newDate.getHours()}:${newDate.getMinutes()},  ${newDate.toDateString()}`;
  };

  useEffect(async () => {
    await setLoading(true);
    const eventsArr = events;
    const attributesArr = attributes;

    data?.activities.map((item, index) => {
      if (item.subject.properties.old) {
        Object.keys(item.subject.properties.old).forEach(function (key, indexObj) {
          if (key !== "updated_at") {
            eventsArr.push({ 'key': key, 'value': item.subject.properties.old[key], 'index': index, 'updated_at': item.subject.properties.old.updated_at });
          }
        });
      }

      return eventsArr;
    });

    data?.activities.map((item, index) => {
      if (item.subject.properties.attributes) {
        if (item.subject.properties.attributes.address_book_id) {
          attributesArr.push({ 'key': 'Status', 'value': item.subject.properties.attributes.status, 'index': index, 'updated_at': item.subject.properties.attributes.updated_at })
        } else {
          Object.keys(item.subject.properties.attributes).forEach(function (key, indexObj) {
            if (key !== "updated_at") {
              attributesArr.push({ 'key': key, 'value': item.subject.properties.attributes[key], 'index': index, 'updated_at': item.subject.properties.attributes.updated_at });
            }
          });
        }
      }

      return eventsArr;
    });
    setEvents(eventsArr);
    setAttributes(attributesArr)
    await setLoading(false)
  }, [data]);
  return (
    <>
      {loading ? "" :
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
                      {item.subject.properties.old ? (
                        <Row className="g-0 h-100 sh-lg-9 position-relative">
                          <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                            <Row className="g-0 h-100 align-content-center">
                              <Col xs="6" lg="6" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                                <div className="lh-1 text-alternate">
                                  {events.map((eventItem, eventIndex) => (
                                    <>
                                      {eventItem.index === index ? <>
                                        <span className="font-weight-bold text-primary"><span className="text-capitalize">{eventItem.key.replaceAll("_", " ")}</span>:  </span>
                                        {eventItem.value}
                                      </>
                                        : ""}
                                    </>
                                  ))}
                                </div>
                              </Col>
                              <Col xs="6" lg="6" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                                <div className="lh-1 text-alternate">
                                  <span className="font-weight-bold text-primary">Updated at: </span>
                                  {events.map((eventItem, eventIndex) => (
                                    eventItem.index === index ? newDateFormat(eventItem.updated_at) : ""
                                  ))}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      ) : (
                        ''
                      )}
                      {item.subject.properties.attributes ? (
                        <Row className="g-0 h-100 sh-lg-9 position-relative">
                          <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                            <Row className="g-0 h-100 align-content-center">
                              <Col xs="6" lg="6" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                                <div className="lh-1 text-alternate">
                                  {attributes.map((eventItem, eventIndex) => (
                                    <>
                                      {eventItem.index === index && eventItem.key !== "updated_at" ? <>
                                        <span className="font-weight-bold text-primary"><span className="text-capitalize">{eventItem.key.replaceAll("_", " ")}</span>:  </span>
                                        {eventItem.value}
                                      </>
                                        : ""}
                                    </>
                                  ))}
                                </div>
                              </Col>
                              <Col xs="6" lg="6" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                                <div className="lh-1 text-alternate">
                                  <span className="font-weight-bold text-primary">Updated at: </span>
                                  {attributes.map((eventItem, eventIndex) => (
                                    eventItem.index === index ? newDateFormat(eventItem.updated_at) : ""
                                  ))}
                                </div>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      ) : (
                        ''
                      )}
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>}
    </>
  );
};

export default ActivityLog;
