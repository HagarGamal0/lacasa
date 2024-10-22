import { HasAccess } from "@permify/react-role";
import imageCompression from "browser-image-compression";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Bars } from "react-loader-spinner";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../../API/API";
import "./EditBanner.css";

const Banner = ({ Link, id }) => {
  const [loading, setLoading] = useState(false);
  const [ImageUpload, setImageUpload] = useState();
  const [mobileImageUpload, setMobileImageUpload] = useState();
  const [link, setLink] = useState();
  const [title, setTitle] = useState();
  const [error, setError] = useState();
  const [arImageUpload, setIarmageUpload] = useState();
  const [armobileImageUpload, setarMobileImageUpload] = useState();
  const [artitle, setarTitle] = useState();
  const [bannerData, setBannerData] = useState();
  const [order, setOrder] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const formData = new FormData();
  const onSubmit = async (data) => {
    formData.append("title[en]", title);

    if (arImageUpload instanceof Blob) {
      formData.append("image[ar]", arImageUpload);
    }
    formData.append("title[ar]", artitle);
    if (ImageUpload instanceof Blob) {
      formData.append("image[en]", ImageUpload);
    }
    formData.append("link", link);

    if (mobileImageUpload instanceof Blob) {
      formData.append("mobile_image[en]", mobileImageUpload);
    }

    if (armobileImageUpload instanceof Blob) {
      formData.append("mobile_image[ar]", armobileImageUpload);
    }
    formData.append("order", order);
    formData.append("_method", "PATCH");
    api
      .update(Link, formData, id)
      .then((response) => {
        if (response.errors) {
          setError(response?.errors);
        } else {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    setLoading(true);
    api
      .readAll(`${Link}/${id}`)
      .then(async (response) => {
        setBannerData(response.data);
        setLink(response.data?.link);
        setTitle(response.data?.title);
        setarTitle(response.data?.title_translate.ar);
        setImageUpload( response.data.image_translate.en?.url );
        setIarmageUpload( response.data.image_translate.ar?.url );
        setMobileImageUpload( response.data.mobile_image_translate.en?.url);
        setarMobileImageUpload(response.data.mobile_image_translate.ar?.url);
        setOrder(response.data?.order);

        setLoading(false);

      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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

  const handlearImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setIarmageUpload(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handleMobileImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setMobileImageUpload(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handlearMobileImage = async (e) => {
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setarMobileImageUpload(compressedFile);
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handleLink = (e) => {
    setLink(e.target.value);
  };
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handlearTitle = (e) => {
    setarTitle(e.target.value);
  };

  const handleOrder = (e) => {
    setOrder(e.target.value);
  };
  return (
    <HasAccess
      permissions="Edit Settings"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
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
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col xl="5" className="d-flex flex-column">
                          <Form.Label>Image</Form.Label>
                          {ImageUpload &&
                          <Image
                            src={
                              ImageUpload instanceof Blob
                                ? URL.createObjectURL(ImageUpload)
                                : ImageUpload
                            }
                            thumbnail
                            style={{marginBottom:'10px'}}
                          />}
                          <Form.Control type="file" onChange={handleImage} />
                        </Col>
                        <Col xl="2">
                          <div className="vr">
                            <br />
                          </div>
                        </Col>
                        <Col xl="5" className="d-flex flex-column">
                          <Form.Label>Mobile Image (Optional)</Form.Label>
                          {mobileImageUpload &&
                          <Image
                            src={
                              mobileImageUpload instanceof Blob
                                ? URL.createObjectURL(mobileImageUpload)
                                : mobileImageUpload
                            }
                            thumbnail
                            style={{marginBottom:'10px'}}
                          />}
                          <Form.Control
                            type="file"
                            onChange={handleMobileImage}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col xl="5" className="d-flex flex-column">
                          <Form.Label>Arabic Image</Form.Label>
                          {arImageUpload && <Image
                            src={
                              arImageUpload instanceof Blob
                                ? URL.createObjectURL(arImageUpload)
                                : arImageUpload
                            }
                            thumbnail
                            style={{marginBottom:'10px'}}
                          />}
                          <Form.Control type="file" onChange={handlearImage} />
                        </Col>
                        <Col xl="2">
                          <div className="vr">
                            <br />
                          </div>
                        </Col>
                        <Col xl="5" className="d-flex flex-column">
                          <Form.Label>
                            Arabic Mobile Image (Optional)
                          </Form.Label>
                          {armobileImageUpload &&
                          <Image
                            src={
                              armobileImageUpload instanceof Blob
                                ? URL.createObjectURL(armobileImageUpload)
                                : armobileImageUpload
                            }
                            thumbnail
                            style={{marginBottom:'10px'}}
                          />}
                          <Form.Control
                            type="file"
                            onChange={handlearMobileImage}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-5">
                        <Col xl="12">
                          <div className="mb-3">
                            <Form.Label>Link</Form.Label>
                            <Form.Control
                              type="text"
                              onChange={handleLink}
                              defaultValue={bannerData?.link}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-5">
                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              onChange={handleTitle}
                              defaultValue={bannerData?.title}
                            />
                          </div>
                        </Col>

                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Arabic Title</Form.Label>
                            <Form.Control
                              type="text"
                              onChange={handlearTitle}
                              defaultValue={bannerData?.title}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-5">
                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Order</Form.Label>
                            <Form.Control type="number" onChange={handleOrder} defaultValue={bannerData?.order} />
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-5">
                        <div className="d-flex justify-content-end">
                          <Button
                            onClick={onSubmit}
                            variant="outline-primary"
                            className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                          >
                            <CsLineIcons icon="save" />
                            <span>Save</span>
                          </Button>
                        </div>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </>
    </HasAccess>
  );
};

export default Banner;
