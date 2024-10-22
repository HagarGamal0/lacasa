import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

const CustomersList = () => {
const title = "User List";
  const description = "Lacasa User List Page";
  const [data, setData] = useState();
  const [meta, setMeta] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);
  const [statusLoading, setstatusLoading] = useState(false);
  const status = {
    "0": "Active",
    "1": "blocked",
  };
  const colors = {
    "0":"lightgreen",
    "1":"red",
  };
  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/users?page=${page}&find[name]=${name}`)
      .then(async (response) => {
        setData(response.data);
        setMeta(response.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, name]);

  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleStatusChange = (id, statusId) => {
    setstatusLoading(true);
    api
        .create(`/users/change/status/${id}`, { status: statusId })
        .then((res) => {
          setstatusLoading(false);
          const users = data.map((user) => {
            if (user.id === id) {
              return { ...user, block: statusId };
            }
            return user;
          });
          setData(users);
        })
        .catch((err) => {
          console.error("API request failed:", err);
          setstatusLoading(false);
        });
  };

  return (
    <HasAccess
      permissions="View Users"
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

            {/* Top Buttons End */}
          </Row>
        </div>

        <Row className="mb-3">
          <Col md="5" lg="3" xxl="2" className="mb-1">
            {/* Search Start */}
            <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
              <Form.Control
                type="text"
                placeholder="Search"
                onBlur={handleName}
              />
              <span className="search-magnifier-icon">
                <CsLineIcons icon="search" />
              </span>
              <span className="search-delete-icon d-none">
                <CsLineIcons icon="close" />
              </span>
            </div>
            {/* Search End */}
          </Col>
        </Row>

        {/* List Header Start */}
        <Row className="g-0 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
          <Col lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">ID</div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              NAME
            </div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              LOCATION
            </div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              PHONE
            </div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              EMAIL
            </div>
          </Col>
          <Col
            lg="1"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              Status
            </div>
          </Col>
          <Col
            lg="1"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              EDIT
            </div>
          </Col>
        </Row>
        {/* List Header End */}

        {/* List Items Start */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Bars
              height="80"
              width="80"
              color="black"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <>
            {data?.map((item, index) => (
              <Card className="mb-2" key={item.id}>
                <Card.Body className="pt-0 pb-0 sh-30 sh-lg-8">
                  <Row className="g-0 h-100 align-content-center">
                    <Col
                      xs="11"
                      lg="2"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 h-lg-100 position-relative"
                    >
                      <div className="text-muted text-small d-lg-none">Id</div>
                      <NavLink
                        to={`/users/detail/${item.id}`}
                        className="text-truncate h-100 d-flex align-items-center"
                      >
                        {item.id}
                      </NavLink>
                    </Col>
                    <Col
                      xs="6"
                      lg="2"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2"
                    >
                      <div className="text-muted text-small d-lg-none">
                        Name
                      </div>
                      <div className="text-alternate">{item.name}</div>
                    </Col>
                    <Col
                      xs="6"
                      lg="2"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-3"
                    >
                      <div className="text-muted text-small d-lg-none">
                        Location
                      </div>
                      <div className="text-alternate">
                        {item.addressbook.shipping.length > 0
                          ? item.addressbook.shipping[0].area
                          : "No area available"}
                      </div>
                    </Col>
                    <Col
                      xs="6"
                      lg="2"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-4 order-lg-4"
                    >
                      <div className="text-muted text-small d-lg-none">
                        Phone
                      </div>
                      <div className="text-alternate">{item.phone}</div>
                    </Col>
                    <Col
                      xs="6"
                      lg="2"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4"
                    >
                      <div className="text-muted text-small d-lg-none">
                        Email
                      </div>
                      <div className="text-alternate">{item.email}</div>
                    </Col>

                    <Col
                        xs="6"
                        lg="1"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4"
                    >
                      <div className="text-alternate" id={item.block}>
                        <select
                            disabled={statusLoading}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            value={item.block}
                            className={`${status[item.block]}`}
                            style={{
                              cursor: "pointer",
                              borderRadius: "7px",
                              padding: "1px",
                              width: "77px",
                              marginBottom: "10px",
                              background: `${colors[item.block]}`,
                            }}
                        >
                          <option value="0">Active</option>
                          <option value="1">Blocked</option>
                        </select>
                      </div>
                    </Col>

                    <Col
                      xs="6"
                      lg="1"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4"
                    >
                      <div className="text-muted text-small d-lg-none">
                        Last Order
                      </div>
                      <HasAccess
                        permissions="Edit Users"
                        renderAuthFailed={
                          "You don't have access to edit users."
                        }
                        isLoading="loading..."
                      >
                        <NavLink
                          to={`/users/detail/${item.id}`}
                          className="text-truncate h-100 d-flex align-items-center body-link"
                        >
                          <CsLineIcons icon="edit" />
                        </NavLink>
                      </HasAccess>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </>
        )}

        {/* List Items End */}

        {/* Pagination Start */}
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
        {/* Pagination End */}
      </>
    </HasAccess>
  );
};

export default CustomersList;


