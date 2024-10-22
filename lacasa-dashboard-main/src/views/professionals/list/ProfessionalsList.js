import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

const ProfessionalsList = () => {
  const title = "Professionals List";
  const description = "Lacasa Professionals List Page";
  const [data, setData] = useState();
  const [meta, setMeta] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);
  const [statusLoading, setstatusLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/designers?page=${page}`)
      .then(async (response) => {
        console.log(response.data);
        setData(response.data);
        setMeta(response.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, name]);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const status = {
    1: "Pending",
    2: "Active",
    3: "Suspend",
    4: "Draft",
  };
  const colors = {
    1: " #ffbd02",
    2: " lightgreen",
    3: " rgb(255, 71, 71)",
    4: "lightgrey",
  };

  const update = (id, statusId) => {
    setstatusLoading(true);
    api
      .create(`/designers/change/status/${id}`, { status: statusId })
      .then((res) => {
        console.log(res);
        setstatusLoading(false);
        const users = data.map((user) => {
          if (user.id === id) {
            return { ...user, status: statusId };
          }
          return user;
        });
        setData(users);
      })
      .catch((err) => {
        // toast.error(err.message);
        setstatusLoading(false);
      });
  };
  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };

  return (
    <HasAccess
      permissions="View Vendors"
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
            <Col
              xs="12"
              sm="auto"
              className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3"
            >
              <a href="/professionals/create">
                <Button
                  variant="outline-primary"
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <CsLineIcons icon="plus" />
                  <span>Add Professional</span>
                </Button>
              </a>
            </Col>
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
          <Col lg="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small">ID</div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small ">NAME</div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small">PHONE</div>
          </Col>
          <Col
            lg="1"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small">JOB TITLE</div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small">EMAIL</div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center align-items-center"
          >
            <div className="text-muted text-small">COMPANY NAME</div>
          </Col>

          <Col
            lg="1"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small">STATUS</div>
          </Col>

          <Col
            lg="1"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small">EDIT</div>
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
                      lg="1"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 h-lg-100 position-relative"
                    >
                      <div className="text-muted text-small d-lg-none">Id</div>
                      <NavLink
                        to={`/vendors/detail/${item.id}`}
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
                        Phone
                      </div>
                      <div className="text-alternate">{item.phone}</div>
                    </Col>
                    <Col
                      xs="6"
                      lg="1"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-4 order-lg-4"
                    >
                      <div className="text-muted text-small d-lg-none">
                        Job Title
                      </div>
                      <div className="text-alternate">{item.job_title}</div>
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
                      lg="2"
                      className="d-flex flex-column justify-content-center align-items-center mb-2 mb-lg-0 order-last order-lg-5"
                    >
                      <div className="text-muted text-small d-lg-none mb-1">
                        Company Name
                      </div>
                      <div className="text-alternate">{item.company_name}</div>
                    </Col>
                    <Col
                      xs="6"
                      lg="1"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-last order-lg-5"
                    >
                      <div className="text-muted text-small d-lg-none mb-1">
                        STATUS
                      </div>
                      <HasAccess
                        permissions="Edit Vendors"
                        renderAuthFailed={
                          "You don't have access to edit professionals."
                        }
                        isLoading="loading..."
                      >
                        <select
                          disabled={statusLoading}
                          onChange={(e) => {
                            update(item.id, e.target.value);
                          }}
                          value={item.status}
                          className={`${status[item?.stauts]}`}
                          style={{
                            cursor: "pointer",
                            borderRadius: "7px",
                            padding: "0px",
                            width: "77px",
                            marginBottom: "10px",
                            background: `${colors[item.status]}`,
                          }}
                        >
                          <option value="1">Pending</option>
                          <option value="2">Active</option>
                          <option value="3">Suspend</option>
                          <option value="4">Draft</option>
                        </select>
                      </HasAccess>
                    </Col>
                    <Col
                      xs="6"
                      lg="1"
                      className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-last order-lg-5"
                    >
                      <div className="text-muted text-small d-lg-none mb-1">
                        Edit
                      </div>
                      <HasAccess
                        permissions="Edit Vendors"
                        renderAuthFailed={
                          "You don't have access to edit professionals."
                        }
                        isLoading="loading..."
                      >
                        <NavLink to={`/professionals/detail/${item.id}`}>
                          <div className="lh-1 text-alternate">
                            <CsLineIcons icon="edit" />
                          </div>
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

export default ProfessionalsList;
