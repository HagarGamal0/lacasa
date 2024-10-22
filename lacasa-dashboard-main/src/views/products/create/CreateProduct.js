import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import Attributes from "components/product-inner-page/Attributes";
import Gallery from "components/product-inner-page/Gallery";
import Inventory from "components/product-inner-page/Inventory";
import Price from "components/product-inner-page/Price";
import ProductInfo from "components/product-inner-page/ProductInfo";
import Tags from "components/product-inner-page/Tags";
import Metalinks from "components/product-inner-page/Metalinks";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useForm } from "react-hook-form";
import { Bars } from "react-loader-spinner";
import { NavLink, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";
import "./products.css";

import "react-toastify/dist/ReactToastify.css";

const ProductsDetail = () => {
  const history = useHistory();
  const title = "Product Detail";
  const description = "Lacasa Product Detail Page";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const { register, handleSubmit } = useForm();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [productName, setProductName] = useState("");
  const [editorDescState, setEditorDescState] = useState();
  const [editorState, setEditorState] = useState();
  const [arproductName, setarProductName] = useState("");
  const [areditorDescState, setarEditorDescState] = useState();
  const [areditorState, setarEditorState] = useState();
  const [categoryID, setCategoryID] = useState([]);
  const [vendorID, setVendorID] = useState("");
  const [itemOrder, setItemOrder] = useState("");
  const [stock, setStock] = useState();

  const [attributeData, setAttributeData] = useState([]);
  const [totalNewTags, setTotalNewTags] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [imageUpload, setImageUpload] = useState();
  const [deletedImages, setDeletedImages] = useState([]);
  const [sku, setSku] = useState("");
  const [featured, setFeatured] = useState();
  const [productBrand, setProductBrand] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [urlSlug, setUrlSlug] = useState("");
  const [metakeys, setMetakeys] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");



  const onSubmit = () => {
    const formData = new FormData();
    formData.append("name[en]", productName);
    if (editorDescState) {
      formData.append(
        "description[en]",
        draftToHtml(convertToRaw(editorDescState.getCurrentContent()))
      );
    }
    if (editorState) {
      formData.append(
        "short_description[en]",
        draftToHtml(convertToRaw(editorState.getCurrentContent()))
      );
    }

    formData.append("name[ar]", arproductName);
    if (editorDescState) {
      formData.append(
        "description[ar]",
        draftToHtml(convertToRaw(areditorDescState.getCurrentContent()))
      );
    }
    if (editorState) {
      formData.append(
        "short_description[ar]",
        draftToHtml(convertToRaw(areditorState.getCurrentContent()))
      );
    }
    if(itemOrder){
      formData.append("item_order", itemOrder);
    }
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("discount_type", discountType);
    formData.append("featured", featured);
    formData.append("stock", quantity);
    formData.append("urlSlug", urlSlug);
    formData.append("metakeys", metakeys);
    formData.append("metaDesc", metaDesc);
    formData.append("metaTitle", metaTitle);

    if (totalNewTags !== undefined) {
      for (let i = 0; i < totalNewTags.length; i += 1) {
        formData.append(`tags[${i}][name]`, totalNewTags[i]);
      }
    }
    formData.append("brand", productBrand);
    formData.append("vendor_id", vendorID);
    for (let i = 0; i < categoryID.length; i += 1) {
      formData.append("categories[]", categoryID[i]);
    }
    for (let i = 0; i < deletedImages.length; i += 1) {
      formData.append("deleted_images[]", deletedImages[i]);
    }
    if (imageUpload) {
      for (let i = 0; i < imageUpload.length; i += 1) {
        if (imageUpload[i] instanceof Blob) {
          formData.append("images[]", imageUpload[i]);
        }
      }
    }
    if (attributeData.length > 0) {
      for (let i = 0; i < attributeData.length; i += 1) {
        formData.append(`attributes[${i}][name]`, attributeData[i].key);
        if (attributeData[i].value.length <= 0) {
          formData.append(`attributes[${i}][values][0][title]`, 0);
        }
        attributeData[i].value.map((item, index) => {
          formData.append(
            `attributes[${i}][values][${index}][title]`,
            item.value
          );
          if (item.price > 0) {
            formData.append(
              `attributes[${i}][values][${index}][price]`,
              item.price
            );
            formData.append(
              `attributes[${i}][values][${index}][price_after_sale]`,
              item.price_after_sale
            );
          } else if (item.price === null) {
            console.log();
          }
          return 1;
        });
      }
    } else {
      formData.append(`attributes`, attributeData);
    }
    api
      .create(`/products`, formData)
      .then((response) => {
        if (response.data) {
          toast.success("Product Created Successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          history.push(`/products/list`);
        } else {
          // eslint-disable-next-line no-use-before-define
          handleErrorResponse(response?.errors);
        }
      })
      .catch((err) => console.log(err));

    const handleErrorResponse = (errors) => {
      // Show toast message for each error
      Object.values(errors).forEach((errorArray) => {
        errorArray.forEach((errorMessage) => {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
      });
    };
  };

  return (
    <HasAccess
      permissions="Edit Products"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
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
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
          <Row className="g-0">
            {/* Title Start */}
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <NavLink
                className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
                to="/products"
              >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Products</span>
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                <Col xl="8">
                  {/* Product Info Start */}
                  <ProductInfo
                    productName={productName}
                    arproductName={arproductName}
                    setProductName={setProductName}
                    setarProductName={setarProductName}
                    editorDescState={editorDescState}
                    areditorDescState={areditorDescState}
                    areditorState={areditorState}
                    editorState={editorState}
                    setEditorDescState={setEditorDescState}
                    setarEditorDescState={setarEditorDescState}
                    setEditorState={setEditorState}
                    setarEditorState={setarEditorState}
                    setCategoryID={setCategoryID}
                    setVendorID={setVendorID}
                    setItemOrder={setItemOrder}
                    error={error}
                  />
                  <h2 className="small-title">Attributes</h2>
                  <Card className="mb-5">
                    <Card.Body>
                      <Attributes
                        attributeData={attributeData}
                        setAttributeData={setAttributeData}
                        totalNewTags={totalNewTags}
                        setTotalNewTags={setTotalNewTags}
                      />
                    </Card.Body>
                  </Card>
                  <h2 className="small-title">Tags</h2>
                  <Card className="mb-5">
                    <Card.Body>
                      <Tags
                        totalNewTags={totalNewTags}
                        setTotalNewTags={setTotalNewTags}
                      />
                    </Card.Body>
                  </Card>
                  {/* Attributes End */}
                </Col>

                <Col xl="4">
                  <Price
                    setPrice={setPrice}
                    price={price}
                    discount={discount}
                    discountType={discountType}
                    setDiscount={setDiscount}
                    setDiscountType={setDiscountType}
                    error={error}
                  />
                  <Gallery
                    imageUpload={imageUpload}
                    setImageUpload={setImageUpload}
                    deletedImages={deletedImages}
                    setDeletedImages={setDeletedImages}
                    error={error}
                  />
                  <Inventory
                    setQuantity={setQuantity}
                    setSku={setSku}
                    setFeatured={setFeatured}
                    setStock={setStock}
                    setProductBrand={setProductBrand}
                    error={error}
                  />
                  <Metalinks setUrlSlug={setUrlSlug}
                    setMetakeys={setMetakeys}
                    setMetaDesc={setMetaDesc}
                    setMetaTitle={setMetaTitle}
                    error={error}
                  />
                </Col>
              </Row>
              <Row className="d-flex justify-content-end">
                <Col xl="3">
                  <button type="submit" className="btn btn-primary">
                    <CsLineIcons icon="save" /> <span>Save</span>
                  </button>
                </Col>
              </Row>
            </form>
          </>
        )}
      </>
    </HasAccess>
  );
};

export default ProductsDetail;
