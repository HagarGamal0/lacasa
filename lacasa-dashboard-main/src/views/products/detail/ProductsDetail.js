import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import Attributes from "components/product-inner-page/Attributes";
import Gallery from "components/product-inner-page/Gallery";
import Inventory from "components/product-inner-page/Inventory";
import Price from "components/product-inner-page/Price";
import ProductInfo from "components/product-inner-page/ProductInfo";
import Status from "components/product-inner-page/Status";
import Tags from "components/product-inner-page/Tags";
import Metalinks from "components/product-inner-page/Metalinks";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { convertFromHTML } from "draft-convert";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "quill/dist/quill.bubble.css";
import React, { useEffect, useState } from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useForm } from "react-hook-form";
import { Bars } from "react-loader-spinner";
import { NavLink, useHistory, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";
import ActivityLog from "./components/ActivityLog";
import "./products.css";

const ProductsDetail = () => {
  const history = useHistory();
  const title = "Product Detail";
  const description = "Lacasa Product Detail Page";
  const [error, setError] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [editorDescState, setEditorDescState] = useState("");
  const [editorState, setEditorState] = useState("");
  const [arproductName, setarProductName] = useState("");
  const [areditorDescState, setarEditorDescState] = useState();
  const [areditorState, setarEditorState] = useState();
  const [nameError, setNameError] = useState();
  const [categoryID, setCategoryID] = useState([]);
  const [slug, setSlug] = useState([]);
  const [vendorID, setVendorID] = useState("");
  const [itemOrder, setItemOrder] = useState();
  // arrtibutes states
  const [attributeData, setAttributeData] = useState([]);
  const [totalNewTags, setTotalNewTags] = useState([]);
  // end of attributes states
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("");
  // end of price states
  const [imageUpload, setImageUpload] = useState("");
  const [deletedImages, setDeletedImages] = useState([]);
  // end of gallery states

  // inventory states
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("");
  const [featured, setFeatured] = useState("");
  const [productBrand, setProductBrand] = useState("");
  const [skuError, setSkuError] = useState();
  const [quantity, setQuantity] = useState();
  const [newSku, setNewSku] = useState();
  const [updateSlug, setUpdateSlug] = useState();
  // end of inventory states

  // Meta states
  const [metakeys, setMetakeys] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaArkeys, setArMetakeys] = useState("");
  const [metaArDesc, setArMetaDesc] = useState("");
  const [metaArTitle, setArMetaTitle] = useState("");


  // status and shipping profile states
  const [shippingProfileID, setShippingProfileID] = useState();
  const [status, setStatus] = useState();
  // end of status and shipping profile states

  const { register, handleSubmit } = useForm();
  const url = process.env.REACT_APP_BASE_URL.split("/v1")[0];
  const environment = url.split("api.")[0] + url.split("api.")[1];

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/products/${id}`)
      .then(async (response) => {
        const categoriesArr = [];
        setEditorState(
          EditorState.createWithContent(
            convertFromHTML(response.data.short_description_translate.en)
          )
        );

        setarEditorState(
          EditorState.createWithContent(
            convertFromHTML(response.data.short_description_translate.ar)
          )
        );

        setEditorDescState(
          EditorState.createWithContent(
            convertFromHTML(response.data.description_translate.en)
          )
        );

        setarEditorDescState(
          EditorState.createWithContent(
            convertFromHTML(response.data.description_translate.ar)
          )
        );

        await setData(response.data);
        await setVendorID(response.data.vendor.id);
        response.data.categories.map((item, index) =>
          categoriesArr.push(item.id)
        );
        setCategoryID(categoriesArr);
        await setImageUpload([...response.data.images]);
        await setProductName(response.data.name_translate.en);
        await setarProductName(response.data.name_translate.ar);
        await setSku(response.data.sku);
        await setPrice(response.data.price);
        await setDiscount(response.data.discount);
        await setDiscountType(response.data.discount_type);
        await setFeatured(response.data.featured);
        await setShippingProfileID(response.data.shipping_profile.id);
        await setStatus(response.data.status);
        await setSlug(response.data.slug);
        await setTotalNewTags(response.data.tags);
		await setProductBrand(response.data.brand);
        await setSlug(response.data?.slug);
        await setMetaDesc(response.data?.meta_description_translate?.en);
        await setMetakeys(response.data?.meta_keywords_translate?.en);
        await setMetaTitle(response.data?.meta_title_translate?.en);
		await setArMetaDesc(response.data?.meta_description_translate?.ar);
        await setArMetakeys(response.data?.meta_keywords_translate?.ar);
        await setArMetaTitle(response.data?.meta_title_translate?.ar);

        const attArr = [];
        for (let i = 0; i < response.data.attributes.length; i += 1) {
          const array = [];
          array.push({
            value: response.data.attributes[i].value,
            price: response.data.attributes[i].price,
            price_after_sale: response.data.attributes[i].price_after_sale,
          });

          attArr.push({
            key: response.data.attributes[i][0].attribute,
            value: response.data.attributes[i],
          });
        }
        setAttributeData(attArr);
        await setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  const onSubmit = () => {
    const formData = new FormData();
    formData.append("name[en]", productName);
    formData.append("name[ar]", arproductName);
    formData.append(
      "description[en]",
      draftToHtml(convertToRaw(editorDescState.getCurrentContent()))
    );

    formData.append(
      "description[ar]",
      draftToHtml(convertToRaw(areditorDescState.getCurrentContent()))
    );

    formData.append(
      "short_description[en]",
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );

    formData.append(
      "short_description[ar]",
      draftToHtml(convertToRaw(areditorState.getCurrentContent()))
    );
    if(itemOrder){
      formData.append("order", itemOrder);
    }
    if (newSku !== undefined) {
      formData.append("sku", sku);
    }
    formData.append("price", price === "" ? null : price);
    formData.append("discount", discount === "" ? null : discount);
    formData.append("discount_type", discountType);
    formData.append("featured", featured ?? data.featured);
    formData.append("slug", slug);
    formData.append("meta_keywords[en]", metakeys);
    formData.append("meta_description[en]", metaDesc);
    formData.append("meta_title[en]", metaTitle);
	formData.append("meta_keywords[ar]", metaArkeys);
    formData.append("meta_description[ar]", metaArDesc);
    formData.append("meta_title[ar]", metaArTitle);
    // formData.append("quantity", quantity??data.quantity);
    if (totalNewTags !== undefined) {
      for (let i = 0; i < totalNewTags.length; i += 1) {
        formData.append(`tags[${i}][name]`, totalNewTags[i]);
      }
    }
    formData.append(
      "stock",
      quantity !== undefined ? quantity : data?.quantity
    );
    formData.append("brand", productBrand);
    formData.append("vendor_id", vendorID);
    formData.append("status", status);
    formData.append("update_slug", updateSlug);
    formData.append("shipping_profile_id", shippingProfileID);
    if (categoryID.length === 0) {
      formData.append("categories[]", null);
    } else {
      for (let i = 0; i < categoryID.length; i += 1) {
        formData.append("categories[]", categoryID[i]);
      }
    }

    for (let i = 0; i < deletedImages.length; i += 1) {
      formData.append("deleted_images[]", deletedImages[i]);
    }
    for (let i = 0; i < imageUpload.length; i += 1) {
      if (imageUpload[i] instanceof Blob) {
        formData.append("images[]", imageUpload[i]);
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
    formData.append("_method", "PUT");

    api
      .create(`/products/${data.id} `, formData)
      .then((response) => {
        if (response.data) {
          toast.success("Product Updated!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          history.push(`/products/detail/${response.data.id}`);
          window.location.reload();
        } else {
          // eslint-disable-next-line no-use-before-define
          handleErrorResponse(response?.errors);

          if (response.message.includes("sku")) {
            setSkuError("The sku field is required");
          } else if (response.message.includes("name")) {
            setNameError("The name field is required");
          }
          setError(response?.errors);
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


  const handleDuplicate = () => {
    api
      .create(`/products/${data?.id}/duplicate`)
      .then((response) => {
        toast.success("Product Duplicated!", {
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
      .catch((err) => console.log(err));
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
          <div className="w-100 d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-primary mt-5 mb-5"
              onClick={handleDuplicate}
            >
              Duplicate
            </button>
            <a
              href={`${environment}/product-details/${data?.slug}?category=`}
              target="_blank"
              rel="noreferrer"
            >
              {/* <a href={`https://lacasa.tacverse.com/product-details/${data?.slug}?category=`} target="_blank"  rel="noreferrer"> */}
              <button type="button" className="btn btn-primary">
                Preview on store
              </button>
            </a>
          </div>
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
                  {loading ? (
                      ""
                  ) : (
                      <ProductInfo
                          productName={productName}
                          arproductName={arproductName}
                          setProductName={setProductName}
                          setarProductName={setarProductName}
                          setEditorDescState={setEditorDescState}
                          setarEditorDescState={setarEditorDescState}
                          editorDescState={editorDescState}
                          areditorDescState={areditorDescState}
                          setEditorState={setEditorState}
                          setarEditorState={setarEditorState}
                          areditorState={areditorState}
                          editorState={editorState}
                          setCategoryID={setCategoryID}
                          setVendorID={setVendorID}
                          setItemOrder={setItemOrder}
                          data={data}
                          error={error}
                          nameError={nameError}
                      />
                  )}
                  <h2 className="small-title">Attributes</h2>
                  <Card className="mb-5">
                    <Card.Body>
                      {loading ? (
                          ""
                      ) : (
                          <Attributes
                              attributeData={attributeData}
                              setAttributeData={setAttributeData}
                              productData={data}
                          />
                      )}
                    </Card.Body>
                  </Card>
                  <h2 className="small-title">Tags</h2>
                  <Card className="mb-5">
                    <Card.Body>
                      {loading ? (
                          ""
                      ) : (
                          <Tags
                              totalNewTags={totalNewTags}
                              setTotalNewTags={setTotalNewTags}
                          />
                      )}
                    </Card.Body>
                  </Card>
                  <h2 className="small-title">Update Link</h2>
                  <Card className="mb-5">
                    <Card.Body>
                      <div className="mb-3">
                        <Form.Select onChange={e => setUpdateSlug(e.target.value)}>
                          <option value={0}>No</option>
                          <option value={1}>Yes</option>
                        </Form.Select>
                      </div>
                    </Card.Body>
                  </Card>
                  <Row>
                    <Col xl="12">
                      <button type="submit" className="btn btn-primary w-100">
                        {" "}
                        <CsLineIcons icon="save"/> <span>Save</span>
                      </button>
                    </Col>
                  </Row>
                  {/* Attributes End */}
                </Col>
                <Col xl="4">
                <Status
                      setStatus={setStatus}
                      setShippingProfileID={setShippingProfileID}
                    data={data}
                  />

                  <Price
                    setPrice={setPrice}
                    price={price}
                    discount={discount}
                    discountType={discountType}
                    setDiscount={setDiscount}
                    setDiscountType={setDiscountType}
                    data={data}
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
                    data={data}
                    setStock={setStock}
                    setProductBrand={setProductBrand}
                    productBrand={productBrand}
                    error={error}
                    skuError={skuError}
                    setNewSku={setNewSku}
                  />
                  <Metalinks setSlug={setSlug}
                    setMetakeys={setMetakeys}
                    setMetaDesc={setMetaDesc}
                    setMetaTitle={setMetaTitle}
					setArMetakeys={setArMetakeys}
                    setArMetaDesc={setArMetaDesc}
                    setArMetaTitle={setArMetaTitle}
                    error={error}
					data={data}
                  />
                </Col>
              </Row>
              <Row>
                {/* <ActivityLog data={data} /> */}
              </Row>
            </form>
          </>
        )}
      </>
    </HasAccess>
  );
};

export default ProductsDetail;
