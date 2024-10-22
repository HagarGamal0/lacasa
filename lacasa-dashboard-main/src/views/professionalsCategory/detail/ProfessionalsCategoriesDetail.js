import { HasAccess } from "@permify/react-role";
import imageCompression from "browser-image-compression";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import "quill/dist/quill.bubble.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Bars } from "react-loader-spinner";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

import "react-toastify/dist/ReactToastify.css";

const ProfessionalsCategoryDetails = () => {
  const title = "Professionals Category Detail";
  const description = "Lacasa Professionals Category Detail Page";
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [categories, setCategories] = useState();
  const [ImageUpload, setImageUpload] = useState();
  const [banner, setBanner] = useState();
  const [name, setName] = useState();
  const [parentID, setParentID] = useState();
  const [professional, setProfessional] = useState();
  const [arImageUpload, setarImageUpload] = useState();
  const [arname, setarName] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/designers/categories/${id}`)
      .then(async (response) => {
        console.log(response.data);
        setData(response.data);
        setImageUpload(response.data.image_translate.en);
        setarImageUpload(response.data.image_translate.ar);
        setProfessional(response.data.type);
        setBanner(response.data.banner);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .readAll(`/designers/categories`)
      .then(async (response) => {
        const category = [];

        response.data.map((item, index) =>
          category.push({ value: item.id, label: item.name })
        );
        await setCategories(category);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setImageUpload(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };
  console.log(ImageUpload);

  const handleBanner = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setBanner(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlearImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setarImageUpload(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };
  const handlearName = (e) => {
    setarName(e.target.value);
  };

  const handleParentID = (e) => {
    setParentID(e.target.value);
  };
  const handleProfessional = (e) => {
    setProfessional(e.target.value);
  };
  console.log(professional);
  const professionals = { Designer: 1, Supplier: 2 };
  const formData = new FormData();
  const onSubmit = async () => {
    setLoading(true);
    formData.append("name[en]", name !== "" ? name : data.name_trnaslate.en);
    formData.append("name[ar]", arname !== "" ? arname : data.name_translate.ar);
    formData.append("type", professionals[professional]);
    formData.append("_method", "PATCH");
    api
      .create(`/designers/categories/${id}`, formData)
      .then((response) => {
        if (response.message) {
          toast.error(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setLoading(false);
        } else {
          toast.success("Category Saved!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <HasAccess
      permissions="Edit Products"
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
            {/* Title Start */}
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <NavLink
                className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
                to="/categories"
              >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Categories</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}
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
                {/* Category Info Start */}
                <h2 className="small-title">Category Info</h2>
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              defaultValue={`${data?.name_translate.en}`}
                              onChange={handleName}
                            />
                          </div>
                          <div className="mb-3">
                            <Form.Label>Professional</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              onChange={handleProfessional}
                              value={professional}
                            >
                              {[
                                { label: "Designer", value: "Designer" },
                                { label: "Supplier", value: "Supplier" },
                              ].map((item, index) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </Col>

                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Arabic Name</Form.Label>
                            <Form.Control
                              type="text"
                              defaultValue={`${data?.name_translate.ar}`}
                              onChange={handlearName}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                {/* Category Info End */}
                <Row className="d-flex justify-content-end">
                  <Col xl="3">
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={onSubmit}
                    >
                      Save
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </>
    </HasAccess>
  );
};

export default ProfessionalsCategoryDetails;
