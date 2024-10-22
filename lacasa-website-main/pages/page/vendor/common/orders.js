import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse,
} from "reactstrap";
import API from "../../../../helpers/API/API";
import router from "next/router";
import ReactPaginate from "react-responsive-pagination";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

var XLSX = require("xlsx");

const AllOrder = ({
  refresh,
  setRefresh,
  address,
  id,
  payment_method,
  revenue,
  no_products,
  products,
  total,
  shipping_fees,
  toggle,
}) => {
  const { t } = useTranslation();
  const [collapse, setCollapse] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onStatusChange = (status, note, product) => {
    API.create(
      product.available_status.type === "products"
        ? `/orders/${id}`
        : `/orders/${id}/shipments/${product.available_status.id}`,
      {
        _method: "PATCH",
        products: [product.id],
        status: status,
        notes: note,
      }
    )
      .then((response) => {
        setRefresh(!refresh);
        toast.success("Order status is updated!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleCollapse = () => {
    setCollapse(!collapse);
  };

  const handletoggleStatusModal = (product) => {
    setStatusModal({
      open: !statusModal.open,
      data: product ? product : false,
    });
  };

  const onSubmit = (data, product) => {
    if (data.status === ("Rejected" || "Returned") && data.note === "") {
      setError("note", { type: "focus", message: "This field is required" });
    } else {
      onStatusChange(data.status, data.note, product);
    }
  };

  return (
    <>
      <tr style={{ height: "60px" }}>
        <td
          style={{ zIndex: 100, width: "15%", textAlign: "center" }}
          scope="col"
        >
          {address ? (
            <i
              className="fa fa-address-card"
              style={{ cursor: address ? "pointer" : "not-allowed" }}
              onClick={() => {
                if (address) {
                  toggle(address);
                }
              }}
            ></i>
          ) : (
            <p>{t("Customer data show only in shipped status")}</p>
          )}
        </td>
        <td scope="row">{id}</td>
        <td>{shipping_fees}</td>
        <td>{payment_method}</td>
        <td>{no_products}</td>
        <td>{total}</td>
        <td>{revenue}</td>
        <td
          onClick={toggleCollapse}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {collapse ? t("Close") : t("Open")}
          {collapse ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-down"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
              />
            </svg>
          )}
        </td>
      </tr>

      <tr className="mb-5">
        <td colSpan={8} className={"hiddenRow"}>
          <Collapse isOpen={collapse}>
            <div className="p-2">
              <h3 className="float-right">
                {t("Products for Order#")}:{id}{" "}
              </h3>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="info">
                    <th>{t("ID")} #</th>
                    <th>{t("Name")}</th>
                    <th>{t("Sku")}</th>
                    <th>{t("Quantity")}</th>
                    <th>{t("Shipping Fees")}</th>
                    <th>{t("Shipped By")}</th>
                    <th>{t("price")}</th>
                    <th>{t("Attributes")}</th>
                    <th>{t("Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    return (
                      <tr>
                        <td>{product.id}</td>
                        <td>
                          <a
                            href={`https://lacasa-egy.com/product-details/${product.slug}`}
                            target={"_blank"}
                          >
                            {product.name}
                          </a>
                        </td>
                        <td>{product.sku}</td>
                        <td>{product.quantity}</td>
                        <td>{product.shipping_fees}</td>
                        <td>{product.shipping_provider?.name}</td>
                        <td>{product.price}</td>
                        {product.attributes.length > 0 ? (
                          <>
                            {product.attributes.map((item) => {
                              if (item?.options) {
                                return (
                                  <>
                                    <td>
                                      {item?.options?.map((attr, i) => (
                                        <div>
                                          {attr.attribute}: {attr.value}
                                        </div>
                                      ))}
                                    </td>
                                  </>
                                );
                              } else {
                                return (
                                  <div>
                                    {item.attribute}: {item.value}
                                  </div>
                                );
                              }
                            })}
                          </>
                        ) : (
                          <td>{t("No Attributes")}</td>
                        )}
                        <td>
                          {product.status ===
                          ("Arrived" || "Failed To Deliver") ? (
                            <p>{product.status}</p>
                          ) : (
                            <button
                              className="btn btn-sm btn-solid"
                              onClick={() => handletoggleStatusModal(product)}
                            >
                              {" "}
                              Status
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Modal
                dir={t("dir")}
                isOpen={statusModal.open}
                toggle={handletoggleStatusModal}
                className="modal-md quickview-modal"
                centered
              >
                <ModalHeader toggle={handletoggleStatusModal}>
                  {t("Customer Address")}
                </ModalHeader>
                <ModalBody className="p-4">
                  <form
                    onSubmit={handleSubmit((e) =>
                      onSubmit(e, statusModal?.data)
                    )}
                  >
                    {statusModal.data ? (
                      <div>
                        <select
                          defaultValue={statusModal?.data.status}
                          className="form-control"
                          {...register("status", {
                            required: "Status field is required*",
                          })}
                          required={true}
                        >
                          <option value={statusModal?.data.status}>
                            {statusModal?.data.status}
                          </option>
                          {statusModal?.data?.available_status?.statuses.map(
                            (status) => {
                              return <option value={status}>{status}</option>;
                            }
                          )}
                        </select>
                        <textarea
                          {...register("note")}
                          placeholder={t("Note")}
                          className="mt-2 mb-2 form-control"
                        />
                        <ErrorMessage
                          errors={errors}
                          name="note"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                              className="mb-4"
                            >
                              {message}
                            </p>
                          )}
                        />
                        <button type="submit" className="btn btn-sm btn-solid">
                          Update
                        </button>
                      </div>
                    ) : null}
                  </form>
                </ModalBody>
              </Modal>
            </div>
          </Collapse>
        </td>
      </tr>
    </>
  );
};

const Orders = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [page, setPage] = useState(router.query.page ? router.query.page : 1);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applyFilter, setApplyFilter] = useState(true);
  const [modalData, setModalData] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [date, setDate] = useState({
    start: moment().date(-30).format("YYYY-MM-DD"),
    end: moment().format("YYYY-MM-DD"),
  });

  const [filter, setFilter] = useState({
    phone: "",
    order_id: "",
    productName: "",
    status: "",
    from: "",
    to: "",
  });

  const toggle = async (address) => {
    if (!modal) {
      await setModalData(address);
    }
    await setModal(!modal);
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    API.readAll(
      `/vendor/orders?page=${page}&find[id]=${filter.order_id}&find[products.status]=${filter.status}&find[created_before]=${date.end}&find[created_after]=${date.start}`
    )
      .then(async (response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, applyFilter, refresh]);

  const handlePageChange = (event) => {
    router.push({ query: { active: router.query.active, page: event } });
    setPage(event);
  };

  const handleChangeFilter = (e) => {
    setFilter({ ...filter, ...{ [e.target.name]: e.target.value } });
  };

  const handleExport = async () => {
    const response = await API.readAll(
      `/export/orders?find[created_before]=${date.end}&find[created_after]=${date.start}`
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
    XLSX.writeFile(workbook, "Orders.xlsx");
  };

  return (
    <>
      <Row>
        <Col sm="12">
          <Card className="dashboard-table mt-0">
            <CardBody>
              <div className="top-sec">
                <h3>{t("Orders")}</h3>
                <a
                  onClick={() => handleExport()}
                  className="btn btn-sm btn-solid"
                >
                  {t("Export")}
                </a>
              </div>

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
              <div className="form-group  d-md-flex">
                <input
                  type="number"
                  className="mr-2 mb-2 form-control"
                  name="order_id"
                  id="search"
                  onChange={handleChangeFilter}
                  placeholder={t("Search by Order Id")}
                />
                <select
                  onChange={handleChangeFilter}
                  name="status"
                  className="form-control"
                  style={{ width: "100%", backgroundColor: "transparent" }}
                >
                  <option value="">{t("Filter By Status")}</option>
                  <option value="Pending Confirmation">
                    {t("Pending Confirmation")}
                  </option>
                  <option value="Pending Payment">
                    {t("Pending Payment")}
                  </option>
                  <option value="Customer Confirmed">
                    {t("Customer Confirmed")}
                  </option>
                  <option value="Processing">{t("Processing")}</option>
                  <option value="Ready To Ship">{t("Ready To Ship")}</option>
                  <option value="Shipped">{t("Shipped")}</option>
                  <option value="Arrived">{t("Arrived")}</option>
                  <option value="Returned">{t("Returned")}</option>
                  <option value="Rejected">{t("Rejected")}</option>
                  <option value="Refunded">{t("Refunded")}</option>
                  <option value="Failed To Deliver">
                    {t("Failed To Deliver")}
                  </option>
                </select>
              </div>
              <a
                onClick={() => setApplyFilter(!applyFilter)}
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: "auto",
                  textAlign: "initial",
                }}
                className="btn btn-sm btn-solid"
              >
                {t("Apply filter")}
              </a>
              <table className="table table-responsive-sm mb-0">
                <thead>
                  <tr>
                    <th scope="col">{t("View Address")}</th>
                    <th scope="col">{t("Order ID")}</th>
                    <th scope="col">{t("Shipping Fees")}</th>
                    <th scope="col">{t("Payment_method")}</th>
                    <th scope="col">{t("Products No.")}</th>
                    <th scope="col">{t("Total")}</th>
                    <th scope="col">{t("Revenue")}</th>
                    <th>{t("Products")}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.map((item, i) => {
                    return (
                      <>
                        {loading ? (
                          ""
                        ) : (
                          <AllOrder
                            refresh={refresh}
                            setRefresh={setRefresh}
                            key={i}
                            id={item.id}
                            payment_method={item.transaction_detail.type}
                            products={item.items}
                            no_products={item.items.length}
                            status={item.status}
                            revenue={item.items
                              .filter((product) => product.revenue)
                              .reduce((a, b) => a + b.revenue, 0)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                            total={item.items
                              .filter((product) => product.total)
                              .reduce((a, b) => a + b.total, 0)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                            shipping_fees={item.items
                              .filter((product) => product.shipping_fees)
                              .reduce((a, b) => a + b.shipping_fees, 0)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                            address={item?.shipping_details?.shipping_address}
                            toggle={toggle}
                          />
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
                          total={data ? data?.meta.last_page : 0}
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
      <Modal
        dir={t("dir")}
        isOpen={modal}
        toggle={toggle}
        className="modal-md quickview-modal"
        centered
      >
        <ModalHeader toggle={toggle}>{t("Customer Address")}</ModalHeader>
        <ModalBody className="p-4">
          <Row>
            <Col lg="12" xs="12" style={{ textAlign: "initial" }}>
              <h5>
                {t("Name")}: {modalData.first_name} {modalData.last_name}
              </h5>
              <h5>
                {t("Email")}: {modalData.email}
              </h5>
              <h5>
                {t("Phone number")}: {modalData.phone}
              </h5>
              <h5>
                {t("City")}: {modalData.city}
              </h5>

              <h5>
                {t("Area")}: {modalData.area}
              </h5>
              <h5>
                {t("Address")}: {modalData.address}
              </h5>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-solid btn-custom"
            color="secondary"
            onClick={toggle}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Orders;
