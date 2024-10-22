import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

const ProfessionalsCategory = () => {
  const title = "Professionals Category List";
  const description = "Ecommerce Professionals Category List Page";
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState();

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/designers/categories`)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setMeta(response.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
	const formData = new FormData();
	formData.append("_method", "DELETE");
    api
      .delete(`/designers/categories/${id}`, formData)
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
              <a href="/professionals-category/create">
                <Button
                  variant="outline-primary"
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <CsLineIcons icon="plus" />
                  <span>Add Professionals Category</span>
                </Button>
              </a>
            </Col>
            {/* Top Buttons End */}
          </Row>
        </div>

        <Row className="g-0 mb-2 d-none d-lg-flex">
          <Col xs="auto" className="sw-11 d-none d-lg-flex" />
          <Col>
            <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
              <Col
                xs="3"
                lg="3"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">TITLE</div>
              </Col>

              <Col
                xs="3"
                lg="3"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">PROFESSION</div>
              </Col>

              <Col
                xs="2 "
                lg="3"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">EDIT</div>
              </Col>
              <Col
                xs="2  "
                lg="3"
                className="d-flex flex-column mb-lg-0 pe-3 d-flex"
              >
                <div className="text-muted text-small">DELETE</div>
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
              <Card className="mb-2 p-3" key={item.id}>
                <Row className="g-0 h-100 sh-lg-9 position-relative">
                  <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                    <Row className="g-0 h-100 align-content-center">
                      <Col
                        xs="11"
                        lg="3"
                        className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                      >
                        <NavLink
                          to={`/professionals-category/detail/${item.id}`}
                        >
                          <div className="text-small text-muted text-truncate">
                            #{item.id}
                          </div>
						  <small>{item.name}</small>
                        </NavLink>
                      </Col>

                      <Col
                        xs="11"
                        lg="3"
                        className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                      >
                        <small>{item.type}</small>
                      </Col>

                      <Col
                        lg="3"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <HasAccess
                          permissions="Edit Products"
                          renderAuthFailed={"You don't have access to edit"}
                          isLoading="loading..."
                        >
                          <NavLink
                            to={`/professionals-category/detail/${item.id}`}
                          >
                            <div className="lh-1 text-alternate">
                              <CsLineIcons icon="edit" />
                            </div>
                          </NavLink>
                        </HasAccess>
                      </Col>
                      <Col
                        lg="3"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <HasAccess
                          permissions="Edit Products"
                          renderAuthFailed={"You don't have access to delete"}
                          isLoading="loading..."
                        >
                          <div
                            className="lh-1 text-alternate"
                            role="button"
                            tabIndex={index}
                            onClick={() => handleDelete(item.id)}
                          >
                            {" "}
                            <CsLineIcons icon="bin" />
                          </div>
                        </HasAccess>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            ))}
          </>
        )}
        {/* Pagination End */}
      </>
    </HasAccess>
  );
};

export default ProfessionalsCategory;
