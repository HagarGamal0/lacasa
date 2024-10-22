import React, { useState, useEffect } from 'react';
import { Col, Form, Card } from 'react-bootstrap';
import Select from 'react-select';
import { NavLink } from 'react-router-dom';
import api from '../../API/API';

const Status = ({ error = '', setStatus, setShippingProfileID, data = [] }) => {
  const [shippingProfileSearch, setShippingProfileSearch] = useState([]);
  const [shipping, setShipping] = useState([]);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    const shippingProfiles = [];
    api
      .readAll(`/shipping_profiles?find[name]=${shippingProfileSearch}`)
      .then(async (response) => {
        response.data.map((item, index) => shippingProfiles.push({ value: item.id, label: item.name }));
        setShipping(shippingProfiles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [shippingProfileSearch]);

  const handleProfileSearch = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    setTimer(
      window.setTimeout(function () {
        setTimer(null);
        setShippingProfileSearch(e);
      }, 1000)
    );
  };
  return (
    <Col xl="12">
      <h2 className="small-title">Status & Shipping Profile</h2>
      <Card className="mb-5">
        <Card.Body>
          {data !== [] ? (
            <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to={`/shipping/details/${data.shipping_profile.id}`}>
              <button className="btn btn-primary mb-3" type="button">
                View Shipping Profile
              </button>
            </NavLink>
          ) : (
            ''
          )}
          <div className="mb-3">
            <Form.Label>Product Status</Form.Label>
            <Form.Select onChange={(e) => setStatus(e.target.value)}>
              <option hidden>{data.status ? data.status : 'Pick your choice...'}</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
              <option value="Draft">Draft</option>
              <option value="Trash">Trash</option>
            </Form.Select>
          </div>
          <div className="mb-3">
            <Form.Label>Shipping Profile</Form.Label>
            <Select
              className="input-select__input"
              options={shipping}
              name="shipping profile"
              onInputChange={handleProfileSearch}
              onChange={(e) => setShippingProfileID(e.value)}
              defaultValue={{ value: data.shipping_profile.id, label: data.shipping_profile.name }}
            />
          </div>
		  <div className="mb-3">
            <Form.Label>Product Impressions</Form.Label>
            <p>{data.clicks}</p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Status;
