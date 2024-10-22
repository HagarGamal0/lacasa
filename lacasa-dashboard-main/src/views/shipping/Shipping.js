import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import api from "../../API/API";

const ShippingProfile = () => {
  const title = "Shipping Profiles";
  const description = "Lacasa Shipping Profiles Page";
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/shipping_profiles?page=${page}&find[name]=${name}`)
      .then(async (response) => {
        await setData(response.data);
        await setMeta(response.meta);
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
  console.log("data", data);
  return (
    <HasAccess
      permissions="View Settings"
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
          </Row>
        </div>

        <Row className="mb-3">
          <Col md="5" lg="3" xxl="2" className="mb-1">
            {/* Search Start */}
            <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
              <Form.Control
                type="text"
                placeholder="Search"
                onChange={handleName}
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
          <Col md="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">ID</div>
          </Col>
          <Col
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              NAME
            </div>
          </Col>
          <Col
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              PRODUCT COUNT
            </div>
          </Col>
          <Col
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              SHIPPED BY
            </div>
          </Col>
          <Col
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              TYPE
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
              <NavLink to={`/shipping/details/${item.id}`} key={item.id}>
                <Card className={`mb-2 `}>
                  <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
                    <Row
                      className="g-0 h-100 align-content-center cursor-default"
                      style={{ cursor: "pointer" }}
                    >
                      <Col
                        md="2"
                        className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative"
                      >
                        <div className="text-muted text-small d-md-none">
                          Id
                        </div>
                        {item.id}
                      </Col>
                      <Col
                        className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2"
                      >
                        <div className="text-muted text-small d-md-none">
                          Name
                        </div>
                        <div className="text-alternate">{item.name}</div>
                      </Col>
                      <Col
                        className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3"
                      >
                        <div className="text-muted text-small d-md-none">
                          Product Count
                        </div>
                        <div className="text-alternate">
                          <span>{item.products_count}</span>
                        </div>
                      </Col>
                      <Col
                        className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3"
                      >
                        <div className="text-muted text-small d-md-none">
                          shipped By
                        </div>
                        <div className="text-alternate">
                          <span>{item.provider?.name}</span>
                        </div>
                      </Col>
                      <Col
                        className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3"
                      >
                        <div className="text-muted text-small d-md-none">
                          Type
                        </div>
                        <div className="text-alternate">
                          <span>{item.type}</span>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </NavLink>
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

export default ShippingProfile;
