import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { Bars } from "react-loader-spinner";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import imageCompression from "browser-image-compression";
import api from "../../API/API";

function Gallery() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleImage = async (e) => {
    const imageFiles = Object.values(e.target.files);
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFiles = [];
    try {
      imageFiles.forEach(async (imageFile, index) => {
        const compressedFile = await imageCompression(imageFile, options);
        compressedFiles.push(compressedFile);
        if (index === imageFiles.length - 1) setUploadedImages(compressedFiles);
      });
    } catch (errorss) {
      console.log(errorss);
    }
  };
  useEffect(() => {
    try {
      setLoading(true);
      api.readAll(`/Gallery`).then((res) => {
        console.log("res", res);
        if (res.message) {
          toast.error(res.message, {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        setImages(res?.data);
      });
    } catch (error) {
      console.log(error.message);
      toast.success(error.message, {
        position: "top-right",

        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    const formData = new FormData();
    uploadedImages.forEach((uploadedImage, index) => {
      formData.append(`images[${index}]`, uploadedImage);
    });

    api
      .create(`/Gallery/upload`, formData)
      .then((response) => {
        console.log(response);
        if (response.errors) {
          toast.success(response.errors, {
            position: "top-right",

            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          console.log("success");
          window.location.reload();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.success(err.message, {
          position: "top-right",

          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  function copyText(e) {
    console.log(e.target.innerText);

    const temporaryInput = document.createElement("input");
    temporaryInput.value = e.target.innerText;
    document.body.appendChild(temporaryInput);

    temporaryInput.select();
    temporaryInput.setSelectionRange(0, 99999); // For mobile devices

    document.execCommand("copy");

    document.body.removeChild(temporaryInput);

    // You can optionally provide user feedback here, such as changing the span's content briefly
  }

  const tooltip = (
    <Tooltip id="tooltip">
      <strong>copy</strong>
    </Tooltip>
  );

  console.log("uploadedImages", uploadedImages);
  return (
    <HasAccess
      permissions="View Products"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
        <HtmlHead title="Gallery" description="Gallery Page" />
        <Col className="col-auto mb-3 mb-sm-0 me-auto">
          <NavLink
            className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
            to="/"
          >
            <CsLineIcons icon="chevron-left" size="13" />
            <span className="align-middle text-small ms-1">Home</span>
          </NavLink>
          <h1 className="mb-0 pb-0 display-4" id="title">
            Gallery
          </h1>
        </Col>
        <div className="d-flex mt-3">
          <Form.Control
            label="coose multiple images"
            type="file"
            multiple
            onChange={handleImage}
          />
          <Button
            disabled={!uploadedImages.length}
            onClick={onSubmit}
            variant="outline-primary"
            className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
          >
            <CsLineIcons icon="plus" />
            <span>Upload</span>
          </Button>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {loading && (
            <div
              style={{
                background: "transparent",
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: "100vw",
              }}
              className="d-flex justify-content-center align-items-center h-100"
            >
              <Bars
                height="80"
                width="80"
                color="black"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          {images?.map((image, index) => (
            <div style={{ padding: "20px" }} key={index}>
              <Image
                style={{
                  width: "200px",
                  height: "200px",
                  display: "block",
                }}
                src={image?.url}
                thumbnail
              />
              <OverlayTrigger placement="bottom" overlay={tooltip}>
                <div
                  onClick={(e) => copyText(e)}
                  style={{
                    cursor: "pointer",
                    display: "block",
                    maxWidth: "200px" /* Set your desired maximum width */,
                    whiteSpace: "nowrap",
                    overflow: "hidden" /* Hide overflowed text */,
                    textOverflow: "ellipsis",
                  }}
                >
                  {image?.url}
                </div>
              </OverlayTrigger>
            </div>
          ))}
        </div>
      </>
    </HasAccess>
  );
}

export default Gallery;
