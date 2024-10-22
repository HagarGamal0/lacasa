import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import "quill/dist/quill.bubble.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Bars } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../API/API";

import "react-toastify/dist/ReactToastify.css";

const ProductsDetail = () => {
  const title = "Bulk Actions";
  const description = "Lacasa Shipping Profile Bulk Action Page";
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);
  const [shippingProfile, setShippingProfile] = useState([]);
  const [shippingProfileName, setShippingProfileName] = useState();
  const [vendorSearch, setVendorSearch] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorsName, setVendorsName] = useState([]);
  const [vendorCategory, setVendorCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [productSearch, setProductSearch] = useState([]);
  const [product, setProducts] = useState([]);
  const [specifiedCategory, setSpecifiedCategory] = useState();
  const [selectedIncludedProducts, setSelectedIncludedProducts] = useState();
  const [selectedExcludedProducts, setSelectedExcludedProducts] = useState();
  const [selectedVendorCategory, setSelectedVendorCategory] = useState();
  const [shippingProviders, setShippingProviders] = useState();
  const [selectedProvider, setSelectedProvider] = useState();
  const [shippingType, setShippingType] = useState();
  const [selectedType, setSelectedType] = useState();
  const [vendorCategoriesCombined, setVendorCategoriesCombined] = useState([]);
  const [displayVendorCategoriesCombined, setDisplayVendorCategoriesCombined] =
    useState([]);

  const [displayVendorCategory, setDisplayVendorCategory] = useState();
  const [displayVendor, setDisplayVendor] = useState();
  const [error, setError] = useState();
  const [loadingVendorCategories, setLoadingVendorCategories] = useState(false);

  useEffect(() => {
    api
      .readAll(`/shipping_profiles?find[name]=${name}`)
      .then(async (response) => {
        const arr = [];
        response.data.map((item) => {
          arr.push({ value: item.id, label: item.name });
          return arr;
        });
        await setShippingProfile(arr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [name]);

  useEffect(() => {
    api
      .readAll(`/vendors?find[name]=${vendorSearch}`)
      .then(async (response) => {
        const vendorsArr = [];
        response.data.map((item, index) =>
          vendorsArr.push({ value: item.id, label: item.name })
        );
        setVendors(vendorsArr);
      });
  }, [vendorSearch]);

  useEffect(() => {
    api
      .readAll(`/categories`)
      .then(async (response) => {
        const arr = [];
        const arrData = [];
        const createParentId = (childs) => {
          for (let i = 0; i < childs.length; i += 1) {
            arr.push(childs[i]);
            if (childs[i].childs.length > 0) {
              createParentId(childs[i].childs, childs[i].id);
            }
          }
        };
        for (let i = 0; i < response.data.length; i += 1) {
          arr.push(response.data[i]);
          if (response.data[i].childs.length > 0) {
            createParentId(response.data[i].childs);
          }
        }
        arr.map((item, index) => {
          arrData.push({ value: item.id, label: item.name });
          return arrData;
        });
        setCategories(arrData);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .readAll(`/shipping_providers`)
      .then(async (response) => {
        const arr = [];
        response.data.map((item, index) => {
          arr.push({ value: item.id, label: item.name });
          return arr;
        });
        await setShippingProviders(arr);
      })
      .catch((errors) => {
        console.log(errors);
      });
  }, []);

  useEffect(() => {
    api
      .readAll(`/products?find[name]=${productSearch}&paginate=5`)
      .then(async (response) => {
        const products = [];
        response.data.products.items.map((item, index) =>
          products.push({ value: item.id, label: item.name })
        );
        setProducts(products);
      });
  }, [productSearch]);

  const handleShippingSearch = (e) => {
    if (e !== "") {
      setName(e);
    }
  };
  const handleShippingName = (e) => {
    setShippingProfileName(e.value);
  };

  const handleVendorsSearch = (e) => {
    if (e !== "") {
      setVendorSearch(e);
    }
  };
  const handleVendorName = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setVendorsName(arr);
  };

  const handleVendorCategoryName = (e) => {
    setDisplayVendor(e.label);
    setVendorCategory(e.value);
  };

  const handleProductSearch = (e) => {
    if (e !== "") {
      setProductSearch(e);
    }
  };

  const handleSpecifiedCategory = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSpecifiedCategory(arr);
  };
  const handleIncludedProduct = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSelectedIncludedProducts(arr);
  };
  const handleExcludedProduct = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSelectedExcludedProducts(arr);
  };
  const handleVendorCategory = (e) => {
    const arr = [];
    const displayArr = [];
    e.map((item) => {
      displayArr.push(item.label);
      arr.push(item.value);
      return arr;
    });
    setDisplayVendorCategory(displayArr);
    setSelectedVendorCategory(arr);
  };

  const onSubmit = async () => {
    if (shippingProfileName !== undefined) {
      const rawData = {
        products: {
          vendors: vendorsName,
          vendor_categories: vendorCategoriesCombined,
          categories: specifiedCategory,
          include: selectedIncludedProducts,
          exclude: selectedExcludedProducts,
        },
        type: selectedType,
        shipping_provider_id: selectedProvider,
      };

      api
        .updateShipping(`/shipping_profiles/${shippingProfileName}`, rawData)
        .then((response) => {
          if (response.data) {
            toast.success("Changes are saved!", {
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
            console.log(response);
          } else {
            console.log(response.errors[Object.keys(response.errors)[0]][0]);
            toast.error(response.errors[Object.keys(response.errors)[0]][0]);
            setError(response.errors);
          }
        })
        .catch((err) => {
          console.log("err==>");
          toast.error(err.message);
        });
    } else {
      alert("please, pick a profile name");
    }
  };

  // combine array of vendors and their categories
  const handleCombinedVendorsCategories = async (e) => {
    if (
      vendorCategory !== undefined &&
      selectedVendorCategory !== undefined &&
      displayVendor !== undefined &&
      displayVendorCategory !== undefined
    ) {
      await setLoadingVendorCategories(true);
      const arr = vendorCategoriesCombined;
      const displayArr = displayVendorCategoriesCombined;
      if (selectedVendorCategory === "") {
        console.log("asd");
      } else {
        arr.push({ id: vendorCategory, categories: selectedVendorCategory });
        displayArr.push({
          vendor: displayVendor,
          categories: displayVendorCategory,
          vendor_id: vendorCategory,
        });
      }
      setVendorCategoriesCombined(arr);
      setDisplayVendorCategoriesCombined(displayArr);
      setVendorCategory();
      setSelectedVendorCategory();
      setDisplayVendor();
      setDisplayVendorCategory();
      setLoadingVendorCategories(false);
    } else {
      alert("Please, fill in the values before adding a vendor category");
    }
  };

  const deleteVendorCategory = async (vendorId) => {
    await setLoadingVendorCategories(true);
    const arr = [];
    const displayArr = [];

    vendorCategoriesCombined.map((item, index) => {
      if (item.id !== vendorId) {
        arr.push(item);
      }
      return arr;
    });
    displayVendorCategoriesCombined.map((item, index) => {
      if (item.vendor_id !== vendorId) {
        displayArr.push(item);
      }
      return displayArr;
    });
    setVendorCategoriesCombined(arr);
    setDisplayVendorCategoriesCombined(displayArr);
    setLoadingVendorCategories(false);
  };

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
                  Bulk Action
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
                <h2 className="small-title">Bulk Actions Are Irreversible</h2>
                <Row>
                  <Col xl="6">
                    <Card className="mb-5">
                      <Card.Body>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Shipping Profile</Form.Label>
                            <Select
                              isSearchable="true"
                              onInputChange={handleShippingSearch}
                              options={shippingProfile}
                              className="input-fields-layout"
                              onChange={handleShippingName}
                            />
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xl="6">
                    <Card className="mb-5">
                      <Card.Body>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Vendors</Form.Label>
                            <Select
                              isMulti
                              isSearchable="true"
                              onInputChange={handleVendorsSearch}
                              options={vendors}
                              className="input-fields-layout"
                              onChange={handleVendorName}
                            />
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col xl="6">
                    <Card className="mb-5">
                      <Card.Body>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Shipping Provider</Form.Label>
                            <Select
                              className="input-fields-layout"
                              options={shippingProviders}
                              onChange={(e) => setSelectedProvider(e.value)}
                            />
                            <small className="text-danger">
                              {error !== undefined &&
                              error?.shipping_provider_id
                                ? error.shipping_provider_id
                                : ""}
                            </small>
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                    <Card className="mb-5">
                      <Card.Body>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Shipping Type</Form.Label>
                            <Select
                              className="input-fields-layout"
                              options={[
                                { value: 2, label: "Heavy" },
                                { value: 1, label: "Light" },
                              ]}
                              onChange={(e) => setSelectedType(e.value)}
                            />
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                    <Card className="mb-5">
                      <Card.Header>
                        <h3>Set specified categories</h3>
                      </Card.Header>
                      <Card.Body>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Categories</Form.Label>
                            <Select
                              isSearchable="true"
                              options={categories}
                              className="input-fields-layout"
                              onChange={handleSpecifiedCategory}
                              isMulti
                            />
                          </div>
                        </Form>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Included Products</Form.Label>
                            <Select
                              isSearchable="true"
                              onInputChange={handleProductSearch}
                              options={product}
                              className="input-fields-layout"
                              onChange={handleIncludedProduct}
                              isMulti
                            />
                          </div>
                        </Form>
                        <Form>
                          <div className="mb-3">
                            <Form.Label>Excluded Products</Form.Label>
                            <Select
                              isSearchable="true"
                              onInputChange={handleProductSearch}
                              options={product}
                              className="input-fields-layout"
                              onChange={handleExcludedProduct}
                              isMulti
                            />
                          </div>
                        </Form>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xl="6">
                    <Card className="mb-5">
                      <Card.Header>
                        <h3>Set a specified vendor categories</h3>
                      </Card.Header>
                      <Card.Body>
                        {loadingVendorCategories ? (
                          ""
                        ) : (
                          <>
                            <Form>
                              <div className="mb-3">
                                <Form.Label>Vendors</Form.Label>
                                <Select
                                  isSearchable="true"
                                  onInputChange={handleVendorsSearch}
                                  options={vendors}
                                  className="input-fields-layout"
                                  onChange={handleVendorCategoryName}
                                />
                              </div>
                            </Form>

                            <Form>
                              <div className="mb-3">
                                <Form.Label>Categories</Form.Label>
                                <Select
                                  isMulti
                                  isSearchable="true"
                                  options={categories}
                                  className="input-fields-layout"
                                  onChange={handleVendorCategory}
                                />
                              </div>
                            </Form>
                          </>
                        )}
                      </Card.Body>
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <Button
                          variant="outline-primary"
                          onClick={handleCombinedVendorsCategories}
                          className="btn-icon btn-icon-start w-50 "
                        >
                          <span>Add</span>
                        </Button>
                      </div>
                    </Card>

                    <Card>
                      <Card.Header>
                        <h4>Added Vendors Categories</h4>
                      </Card.Header>
                      {loadingVendorCategories ? (
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
                          <Card.Body>
                            {displayVendorCategoriesCombined.map(
                              (item, index) => (
                                <div key={index}>
                                  <div
                                    style={{
                                      position: "absolute",
                                      right: "100px",
                                    }}
                                  >
                                    <button
                                      type="button"
                                      style={{
                                        background: "none",
                                        border: "none",
                                      }}
                                      onClick={() =>
                                        deleteVendorCategory(item.vendor_id)
                                      }
                                    >
                                      &#10005;
                                    </button>
                                  </div>
                                  <h5>{item.vendor}</h5>
                                  <br />
                                  <ul>
                                    {item.categories.map(
                                      (category, categoryindex) => (
                                        <li key={categoryindex}>{category}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )
                            )}
                          </Card.Body>
                        </>
                      )}
                    </Card>
                    <div className="d-flex justify-content-end align-items-center w-100 mt-5">
                      <Button
                        variant="outline-primary"
                        className="btn-icon btn-icon-start w-100 "
                        onClick={onSubmit}
                      >
                        <span>Save</span>
                      </Button>
                    </div>
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
