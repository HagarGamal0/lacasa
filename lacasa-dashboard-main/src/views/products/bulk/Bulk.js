import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

import "react-toastify/dist/ReactToastify.css";

const Bulk = () => {
  const title = "Products Bulk Action";
  const description = "LaCasa Bulk Actions Page";

  const [products, setProducts] = useState();
  const [selectBy, setSelectBy] = useState("products");
  const [errors, setErrors] = useState();
  const [toVendorID, setToVendorID] = useState();
  const [searchName, setSearchName] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState([]);
  const [categories, setCategories] = useState();

  const [featured, setFeatured] = useState(0);
  const [price, setPrice] = useState(0);
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState();
  const [selectedVendors, setSelectedVendors] = useState();
  const [selectedCategories, setSelectedCategories] = useState();
  const [status, setStatus] = useState();
  const [numberType, setnumberType] = useState(0);

  useEffect(() => {
    const bulkArr = [];
    api
      .readAll(`/products?find[name]=${searchName}`)
      .then(async (response) => {
        response.data.products.items.map((item, index) =>
          bulkArr.push({ value: item.id, label: item.name })
        );
        setProducts(bulkArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchName]);

  useEffect(() => {
    const bulkArr = [];
    api
      .readAll(`/vendors?find[name]=${vendorName}`)
      .then(async (response) => {
        response.data.map((item, index) =>
          bulkArr.push({ value: item.id, label: item.name })
        );
        setVendors(bulkArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vendorName]);

  useEffect(() => {
    api
      .readAll(`/categories`)
      .then(async (response) => {
        const category = [];
        response.data.map((item, index) => {
          category.push({ value: item.id, label: item.name });
          if (item.childs.length > 0) {
            item.childs.map((itemChild) => {
              category.push({ value: itemChild.id, label: itemChild.name });
              return category;
            });
          }
          return category;
        });
        await setCategories(category);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const formData = new FormData();
  const onSubmit = async (data) => {
    await setLoading(true);

    if (selectBy === "products") {
      for (let i = 0; i < selectedProducts.length; i += 1) {
        formData.append("products[]", selectedProducts[i]);
      }
    }
    if (selectedCategories !== undefined) {
      for (let i = 0; i < selectedCategories.length; i += 1) {
        formData.append("categories[]", selectedCategories[i]);
      }
    }
    formData.append("select_by", selectBy);
    if (selectBy !== "products") {
      formData.append("vendor_id", selectedVendors);
    }
    if (status !== undefined) {
      formData.append("status", status);
    }
    if (toVendorID !== undefined) {
      formData.append("to_vendor_id", toVendorID);
    }
    if (featured !== null) {
      formData.append("featured", featured);
    }
    if (price !== 0) {
      formData.append("fixed_equation", price);
    }

    if (numberType !== "") {
      formData.append("numberType", numberType);
    }
    api
      .create("/bulk-update/products", formData)
      .then((response) => {
        if (response.errors) {
          setError(response?.errors);
        } else {
          toast.success("Data saved successfully!");

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleVendors = (e) => {
    setSelectedVendors(e.value);
  };
  const handleProducts = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSelectedProducts(arr);
  };
  const handleCategories = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSelectedCategories(arr);
  };

  const handleRadio = (event) => {
    setnumberType(event.target.value);
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
                to="/products/list"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col xl="12">
              {/* Additional Info Start */}
              <h2 className="small-title">Bulk Actions</h2>
              <Card>
                <Card.Body>
                  <div className="mb-5">
                    <Form.Label>Select Products By: </Form.Label>
                    <Form.Select onChange={(e) => setSelectBy(e.target.value)}>
                      <option value="products">Products</option>
                      <option value="vendor">Vendor</option>
                    </Form.Select>
                  </div>
                  {selectBy === "products" ? (
                    <div className="mb-5">
                      <Form.Label>Products: </Form.Label>
                      <Select
                        className="input-select__input"
                        options={products}
                        name="shipping profile"
                        onInputChange={(e) => setSearchName(e)}
                        isMulti
                        onChange={handleProducts}
                      />
                    </div>
                  ) : (
                    <div className="mb-5">
                      <Form.Label>Vendor </Form.Label>
                      <Select
                        className="input-select__input"
                        options={vendors}
                        name="shipping profile"
                        onInputChange={(e) => setVendorName(e)}
                        onChange={handleVendors}
                      />
                    </div>
                  )}
                  <div className="mb-5">
                    <Form.Label>Transfer to another vendor </Form.Label>
                    <Select
                      className="input-select__input"
                      options={vendors}
                      name="shipping profile"
                      onInputChange={(e) => setVendorName(e)}
                      onChange={(e) => setToVendorID(e.value)}
                    />
                  </div>
                  <div className="mb-5">
                    <Form.Label>Categories: </Form.Label>
                    <Select
                      className="input-select__input"
                      options={categories}
                      name="shipping profile"
                      isMulti
                      onChange={handleCategories}
                    />
                  </div>
                  <div className="mb-5">
                    <Form.Label>Status: </Form.Label>
                    <Form.Select onChange={(e) => setStatus(e.target.value)}>
                      <option value="Published">Published</option>
                      <option value="Pending">Pending</option>
                      <option value="Draft">Draft</option>
                      <option value="Trash">Trash</option>
                    </Form.Select>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Featured: </Form.Label>
                    <Form.Select onChange={(e) => setFeatured(e.target.value)}>
                      <option value={0}>False</option>
                      <option value={1}>True</option>
                    </Form.Select>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Price: </Form.Label>
                    <Form.Control
                      type="number"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <Row className="mt-3">
                      <Col xl="6">
                        <Form.Label>Add: </Form.Label>
                        <input
                          type="radio"
                          id="price"
                          name="numberType"
                          value="1"
                          checked={numberType === '1'}
                          onClick={handleRadio}
                        />
                      </Col>
                      <Col xl="6">
                        <Form.Label>Subtract: </Form.Label>
                        <input
                          type="radio"
                          id="pricesubtract"
                          name="numberType"
                          value="0"
                          checked={numberType === '0'}
                          onClick={handleRadio}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div className="w-100 d-flex justify-content-end align-items-end">
                    {loading ? (
                      "Saving data..."
                    ) : (
                      <Button type="submit" className="primary">
                        Save
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
              {/* Additional Info End */}
            </Col>
          </Row>
        </form>
      </>
    </HasAccess>
  );
};

export default Bulk;
