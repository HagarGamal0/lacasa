import { HasAccess } from "@permify/react-role";
import imageCompression from "browser-image-compression";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import "quill/dist/quill.bubble.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Bars } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

import "react-toastify/dist/ReactToastify.css";

const ProductsDetail = () => {
  const title = "Category Detail";
  const description = "Lacasa Category Detail Page";
  const [loading, setLoading] = useState(false);
  const [ImageUpload, setImageUpload] = useState();
  const [banner, setBanner] = useState();
  const [arbanner, setarBanner] = useState();
  const [categories, setCategories] = useState();
  const [name, setName] = useState("");
  const [arname, setarName] = useState("");
  const [parentID, setParentID] = useState();
  const [showInMenu, setShowInMenu] = useState(0);
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/categories`)
      .then(async (response) => {
        const category = [];

        // response.data.map((item, index) => {
        //   if (item.childs.length > 0) {
        //     item.childs.map((itemChild) => {
        //       category.push({ value: itemChild.id, label: itemChild.name });
        //       return category;
        //     });
        //   }
        //   category.push({ value: item.id, label: item.name });

        //   return category;
        // });

        response.data.map((item, index) =>
          category.push({ value: item.id, label: item.name })
        );
        await setCategories(category);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }, []);

  const handleCheck = (e) => {
    const checkedmenu = e.target.checked;
    if(checkedmenu){
      setShowInMenu(1);
    }else{
      setShowInMenu(0);
    }
  };

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

  const handlearBanner = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setarBanner(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlearName = (e) => {
    setarName(e.target.value);
  };

  const handleParentID = (e) => {
    setParentID(e.target.value);
  };

  const formData = new FormData();
  const onSubmit = async () => {
    formData.append("name[en]", name);
    formData.append("name[ar]", arname);
    formData.append("banner[en]", banner);
    formData.append("banner[ar]", arbanner);
    formData.append("image", ImageUpload);
    formData.append("show_in_menu",showInMenu);
    if (parentID !== undefined) {
      formData.append("parent_id", parentID);
    }
    api
      .create("/categories", formData)
      .then((response) => {
        if (response.data) {
          toast.success("Category Created Successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          console.log(response.erros);
          setError(response?.errors);
        }
      })
      .catch((err) => {
        console.log(err);
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
                            <Form.Control type="text" onChange={handleName} />
                            <small className="text-danger">
                              {error && error.name ? error.name : ""}
                            </small>
                          </div>

                          <div className="mb-3">
                            <Form.Label>Arabic Name</Form.Label>
                            <Form.Control type="text" onChange={handlearName} />
                            <small className="text-danger">
                              {error && error.arname ? error.arname : ""}
                            </small>
                          </div>
                        </Col>
                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Parent ID</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              onChange={handleParentID}
                            >
                              <option hidden>Assign a new parent ID</option>
                              {categories?.map((item, index) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        </Col>
                        <Col xl="5">
                          <label className="form-check w-100 mb-2">
                            <input
                              type="checkbox"
                              id="showInMenu"
                              className="form-check-input"
                              onChange={handleCheck}
                            />
                            <span className="form-check-label d-block">
                              <span className="mb-1 lh-1-25">Show In Menu</span>
                            </span>
                          </label>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col xl="5" className="d-flex flex-column mb-2">
                          <Form.Label>Image</Form.Label>
                          {
                          ImageUpload instanceof Blob &&
                          <Image
                            src={
                              ImageUpload instanceof Blob
                                ? URL.createObjectURL(ImageUpload)
                                : ImageUpload
                            }
                            style={{width:'200px',height:'200px',marginBottom:'5px'}}
                            thumbnail
                          />
                          }
                          <Form.Control type="file" onChange={handleImage} />
                          <small className="text-danger">
                            {error && error.image ? error.image : ""}
                          </small>
                        </Col>
                        <Col xl="2">
                          <div className="vr">
                            <br />
                          </div>
                        </Col>
                        <Col xl="5" className="d-flex flex-column mb-2">
                          <Form.Label>Banner</Form.Label>
                          {banner instanceof Blob &&
                          <Image
                            src={
                              banner instanceof Blob
                                ? URL.createObjectURL(banner)
                                : banner
                            }
                            style={{width:'200px',height:'200px',marginBottom:'5px'}}
                            thumbnail
                          />}
                          <Form.Control type="file" onChange={handleBanner} />
                          <small className="text-danger">
                            {error && error.banner ? error.banner : ""}
                          </small>
                        </Col>

                        <Col xl="5" className="d-flex flex-column mb-2">
                          <Form.Label>Arabic Banner</Form.Label>
                          {  arbanner instanceof Blob &&
                          <Image src={
                              arbanner instanceof Blob
                                ? URL.createObjectURL(arbanner)
                                : arbanner
                            }
                            style={{width:'200px',height:'200px',marginBottom:'5px'}}
                            thumbnail
                          />}
                          <Form.Control type="file" onChange={handlearBanner} />
                          <small className="text-danger">
                            {error && error.arbanner ? error.arbanner : ""}
                          </small>
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

export default ProductsDetail;
