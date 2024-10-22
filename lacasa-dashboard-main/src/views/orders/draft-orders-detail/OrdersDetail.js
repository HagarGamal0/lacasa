import { HasAccess } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";
import Address from "./components/Address";
import Cart from "./components/Cart";
import Revenue from "./components/Revenue";
import Status from "./components/Status";

import "react-toastify/dist/ReactToastify.css";

const OrdersDetail = () => {
  const title = "New Abandoned Order Detail";
  const description = "Ecommerce New Abandoned Order Detail Page";
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [addressData, setAddressData] = useState();
  const [shippingID, setShippingID] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/draft_orders/${id}`)
      .then(async (response) => {
        console.log(response.data);
        setData(response.data);
        setAddressData(response.data.address);
        setShippingID(response.data.address.id);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = async (e, prodID) => {
    api
      .updateShipping(
        `/vendor/orders/${id}/products/${prodID}/status`,
        { _method: "PATCH", status: e.target.value }
        // prodID
      )
      .then((response) => {
        toast.success("Product Status Updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const onSubmitAddress = async (e) => {
    const newData = {
      ...addressData,
      default: 1,
      type: "shipping",
      _method: "PUT",
    };
    api
      .updateShipping(
        `/users/${data?.user.id}/addressbooks/${shippingID}`,
        newData
      )
      .then((response) => {
        setAddressData(response.data);
        if (response.errors) {
          setError(response.errors);
        } else {
          toast.success("Address is updated!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <HasAccess
      permissions="Edit Orders"
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
                to="/orders"
              >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Orders</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}
          </Row>
        </div>

        <Row>
          <Col xl="8" xxl="9">
            <Status data={data} />
            {/* <ActivityLog data={data}/> */}
            <Cart data={data} />
          </Col>
          <Col xl="4" xxl="3">
            <Address data={data} />
            <Revenue data={data} />
            <Row>
              <Col xl="12" xxl="12">
                <h2 className="small-title">Notes</h2>
                <Card className="mb-5 p-3">
                  {data?.notes === null
                    ? "No available notes."
                    : data?.notes.map((item, index) => (
                        <Col className="text-alternate" key={index}>
                          {item}
                        </Col>
                      ))}
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    </HasAccess>
  );
};

export default OrdersDetail;
