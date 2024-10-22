import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import "./banners.css";
import CreateBanner from "./createbanner/CreateBanner";
import EditBanner from "./editbanner/EditBanner";

import api from "../../../API/API";

const Banner = ({ titleProp, linkProp }) => {
  const title = `${titleProp} List Page`;
  const description = `${titleProp} List Page`;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [bannerId, setBannerId] = useState();

  const customStyles = {
    content: {
      // top: "50%",
      // left: "50%",
      overflowY: 'scroll',
      height: '90%',
      width:'80%',
      margin:'auto',
      // transform: "translate(-50%, -50%)",
    },
  };

  function openModal() {
    setIsOpen(true);
    document.body.style.overflowY = 'hidden';
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    document.body.style.overflowY = 'auto';
  }

  function openEditModal(id) {
    setBannerId(id);
    setEditModalIsOpen(true);
    document.body.style.overflowY = 'hidden';
  }

  function afterOpenEditModal() {
    subtitle.style.color = "#f00";
  }

  function closeEditModal() {
    setEditModalIsOpen(false);
    document.body.style.overflowY = 'auto';
  }

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`${linkProp}`)
      .then(async (response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    api
      .delete(`${linkProp}/${id}`, {"_method": "DELETE"})
      .then((response) => {
        if (response.status === "success") {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

            <HasAccess
              permissions="Edit Settings"
              renderAuthFailed=""
              isLoading="loading..."
            >
              {/* Top Buttons Start */}

              <Col
                xs="12"
                sm="auto"
                className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3"
              >
                <span onClick={openModal}>
                  <Button
                    variant="outline-primary"
                    className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                  >
                    <CsLineIcons icon="plus" />
                    <span>Add {title} Banner</span>
                  </Button>
                </span>
              </Col>
              {/* Top Buttons End */}
            </HasAccess>
          </Row>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={() => afterOpenModal}
          onRequestClose={() => closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="d-flex justify-content-between">
            <h3>Create {titleProp}</h3>
            <span id="close__modal-button" onClick={closeModal}>
              &times;
            </span>
          </div>
          <CreateBanner Link={linkProp} />
        </Modal>

        <Modal
          isOpen={editModalIsOpen}
          onAfterOpen={() => afterOpenEditModal}
          onRequestClose={() => closeEditModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="d-flex justify-content-between">
            <h3>Edit {titleProp}</h3>
            <span id="close__modal-button" onClick={closeEditModal}>
              X
            </span>
          </div>
          <EditBanner Link={linkProp} id={bannerId} />
        </Modal>

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
          <Col md="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">ID</div>
          </Col>
          <Col
            md="3"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              Title
            </div>
          </Col>
          <Col
            md="4"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              IMAGE
            </div>
          </Col>
          <Col
            md="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              EDIT
            </div>
          </Col>
          <Col
            md="1"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              DELETE
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
            {data?.length > 0 ? (
              <>
                {data?.map((item, index) => (
                  <Card className={`mb-2 `} key={item.id}>
                    <Card.Body className="pt-0 pb-0 sh-21 sh-md-8">
                      <Row className="g-0 h-100 align-content-center cursor-default">
                        <Col
                          xs="11"
                          md="2"
                          className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-1 order-md-1 h-md-100 position-relative"
                        >
                          <div className="text-muted text-small d-md-none">
                            Id
                          </div>
                          <NavLink
                            to="/orders/detail"
                            className="text-truncate h-100 d-flex align-items-center"
                          >
                            {item.id}
                          </NavLink>
                        </Col>
                        <Col
                          xs="6"
                          md="3"
                          className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-3 order-md-2"
                        >
                          <div className="text-muted text-small d-md-none">
                            Title
                          </div>
                          <div className="text-alternate">{item.title}</div>
                        </Col>
                        <Col
                          xs="6"
                          md="4"
                          className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-4 order-md-3"
                        >
                          <div className="text-muted text-small d-md-none">
                            Image
                          </div>
                          <div className="text-alternate">
                            <img
                              className="banner-layout"
                              src={`${item?.image?.url}`}
                              alt="banner thumbnail"
                              style={{width:"50px",height:"50px"}}
                            />
                          </div>
                        </Col>
                        <Col
                          xs="6"
                          md="2"
                          className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5"
                        >
                          <HasAccess
                            permissions="Edit Settings"
                            renderAuthFailed=""
                            isLoading="loading..."
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => openEditModal(item.id)}
                              className="btn-icon w-50 btn-icon-start ms-0 ms-sm-1 "
                            >
                              <CsLineIcons icon="edit" />
                            </Button>
                          </HasAccess>
                        </Col>

                        <Col
                          xs="6"
                          md="1"
                          className="d-flex flex-column justify-content-center mb-2 mb-md-0 order-last order-md-5"
                        >
                          <HasAccess
                            permissions="Edit Settings"
                            renderAuthFailed=""
                            isLoading="loading..."
                          >
                            <Button
                              variant="outline-primary"
                              onClick={() => handleDelete(item.id)}
                              className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                            >
                              <CsLineIcons icon="bin" />
                            </Button>
                          </HasAccess>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </>
            ) : (
              <h1 style={{ textAlign: "center", marginTop : "20px" }}>No records to display...</h1>
            )}
          </>
        )}
        {/* List Items End */}
      </>
    </HasAccess>
  );
};

export default Banner;
