import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Media,
  Form,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
} from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import API from "../../../../helpers/API/API";
import Select from "react-select";
import imageCompression from "browser-image-compression";
import { EditorState, convertToRaw } from "draft-js";
import dynamic from "next/dynamic";
import draftToHtml from "draftjs-to-html";
import { useTranslation } from "react-i18next";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const AddProduct = ({ setToggleAddProduct }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    getValues,
    setValue: setFormValue,
    formState: { data, errors },
    watch,
  } = useForm();
  const [error, setError] = useState({});
  const [valueAtt, setValueAtt] = useState([]);
  const [value, setValue] = useState([]);
  const [sizePrice, setSizePrice] = useState({});
  const [category, setCategory] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [attributeValue, setAttributeValue] = useState([]);
  const [image, setImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [modal2, setModal2] = useState(false);
  const toggle2 = () => setModal2(!modal2);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  useEffect(() => {
    API.readAll("/categories")
      .then(async (response) => {
        const category = [];
        response.data.map((item, index) => {
          if (item.childs.length > 0) {
            item.childs.map((item) => {
              category.push({ value: item.id, label: item.name });
            });
          } else {
            category.push({ value: item.id, label: item.name });
          }
        });
        await setCategory(category);
      })
      .catch((error) => {
        console.log(error);
      });
    API.readAll("/attributes")
      .then(async (response) => {
        const arr = [];
        response.data.map((item, index) => {
          arr.push({ value: item.id, label: item.name });
        });
        await setAttributes(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangecategoryies = (e) => {
    const arr = [];
    for (let i = 0; i < e.length; i++) {
      arr.push(e[i].value);
    }
    setCategories(arr);
  };

  const handleChangeAttributes = async (e) => {
    setValue([]);
    setValueAtt(e);
    setIsLoading(true);
    const arr = [];
    if (Number.isInteger(e.value)) {
      API.read("/attributes", e.value)
        .then(async (response) => {
          response.data.values.map((item, index) => {
            arr.push({ value: item.id, label: item.value });
          });
          await setAttributeValue(arr);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAddAttributes = async () => {
    const value = document.getElementById("newAttribute").value;
    if (attributes.find(({ label }) => label === value)) {
      setError({
        ...error,
        ...{ attributes: "This attribute is already used" },
      });
    } else if (value === "") {
      setError({ ...error, ...{ attributes: "Please Enter attribute" } });
    } else {
      setAttributes([...attributes, { value: value, label: value }]);
      setValueAtt({ value: value, label: value });
      setAttributeValue([]);
      toggle();
      setError({});
      setValue([]);
    }
  };

  const handleChangeAttributeValue = (_, action) => {
    switch (action.action) {
      case "select-option": {
        setValue([...value, action.option]);
        break;
      }
      default: {
        setValue([
          ...value.filter((o) => o.value !== action.removedValue.value),
        ]);
        break;
      }
    }
  };

  const handleAddAttributeValue = async (e) => {
    setIsLoading(true);
    const data = document.getElementById("newValue").value;
    if (attributeValue.find(({ label }) => label === data)) {
      setError({ ...error, ...{ values: "This value is already used" } });
    } else if (value === "") {
      setError({ ...error, ...{ values: "Please Enter Value" } });
    } else {
      await setAttributeValue([
        ...attributeValue,
        { value: data, label: data },
      ]);
      setValue([...value, { value: data, label: data }]);
      toggle2();
      setError({});
      setIsLoading(false);
    }
  };

  const addAttribute = async () => {
    setIsLoadingTable(true);
    if (valueAtt.label && value.length > 0) {
      if (valueAtt.value === 3 && value.length > 0) {
        const sizeArr = tableData.filter((e) => e.key === "Size");
        if (sizeArr.length > 0) {
          var arr = sizeArr[0].value;
          for (let i = 0; i < value.length; i++) {
            arr.push({
              ...sizeArr[0].value,
              ...{
                value: value[i].label,
                price: sizePrice.price,
                price_after_sale: sizePrice.price_after_sale,
              },
            });
          }
          const dataArr = tableData.filter((e) => e.key !== "Size");
          await setTableData([...dataArr, { key: valueAtt.label, value: arr }]);
        } else {
          var arr = [];
          for (let i = 0; i < value.length; i++) {
            arr.push({
              value: value[i].label,
              price: sizePrice.price,
              price_after_sale: sizePrice.price_after_sale,
            });
          }
          await setTableData([
            ...tableData,
            { key: valueAtt.label, value: arr },
          ]);
        }
      } else {
        var arr = [];
        for (let i = 0; i < value.length; i++) {
          arr.push({ value: value[i].label });
        }
        await setTableData([...tableData, { key: valueAtt.label, value: arr }]);
      }
      setError({});
      setValue([]);
      setValueAtt([]);
    } else if (valueAtt.value === 2) {
      var arr = [];
      await setTableData([...tableData, { key: valueAtt.label, value: arr }]);
      setError({});
      setValue([]);
      setValueAtt([]);
    }
  };

  const handleClearAtt = async (index) => {
    await setIsLoadingTable(false);
    var arr = tableData;
    for (var i = 0; i < arr.length; i++) {
      if (i === index) {
        arr.splice(i, 1);
      }
    }
    await setTableData(arr);
    await setIsLoadingTable(true);
  };

  const handleImage = async (e) => {
    const arr = [];
    if (image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        arr.push(image[i]);
      }
    }
    for (let i = 0; i < e.target.files.length; i++) {
      const imageFile = e.target.files[i];
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(imageFile, options);
        arr.push(compressedFile);
      } catch (error) {
        console.log(error);
      }
    }
    setImage(arr);
  };

  const handleDeleteImage = async (e) => {
    const arr = image;
    await setImage([]);
    for (let i = 0; i < arr.length; i++) {
      if (i == e.target.id) {
        arr.splice(i, 1);
      }
    }
    setImage(arr);
  };

  const handleChangeEditor = async (e) => {
    setEditorState(e);
  };

  const onSubmit = async (data) => {
    var formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append(
      "short_description",
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    formData.append("price", data.price);
    formData.append("discount", parseInt(data.discount));
    formData.append("discount_type", data.discount_type);
    formData.append("featured", data.featured);
    formData.append("stock", data.stock);
    formData.append("sku", data.sku);
    for (let i = 0; i < image.length; i++) {
      formData.append("images[]", image[i]);
    }
    for (let i = 0; i < categories.length; i++) {
      formData.append("categories[]", categories[i]);
    }

    for (let i = 0; i < tableData.length; i++) {
      formData.append(`attributes[${i}][name]`, tableData[i].key);
      if (tableData[i].value.length <= 0) {
        formData.append(`attributes[${i}][values][0][title]`, 0);
      }
      tableData[i].value.map((item, index) => {
        formData.append(
          `attributes[${i}][values][${index}][title]`,
          item.value
        );
        if (item.price > 0) {
          formData.append(
            `attributes[${i}][values][${index}][price]`,
            item.price
          );
          formData.append(
            `attributes[${i}][values][${index}][price_after_sale]`,
            item.price_after_sale
          );
        }
      });
    }

    API.create("/vendor/products", formData)
      .then((response) => {
        if (response.data) {
          setToggleAddProduct(false);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleChangeSizePrice = (e) => {
    const newData = {
      [e.target.name]: e.target.value,
    };
    setSizePrice({ ...sizePrice, ...newData });
  };

  const handleChangePrice = (e, type) => {
    if (getValues("discount_type") === "fixed") {
      if (type === "price") {
        setFormValue(type, e.target.value);
        setFormValue(
          "price_after_discount",
          parseInt(e.target.value) - parseInt(getValues("discount"))
        );
      } else if (type === "discount") {
        setFormValue(type, e.target.value);
        setFormValue(
          "price_after_discount",
          parseInt(getValues("price")) - parseInt(e.target.value)
        );
      } else {
        setFormValue(type, e.target.value);
        setFormValue("discount", parseInt(getValues("price")) - e.target.value);
      }
    } else {
      if (type === "price") {
        setFormValue(type, e.target.value);
        setFormValue(
          "price_after_discount",
          parseInt(e.target.value) -
            (parseInt(getValues("discount")) / 100) * parseInt(e.target.value)
        );
      } else if (type === "discount") {
        setFormValue(type, e.target.value);
        setFormValue(
          "price_after_discount",
          parseInt(getValues("price")) -
            (parseInt(e.target.value) / 100) * parseInt(getValues("price"))
        );
      } else {
        setFormValue(type, e.target.value);
        setFormValue(
          "discount",
          100 - (e.target.value / parseInt(getValues("price"))) * 100
        );
      }
    }
  };
  const handleChangeDiscountType = (e) => {
    setFormValue("discount_type", e.target.value);
    setFormValue("price_after_discount", parseInt(getValues("price")));
    setFormValue("discount", 0);
  };

  return (
    <>
      <Row dir={t("dir")}>
        <Col sm="12">
          <Card className="dashboard-table mt-0">
            <CardBody>
              <div className="top-sec">
                <h3>{t("Add new product")}</h3>
              </div>
              <div className="theme-card">
                <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
                  <Row>
                    <Col sm="6">
                      <div className="form-group mb-3">
                        <label>{t("product name")}</label>
                        <input
                          {...register("name", {
                            required: "Name field is required*",
                          })}
                          className="form-control"
                          placeholder={t("product name")}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="name"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group mb-3">
                        <label>{t("Short description")}</label>
                        <div
                          style={{
                            border: "1px solid #ced4da",
                            padding: "10px",
                          }}
                        >
                          <Editor
                            editorState={editorState}
                            wrapperClassName="home-wrapper"
                            editorClassName="home-editor"
                            toolbarClassName="toolbar-class"
                            onEditorStateChange={handleChangeEditor}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12">
                      <div className="form-group mb-3">
                        <label>{t("Description")}</label>
                        <textarea
                          {...register("description", {
                            required: "Description field is required*",
                          })}
                          className="form-control"
                          placeholder={t("Description")}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="description"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="4">
                      <div className="form-group mb-3">
                        <label>{t("price")}</label>
                        <input
                          type={"number"}
                          {...register("price", {
                            required: "Price field is required*",
                          })}
                          onChange={(e) => handleChangePrice(e, "price")}
                          className="form-control"
                          placeholder={t("price")}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="price"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                    <Col sm="4">
                      <div className="form-group mb-3">
                        <label>{t("Discount type")}</label>
                        <select
                          type="text"
                          className="form-control"
                          {...register("discount_type", {
                            required: "Discount type field is required*",
                          })}
                          onChange={handleChangeDiscountType}
                        >
                          <option value={"fixed"}>{t("Fixed")}</option>
                          <option value={"percentage"}>
                            {t("Percentage")}
                          </option>
                        </select>
                        <ErrorMessage
                          errors={errors}
                          name="discount_type"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                    <Col sm="4">
                      <div className="form-group mb-3">
                        <label>{t("Discount")}</label>
                        <input
                          type={"number"}
                          {...register("discount", {
                            required: "Discount field is required*",
                          })}
                          onChange={(e) => handleChangePrice(e, "discount")}
                          className="form-control"
                          placeholder={t("Discount")}
                          defaultValue={0}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="discount"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                    <Col sm="4">
                      <div className="form-group mb-3">
                        <label>{t("Price after sale")}</label>
                        <input
                          type={"number"}
                          {...register("price_after_discount")}
                          onChange={(e) =>
                            handleChangePrice(e, "price_after_discount")
                          }
                          className="form-control"
                          placeholder={t("Price after sale")}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="price_after_discount"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="6">
                      <div className="form-group mb-3">
                        <label>{t("In Stock")}</label>
                        <input
                          type={"number"}
                          {...register("stock", {
                            required: "stock is required*",
                          })}
                          className="form-control"
                          placeholder={t("Stock")}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="stock"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                    <Col sm="6">
                      <div className="form-group mb-3">
                        <label>{t("Sku")}</label>
                        <input
                          {...register("sku", {
                            required: "Sku field is required*",
                          })}
                          className="form-control"
                          placeholder={t("Sku")}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="sku"
                          render={({ message }) => (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="12">
                      <label>{t("Categories")}</label>
                      <Select
                        options={category}
                        isMulti={true}
                        onChange={handleChangecategoryies}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col
                      sm="12"
                      className="top-sec d-flex justify-content-center"
                    >
                      <h3>{t("Attributes")}</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="10">
                      <label>{t("Attribute")}</label>
                      <Select
                        value={valueAtt}
                        options={attributes}
                        onChange={handleChangeAttributes}
                      />
                    </Col>
                    <Col xs="2" className="d-flex justify-content-center">
                      <a onClick={toggle} className="btn btn-sm btn-solid mt-4">
                        +
                      </a>
                    </Col>
                    <Col sm="4" className="d-flex justify-content-center">
                      <Modal isOpen={modal} toggle={toggle} centered>
                        <ModalHeader toggle={toggle}>
                          {t("Add")} {t("Attribute")}
                        </ModalHeader>
                        <ModalBody className="p-4">
                          <input
                            id={"newAttribute"}
                            className="form-control"
                            placeholder={"Attribute Name"}
                          />
                          {error.attributes ? (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {error.attributes}
                            </p>
                          ) : (
                            ""
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <a
                            className="btn-solid btn-custom"
                            onClick={handleAddAttributes}
                            color="secondary"
                          >
                            {t("Add")}
                          </a>
                          <Button
                            className="btn-solid btn-custom"
                            color="secondary"
                            onClick={toggle}
                          >
                            {t("cancel")}
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </Col>
                  </Row>
                  {valueAtt.value === 2 ? (
                    ""
                  ) : (
                    <>
                      {valueAtt.value === 3 ? (
                        <Row>
                          <Col sm="12">
                            {isLoading ? (
                              <div></div>
                            ) : (
                              <Row className={"mt-2"}>
                                <Col xs="3">
                                  <label>{t("Price")}</label>
                                  <input
                                    className="form-control"
                                    name={"price"}
                                    placeholder={t("Price")}
                                    onChange={handleChangeSizePrice}
                                  />
                                </Col>
                                <Col xs="3">
                                  <label>{t("Price after sale")}</label>
                                  <input
                                    className="form-control"
                                    name={"price_after_sale"}
                                    placeholder={t("Price after sale")}
                                    onChange={handleChangeSizePrice}
                                  />
                                </Col>
                                <Col xs="4">
                                  <label>{t("Values")}</label>
                                  <Select
                                    value={value}
                                    options={attributeValue}
                                    isMulti={true}
                                    onChange={handleChangeAttributeValue}
                                  />
                                </Col>
                                <Col
                                  xs="2"
                                  className="d-flex justify-content-center"
                                >
                                  <a
                                    onClick={toggle2}
                                    className="btn btn-sm btn-solid mt-4"
                                  >
                                    +
                                  </a>
                                </Col>
                              </Row>
                            )}
                            <Modal isOpen={modal2} toggle={toggle2} centered>
                              <ModalHeader toggle={toggle2}>
                                {t("Add Value")}
                              </ModalHeader>
                              <ModalBody className="p-4">
                                <input
                                  id={"newValue"}
                                  className="form-control"
                                  placeholder={t("Add Value")}
                                />
                                {error.values ? (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "5px",
                                      color: "red",
                                    }}
                                  >
                                    {error.values}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </ModalBody>
                              <ModalFooter>
                                <a
                                  className="btn-solid btn-custom"
                                  onClick={handleAddAttributeValue}
                                  color="secondary"
                                >
                                  {t("Add")}
                                </a>
                                <a
                                  className="btn-solid btn-custom"
                                  color="secondary"
                                  onClick={toggle2}
                                >
                                  {t("cancel")}
                                </a>
                              </ModalFooter>
                            </Modal>
                          </Col>
                        </Row>
                      ) : (
                        <Row>
                          <Col sm="12">
                            {isLoading ? (
                              <div></div>
                            ) : (
                              <Row className={"mt-2"}>
                                <Col xs="10">
                                  <label>{t("Values")}</label>
                                  <Select
                                    value={value}
                                    options={attributeValue}
                                    isMulti={true}
                                    onChange={handleChangeAttributeValue}
                                  />
                                </Col>
                                <Col
                                  xs="2"
                                  className="d-flex justify-content-center"
                                >
                                  <a
                                    onClick={toggle2}
                                    className="btn btn-sm btn-solid mt-4"
                                  >
                                    +
                                  </a>
                                </Col>
                              </Row>
                            )}
                            <Modal isOpen={modal2} toggle={toggle2} centered>
                              <ModalHeader toggle={toggle2}>
                                {t("Add Value")}
                              </ModalHeader>
                              <ModalBody className="p-4">
                                <input
                                  id={"newValue"}
                                  className="form-control"
                                  placeholder={t("Add Value")}
                                />
                                {error.values ? (
                                  <p
                                    style={{
                                      fontSize: "12px",
                                      marginTop: "5px",
                                      color: "red",
                                    }}
                                  >
                                    {error.values}
                                  </p>
                                ) : (
                                  ""
                                )}
                              </ModalBody>
                              <ModalFooter>
                                <a
                                  className="btn-solid btn-custom"
                                  onClick={handleAddAttributeValue}
                                  color="secondary"
                                >
                                  {t("Add")}
                                </a>
                                <a
                                  className="btn-solid btn-custom"
                                  color="secondary"
                                  onClick={toggle2}
                                >
                                  {t("cancel")}
                                </a>
                              </ModalFooter>
                            </Modal>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                  <Row>
                    <Col sm="12" className={"d-flex justify-content-center"}>
                      <a
                        onClick={addAttribute}
                        className="btn btn-sm btn-solid mt-4"
                      >
                        {t("Add")}
                      </a>
                    </Col>
                  </Row>
                  {isLoadingTable && (
                    <div>
                      {tableData.map((item, index) => (
                        <Row className={"mt-3 attribute-list"} key={index}>
                          <Col xs="5">
                            <div>{item.key}</div>
                          </Col>
                          <Col xs="6">
                            {item.value.map((value, index) => (
                              <Row>
                                <Col xs="4">
                                  <ul key={index}>
                                    <li>
                                      {index + 1}-{value.value}
                                    </li>
                                  </ul>
                                </Col>
                                {value.price ? (
                                  <Col xs="8">
                                    <ul key={index}>
                                      <li>
                                        {t("Price")}: {value.price}
                                      </li>
                                      <br />
                                      <li>
                                        {t("Price after sale")}:{" "}
                                        {value.price_after_sale}
                                      </li>
                                    </ul>
                                  </Col>
                                ) : (
                                  ""
                                )}
                              </Row>
                            ))}
                          </Col>
                          <Col xs="1">
                            <a onClick={() => handleClearAtt(index)}>X</a>
                          </Col>
                        </Row>
                      ))}
                    </div>
                  )}
                  <hr />
                  <Row>
                    <Col sm="12">
                      <label>{t("Images")}</label>
                      <div>
                        {image.length > 0 && (
                          <Row>
                            {image.map((image, index) => (
                              <Col key={index} sm="3">
                                <div className={"position-relative mt-3 mb-4"}>
                                  <div
                                    className="delete-Img"
                                    id={index}
                                    onClick={handleDeleteImage}
                                  >
                                    X
                                  </div>
                                  <Media
                                    src={URL.createObjectURL(image)}
                                    style={{ height: "150px", width: "150px" }}
                                    className="blur-up lazyloaded"
                                  />
                                </div>
                              </Col>
                            ))}
                          </Row>
                        )}
                      </div>
                      <input type="file" onChange={handleImage} multiple />
                    </Col>
                  </Row>
                  <button type="submit" className="btn btn-sm btn-solid mt-4">
                    {t("Save")}
                  </button>
                  <button
                    onClick={() => setToggleAddProduct(false)}
                    className=" mx-4 btn btn-sm btn-solid mt-4"
                  >
                    {t("cancel")}
                  </button>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddProduct;
