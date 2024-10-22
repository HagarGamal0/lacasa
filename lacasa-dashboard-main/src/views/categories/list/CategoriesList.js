import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

const ProductsList = () => {
  const title = "Category List";
  const description = "Ecommerce Category List Page";
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState();

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/categories`)
      .then((response) => {
        setData(response.data);
        setMeta(response.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }, []);

  const displayChilds = (id) => {
    const child = document.getElementsByClassName(`child${id}`);
    for (let i = 0; i < child.length; i += 1) {
      if (child[i].style.display === "none" || child[i].style.display === "") {
        child[i].style.display = "block";
      } else {
        child[i].style.display = "none";
      }
    }
  };
  const handleDelete = (id) => {
    api
      .delete(`/categories/${id}`)
      .then((response) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <HasAccess
      permissions="View Products"
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
              <a href="/categories/create">
                <Button
                  variant="outline-primary"
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <CsLineIcons icon="plus" />
                  <span>Add Category</span>
                </Button>
              </a>
            </Col>
            {/* Top Buttons End */}
          </Row>
        </div>

        <Row className="g-0 mb-2 d-none d-lg-flex">
          <Col xs="2" lg="2" className="sw-11 d-none d-lg-flex" />
          <Col>
            <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
              <Col
                xs="2"
                lg="1"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">TITLE</div>
              </Col>
              <Col
                  xs="2"
                  lg="2"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">SLUG</div>
              </Col>
              <Col
                  xs="2"
                  lg="2"
                  className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">Products count</div>
              </Col>

              <Col
                  xs="2"
                  lg="2"
                  className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">Price average</div>
              </Col>
              <Col
                xs="1"
                lg="1"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">EDIT</div>
              </Col>
              <Col
                xs="1  "
                lg="1"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">DELETE</div>
              </Col>
              <Col
                xs="2"
                lg="2"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">SUB-CATEGORIES</div>
              </Col>
            </Row>
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
              <Card className={`mb-2 `} key={item.id}>
                <Row className="g-0 h-100 sh-lg-9 position-relative">
                  <Col xs="1" lg="1" className="position-relative ">
                    <NavLink to={`/categories/detail/${item.slug}`}>
                      <img
                        src={`${item.image}`}
                        alt="product broken image"
                        className="card-img card-img-horizontal sh-9 sw-11 h-100"
                      />
                    </NavLink>
                  </Col>

                  <Col className="py-4 py-lg-0  pe-4 h-100">
                    <Row className="g-0 h-100 align-content-center">
                      <Col
                        xs="1"
                        lg="1"
                        className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                      >
                        <NavLink to={`/categories/detail/${item.slug}`}>
                          <small>{item.name}</small>
                          <div className="text-small text-muted text-truncate">
                            #{item.id}
                          </div>
                        </NavLink>
                      </Col>

                      <Col
                          xs="2"
                          lg="2"
                          className="d-flex flex-column pe-1 mb-2 mb-lg-0 ps-4 justify-content-center order-3"
                      >
                        <div className="lh-1 text-alternate">{item.slug}</div>
                      </Col>

                      <Col
                          xs="2"
                          lg="2"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <div className="lh-1 text-alternate">{item.products_count}</div>
                      </Col>

                      <Col
                          xs="2"
                          lg="2"
                          className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <div className="lh-1 text-alternate">{item.price_average}</div>
                      </Col>


                      <Col
                        lg="1"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <HasAccess
                          permissions="Edit Products"
                          renderAuthFailed={
                            "You don't have access to edit categories or products."
                          }
                          isLoading="loading..."
                        >
                          <NavLink to={`/categories/detail/${item.slug}`}>
                            <div className="lh-1 text-alternate">
                              <CsLineIcons icon="edit" />
                            </div>
                          </NavLink>
                        </HasAccess>
                      </Col>
                      <Col
                        lg="1"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <HasAccess
                          permissions="Edit Products"
                          renderAuthFailed={
                            "You don't have access to delete categories or products."
                          }
                          isLoading="loading..."
                        >
                          {item.childs.length > 0 ? (
                            "Delete SUB-CATEGORIES First"
                          ) : (
                            <div
                              className="lh-1 text-alternate"
                              role="button"
                              tabIndex={index}
                              onClick={() => handleDelete(item.id)}
                            >
                              {" "}
                              <CsLineIcons icon="bin" />
                            </div>
                          )}
                        </HasAccess>
                      </Col>
                      <Col
                        lg="2"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <button
                          type="button"
                          className="lh-1 text-alternate button_no_style"
                          onClick={() => displayChilds(index)}
                        >
                          &#65086;
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {item.childs.length > 0 ? (
                  item.childs.map((children, indexChildren) => (
                    <Row
                      className={`g-0 h-100 sh-lg-9 position-relative hidden child${index}`}
                      key={indexChildren}
                    >
                      <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                        <Row className="g-0 h-100 align-content-center">
                          <Col
                              xs="2"
                              lg="2"
                            className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-1"
                          >
                            <NavLink to={`/categories/detail/${children.slug}`}>
                              <img
                                src={`${children.image}`}
                                alt="product broken image"
                                className="card-img card-img-horizontal sh-9 sw-11 h-100"
                              />
                            </NavLink>
                          </Col>
                          <Col
                            xs="11"
                            lg="2"
                            className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex h-lg-100 justify-content-center order-3"
                          >
                            <NavLink to={`/categories/detail/${children.slug}`}>
                              <small>{children.name}</small>
                              <div className="text-small text-muted text-truncate">
                                #{children.id}
                              </div>
                            </NavLink>
                          </Col>
                          <Col
                            lg="2"
                            className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                          >
                            <div className="lh-1 text-alternate">
                              {children.slug}
                            </div>
                          </Col>

                          <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                          >
                            <div className="lh-1 text-alternate">
                              {children.products_count}
                            </div>
                          </Col>
                          <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                          >
                            <div className="lh-1 text-alternate">
                              {children.price_average}
                            </div>
                          </Col>
                          <Col
                            lg="1"
                            className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                          >
                            <HasAccess
                              permissions="Edit Products"
                              renderAuthFailed={
                                "You don't have access to edit categories or products."
                              }
                              isLoading="loading..."
                            >
                              <NavLink to={`/categories/detail/${children.slug}`}>
                                <div className="lh-1 text-alternate">
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </HasAccess>
                          </Col>
                          <Col
                            lg="1"
                            className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                          >
                            <HasAccess
                              permissions="Edit Products"
                              renderAuthFailed={
                                "You don't have access to delete categories or products."
                              }
                              isLoading="loading..."
                            >
                              <div
                                className="lh-1 text-alternate"
                                role="button"
                                tabIndex={indexChildren}
                                onClick={() => handleDelete(children.id)}
                              >
                                <CsLineIcons icon="bin" />
                              </div>
                            </HasAccess>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <></>
                )}
              </Card>
            ))}
          </>
        )}
        {/* Pagination End */}
      </>
    </HasAccess>
  );
};

export default ProductsList;
