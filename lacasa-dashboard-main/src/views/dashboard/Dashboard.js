/* eslint-disable no-plusplus */
import React, { useEffect, useState } from "react";

import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import api from "../../API/API";
import LineChart from "./components/LineChart";

const Dashboard = () => {
  const title = "Dashboard";
  const description = "Ecommerce Dashboard Page";
  const [productData, setProductData] = useState(0);
  const [ordersData, setOrdersData] = useState(0);
  const [usersData, setUsersData] = useState(0);
  const [vendorsData, setVendorsData] = useState(0);
  const [labels, setLabels] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [analyticalData, setAnalyticalData] = useState();

  const formatDate = (date) => {
    if (date !== undefined) {
      const d = new Date(date);
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
      const year = d.getFullYear();

      if (month.length < 2) month = `0${month}`;
      if (day.length < 2) day = `0${day}`;

      return [year, month, day].join("-");
    }
    return "No date available";
  };

  function Last7Days() {
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 90);
    const result = formatDate(sixDaysAgo);
    return result;
  }

  useEffect(() => {
    const labelsArr = [];
    const dataArr = [];
    const today = new Date();
    api
      .readAll(
        `/analytics/orders?find[created_before]=${formatDate(
          today
        )}&find[created_after]=${Last7Days()}`
      )
      .then(async (response) => {
        setAnalyticalData(response.data);
        response.data.chart1.months.map((item, index) => labelsArr.push(item));
        response.data.chart1.total_sales.map((item, index) =>
          dataArr.push(item)
        );
        await setLabels(labelsArr);
        await setDataSet(dataArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .readAll(`/products`)
      .then(async (response) => {
        setProductData(response.meta.total);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .readAll(`/orders`)
      .then(async (response) => {
        setOrdersData(response.meta.total);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .readAll(`/vendors`)
      .then(async (response) => {
        setVendorsData(response.meta.total);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .readAll(`/users`)
      .then(async (response) => {
        setUsersData(response.meta.total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-container">
        <NavLink
          className="muted-link pb-1 d-inline-block hidden breadcrumb-back"
          to="/"
        >
          <span className="align-middle text-small ms-1">&nbsp;</span>
        </NavLink>
        <h1 className="mb-0 pb-0 display-4" id="title">
          Welcome, Admin!
        </h1>
      </div>
      {/* Title End */}

      {/* Stats Start */}
      <div className="d-flex">
        <h2 className="small-title">Stats</h2>
      </div>
      <Row className="mb-5 g-2">
        <Col xs="6" md="3" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <NavLink to="/products/list">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                  <CsLineIcons icon="shop" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  PRODUCTS
                </div>
                <div className="text-primary cta-4">{productData}</div>
              </Card.Body>
            </NavLink>
          </Card>
        </Col>

        <Col xs="6" md="3" lg="3">
          <Card className="h-100 hover-scale-up ">
            <NavLink to="/orders/list">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                  <CsLineIcons icon="cart" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  ORDERS
                </div>
                <div className="text-primary cta-4">{ordersData}</div>
              </Card.Body>
            </NavLink>
          </Card>
        </Col>
        <Col xs="6" md="3" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <NavLink to="/vendors/list">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                  <CsLineIcons icon="user" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  VENDORS
                </div>
                <div className="text-primary cta-4">{vendorsData}</div>
              </Card.Body>
            </NavLink>
          </Card>
        </Col>
        <Col xs="6" md="3" lg="3">
          <Card className="h-100 hover-scale-up cursor-pointer">
            <NavLink to="/users/list">
              <Card.Body className="d-flex flex-column align-items-center">
                <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary mb-4">
                  <CsLineIcons icon="user" className="text-primary" />
                </div>
                <div className="mb-1 d-flex align-items-center text-alternate text-small lh-1-25">
                  USERS
                </div>
                <div className="text-primary cta-4">{usersData}</div>
              </Card.Body>
            </NavLink>
          </Card>
        </Col>
        <LineChart labels={labels} dataSet={dataSet} />
      </Row>
      <div className="d-flex">
        <h2 className="small-title">Trending Products</h2>
      </div>
      <Card>
        <Card.Body>
          <Row className="g-0 mb-2 d-none d-lg-flex p-5">
            <Col xs="auto" className="sw-11 d-none d-lg-flex" />
            <Col>
              <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
                <Col xs="2" lg="3" className=" mb-lg-0 pe-3">
                  <div className="text-muted text-small">NAME</div>
                </Col>
                <Col
                  xs="2"
                  lg="3"
                  className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                >
                  <div>
                    <div className="text-muted text-small">PRICE</div>
                  </div>
                </Col>
                <Col
                  xs="2"
                  lg="3"
                  className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                >
                  <div className="text-muted text-small">SALES</div>
                </Col>
                <Col
                  xs="2"
                  lg="3"
                  className="d-flex flex-column mb-lg-0 pe-3 d-flex"
                >
                  <div className="text-muted text-small">SLUG</div>
                </Col>
              </Row>
            </Col>
          </Row>
          {analyticalData?.trending.map((item, index) => (
            <Card className="mb-2 p-3" key={index}>
              <NavLink to={`/products/detail/${item.slug}`}>
                <Row className="g-0 h-100 sh-lg-9 position-relative">
                  <Col xs="auto" className="position-relative ">
                    <img
                      src={`${item.image}`}
                      alt="product broken image"
                      className="card-img card-img-horizontal sh-9 sw-11 h-100"
                    />
                  </Col>
                  <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                    <Row className="g-0 h-100 align-content-center">
                      <Col
                        lg="3"
                        className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center"
                      >
                        <NavLink to={`/products/detail/${item.slug}`}>
                          <small>{item.name}</small>
                        </NavLink>
                      </Col>
                      <Col
                        lg="3"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <div className="lh-1 text-alternate">{item.price}</div>
                        <small className="text-muted">EGP</small>
                      </Col>
                      <Col
                        lg="3"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <div className="lh-1 text-alternate">{item.sales}</div>
                      </Col>
                      <Col
                        lg="3"
                        className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3"
                      >
                        <div className="lh-1 text-alternate">{item.slug}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </NavLink>
            </Card>
          ))}
        </Card.Body>
      </Card>
    </>
  );
};

export default Dashboard;
