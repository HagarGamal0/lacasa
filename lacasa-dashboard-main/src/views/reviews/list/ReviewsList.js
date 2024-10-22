import { HasAccess } from '@permify/react-role';
import HtmlHead from 'components/html-head/HtmlHead';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner';
import ReactPaginate from 'react-paginate';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';
import Stars from '../components/Stars';

const Reviews = () => {
  const title = 'Reviews List';
  const description = 'Ecommerce Reviews List Page';
  const [data, setData] = useState();
  const [meta, setMeta] = useState();
  const [status, setStatus] = useState('Pending')
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/reviews?page=${page}&find[status]=${status}`)
      .then(async (response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [status, page]);

  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };
  const handleApprove = (id) => {
    api
      .create(`/reviews/${id}/approve`)
      .then((response) => {
        if (response.data) {
          toast.success('Review Approved!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      })
  };

  const handleReject = (id) => {
    api
      .create(`/reviews/${id}/reject`)
      .then((response) => {
        if (response.data) {
          toast.success('Review Rejected!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      })
  };
  return (
    <HasAccess roles="Super Admin" renderAuthFailed={<Unauthorized />} isLoading="loading...">
      <>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
          <Row className="g-0">
            {/* Title Start */}
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}

          </Row>
        </div>


        <Row>
          <Col xl="6">
            {/* eslint-disable-next-line */}
            <select className="form-select form-select-sm form-select-box-shadow w-25 me-3 mb-5 text-dark font-weight-bold" onChange={e => setStatus(e.target.value)}>
              <option value='Pending'>Pending</option>
              <option value='Approved'>Approved</option>
              <option value='Rejected'>Rejected</option>
            </select>
          </Col>
        </Row>
        {/* List Header Start */}
        <Row className="g-0 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort align-items-center">
          <Col md="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">ID</div>
          </Col>
          <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">TITLE</div>
          </Col>
          <Col md="3" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">DESCRIPTION</div>
          </Col>
          <Col md="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">USER</div>
          </Col>
          <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">PRODUCT IMAGE</div>
          </Col>
          <Col md="1" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">RATING</div>
          </Col>
          <Col md="2" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small cursor-pointer sort">APPROVE</div>
          </Col>
        </Row>
        {/* List Header End */}

        {/* List Items Start */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
          </div>
        ) : (
          <>
            {data?.map((item, index) => (
              <Card className='mb-2 p-3' key={item.id}>
                <Card.Body className="pt-0 pb-0">
                  <Row className="g-0 h-100 align-items-center cursor-default">
                    <Col xs="1" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative">
                      <div className="text-muted text-small d-md-none">Id</div>
                      {item.id}
                    </Col>
                    <Col xs="2" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-2 order-md-2">
                      <div className="text-muted text-small d-md-none">Title</div>
                      <div className="text-alternate">{item.content.title}</div>
                    </Col>
                    <Col xs="3" md="3" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-3">
                      <HasAccess roles="Super Admin" renderAuthFailed={"You don't have access to edit"} isLoading="loading...">
                        <div className="text-muted text-small d-md-none">Description</div>
                        <div className="text-alternate pe-2"><p>{item.content.description}</p></div>
                      </HasAccess>
                    </Col>
                    <Col xs="1" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-4 h-md-100 position-relative">
                      <div className="text-muted text-small d-md-none">User</div>
                      {item.user.name}
                    </Col>
                    <Col xs="2" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5">
                      <HasAccess roles="Super Admin" renderAuthFailed={"You don't have access to edit"} isLoading="loading...">
                        <div className="text-muted text-small d-md-none">Product Image</div>
                        <NavLink to={`/products/detail/${item.product.slug}`} className="text-truncate h-100 d-flex align-items-center body-link">
                          <img src={`${item.product.image.url}`} alt="product logo" className="w-25" />
                        </NavLink>
                      </HasAccess>
                    </Col>
                    <Col xs="1" md="1" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5">
                      <div className="lh-1 text-alternate">
                        <Stars n={item.stars} />
                      </div>
                    </Col>
                    <Col xs="2" md="2" className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-5 order-md-5">
                      <div className="lh-1 text-alternate ">
                        {item.status === 'approved' ? '' :
                          <button type="button" className="btn btn-primary px-2 mx-1" onClick={(e) => handleApprove(item.id)}>Approve</button>}
                        {item.status === 'rejected' ? '' :
                          <button type="button" className="btn btn-danger px-2" onClick={(e) => handleReject(item.id)}>Reject</button>}
                      </div>
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
            pageCount={meta?.last_page > 0 ? meta?.last_page : 1}
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

export default Reviews;
