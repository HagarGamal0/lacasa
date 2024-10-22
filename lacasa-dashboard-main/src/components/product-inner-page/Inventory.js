import React, { useState, useEffect } from 'react';
import { Col, Form, Card } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import api from '../../API/API';

const Inventory = ({ error = '', setSku, setQuantity, setFeatured, setStock, setProductBrand, productBrand, data = [], skuError = '', setNewSku = '' }) => {
  const [brands, setBrands] = useState();

  useEffect(() => {
    const brandsArr = [];
    api
      .readAll(`/brands`)
      .then(async (response) => {
        response.data.map((item, index) => (
          brandsArr.push({ value: item, label: item })
        ))
        setBrands(brandsArr)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Col xl="12">
      <h2 className="small-title">Inventory</h2>
      <Card className="mb-5">
        <Card.Body>
          <div className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" onChange={e => setQuantity(e.target.value)} defaultValue={data?.quantity} />
            <small className="text text-danger">{error.quantity ?? error.quantity}</small>
          </div>
          <div className="mb-3">
            {data?.sku !== undefined ? <> <Form.Label>SKU</Form.Label>
              <Form.Control type="text" onChange={e => { setSku(e.target.value); setNewSku(e.target.value); }} defaultValue={data?.sku} />
              <small className="text text-danger">{error.sku ?? error.sku}</small>
              <small className="text text-danger">{skuError}</small></> :
              <> <Form.Label>SKU</Form.Label>
              <Form.Control type="text" onChange={e => setSku(e.target.value)} defaultValue={data?.sku} />
              <small className="text text-danger">{error.sku ?? error.sku}</small>
              <small className="text text-danger">{skuError}</small></>}

          </div>
          <div className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Select onChange={e => setStock(e.target.value)}>
              {data?.featured !== undefined ? <option hidden>{data.stock === 0 ? "Out of stock" : "In stock"}</option> : <option hidden>Pick your choice...</option>}
              <option value={0}>Out of stock</option>
              <option value={1}>In stock</option>
            </Form.Select>
            <small className="text text-danger">{error.stock ?? error.stock}</small>
          </div>
          <div className="mb-3">
            <Form.Label>Brand</Form.Label>
            <CreatableSelect
              className="input-select__input"
              options={brands}
              name="brands"
              onChange={(e) => setProductBrand(e.value)}
              onBlurResetsInput={false}
              defaultValue={{ value: data?.brand, label: data?.brand }}
            />
          </div>
          <div className="mb-3">
            <Form.Label>Featured</Form.Label>
            <Form.Select onChange={e => setFeatured(e.target.value)}>
              {data?.featured !== undefined ? <option hidden>{data.featured === 0 ? "No" : "Yes"}</option> : <option hidden>Pick your choice...</option>}
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </Form.Select>
            <small className="text text-danger">{error.featured ?? error.featured}</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Inventory;
