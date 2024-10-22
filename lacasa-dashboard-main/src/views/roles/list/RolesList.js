import { HasAccess } from '@permify/react-role';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner';
import { NavLink } from 'react-router-dom';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';

const Roles = () => {
  const title = 'Roles List';
  const description = 'Ecommerce Roles List Page';
  const [data, setData] = useState();
  const [meta, setMeta] = useState();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/roles`)
      .then(async (response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [page])

  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };
  return (
    <HasAccess roles="Super Admin" renderAuthFailed={<Unauthorized />} isLoading="loading...">
      <>
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
          <Row className="g-0">
            {/* Title Start */}
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
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
              <Form.Control type="text" placeholder="Search" />
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
          <Col md="4" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">ID</div>
          </Col>
          <Col md="4" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">NAME</div>
          </Col>
          <Col md="4" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">EDIT</div>
          </Col>
        </Row>
        {/* List Header End */}

        {/* List Items Start */}
        {loading ?
          <div className="d-flex justify-content-center align-items-center h-100">
            <Bars
              height="80"
              width="80"
              color="black"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div> : <>
            {data?.map((item, index) => (
              <Card className={`mb-2 `} key={item.id}>
                <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
                  <Row className="g-0 h-100 align-content-center cursor-default" >
                    <Col xs="4" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                      <div className="text-muted text-small d-md-none">Id</div>
                      <NavLink to="/orders/detail" className="text-truncate h-100 d-flex align-items-center">
                        {item.id}
                      </NavLink>
                    </Col>
                    <Col xs="4" md="4" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2">
                      <div className="text-muted text-small d-md-none">Name</div>
                      <div className="text-alternate">{item.name}</div>
                    </Col>
                    <Col xs="6" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5">
                      <HasAccess roles="Super Admin" renderAuthFailed={"You don't have access to edit"} isLoading="loading...">
                        <div className="text-muted text-small d-md-none">Edit</div>
                        <NavLink to={`/roles/edit/${item.id}`} className="text-truncate h-100 d-flex align-items-center body-link">
                          <CsLineIcons icon="edit" />
                        </NavLink>
                      </HasAccess>
                    </Col>

                  </Row>
                </Card.Body>
              </Card>

            ))}</>}
        {/* List Items End */}

        {/* Pagination Start */}
        <div className="d-flex justify-content-center mt-5">
          {/* <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
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
        /> */}
        </div>
        {/* Pagination End */}

      </>
    </HasAccess>
  );
};

export default Roles;
