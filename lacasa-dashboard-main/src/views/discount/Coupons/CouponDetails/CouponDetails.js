import { HasAccess } from "@permify/react-role";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Unauthorized from "views/default/Unauthorized";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../API/API";

import "./CouponDetails.css";

const CreateCoupon = ({ Link }) => {
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    api
      .readAll(`/coupons/${id}`)
      .then(async (response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const updateCoupon = () => {
    console.log(data);
    try {
      api
        .updateCupon(`/coupons/${id}`, {
          ...data,
          expiry: data.expiry.split(" ")[0],
          max_discount: 0,
          max_purchase: 0,
          products: [""],
        })
        .then(async (response) => {
          console.log(response);
          if (response.errors) {
            toast.error(response.errors[Object.keys(response.errors)[0]][0]);
          } else {
            setData(response.data);
            toast.success("Coupon updated");
          }
        })
        .catch((err) => {
          console.log(err);
          // toast.error()
        });
    } catch (error) {
      console.log(error);
    }
  };
  const onchange = (e) => {
    console.log(e.target.name);
    const inputName = e.target.name;
    setData({ ...data, [inputName]: e.target.value });
  };
  console.log(data);
  return (
    <HasAccess
      permissions="Edit Settings"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
        <form className="needs-validation add-product-form">
          <Row>
            <Col xl="6">
              <Form.Label>Coupon Code</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="coupon_code"
                type="text"
                value={data?.coupon_code}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Allocation Method</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="allocation_method"
                type="text"
                value={data?.allocation_method}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="6">
              <Form.Label>New Users Only</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="first_order"
                type="text"
                value={data?.first_order === 0 ? "False" : "True"}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Number Of Usage</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="usage_limit"
                type="text"
                min={0}
                value={data?.usage_limit}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="6">
              <Form.Label>Minimum Quantity</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="min_quantity"
                type="number"
                min={0}
                value={data?.min_quantity}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Minimum Purchase</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="min_purchase"
                type="number"
                min={0}
                value={data?.min_purchase}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="6">
              <Form.Label>Limit Per User</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="usage_limit_per_user"
                type="number"
                min={0}
                value={data?.usage_limit_per_user}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Discount Type</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="discount_type"
                type="text"
                min={0}
                value={data?.discount_type}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="12">
              <Form.Label>Discount Value</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="discount_value"
                type="number"
                min={0}
                value={data?.discount_value}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="6">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="start_date"
                type="text"
                min={0}
                value={data?.start_date}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                onChange={(e) => onchange(e)}
                name="expiry"
                type="text"
                value={data?.expiry}
              />
            </Col>
          </Row>
          <div style={{ marginTop: "5px", textAlign: "end" }}>
            <Button
              variant="outline-primary"
              onClick={updateCoupon}
              className="btn-icon btn-icon-start w-100 w-md-auto"
            >
              <span>Save</span>
            </Button>
          </div>
        </form>
      </>
    </HasAccess>
  );
};

export default CreateCoupon;
