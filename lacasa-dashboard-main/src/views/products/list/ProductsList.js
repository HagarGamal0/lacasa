import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Bars } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

const ProductsList = () => {
  const title = "Product List";
  const description = "Ecommerce Product List Page";
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);
  const [timer, setTimer] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState([]);
  const [vendorPage, setVendorPage] = useState([]);
  const [vendorName, setVendorName] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [shippingProfileName, setShippingProfileName] = useState([]);
  const [shippingProfilePage, setShippingProfilePage] = useState([]);
  const [shippingProfile, setShippingProfile] = useState([]);
  const [sort, setSort] = useState([]);
  const [sku, setSku] = useState([]);
  const [key, setKey] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [stock, setStock] = useState([]);
  const [disableExport, setDisableExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importedFile, setImportedFile] = useState(null);
  const arr = [];

  const createParentId = (childs) => {
    for (let i = 0; i < childs.length; i += 1) {
      arr.push(childs[i]);
      if (childs[i].childs.length > 0) {
        createParentId(childs[i].childs);
      }
    }
    return arr;
  };

  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };

  useEffect(() => {
    setLoading(true);
    api
      .readAll(
        `/products?page=${page}&paginate=20&find[shipping_profile_id]=${shippingProfile}&find[status]=${key}&find[name]=${name}&find[category]=${category}&find[vendor_id]=${selectedVendor}&sort=${sort}&find[sku]=${sku}&find[featured]=${featured}&find[stock]=${stock}`
      )
      .then((response) => {
        setData(response.data);
        setMeta(response.meta);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [
    page,
    key,
    name,
    category,
    selectedVendor,
    shippingProfile,
    sku,
    sort,
    featured,
    stock,
  ]);

  useEffect(() => {
    api
      .readAll(`/categories`)
      .then(async (response) => {
        await setCategoryData(createParentId(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .readAll(`/vendors?find[name]=${vendorPage}`)
      .then(async (response) => {
        const vendorArr = [];
        response.data.map((item) =>
          vendorArr.push({ value: item.id, label: item.name })
        );
        await setVendorName(vendorArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vendorPage]);

  useEffect(() => {
    api
      .readAll(`/shipping_profiles?find[name]=${shippingProfilePage}`)
      .then(async (response) => {
        const shippingArr = [];
        response.data.map((item) =>
          shippingArr.push({ value: item.id, label: item.name })
        );
        await setShippingProfileName(shippingArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [shippingProfilePage]);

  const categorySearch = (e) => {
    setPage(1);
    setCategory(e.target.value);
  };

  const nameSearch = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    setTimer(
      window.setTimeout(function () {
        setTimer(null);

        setPage(1);
        setName(e.target.value);
      }, 1000)
    );
  };
  const scrollVendor = (e) => {
    setVendorPage(e);
  };
  const changeVendor = (e) => {
    setSelectedVendor(e.value);
  };

  const shippingProfileFilter = (e) => {
    setShippingProfile(e.value);
  };
  const handleSort = (e) => {
    setSort(e.target.value);
  };
  const handleSku = (e) => {
    setSku(e.target.value);
  };

  function downloadBlob(blob, fName) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob)
      return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const dataBlob = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = dataBlob;
    link.download = fName;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);

    return 1;
  }
  const handleExport = async () => {
    await setDisableExport(true);
    api
      .readAll(
        `/export/products?find[shipping_profile_id]=${shippingProfile}&find[status]=${key}&find[name]=${name}&find[category]=${category}&find[vendor_id]=${selectedVendor}&sort=${sort}&find[sku]=${sku}&find[featured]=${featured}&find[stock]=${stock}`
      )
      .then(async (response) => {
        const blob = new Blob([response], { type: "text/csv" });
        await downloadBlob(blob, `Products--export.csv`);
        await setDisableExport(false);
      });
  };

  const handleDuplicate = (id) => {
    api
      .create(`/products/${id}/duplicate`)
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

  const handleShowImport = () => setShowImport(true);
  const handleCloseImport = () => setShowImport(false);

  const handleImport = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", importedFile);
    api.create("/import/products", formData).then((res) => {
      if (res.status === "success") {
        setLoading(false);
        toast.success("Products imported successfully");
      } else {

        setLoading(false);
        toast.error(res.errors?.[0]?.[0]);
      }
    });
    setShowImport(false);
  };

  return (
    <>
      <HasAccess
        permissions="View Products"
        renderAuthFailed={<Unauthorized />}
        isLoading="loading..."
      >
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
            <Col
              xs="12"
              sm="auto"
              className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3"
            >
              {disableExport ? (
                "Getting your data ready..."
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={handleShowImport}
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <span>Import Products</span>
                </Button>
              )}
            </Col>
            <Col
              xs="12"
              sm="auto"
              className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3"
            >
              {disableExport ? (
                "Getting your data ready..."
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={handleExport}
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <span>Export Products</span>
                </Button>
              )}
            </Col>

            {/* Top Buttons Start */}
            <Col
              xs="12"
              sm="auto"
              className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3"
            >
              <NavLink to="/products/create">
                <Button
                  variant="outline-primary"
                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto"
                >
                  <CsLineIcons icon="plus" /> <span>Add Product</span>
                </Button>
              </NavLink>
            </Col>
            {/* Top Buttons End */}
          </Row>
        </div>

        <div className="d-flex justify-content-between">
          {/* eslint-disable  */}
          <div className="text-small text-muted w-75 d-flex mb-3">
            <select
              className="form-select form-select-sm form-select-box-shadow w-50 me-3 text-dark font-weight-bold"
              onChange={categorySearch}
            >
              <option value="">CATEGORY</option>
              {categoryData?.map((item, index) => (
                <option value={item.slug} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Select
              className="w-50 text-dark font-weight-bold"
              placeholder="SHIPPING PROFILE"
              options={shippingProfileName}
              onInputChange={(e) => setShippingProfilePage(e)}
              onChange={shippingProfileFilter}
            />
            <input
              type="text"
              className="form-control ms-3 me-3 w-25"
              placeholder="SKU"
              onChange={handleSku}
            />
            <select
              className="form-select form-select-sm form-select-box-shadow w-25 me-3 text-dark font-weight-bold"
              onChange={handleSort}
            >
              <option hidden>SORT</option>
              <option value="new">OLD TO NEW</option>
              <option value="-new">NEW TO OLD</option>
            </select>
            <select
              className="form-select form-select-sm form-select-box-shadow w-25 me-3 text-dark font-weight-bold"
              onChange={(e) => setFeatured(e.target.value)}
            >
              <option hidden>FEATURED</option>
              <option value={[]}>All</option>
              <option value={1}>Featured Products</option>
              <option value={0}>Not Featured Products</option>
            </select>
            <select
              className="form-select form-select-sm form-select-box-shadow w-25 me-3 text-dark font-weight-bold"
              onChange={(e) => setStock(e.target.value)}
            >
              <option hidden>STOCK</option>
              <option value={[]}>All</option>
              <option value={1}>In Stock</option>
              <option value={0}>Out Of stock</option>
            </select>
          </div>

          <div>
            <p>
              <span className="bg-danger p-2 rounded">{meta?.total}</span>{" "}
              PRODUCTS
            </p>
          </div>
        </div>
        <Card className="p-3">
          <Tabs
            id="products-tab"
            activeKey={key}
            onSelect={(k) => {
              setKey(k);
              setSelectedVendor([]);
            }}
            className="mb-3"
          >
            <Tab eventKey={[]} title="Total">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 custom-sort ps-5 pe-4 align-items-center">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control
                        type="text"
                        placeholder="TITLE"
                        onChange={nameSearch}
                      />
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div>
                        <Select
                          placeholder="VENDOR"
                          options={vendorName}
                          onInputChange={scrollVendor}
                          onChange={changeVendor}
                        />
                      </div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
					<Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">IMPRESSIONS</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 align-items-center pe-3 d-flex"
                    >
                      <div className="text-muted text-small">DUPLICATE</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">EDIT</div>
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
                  {data?.products.items.map((item, index) => (
                    <Card
                      className={`mb-2 ${
                        selectedItems.includes(index + 1) && "selected"
                      }`}
                      key={index}
                    >
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.id}`}>
                            <img
                              src={`${
                                item.images.length > 0 ? item.images[0].url : ""
                              }`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col
                              xs="11"
                              lg="2"
                              className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <small
                                  style={{
                                    overflow: "hidden",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    maxHeight: "3 * 1.2em",
                                    lineHeight: " 1.2em",
                                  }}
                                >
                                  {item.name}
                                </small>
                                <div className="text-small text-muted text-truncate">
                                  #{item.id}
                                </div>
                              </NavLink>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.vendor.name}
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.quantity}
                              </div>
                            </Col>

                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3"
                            >
                              {item.status === "Draft" ? (
                                <Badge bg="outline-secondary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ? (
                                <Badge bg="outline-tertiary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ||
                              item.status === "Draft" ? (
                                ""
                              ) : (
                                <Badge bg="outline-primary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              )}
                            </Col>
							<Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.clicks}
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-center justify-content-center order-4"
                            >
                              <HasAccess
                                permissions="Edit Products"
                                renderAuthFailed={
                                  "You don't have access to edit products."
                                }
                                isLoading="loading..."
                              >
                                <button
                                  className="btn btn-primary w-50 text-center px-0"
                                  onClick={() => handleDuplicate(item.id)}
                                >
                                  Duplicate
                                </button>
                              </HasAccess>
                            </Col>
                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4"
                            >
                              <HasAccess
                                permissions="Edit Products"
                                renderAuthFailed={
                                  "You don't have access to edit products."
                                }
                                isLoading="loading..."
                              >
                                <NavLink to={`/products/detail/${item.id}`}>
                                  <div className="lh-1 text-alternate">
                                    <CsLineIcons icon="edit" />
                                  </div>
                                </NavLink>
                              </HasAccess>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Published" title="Published">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 align-items-center">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control
                        type="text"
                        placeholder="TITLE"
                        onChange={nameSearch}
                      />
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div>
                        <Select
                          placeholder="VENDOR"
                          options={vendorName}
                          onInputChange={scrollVendor}
                          onChange={changeVendor}
                        />
                      </div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 align-items-center pe-3 d-flex"
                    >
                      <div className="text-muted text-small">DUPLICATE</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">EDIT</div>
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
                  {data?.products.items.map((item, index) => (
                    <Card
                      className={`mb-2 ${
                        selectedItems.includes(index + 1) && "selected"
                      }`}
                      key={index}
                    >
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.id}`}>
                            <img
                              src={`${
                                item.images.length > 0 ? item.images[0].url : ""
                              }`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col
                              xs="11"
                              lg="2"
                              className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">
                                  #{item.id}
                                </div>
                              </NavLink>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.vendor.name}
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.quantity}
                              </div>
                            </Col>

                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3"
                            >
                              {item.status === "Draft" ? (
                                <Badge bg="outline-secondary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ? (
                                <Badge bg="outline-tertiary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ||
                              item.status === "Draft" ? (
                                ""
                              ) : (
                                <Badge bg="outline-primary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              )}
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center align-items-center order-4"
                            >
                              <HasAccess
                                permissions="Edit Products"
                                renderAuthFailed={
                                  "You don't have access to edit products."
                                }
                                isLoading="loading..."
                              >
                                <button
                                  className="btn btn-primary w-50 text-center px-0"
                                  onClick={() => handleDuplicate(item.id)}
                                >
                                  Duplicate
                                </button>
                              </HasAccess>
                            </Col>
                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <div className="lh-1 text-alternate">
                                  {" "}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Pending" title="Pending">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 align-items-center">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control
                        type="text"
                        placeholder="TITLE"
                        onChange={nameSearch}
                      />
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div>
                        <Select
                          placeholder="VENDOR"
                          options={vendorName}
                          onInputChange={scrollVendor}
                          onChange={changeVendor}
                        />
                      </div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column align-items-center mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">DUPLICATE</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">EDIT</div>
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
                  {data?.products.items.map((item, index) => (
                    <Card
                      className={`mb-2 ${
                        selectedItems.includes(index + 1) && "selected"
                      }`}
                      key={index}
                    >
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.id}`}>
                            <img
                              src={`${
                                item.images.length > 0 ? item.images[0].url : ""
                              }`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col
                              xs="11"
                              lg="2"
                              className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">
                                  #{item.id}
                                </div>
                              </NavLink>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.vendor.name}
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.quantity}
                              </div>
                            </Col>

                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3"
                            >
                              {item.status === "Draft" ? (
                                <Badge bg="outline-secondary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ? (
                                <Badge bg="outline-tertiary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ||
                              item.status === "Draft" ? (
                                ""
                              ) : (
                                <Badge bg="outline-primary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              )}
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center align-items-center order-4"
                            >
                              <HasAccess
                                permissions="Edit Products"
                                renderAuthFailed={
                                  "You don't have access to edit products."
                                }
                                isLoading="loading..."
                              >
                                <button
                                  className="btn btn-primary w-50 text-center px-0"
                                  onClick={() => handleDuplicate(item.id)}
                                >
                                  Duplicate
                                </button>
                              </HasAccess>
                            </Col>
                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <div className="lh-1 text-alternate">
                                  {" "}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Draft" title="Draft">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 align-items-center">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control
                        type="text"
                        placeholder="TITLE"
                        onChange={nameSearch}
                      />
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div>
                        <Select
                          placeholder="VENDOR"
                          options={vendorName}
                          onInputChange={scrollVendor}
                          onChange={changeVendor}
                        />
                      </div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column align-items-center mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">DUPLICATE</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">EDIT</div>
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
                  {data?.products.items.map((item, index) => (
                    <Card
                      className={`mb-2 ${
                        selectedItems.includes(index + 1) && "selected"
                      }`}
                      key={index}
                    >
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.id}`}>
                            <img
                              src={`${
                                item.images.length > 0 ? item.images[0].url : ""
                              }`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col
                              xs="11"
                              lg="2"
                              className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">
                                  #{item.id}
                                </div>
                              </NavLink>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.vendor.name}
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.quantity}
                              </div>
                            </Col>

                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3"
                            >
                              {item.status === "Draft" ? (
                                <Badge bg="outline-secondary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ? (
                                <Badge bg="outline-tertiary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ||
                              item.status === "Draft" ? (
                                ""
                              ) : (
                                <Badge bg="outline-primary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              )}
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center align-items-center order-4"
                            >
                              <HasAccess
                                permissions="Edit Products"
                                renderAuthFailed={
                                  "You don't have access to edit products."
                                }
                                isLoading="loading..."
                              >
                                <button
                                  className="btn btn-primary w-50 text-center px-0"
                                  onClick={() => handleDuplicate(item.id)}
                                >
                                  Duplicate
                                </button>
                              </HasAccess>
                            </Col>
                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <div className="lh-1 text-alternate">
                                  {" "}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Trash" title="Trash">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 align-items-center">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control
                        type="text"
                        placeholder="TITLE"
                        onChange={nameSearch}
                      />
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div>
                        <Select
                          placeholder="VENDOR"
                          options={vendorName}
                          onInputChange={scrollVendor}
                          onChange={changeVendor}
                        />
                      </div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col
                      xs="2"
                      lg="2"
                      className="d-flex flex-column mb-lg-0 align-items-center pe-3 d-flex"
                    >
                      <div className="text-muted text-small">DUPLICATE</div>
                    </Col>
                    <Col
                      xs="1"
                      lg="1"
                      className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                    >
                      <div className="text-muted text-small">EDIT</div>
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
                  {data?.products.items.map((item, index) => (
                    <Card
                      className={`mb-2 ${
                        selectedItems.includes(index + 1) && "selected"
                      }`}
                      key={index}
                    >
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.id}`}>
                            <img
                              src={`${
                                item.images.length > 0 ? item.images[0].url : ""
                              }`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col
                              xs="11"
                              lg="2"
                              className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">
                                  #{item.id}
                                </div>
                              </NavLink>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.vendor.name}
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                            >
                              <div className="lh-1 text-alternate">
                                {item.quantity}
                              </div>
                            </Col>

                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3"
                            >
                              {item.status === "Draft" ? (
                                <Badge bg="outline-secondary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ? (
                                <Badge bg="outline-tertiary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              ) : (
                                ""
                              )}

                              {item.status === "Published" ||
                              item.status === "Draft" ? (
                                ""
                              ) : (
                                <Badge bg="outline-primary">
                                  {item.status.toUpperCase()}
                                </Badge>
                              )}
                            </Col>
                            <Col
                              lg="2"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center align-items-center order-4"
                            >
                              <HasAccess
                                permissions="Edit Products"
                                renderAuthFailed={
                                  "You don't have access to edit products."
                                }
                                isLoading="loading..."
                              >
                                <button
                                  className="btn btn-primary w-50 text-center px-0"
                                  onClick={() => handleDuplicate(item.id)}
                                >
                                  Duplicate
                                </button>
                              </HasAccess>
                            </Col>
                            <Col
                              lg="1"
                              className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4"
                            >
                              <NavLink to={`/products/detail/${item.id}`}>
                                <div className="lh-1 text-alternate">
                                  {" "}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
          </Tabs>
        </Card>
        <div className="d-flex justify-content-center mt-5">
          <ReactPaginate
            previousLabel="<<"
            nextLabel=">>"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={meta?.last_page > 0 ? meta?.last_page : 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
        {/* Pagination End */}
      </HasAccess>
      <Modal show={showImport} onHide={handleCloseImport}>
        <Modal.Header closeButton>
          <Modal.Title>Import Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFileSm" className="mb-3">
            <Form.Control
              type="file"
              size="sm"
              onChange={(e) => setImportedFile(e.target.files[0])}
            />
            <Form.Label className="mt-2">
              For template reference please{" "}
              <a href="/products-import-reference.csv" download>
                download this file
              </a>
            </Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleImport}>
            Import
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductsList;
