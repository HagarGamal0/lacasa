import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import "quill/dist/quill.bubble.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Bars } from "react-loader-spinner";
import { NavLink, useParams } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../API/API";

import "react-toastify/dist/ReactToastify.css";

const ProductsDetail = () => {
  const title = "Shipping Profile Detail";
  const description = "Lacasa Shipping Profile Detail Page";
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState();
  const { id } = useParams();
  const [shippingProviders, setShippingProviders] = useState();
  const [name, setName] = useState();
  const [selectedProvider, setSelectedProvider] = useState();
  const [selectedType, setSelectedType] = useState();

  useEffect(() => {
    const arr = [];
    setLoading(true);
    api
      .readAll(`/world/cities`)
      .then(async (response) => {
        setCities(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .readAll(`/shipping_providers`)
      .then(async (response) => {
        response.data.map((item, index) => {
          arr.push({ value: item.id, label: item.name });
          return arr;
        });
        await setShippingProviders(arr);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, []);

  const onSubmit = async () => {
    const rules = [];
    for (let i = 0; i < cities.length; i += 1) {
      rules.push({
        city_id: i + 1,
        shipping_fee: document.getElementById(`shipping_fee${i}`).value,
        estimated_delivery: document.getElementById(`estimated_delivery${i}`)
          .value,
        is_disabled: document.getElementById(`disabled${i}`).checked,
      });
    }

    const rawData = {
      name,
      rules,
      products: [],
      shipping_provider_id: selectedProvider,
      type: selectedType,
    };
    console.log("raw", rawData);
    api
      .create("/shipping_profiles", rawData)
      .then((response) => {
        if (response.data) {
          window.location.reload();
          toast.success("Shipping Profile Created Successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  console.log("providers", shippingProviders);

  return (
    <HasAccess
      permissions="Edit Settings"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
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
          <Row className="g-0">
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <NavLink
                className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
                to="/shipping"
              >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">
                  Shipping Profile
                </span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
          </Row>
        </div>
        {loading ? (
          <Bars
            height="80"
            width="80"
            color="black"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <>
            <Row>
              <Col xl="12">
                <h2 className="small-title">Shipping Profile Info</h2>
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col xl="4">
                          <div className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" onChange={handleName} />
                          </div>
                        </Col>
                        <Col xl="4">
                          <div className="mb-3">
                            <Form.Label>Shipping Provider</Form.Label>
                            <Select
                              className="input-fields-layout"
                              options={shippingProviders}
                              onChange={(e) => setSelectedProvider(e.value)}
                            />
                          </div>
                        </Col>
                        <Col xl="4">
                          <div className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Select
                              className="input-fields-layout"
                              options={[
                                { value: 2, label: "Heavey" },
                                { value: 1, label: "Light" },
                              ]}
                              onChange={(e) => setSelectedType(e.value)}
                            />
                          </div>
                        </Col>
                      </Row>
                      {cities?.map((item, index) => (
                        <div className="d-flex flex-column" key={item.id}>
                          <Form.Label>{item.name}</Form.Label>
                          <div className="d-flex justify-content-between align-content-center">
                            <Col xl="5">
                              <div className="mb-3">
                                <Form.Control
                                  type="text"
                                  id={`shipping_fee${index}`}
                                  placeholder="Shipping Fees"
                                />
                              </div>
                            </Col>
                            <Col xl="5">
                              <div className="mb-3" key={item.id}>
                                <Form.Control
                                  type="text"
                                  id={`estimated_delivery${index}`}
                                  placeholder="Estimated Delivery"
                                />
                              </div>
                            </Col>
                            <Col xl="1">
                              <label className="form-check w-100 mb-2">
                                <input
                                  type="checkbox"
                                  id={`disabled${index}`}
                                  className="form-check-input"
                                />
                                <span className="form-check-label d-block">
                                  <span className="mb-1 lh-1-25">Disabled</span>
                                </span>
                              </label>
                            </Col>
                          </div>
                        </div>
                      ))}
                    </Form>
                  </Card.Body>
                  <Button
                    variant="outline-primary"
                    onClick={onSubmit}
                    className="btn-icon btn-icon-start w-100 w-md-auto m-5 "
                  >
                    <span>Add</span>
                  </Button>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </>
    </HasAccess>
  );
};

export default ProductsDetail;
