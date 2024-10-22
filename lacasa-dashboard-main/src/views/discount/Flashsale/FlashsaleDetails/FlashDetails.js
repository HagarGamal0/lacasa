import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';
import api from '../../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const CreateCoupon = () => {
  const {
    register,
    handleSubmit,
  } = useForm();
  const products = {};
  const [perEach, setPerEach] = useState('across');
  const [error, setError] = useState()
  const [categories, setCategories] = useState();
  const [soloCategories, setSoloCategories] = useState();
  const [includedProductsList, setIncludedProductsList] = useState();
  const [includedProductName, setIncludedProductName] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [showSubmit, setShowSubmit] = useState(true);

  const onSubmit = async (data) => {
    await setShowSubmit(false)

    data.max_purchase = 999999999;
    data.allocation_method = perEach;
    products.exclude_categories = soloCategories;
    products.include = selectedProduct;
    data.products = products;

    api.create('/coupons', data).then(async response => {
      if (response.errors) {
        setError(response?.errors)
        await setShowSubmit(true)
      } else {
        toast.success('Coupon Created Successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        window.location.reload();
        await setShowSubmit(true)

      }

    }).catch(err => {
      console.log(err)
    })
  };

  useEffect(() => {
    api
      .readAll(`/products?find[name]=${includedProductName}`)
      .then(async (response) => {
        const arr = [];
        for (let i = 0; i < response.data.products.items.length; i += 1) {
          arr.push({ label: response.data.products.items[i].name, value: response.data.products.items[i].id });
        }
        await setIncludedProductsList(arr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [includedProductName]);

  useEffect(() => {
    api
      .readAll(`/categories`)
      .then(async (response) => {
        const arr = [];
        const createParentId = (childs, id) => {
          for (let i = 0; i < childs.length; i += 1) {
            arr.push({ label: childs[i].name, value: childs[i].id });
            if (childs[i].childs.length > 0) {
              createParentId(childs[i].childs, childs[i].id);
            }
          }
        };
        for (let i = 0; i < response.data.length; i += 1) {
          arr.push({ label: response.data[i].name, value: response.data[i].id });
          if (response.data[i].childs.length > 0) {
            createParentId(response.data[i].childs, response.data[i].id);
          }
        }
        await setCategories(arr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSelectProduct = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSelectedProduct(arr);
  };

  const handleCategoriesSelected = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSoloCategories(arr);
  };

  const handleProductSearch = (e) => {
    setIncludedProductName(e.target.value);
  };

  useEffect(() => {
    if (perEach === 'each') {
      document.getElementById('perEach').style.display = 'flex';
    } else {
      document.getElementById('perEach').style.display = 'none';
    }
  }, [perEach]);

  const handlePerEach = (e) => {
    setPerEach(e.target.value);
  };
  return (
    <>

      <form className="needs-validation add-product-form" onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col xl="6">
            <Form.Label>Coupon Code</Form.Label>
            <Form.Control type="text" {...register('coupon_code', { required: 'This field is required.' })} />
            {error && error.coupon_code ? <small className="text-danger">{error.coupon_code}</small> : ""}
          </Col>
          <Col xl="6">
            <Form.Label>Allocation Method</Form.Label>
            <Form.Select onChange={handlePerEach}>
              <option value="across">Across All Products</option>
              <option value="each">Per Product</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-3" id="perEach">
          <Col xl="6">
            <Form.Label>Excluded Categories</Form.Label>
            <Select className="input-fields-layout" options={categories} onChange={handleCategoriesSelected} isMulti />
          </Col>
          <Col xl="6">
            <Form.Label>Products</Form.Label>
            <Select
              className="input-fields-layout"
              options={includedProductsList}
              onChange={handleSelectProduct}
              isMulti
              onKeyDown={handleProductSearch}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xl="6">
            <Form.Label>New Users Only</Form.Label>
            <Form.Select {...register('first_order', { required: 'This field is required.' })}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </Form.Select>
          </Col>
          <Col xl="6">
            <Form.Label>Number Of Usage</Form.Label>
            <Form.Control type="number" {...register('usage_limit', { required: 'This field is required.' })} />
            {error && error.usage_limit ? <small className="text-danger">{error.usage_limit}</small> : ""}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xl="6">
            <Form.Label>Minimum Quantity</Form.Label>
            <Form.Control type="number" {...register('min_quantity', { required: 'This field is required.' })} />
          </Col>
          <Col xl="6">
            <Form.Label>Minimum Purchase</Form.Label>
            <Form.Control type="number" {...register('min_purchase', { required: 'This field is required.' })} />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xl="6">
            <Form.Label>Limit Per User</Form.Label>
            <Form.Control type="number" {...register('usage_limit_per_user', { required: 'This field is required.' })} />
            {error && error.usage_limit_per_user ? <small className="text-danger">{error.usage_limit_per_user}</small> : ""}
          </Col>
          <Col xl="6">
            <Form.Label>Discount Type</Form.Label>
            <Form.Select {...register('discount_type', { required: 'This field is required.' })}>
              <option value="fixed">Fixed</option>
              <option value="percentage">Percentage</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xl="6">
            <Form.Label>Discount Value</Form.Label>
            <Form.Control type="number" {...register('discount_value', { required: 'This field is required.' })} />
          </Col>
          <Col xl="6">
            <Form.Label>Max Discount</Form.Label>
            <Form.Control type="number" {...register('max_discount', { required: 'This field is required.' })} />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xl="6">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" {...register('start_date', { required: 'This field is required.' })} />
          </Col>
          <Col xl="6">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control type="date" {...register('expiry', { required: 'This field is required.' })} />
          </Col>
        </Row>

        <Row className="mt-5 d-flex justify-content-end">
          {showSubmit ? <button type="submit" className="btn btn-primary w-50">
            Create Coupon
          </button> : "Saving Coupon..."}
        </Row>
      </form>
    </>
  );
};

export default CreateCoupon;
