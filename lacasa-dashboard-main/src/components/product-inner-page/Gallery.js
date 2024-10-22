import React from "react";
import ModalImage from "react-modal-image";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import imageCompression from "browser-image-compression";

const Gallery = ({
  error = "",
  imageUpload,
  setImageUpload,
  deletedImages,
  setDeletedImages,
}) => {
  const handleProductImageDelete = async (e) => {
    const arr = imageUpload;
    const deleted = deletedImages;
    await setImageUpload([]);
    for (let i = 0; i < arr.length; i += 1) {
      if (i === parseInt(e.target.id, 10)) {
        const imgID = e.target.dataset.id;
        arr.splice(i, 1);
        if (imgID) deleted.push(parseInt(imgID, 10));
      }
    }
    setImageUpload(arr);
    setDeletedImages(deleted);
  };

  const handleImage = async (e) => {
    const arr = [];
    if (imageUpload?.length > 0) {
      for (let i = 0; i < imageUpload?.length; i += 1) {
        arr.push(imageUpload[i]);
      }
    }
    for (let i = 0; i < e.target.files.length; i += 1) {
      const imageFile = e.target.files[i];
      const imageOptions = {
        maxSizeMB: 0.59,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        // eslint-disable-next-line
        const compressedFile = await imageCompression(imageFile, imageOptions);
        arr.push(compressedFile);
      } catch (errors) {
        console.log(errors);
      }
    }
    setImageUpload(arr);
  };

  return (
    <Col xl="12">
      {/* Gallery Start */}
      <h2 className="small-title">Gallery</h2>
      <Card className="mb-5">
        <Card.Body>
          <Row>
            <div className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImage} multiple />
              <small className="text text-danger">
                {error.images ?? error.images}
              </small>
              <small className="text text-danger">
                {error.deleted_images ?? error.deleted_images}
              </small>
              {imageUpload?.length > 0 && (
                <Row>
                  {imageUpload.map((image, index) => (
                    <Col sm="4" key={index}>
                      <div className="position-relative mt-3 mb-4 d-flex flex-column">
                        <Button
                          className="delete-Img"
                          id={index}
                          data-id={image?.id}
                          onClick={handleProductImageDelete}
                        >
                          <span>X</span>
                        </Button>
                        <ModalImage
                          className="w-100 border border-primary rounded"
                          small={
                            image instanceof Blob
                              ? URL.createObjectURL(image)
                              : image.url
                          }
                          large={
                            image instanceof Blob
                              ? URL.createObjectURL(image)
                              : image.url
                          }
                          alt="image"
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
            {/* {imageUpload.map((item,index)=>(
              <>
                <Col xl="6" key={item.id} className="mb-5">
                <ModalImage
                className="w-100 border border-primary rounded"
                  small={item.url}
                  large={item.url}
                  alt="image"
                />
                </Col>
                </>
              ))} */}
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Gallery;
