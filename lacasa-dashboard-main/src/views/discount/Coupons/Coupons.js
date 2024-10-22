import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import Modal from "react-modal";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";
import CreateCoupons from "./CreateCoupons/CreateCoupons";
import "react-toastify/dist/ReactToastify.css";

const Coupons = () => {
  const title = "Coupons";
  const description = "Coupons List Page";
  let subtitle;

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isSearched, setIsSearched] = useState(false);
  const [search, setSearch] = useState("");
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "75%",
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
  }

  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/coupons`)
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
      .delete(`/coupons/${id}`)
      .then((response) => {
        toast.success("Coupon Deleted Successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearch = () => {
    setLoading(true);
    api
      .readAll(`/coupons?find[coupon_code]=${search}`)
      .then(async (response) => {
        setData(response.data);
        setLoading(false);
        setIsSearched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!search) {
      setIsSearched(false);
    }
    console.log("search");

    if (!search && isSearched) {
      console.log("inside");

      setLoading(true);
      api
        .readAll(`/coupons`)
        .then(async (response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [search]);

  return (
    <HasAccess
      permissions="View Settings"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={() => afterOpenModal}
            onRequestClose={() => closeModal}
            style={customStyles}
            contentLabel="Create Coupon"
          >
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <h3>Create Coupon</h3>
                <span id="close__modal-button" onClick={closeModal}>
                  &times;
                </span>
              </div>
              <Card>
                <Card.Body>
                  <CreateCoupons />
                </Card.Body>
              </Card>
            </div>
          </Modal>
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
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
            <HasAccess
              permissions="Edit Settings"
              renderAuthFailed=""
              isLoading="loading..."
            >
              <Col
                xs="12"
                sm="auto"
                className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3"
              >
                {/* eslint-disable-next-line */}
                <Button
                  onClick={() => openModal()}
                  variant="outline-primary"
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <CsLineIcons icon="plus" /> <span>Add Coupon</span>{" "}
                </Button>
              </Col>
            </HasAccess>
          </Row>
        </div>

        <Row className="mb-3">
          <Col md="5" lg="5" xxl="5" className="mb-1">
            <div style={{ display: "flex", gap: "3px" }}>
              <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
                <Form.Control
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search"
                />
                <span className="search-magnifier-icon">
                  <CsLineIcons icon="search" />
                </span>
                <span className="search-delete-icon d-none">
                  <CsLineIcons icon="close" />
                </span>
              </div>
              {search ? (
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSearch}
                >
                  Search
                </button>
              ) : (
                <button type="submit" disabled className="btn btn-primary">
                  Search
                </button>
              )}
            </div>
          </Col>
        </Row>

        <Row className="g-0 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
          <Col lg="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small cursor-pointer sort">ID</div>
          </Col>
          <Col
            lg="3"
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
              DISCOUNT
            </div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              PRODUCTS COUNT
            </div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              EXPIRE AT
            </div>
          </Col>
          <Col
            lg="2"
            className="d-flex flex-column pe-1 justify-content-center"
          >
            <div className="text-muted text-small cursor-pointer sort">
              DELETE
            </div>
          </Col>
        </Row>
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
                <NavLink to={`/discount/coupon/detail/${item.id}`}>
                  <Card.Body className="pt-0 pb-0 sh-30 sh-lg-8">
                    <Row
                      className="g-0 h-100 align-content-center"
                      onClick={() => checkItem(1)}
                    >
                      <Col
                        xs="11"
                        lg="1"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 h-lg-100 position-relative"
                      >
                        <div className="text-muted text-small d-lg-none">
                          Id
                        </div>
                        {item.id}
                      </Col>
                      <Col
                        xs="6"
                        lg="3"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2"
                      >
                        <div className="text-muted text-small d-lg-none">
                          Campaign Name
                        </div>
                        <div className="text-alternate">{item.coupon_code}</div>
                      </Col>
                      <Col
                        xs="6"
                        lg="2"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-3"
                      >
                        <div className="text-muted text-small d-lg-none">
                          Discount
                        </div>
                        <div className="text-alternate">
                          {item.discount_value}
                        </div>
                      </Col>
                      <Col
                        xs="6"
                        lg="2"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-4 order-lg-4"
                      >
                        <div className="text-muted text-small d-lg-none">
                          Products Count
                        </div>
                        <div className="text-alternate">
                          {item.discount_type}
                        </div>
                      </Col>
                      <Col
                        xs="6"
                        lg="2"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4"
                      >
                        <div className="text-muted text-small d-lg-none">
                          Expire At
                        </div>
                        <div className="text-alternate">
                          {item.expiry.split(" ")[0]}
                        </div>
                      </Col>
                      <Col
                        xs="6"
                        lg="2"
                        className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4"
                      >
                        <HasAccess
                          permissions="Edit Settings"
                          renderAuthFailed={"You don't have access to delete"}
                          isLoading="loading..."
                        >
                          <NavLink
                            to="/discount/coupons"
                            onClick={() => handleDelete(item.id)}
                          >
                            <div className="text-alternate">
                              <CsLineIcons icon="bin" size="13" />
                            </div>
                          </NavLink>
                        </HasAccess>
                      </Col>
                    </Row>
                  </Card.Body>
                </NavLink>
              </Card>
            ))}
          </>
        )}
      </>
    </HasAccess>
  );
};

export default Coupons;
