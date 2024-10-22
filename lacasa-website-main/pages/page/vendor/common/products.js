import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Media,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import API from "../../../../helpers/API/API";
import router from "next/router";
import ReactPaginate from "react-responsive-pagination";
import { useTranslation } from "react-i18next";
var XLSX = require("xlsx");
const AllProduct = ({
  id,
  img,
  productName,
  price,
  price_after_sale,
  discount,
  status,
  sku,
  handleEdit,
  handleDelete,
  quantity,
  toggle,
  stock,
}) => {
  return (
    <tr key={id}>
      <td style={{ verticalAlign: "middle" }}>{id}</td>
      <td style={{ verticalAlign: "middle" }}>{productName}</td>
      <td style={{ verticalAlign: "middle" }}>
        {price.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
      </td>
      <td style={{ verticalAlign: "middle" }}>
        {price_after_sale.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
      </td>
      <td style={{ verticalAlign: "middle" }}>{status}</td>
      <td style={{ verticalAlign: "middle" }}>{sku}</td>
      <td style={{ verticalAlign: "middle" }} scope="row">
        <div className={"justify-content-center d-flex"}>
          <Media
            style={{ width: "80px", height: "80px" }}
            src={img}
            className="blur-up lazyloaded"
          />
        </div>
      </td>
      <td style={{ verticalAlign: "middle" }} scope="col">
        <center>
          <i
            className="fa fa-solid fa-eye"
            style={{ cursor: "pointer" }}
            onClick={() =>
              toggle(id, productName, price, quantity, discount, stock)
            }
          ></i>
        </center>
      </td>
      <td style={{ verticalAlign: "middle" }}>
        <center>
          <i
            style={{ fontSize: "24px" }}
            className="fa fa-pencil-square-o mr-1"
            aria-hidden="true"
            onClick={() => handleEdit(id)}
          ></i>
          {status === "draft" ? (
            <></>
          ) : (
            <i
              style={{ fontSize: "24px" }}
              className="fa fa-trash-o ml-1"
              aria-hidden="true"
              onClick={() => handleDelete(id)}
            ></i>
          )}
        </center>
      </td>
    </tr>
  );
};

const Products = ({ setToggleAddProduct, setToggleEditProduct }) => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [page, setPage] = useState(router.query.page ? router.query.page : 1);
  const [categories, setCategories] = useState();
  const [deleted, setDeleted] = useState(0);
  const [filter, setFilter] = useState({
    category: "",
    productId: "",
    productName: "",
  });
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [savedData, setSavedData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applyFilter, setApplyFilter] = useState(true);

  const toggle = async (id, productName, price, quantity, sales, stock) => {
    if (!modal) {
      await setModalData({
        id: id,
        name: productName,
        price: price,
        quantity: quantity,
        discount: sales,
        stock: stock,
      });
    }
    await setModal(!modal);
  };
  useEffect(() => {
    API.readAll("/vendor/used_categories")
      .then((response) => setCategories(response.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    API.readAll(
      `/vendor/products?page=${page}&find[id]=${filter.productId}&find[name]=${filter.productName}&find[category]=${filter.category}`
    )
      .then(async (response) => {
        setData(response);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page, deleted, applyFilter, savedData]);

  const handleEdit = async (id) => {
    router.push({
      pathname: "/page/vendor/vendor-dashboard",
      query: { id: id },
    });
    await setToggleEditProduct(true);
  };
  const handlePageChange = (event) => {
    router.push({ query: { active: router.query.active, page: event } });
    setPage(event);
  };

  const handleDelete = (id) => {
    API.delete(`/vendor/products`, id)
      .then((response) => {
        setDeleted(deleted + 1);
      })
      .catch((err) => console.log(err));
  };
  const handleChangeFilter = (e) => {
    setFilter({ ...filter, ...{ [e.target.name]: e.target.value } });
  };
  const handleChangeModalData = (e) => {
    setModalData({ ...modalData, ...{ [e.target.name]: e.target.value } });
  };
  const handleSubmit = () => {
    API.create(`/vendor/products/${modalData.id}`, {
      _method: "PUT",
      name: modalData.name,
      stock: modalData.stock,
    })
      .then((response) => {
        if (response.data) {
          setModal(!modal);
          setSavedData(!savedData);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleExport = async () => {
    const response = await API.readAll(`/vendors/products/export`);
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
    XLSX.writeFile(workbook, "Products.xlsx");
  };

  return (
    <div className="dashboard-section">
      <Row>
        <Col sm="12">
          <Card className="dashboard-table mt-0">
            <CardBody>
              <div className="top-sec">
                <h3>{t("all products")}</h3>

                <a
                  onClick={() => setToggleAddProduct(true)}
                  className="btn btn-sm btn-solid"
                >
                  {t("add product")}
                </a>

                <a
                  onClick={() => handleExport()}
                  className="btn btn-sm btn-solid"
                >
                  {t("Export")}
                </a>
              </div>
              <form className="form-group mx-sm-3 d-md-flex">
                <input
                  type="tel"
                  className="mr-2 mb-2 form-control"
                  name="productId"
                  id="search"
                  onChange={handleChangeFilter}
                  placeholder={t("Search by product #")}
                ></input>
                <input
                  type="text"
                  className="mr-2 mb-2 form-control"
                  name="productName"
                  id="search"
                  onChange={handleChangeFilter}
                  placeholder={t("Search by Product Name")}
                ></input>
                <select
                  onChange={handleChangeFilter}
                  name="category"
                  className="form-control"
                  style={{ width: "100%", backgroundColor: "transparent" }}
                >
                  <option value="">{t("Filter by category")}</option>
                  {categories?.map((category) => (
                    <option value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </form>
              <form className="form-group mx-sm-3 d-md-flex">
                <a
                  onClick={() => setApplyFilter(!applyFilter)}
                  className="btn btn-sm btn-solid"
                >
                  {t("Apply filter")}
                </a>
              </form>
              <table className=" table-striped table-responsive-md table mb-0">
                <thead>
                  <tr>
                    <th scope="col">ID #</th>
                    <th scope="col">{t("product name")}</th>
                    <th scope="col">{t("price")}</th>
                    <th scope="col">{t("Price after sale")}</th>
                    <th scope="col">{t("Status")}</th>
                    <th scope="col">{t("Sku")}</th>
                    <th scope="col">{t("image")}</th>
                    <th scope="col">
                      <center>{t("Quick edit")}</center>
                    </th>
                    <th scope="col">
                      <center>
                        {t("Edit")}/{t("Delete")}
                      </center>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.products.items.map((data, i) => {
                    return (
                      <>
                        {loading ? (
                          ""
                        ) : (
                          <AllProduct
                            id={data.id}
                            img={data.images[0]?.url}
                            productName={data.name}
                            price={data.price}
                            sku={data.sku}
                            quantity={data.quantity}
                            price_after_sale={data.price_after_sale}
                            discount={data.discount}
                            status={data.status}
                            stock={data.stock}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
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
        isOpen={modal}
        toggle={toggle}
        className="modal-md quickview-modal"
        dir={t("dir")}
        centered
      >
        <ModalHeader toggle={toggle}>{t("Qick edit")}</ModalHeader>
        <ModalBody className="p-4">
          <Row>
            <Col lg="12" xs="12">
              <h5 className=" text-initial">
                {t("product name")}:{" "}
                <input
                  onChange={handleChangeModalData}
                  className="mb-2 form-control"
                  name={"name"}
                  defaultValue={modalData.name}
                />
              </h5>
              <h5 className="text-initial">
                {t("stock")}:
                <input
                  defaultValue={modalData.quantity}
                  type={"number"}
                  name={"stock"}
                  onChange={handleChangeModalData}
                  className="form-control"
                  placeholder={t("Stock")}
                />
              </h5>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn-solid btn-custom"
            color="secondary"
            onClick={handleSubmit}
          >
            {t("Save")}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Products;
