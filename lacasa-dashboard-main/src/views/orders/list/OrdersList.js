import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";

// Now import DataTables libraries
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

const OrdersList = () => {
  /* eslint-disable global-require */
  $.DataTable = require("datatables.net");
  /* eslint-enable global-require */
  const tableRef = useRef();
  const tableName = "Orders";
  const [orders, setOrders] = useState();
  const [analytics, setAnalaytics] = useState();
  const title = "Orders List";
  const description = "Lacasa Orders List Page";
  const [meta, setMeta] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);
  const [phone, setPhone] = useState([]);
  const [payment, setPayment] = useState([]);
  const [status, setStatus] = useState([]);
  const [valid, setValid] = useState([]);
  const [timer, setTimer] = useState(null);
  const [searchFromDate, setSearchFromDate] = useState(() => {
    return new Date().setDate(new Date().getDate() - 30);
  });
  const [searchToDate, setSearchToDate] = useState(() => new Date());
  const [exportLoader, setExportLoader] = useState();
  const [exportError, setExportError] = useState(true);

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
    console.log(new Date().setDate(new Date().getDate() - 1));
    api
      .readAll(
        `/orders?page=${page}&find[status]=${status}&find[user.name]=${name}&find[id]=${id}&find[user.phone]=${phone}&find[payment_method.name]=${payment}&find[created_before]=${formatDate(
          searchToDate
        )}&find[created_after]=${formatDate(searchFromDate)}`
      )
      .then(async (response) => {
        await setLoading(true);

        setOrders(response.data);
        setMeta(response.meta);
        await setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, name, phone, payment, status, id, searchToDate, searchFromDate]);

  useEffect(() => {
    api
      .readAll(
        `/analytics/orders?find[created_before]=${formatDate(
          searchToDate
        )}&find[created_after]=${formatDate(searchFromDate)}`
      )
      .then(async (response) => {
        setLoading(true);
        setAnalaytics(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchToDate, searchFromDate]);

  const newDateFormat = (date) => {
    const newDate = new Date(date);
    return `${newDate.getHours()}:${newDate.getMinutes()},  ${newDate.toDateString()}`;
  };
  useEffect(() => {
    const table = $(`#${tableName}`).DataTable({
      data: orders,
      // serverSide: true,
      columns: [
        {
          data: "created_at",
          render: (data, type, row) => {
            return newDateFormat(data);
          },
        },
        {
          data: "shipping_details.consignee.name",
          render: (data, type, row) => {
            return `<a href="/orders/detail/${row.id}">${data}</a>`;
          },
        },
        { data: "shipping_details.consignee.phone" },
        { data: "id" },
        { data: "payment_detail.shipping_fees" },
        { data: "payment_detail.total" },
        { data: "status" },
        { data: "items.length" },
        { data: "transaction_detail.type" },
        { data: "transaction_detail.payment_id" },
        { data: "payment_detail.subtotal" },
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

  const handlePaymentStatus = (e) => {
    setPayment(e.target.value);
  };
  const handleStatus = (e) => {
    setStatus(e.target.value);
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

  const handleExport = () => {
    if (searchFromDate.length > 0 && searchToDate.length > 0) {
      setExportLoader(true);
      api
        .create(
          `/export/orders?find[created_before]=${formatDate(
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
      <h2 className="small-title mt-5">Analytics</h2>
      <Row className="mb-5 w-100 ">
        <Card className="h-100 hover-scale-up cursor-pointer pt-3 pb-3">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center p-1">
            <Row className="w-100 d-flex justify-content-between">
            <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                  <CsLineIcons icon="dollar" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  TOTAL ORDER VALUE
                </div>
                {analytics?.sales ? (
                  <div className="text-primary cta-4">
                    {parseInt(analytics?.sales.total, 10)}
                  </div>
                ) : (
                  <div className="text-primary cta-4">0</div>
                )}
              </Col>
              <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                  <CsLineIcons icon="shipping" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  TOTAL SHIPPING
                </div>
                {analytics?.sales ? (
                  <div className="text-primary cta-4">
                    {parseInt(analytics?.sales.total_shipping_fees, 10)}
                  </div>
                ) : (
                  <div className="text-primary cta-4">0</div>
                )}
              </Col>
              <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
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
              </Col>
              <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
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
              </Col>
              <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                  <CsLineIcons icon="file-text" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  TOTAL ORDERS
                </div>
                {analytics?.orders ? (
                  <div className="text-primary cta-4">
                    {analytics?.orders.count}
                  </div>
                ) : (
                  <div className="text-primary cta-4">0</div>
                )}
              </Col>
              <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                  <CsLineIcons icon="user" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  NEW CUSTOMERS
                </div>
                <div className="text-primary cta-4">
                  {analytics?.users.first_order}
                </div>
              </Col>
              <Col
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="sw-3 sh-3 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-1">
                  <CsLineIcons icon="user" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  RETURNING CUSTOMERS
                </div>
                <div className="text-primary cta-4">
                  {analytics?.users.returning_customers}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Row>

      <Row className="mb-3">
        <Col xl="5" lg="3" xxl="2" className="mb-1">
          <div className="d-inline-block float-md-start me-1 mb-1 search-input-container flex-grow-1 w-100 shadow bg-foreground">
            <Form.Select onChange={handleStatus}>
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
          </div>
        </Col>
        <Col>
          <div>
            <p
              style={{
                textALign: "end",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span className="bg-danger p-2 rounded">{meta?.total}</span>{" "}
              ORDERS
            </p>
          </div>
        </Col>
      </Row>

      <div>
        <table className="display" width="100%" id={tableName}>
          <thead>
            <tr>
              <td>
                <input type="text" placeholder="Creation Date" disabled />
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
              <td>
                <input type="text" placeholder="ID" onChange={handleID} />
              </td>
              <td>Shipping Fees</td>
              <td>Total</td>
              <td>Status</td>
              <td>Products</td>
              <td>
                <select onBlur={handlePaymentStatus}>
                  <option value="cod">Cash on delivery</option>
                  <option value="paymob">Paymob</option>
                  <option value="ValU">ValU</option>
                  <option value="sympl">Sympl</option>
                  <option value="aman">Aman</option>
                  <option value="forsa">Forsa</option>
                  <option value="souhoola">Souhoola</option>
                  <option value="wallet">Wallet</option>
                </select>
              </td>
              <td>
                <input type="text" placeholder="Refrence ID" disabled />
              </td>
              <td>Subtotal</td>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                <input type="text" placeholder="Creation Date" disabled />
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
              <td>
                <input type="text" placeholder="ID" onChange={handleID} />
              </td>
              <td>Shipping Fees</td>
              <td>Total</td>
              <td>Status</td>
              <td>Products</td>
              <td>
                <select onBlur={handlePaymentStatus}>
                  <option value="cod">Cash on delivery</option>
                  <option value="paymob">Paymob</option>
                </select>
              </td>
              <td>
                <input type="text" placeholder="Refrence ID" disabled />
              </td>
              <td>Subtotal</td>
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
    </HasAccess>
  );
};

export default OrdersList;
