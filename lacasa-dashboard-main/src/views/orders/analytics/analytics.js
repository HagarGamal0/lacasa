import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import Unauthorized from "views/default/Unauthorized";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-dt/js/dataTables.dataTables";

// Now import DataTables Buttons related modules
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.colVis";
import "datatables.net-buttons/js/buttons.flash";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons/js/buttons.html5";
import "jquery/dist/jquery.min";
import api from "../../../API/API";

const AnalyticsPage = () => {
  /* eslint-disable global-require */
  /* eslint-enable global-require */
  const [analytics, setAnalaytics] = useState();
  const title = "Analytics";
  const description = "Lacasa Analytics Page";
  const [searchFromDate, setSearchFromDate] = useState(() => {
    return new Date().setDate(new Date().getDate() - 30);
  });
  const [searchToDate, setSearchToDate] = useState(() => new Date());
  const [loading, setLoading] = useState(false);
  const [paymentID, setPaymentID] = useState([]);
  const [status, setStatus] = useState([]);
  const formatDate = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1); // eslint-disable-line
    let day = "" + d.getDate(); // eslint-disable-line
    let year = d.getFullYear(); // eslint-disable-line

    if (month.length < 2) month = "0" + month; // eslint-disable-line
    if (day.length < 2) day = "0" + day; // eslint-disable-line

    return [year, month, day].join("-");
  };

  useEffect(() => {
    api
      .readAll(
        `/analytics/orders?find[created_before]=${formatDate(
          searchToDate
        )}&find[created_after]=${formatDate(
          searchFromDate
        )}&find[payment_method_id]=${paymentID}&find[status]=${status}`
      )
      .then(async (response) => {
        await setLoading(true);
        setAnalaytics(response.data);
        await setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchToDate, searchFromDate, paymentID, status]);

  return (
    <HasAccess
      permissions="View Orders"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row className="g-0">
          <Col className="col-auto mb-3 mb-sm-0 me-auto">
            <NavLink
              className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
              to="/"
            >
              <CsLineIcons icon="chevron-left" size="13" />
              <span className="align-middle text-small ms-1">Home</span>
            </NavLink>
            <h1 className="mb-0 pb-0 display-4" id="title">
              {title}
            </h1>
          </Col>
        </Row>
      </div>
      <Row>
        <Col xl="3">
          <div className="col-md-12">
            From:{" "}
            <input
              type="date"
              className="form-control"
              onChange={(e) => setSearchFromDate(e.target.value)}
              style={{ width: "70%", backgroundColor: "transparent" }}
            />
          </div>
        </Col>
        <Col xl="3">
          <div className="col-md-12">
            To:{" "}
            <input
              type="date"
              className="form-control"
              onChange={(e) => setSearchToDate(e.target.value)}
              style={{ width: "70%", backgroundColor: "transparent" }}
            />
          </div>
        </Col>
        <Col xl="3">
          Payment Type:
          <Form.Select onChange={(e) => setPaymentID(e.target.value)}>
            <option value={[]}>All</option>
            <option value={1}>Cash On Delivery</option>
            <option value={2}>Debit Card</option>
            <option value={3}>ValU</option>
            <option value={4}>Credit Card</option>
            <option value={5}>Sympl</option>
            <option value={9}>Aman</option>
            <option value={10}>Forsa</option>
            <option value={11}>Souhoola</option>
            <option value={12}>Wallet</option>
          </Form.Select>
        </Col>
        <Col xl="3">
          Status:
          <Form.Select onChange={(e) => setStatus(e.target.value)}>
            <option value="">Filter by status</option>
            <option value="Pending Confirmation">Pending Confirmation</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Customer Confirmed">Customer Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Ready To Ship">Ready To Ship</option>
            <option value="Shipped">Shipped</option>
            <option value="Arrived">Arrived</option>
            <option value="Returned">Returned</option>
            <option value="Rejected">Rejected</option>
            <option value="Refunded">Refunded</option>
            <option value="Failed To Deliver">Failed To Deliver</option>
          </Form.Select>
        </Col>
      </Row>
      <h2 className="small-title mt-5">Customers</h2>
      <Row className="mb-5 w-100">
        <Col xs="6" md="6" lg="6">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
              <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                <CsLineIcons icon="user" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                NEW CUSTOMERS
              </div>
              <div className="text-primary cta-4">
                {analytics?.users.first_order}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="6" md="6" lg="6">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
              <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                <CsLineIcons icon="user" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                RETURNING CUSTOMERS
              </div>
              <div className="text-primary cta-4">
                {analytics?.users.returning_customers}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h2 className="small-title mt-5">Revenue</h2>
      <Row className="mb-5">
        <Col xl="8">
          <Row className="mb-3 h-50">
            <Col xs="6" md="6" lg="6">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="dollar" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    LACASA COMMISSIONS
                  </div>
                  {analytics?.sales ? (
                    <div className="text-primary cta-4">
                      {parseInt(analytics?.sales.commissions, 10)}
                    </div>
                  ) : (
                    <div className="text-primary cta-4">0</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs="6" md="6" lg="6">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="dollar" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    LACASA DEBIT
                  </div>
                  {analytics?.sales ? (
                    <div className="text-primary cta-4">
                      {parseInt(analytics?.sales.lacasa_debit, 10)}
                    </div>
                  ) : (
                    <div className="text-primary cta-4">0</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-5 h-50">
            <Col xs="4" md="4" lg="4">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="dollar" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    VENDOR REVENUE
                  </div>
                  {analytics?.sales ? (
                    <div className="text-primary cta-4">
                      {parseInt(analytics?.sales.vendor_revenue, 10)}
                    </div>
                  ) : (
                    <div className="text-primary cta-4">0</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs="4" md="4" lg="4">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="dollar" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    VENDOR DEBIT
                  </div>
                  {analytics?.sales ? (
                    <div className="text-primary cta-4">
                      {parseInt(analytics?.sales.vendor_debit, 10)}
                    </div>
                  ) : (
                    <div className="text-primary cta-4">0</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col xs="4" md="4" lg="4">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="dollar" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    INCOMPLETE
                  </div>
                  {analytics?.sales ? (
                    <div className="text-primary cta-4">
                      {parseInt(analytics?.sales.incomplete, 10)}
                    </div>
                  ) : (
                    <div className="text-primary cta-4">0</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl="3" className="mt-5">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                <CsLineIcons icon="dollar" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                TOTAL
              </div>
              {analytics?.sales ? (
                <div className="text-primary cta-4">
                  {parseInt(analytics?.sales.total, 10)}
                </div>
              ) : (
                <div className="text-primary cta-4">0</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <h2 className="small-title mt-5">Order Anayltics</h2>
      <Row className="mb-5">
        <Col xl="8">
          <Row className="mb-3 h-50">
            <Col xs="6" md="6" lg="6">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="car" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    ARRIVED ORDERS
                  </div>
                  <div className="text-primary cta-4">
                    {analytics?.orders.arrived}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="6" md="6" lg="6">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="recycle" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    RETURNED, REJECTED, OR REFUNDED ORDERS
                  </div>
                  <div className="text-primary cta-4">
                    {analytics?.orders.returned_rejected_refunded}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-5 h-50">
            <Col xs="6" md="6" lg="6">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="spinner" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    PENDING
                  </div>
                  <div className="text-primary cta-4">
                    {analytics?.orders.pending}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xs="6" md="6" lg="6">
              <Card className="h-100 hover-scale-up cursor-pointer">
                <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                  <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                    <CsLineIcons icon="watch" className="text-primary" />
                  </div>
                  <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                    PROCESSING
                  </div>
                  <div className="text-primary cta-4">
                    {analytics?.orders.processing}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xl="3" className="mt-5">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                <CsLineIcons icon="file-text" className="text-primary" />
              </div>
              <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                TOTAL ORDERS
              </div>
              <div className="text-primary cta-4">
                {analytics?.orders.count}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </HasAccess>
  );
};

export default AnalyticsPage;
