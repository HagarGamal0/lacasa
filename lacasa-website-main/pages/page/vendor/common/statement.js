import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import API from "../../../../helpers/API/API";
import router from "next/router";
import ReactPaginate from "react-responsive-pagination";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { DateRangePicker } from "rsuite";
import moment from "moment";
var XLSX = require("xlsx");

const TableRow = ({
  date,
  commission,
  order_id,
  payment_method,
  product,
  credit,
  debit,
  subtotal,
  vendor_revenue,
}) => {
  return (
    <tr key={order_id}>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>{date}</td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
        {order_id}
      </td>
      <td
        style={{
          verticalAlign: "middle",
          textAlign: "center",
          textDecoration: "underline",
        }}
      >
        <Link href={`/product-details/${product.slug}`}>{product.name}</Link>
      </td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
        {payment_method}
      </td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
        {subtotal.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
      </td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
        {vendor_revenue.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
      </td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>
        {commission}
      </td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>{debit}</td>
      <td style={{ verticalAlign: "middle", textAlign: "center" }}>{credit}</td>
    </tr>
  );
};

const Statement = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [page, setPage] = useState(router.query.page ? router.query.page : 1);
  const [loading, setLoading] = useState(false);
  const [applyFilter, setApplyFilter] = useState(true);
  const [date, setDate] = useState({
    start: moment().date(-30).format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    API.readAll(
      `/statements?page=${page}&find[created_before]=${date.end}&find[created_after]=${date.start}`
    )
      .then(async (response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, applyFilter]);

  const handlePageChange = (event) => {
    router.push({ query: { active: router.query.active, page: event } });
    setPage(event);
  };

  const handleChangeFilter = (e) => {
    setFilter({ ...filter, ...{ [e.target.name]: e.target.value } });
  };

  const handleExport = async () => {
    const response = await API.readAll(
      `/export/statements?find[created_before]=${date.end}&find[created_after]=${date.start}`
    );
    downloadExcel(csvJSON(response));
  };
  function csvJSON(csvStr) {
    var lines = csvStr.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]?.replaceAll('"', "")] = currentline[j]?.replaceAll(
          '"',
          ""
        );
      }
      result.push(obj);
    }
    return result;
  }
  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "Statement.xlsx");
  };

  return (
    <div className="dashboard-section">
      <Row>
        <Col sm="12">
          <Card className="dashboard-table mt-0">
            <CardBody>
              <div className="top-sec">
                <h3>{t("Statement")}</h3>
                <a className="btn btn-sm btn-solid" onClick={handleExport}>
                  {t("Export")}
                </a>
              </div>
              <div className="d-flex flex-wrap align-items-center">
                <div className="mb-2">
                  <DateRangePicker
                    cleanable={false}
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
                <form className="form-group  d-md-flex">
                  <a
                    onClick={() => setApplyFilter(!applyFilter)}
                    className="mx-2 btn btn-sm btn-solid"
                  >
                    {t("Apply filter")}
                  </a>
                </form>
              </div>
              <div className="row">
                <div className="col-md-4 p-2">
                  <div className="card border">
                    <div className="card-body ">
                      <h4 className="card-text">{t("Total credit")}</h4>
                      <h6>
                        {data?.data.calculation.to_be_transferred_to_lacasa} LE
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 p-2">
                  <div className="card  border">
                    <div className="card-body">
                      <h4 className="card-text">{t("Total debit")}</h4>
                      <h6>
                        {data?.data.calculation.to_be_transferred_to_vendor} LE
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 p-2">
                  <div className="card  border">
                    <div className="card-body">
                      <h4 className="card-text">{t("Revenue")}</h4>
                      <h6>{data?.data.calculation.total_vendor_income} LE</h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 p-2">
                  <div className="card  border">
                    <div className="card-body">
                      <h4 className="card-text">{t("Account Manager")}</h4>
                      <h6>{data?.data.account_manager.name} </h6>
                      <h6>{data?.data.account_manager.email} </h6>
                      <h6>{data?.data.account_manager.phone} </h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 p-2">
                  <div className="card  border">
                    <div className="card-body">
                      <h4 className="card-text">{t("Lacasa commission")}</h4>
                      <h6>{data?.data.account_manager.commission}%</h6>
                    </div>
                  </div>
                </div>
              </div>

              <table className=" table-striped table-responsive-md table mb-0">
                <thead>
                  <tr>
                    <th scope="col" style={{ textAlign: "initial" }}>
                      {t("Date")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("Order ID")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("product_id")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("payment_method")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("subtotal")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("vendor_revenue")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("Lacasa commission")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("debit")}
                    </th>
                    <th scope="col" style={{ textAlign: "center" }}>
                      {t("credit")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.statement.data.map((data, i) => {
                    return (
                      <>
                        {loading ? (
                          ""
                        ) : (
                          <>
                            <TableRow
                              date={data.date}
                              commission={data.commission}
                              equation={data.equation}
                              is_complete={data.is_complete}
                              order_id={data.order_id}
                              payment_method={data.payment_method}
                              product={data.product}
                              shipping_status={data.shipping_status}
                              subtotal={data.subtotal}
                              vendor_revenue={data.vendor_revenue}
                              debit={data.to_be_transferred_to_lacasa}
                              credit={data.to_be_transferred_to_vendor}
                            />
                          </>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
              <div className="section-t-space">
                <div className="text-center">
                  <Row>
                    <Col xl="12" md="12" sm="12">
                      <div
                        id={"pagination"}
                        className="typo-content mb-5 d-flex justify-content-center pagination"
                      >
                        <ReactPaginate
                          current={parseInt(router.query.page)}
                          total={data ? data?.data.statement.last_page : 0}
                          onPageChange={handlePageChange}
                          previousLabel={"<"}
                          nextLabel={">"}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statement;
