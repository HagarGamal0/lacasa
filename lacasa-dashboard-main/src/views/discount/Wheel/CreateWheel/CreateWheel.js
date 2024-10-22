import { HasAccess } from "@permify/react-role";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../../API/API";

import "react-toastify/dist/ReactToastify.css";
import "./CreateWheel.css";

const CreateWheel = () => {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState();
  const [categories, setCategories] = useState();
  const [soloCategories, setSoloCategories] = useState();
  const [showSubmit, setShowSubmit] = useState(true);

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
          arr.push({
            label: response.data[i].name,
            value: response.data[i].id,
          });
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

  const handleCategoriesSelected = (e) => {
    const arr = [];
    e.map((item) => {
      arr.push(item.value);
      return arr;
    });
    setSoloCategories(arr);
  };

  const onSubmit = async (data) => {
    data.products = {
      excluded_categories: soloCategories,
    };

    api
      .create("/wheel_offers", data)
      .then(async (response) => {
        if (response.data) {
          toast.success("Wheel Created Successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          await setShowSubmit(true);
        } else {
          setError(response?.errors);
          window.location.reload();
          await setShowSubmit(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <HasAccess
      permissions="Edit Settings"
      renderAuthFailed={<Unauthorized />}
      isLoading="loading..."
    >
      <>
        <form
          className="needs-validation add-product-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row>
            <Col xl="6">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                {...register("name", { required: "This field is required." })}
              />
              {error && error.coupon_code ? (
                <small className="text-danger">{error.coupon_code}</small>
              ) : (
                ""
              )}
            </Col>
            <Col xl="6">
              <Form.Label>Color</Form.Label>
              <input
                className="form-control input-fields-layout h-50"
                type="color"
                {...register("color", { required: "This field is required." })}
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="6">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                {...register("value", { required: "This field is required." })}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Winable</Form.Label>
              <Form.Select
                {...register("is_winable", {
                  required: "This field is required.",
                })}
              >
                <option value={0}>False</option>
                <option value={1}>True</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col xl="6">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                {...register("description", {
                  required: "This field is required.",
                })}
              />
            </Col>
            <Col xl="6">
              <Form.Label>Excluded Categories</Form.Label>
              <Select
                className="input-fields-layout"
                options={categories}
                onChange={handleCategoriesSelected}
                isMulti
              />
            </Col>
          </Row>
          <Row className="mt-5 d-flex justify-content-end">
            {showSubmit ? (
              <button type="submit" className="btn btn-primary w-50">
                Create Wheel
              </button>
            ) : (
              "Saving Coupon..."
            )}
          </Row>
        </form>
      </>
    </HasAccess>
  );
};

export default CreateWheel;
