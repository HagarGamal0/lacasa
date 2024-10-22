import React, { useEffect, useState } from "react";
import { Row, Col, Media, Card, CardBody } from "reactstrap";
import order from "../../../../public/assets/images/icon/dashboard/order.png";
import sale from "../../../../public/assets/images/icon/dashboard/sale.png";
import homework from "../../../../public/assets/images/icon/dashboard/homework.png";
import dynamic from "next/dynamic";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import moment from "moment";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { apexPieChart, lineChart1 } from "../../../../data/vendorData";
import API from "../../../../helpers/API/API";
import { Fragment } from "react";

const SummaryTable = ({ img, title, desc }) => {
  return (
    <Col md="4">
      <div className="counter-box mb-4">
        <Media src={img} className="img-fluid" />
        <div>
          <h3>{title}</h3>
          <h5>{desc}</h5>
        </div>
      </div>
    </Col>
  );
};

const TrendingProduct = ({ img, productName, price, sales }) => {
  return (
    <tr>
      <th scope="row">
        <Media
          style={{ width: 50, height: 50 }}
          src={img}
          className="blur-up lazyloaded"
        />
      </th>
      <td>{productName}</td>
      <td>
        {parseInt(price)
          ?.toFixed(0)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
        LE
      </td>
      <td>{sales}</td>
    </tr>
  );
};

const RecentOrder = ({ id, productDetails, status }) => {
  return (
    <tr>
      <th scope="row">{id}</th>
      <td>{productDetails}</td>
      <td>{status}</td>
    </tr>
  );
};

const Summary = () => {
  const [data, setData] = useState(false);
  const [date, setDate] = useState({
    start: moment().date(-30).format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.readAll(`/vendor/orders`)
      .then(async (response) => {
        setOrders(
          response.data.reduce(
            (accumulator, currentValue) => [
              ...accumulator,
              ...currentValue.items.map((item) => ({
                ...item,
                ...{ order_id: currentValue.id },
              })),
            ],
            []
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    API.readAll(
      `/analytics/orders?find[created_before]=${date.end}&find[created_after]=${date.start}`
    )
      .then(async (response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [date]);

  const SummaryData = [
    {
      img: order,
      title: data?.products?.count,
      desc: "Ordered Products",
    },
    {
      img: sale,
      title: data?.sales?.total + " LE",
      desc: "Delivered Total Sales",
    },
    {
      img: homework,
      title: data?.orders?.count,
      desc: "Number Of Orders",
    },
  ];

  const lineChart = {
    ...lineChart1,
    ...{
      ...lineChart1.options,
      ...{
        options: {
          ...lineChart1.options,
          ...{
            xaxis: {
              ...lineChart1.options.xaxis,
              ...{ name: "Month", categories: data?.chart1?.months },
            },
          },
        },
        series: [
          {
            name: "Value",
            data: data?.chart1?.total_sales,
          },
        ],
      },
    },
  };

  const apexPieChart1 = {
    ...apexPieChart,
    ...{
      series: [
        data?.products?.pending,
        data?.products?.processing,
        data?.products?.arrived,
        data?.products?.returned_rejected_refunded,
      ],
    },
  };

  return (
    <>
      <div className="mb-2">
        <DateRangePicker
          format="yyyy-MM-dd"
          style={{ width: 330 }}
          placeholder={`Last 30 days`}
          onOk={(e) =>
            setDate({
              start: moment(e[0]).format("YYYY-MM-DD"),
              end: moment(e[1]).format("YYYY-MM-DD"),
            })
          }
        />
      </div>
      {data && (
        <Fragment>
          <div className="counter-section">
            <Row>
              {SummaryData.map((data, i) => {
                return (
                  <SummaryTable
                    key={i}
                    img={data.img}
                    title={data.title}
                    desc={data.desc}
                  />
                );
              })}
            </Row>
          </div>
          <Row className="mb-4">
            <Col md="7">
              <Card>
                <CardBody>
                  <div id="chart-order">
                    <Chart
                      options={lineChart.options}
                      series={lineChart.series}
                      height={150}
                      type="area"
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="5">
              <Card>
                <CardBody>
                  <div id="chart-order">
                    <Chart
                      options={apexPieChart1.options}
                      series={apexPieChart1.series}
                      type="donut"
                      height={200}
                      width={380}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              <Card className="dashboard-table">
                <CardBody>
                  <h3>Trending products</h3>
                  <table className="table mb-0 table-responsive-sm">
                    <thead>
                      <tr>
                        <th scope="col">image</th>
                        <th scope="col">product name</th>
                        <th scope="col">price</th>
                        <th scope="col">sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.trending?.slice(0, 5).map((data, i) => {
                        return (
                          <TrendingProduct
                            key={i}
                            img={data.image}
                            productName={data.name}
                            price={data.price}
                            sales={data.sales}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="dashboard-table">
                <CardBody>
                  <h3>Recent orders</h3>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">order #</th>
                        <th scope="col">product details</th>
                        <th scope="col">status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((data, i) => {
                        return (
                          <RecentOrder
                            key={i}
                            id={data.order_id}
                            productDetails={data.name}
                            status={data.status}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Fragment>
      )}
    </>
  );
};

export default Summary;
