import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Dropdown,
  Form,
  Card,
  Badge,
  Pagination,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import ReactPaginate from "react-paginate";
import { Bars } from "react-loader-spinner";
import Datatable from "react-laravel-datatable";
import { HasAccess } from "@permify/react-role";
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
import $ from "jquery";

import api from "../../../API/API";

const OldOrdersList = () => {
  /* eslint-disable global-require */
  $.DataTable = require("datatables.net");
  /* eslint-enable global-require */
  const tableRef = useRef();
  const tableName = "OldOrders";
  const [orders, setOrders] = useState();

  const title = "Old Orders List";
  const description = "Lacasa Orders List Page";
  const [meta, setMeta] = useState();
  const [page, setPage] = useState(1);
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);
  const [phone, setPhone] = useState([]);
  const [payment, setPayment] = useState([]);
  const [status, setStatus] = useState([]);
  const [searchFromDate, setSearchFromDate] = useState(() => {
    return new Date(new Date().getDate() - 7);
  });
  const [searchToDate, setSearchToDate] = useState(() => new Date());
  const [exportLoader, setExportLoader] = useState();
  const [exportError, setExportError] = useState(true);
  const [timer, setTimer] = useState(null);
  const [analytics, setAnalaytics] = useState();
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

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
        `/analytics/old_orders?find[created_before]=${formatDate(
          searchToDate
        )}&find[created_after]=${formatDate(searchFromDate)}`
      )
      .then(async (response) => {
        await setAnalyticsLoading(true);
        setAnalaytics(response.data);
        await setAnalyticsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchToDate, searchFromDate]);

  useEffect(() => {
    api
      .readAll(
        `/old_orders?page=${page}&find[status]=${status}&find[user.name]=${name}&find[id]=${id}&find[user.phone]=${phone}&find[payment_method.name]=${payment}`
      )
      .then(async (response) => {
        setOrders(response.data);
        setMeta(response.meta);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, name, phone, payment, status, id]);

  useEffect(() => {
    const table = $(`#${tableName}`).DataTable({
      data: orders,
      columns: [
        { data: "id" },
        {
          data: "user.name",
          render(data, type, row) {
            return `<a href="/orders/old/detail/${row.id}">${data}</a>`;
          },
        },
        { data: "address.phone" },
        { data: "subtotal" },
        { data: "total" },
        { data: "status" },
        { data: "products.length" },
        { data: "payment_id" },
        { data: "payment_status" },
      ],
      destroy: true, // I think some clean up is happening here
      searching: false,
      paging: false,
      sorting: false,
    });
    // Extra step to do extra clean-up.
    return function () {
      console.log("Table destroyed");
      table.destroy();
    };
  }, [orders]);

  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };
  const handleName = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }

    setTimer(
      window.setTimeout(function () {
        setTimer(null);

        setPage(1);
        setName(e.target.value);
      }, 1000)
    );
  };
  const handleID = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }

    setTimer(
      window.setTimeout(function () {
        setTimer(null);

        setPage(1);
        setId(e.target.value);
      }, 1000)
    );
  };

  const handlePhone = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }

    setTimer(
      window.setTimeout(function () {
        setTimer(null);

        setPage(1);
        setPhone(e.target.value);
      }, 1000)
    );
  };

  function downloadBlob(blob, fName) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob)
      return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = data;
    link.download = fName;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);

    return 1;
  }

  const handlePaymentStatus = (e) => {
    setPayment(e.target.value);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
  };
  const handleExport = () => {
    if (searchFromDate && searchToDate) {
      setExportError(false);
      setExportLoader(true);
      api
        .create(
          `/export/old_orders?find[created_before]=${formatDate(
            searchToDate
          )}&find[created_after]=${formatDate(searchFromDate)}`
        )
        .then(async (response) => {
          const blob = new Blob([response], { type: "text/csv" });
          await downloadBlob(
            blob,
            `Orders--${searchFromDate}//${searchToDate}.csv`
          );
          setExportLoader(false);
        });
    }
  };
  const handleExportFromDate = (e) => {
    setSearchFromDate(e.target.value);
  };
  const handleExportToDate = (e) => {
    setSearchToDate(e.target.value);
  };

  return (
    <HasAccess
      permissions="View Orders"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
          <Row className="g-0">
            {/* Title Start */}
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
            {/* Title End */}

            {/* Top Buttons Start */}
            <Row>
              <Col xl="2">
                {exportLoader ? (
                  <p>Getting your file ready, this might take a while...</p>
                ) : (
                  <button
                    type="button"
                    style={{ width: "150px" }}
                    className="btn btn-primary mb-2 mt-3"
                    onClick={handleExport}
                  >
                    Export CSV
                  </button>
                )}
              </Col>
              <Col xl="10">
                <Row>
                  {exportError ? (
                    <small className="text-danger">
                      Please, pick a date to be able to export data
                    </small>
                  ) : (
                    ""
                  )}
                  <Col xl="4">
                    <div className="col-md-12">
                      From:{" "}
                      <input
                        type="date"
                        className="form-control"
                        onChange={handleExportFromDate}
                        style={{ width: "70%", backgroundColor: "transparent" }}
                      />
                    </div>
                  </Col>
                  <Col xl="4">
                    <div className="col-md-12">
                      To:{" "}
                      <input
                        type="date"
                        className="form-control"
                        onChange={handleExportToDate}
                        style={{ width: "70%", backgroundColor: "transparent" }}
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* Top Buttons End */}
          </Row>
        </div>

        <h2 className="small-title mt-5">Order Anayltics</h2>
        <Row className="mb-5">
          <Col xl="12">
            <Row className="mb-3 h-50">
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="car" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      ARRIVED ORDERS
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.complete}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="recycle" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      RETURNED, REJECTED, OR REFUNDED ORDERS
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.delivery_failed +
                          analytics?.result.analytics.orders.refunded +
                          analytics?.result.analytics.orders.rejected +
                          analytics?.result.analytics.orders.returned}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="spinner" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      PENDING
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.pending}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="watch" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      PROCESSING
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.processing}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="mb-5 h-50">
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="spinner" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      CANCELLED
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.cancelled}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="watch" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      CONFIRMED
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.confirmed}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs="3" md="3" lg="3">
                <Card className="h-100 hover-scale-up cursor-pointer">
                  <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
                    <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                      <CsLineIcons icon="spinner" className="text-primary" />
                    </div>
                    <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                      SHIPPED
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.analytics.orders.shipped}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <h2 className="small-title mt-5">Revenue Anayltics</h2>
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
                      LACASA COMMISSION
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.revenue.commission}
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
                      VENDOR REVENUE
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.revenue.vendor_revenue}
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
                      ORDER SALES SUBTOTAL
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.revenue.orders_sales_subtotal}
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
                      ORDER SALES TOTAL
                    </div>
                    <div className="text-primary cta-4">
                      {analyticsLoading
                        ? "Loading..."
                        : analytics?.result.revenue.orders_sales}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xl="5" lg="3" xxl="2" className="mb-1">
            <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
              <Form.Select onChange={handleStatus}>
                <option value="">Filter by status</option>
                <option value="Processing ">Processing </option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Pending payment"> Pending payment </option>
                <option value="Delivered">Delivered</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
                <option value="Rejected">Rejected</option>
                <option value="Refunded">Refunded</option>
                <option value="Delivery failed">Failed To Deliver</option>
              </Form.Select>
            </div>
          </Col>
        </Row>

        <div>
          <table className="display" width="100%" id={tableName}>
            <thead>
              <tr>
                <td>
                  <input type="text" placeholder="ID" onChange={handleID} />
                </td>
                <td>
                  <input type="text" placeholder="Name" onChange={handleName} />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Phone"
                    onChange={handlePhone}
                  />
                </td>
                <td>Subtotal</td>
                <td>Total</td>
                <td>Status</td>
                <td>Product</td>
                <td>
                  <input type="text" placeholder="Payment ID" disabled />
                </td>
                <td>
                  <select onBlur={handlePaymentStatus}>
                    <option value="cod">Cash on delivery</option>
                    <option value="paymob">Paymob</option>
                  </select>
                </td>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>
                  <input type="text" placeholder="ID" onChange={handleID} />
                </td>
                <td>
                  <input type="text" placeholder="Name" onChange={handleName} />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Phone"
                    onChange={handlePhone}
                  />
                </td>
                <td>Subtotal</td>
                <td>Total</td>
                <td>Status</td>
                <td>Product</td>
                <td>
                  <input type="text" placeholder="Payment ID" disabled />
                </td>
                <td>
                  <select onBlur={handlePaymentStatus}>
                    <option value="cod">Cash on delivery</option>
                    <option value="paymob">Paymob</option>
                  </select>
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="d-flex justify-content-center mt-5">
            <ReactPaginate
              previousLabel="<<"
              nextLabel=">>"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              pageCount={meta?.last_page > 0 ? meta?.last_page : 0}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageChange}
              containerClassName="pagination"
              activeClassName="active"
            />
          </div>
        </div>
      </>
    </HasAccess>
  );
};

export default OldOrdersList;
