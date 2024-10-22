import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from "react-select";
import { Row, Col, Form, Card } from "react-bootstrap";
import {toast} from "react-toastify";
import draftToHtml from "draftjs-to-html";
import {convertToRaw, EditorState} from "draft-js";
import {convertFromHTML} from "draft-convert";
import api from "../../API/API";

const ProductInfo = ({
  nameError = "",
  error = "",
  productName,
  arproductName,
  setProductName,
  setarProductName,
  editorDescState,
  areditorDescState,
  setEditorDescState,
  setarEditorDescState,
  setEditorState,
  setarEditorState,
  editorState,
  areditorState,
  setCategoryID,
  setVendorID,
  setItemOrder,
  data = [],
}) => {
  
  const [arNametranslate, setArNametranslate] = useState("");
  const [arShortDescritiontranslate, setArShortDescritiontranslate] = useState("");
  const [arDescritiontranslate, setArDescritiontranslate] = useState("");
  const [categories, setCategories] = useState([]);
  const [vendorSearch, setVendorSearch] = useState([]);
  const [vendors, setVendors] = useState();

  const displayChilds = (childs) => {
    childs.map((item, index) => {
      categories.push({ value: item.id, label: item.name });
      if (item.childs.length > 0) {
        displayChilds(item.childs);
      }
      return categories;
    });
  };

  useEffect(() => {
    api
      .readAll(`/categories`)
      .then(async (response) => {
        response.data.map((item, index) => {
          categories.push({ value: item.id, label: item.name });
          if (item.childs.length > 0) {
            displayChilds(item.childs);
          }
          return categories;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  useEffect(() => {
    api
      .readAll(`/vendors?find[name]=${vendorSearch}`)
      .then((response) => {
        const vendorArr = [];
        response?.data?.map((item, index) =>
          vendorArr.push({ value: item.id, label: item.name })
        );
        console.log();
        setVendors(vendorArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [vendorSearch]);

  // vendor search
  const handleVendorSearch = (e) => {
    setVendorSearch(e);
  };
  // end of vendor search

  const handleChangeEditor = async (e) => {
    setEditorState(e);
  };

  const handleChangearEditor = async (e) => {
    setarEditorState(e);
  };

  const handleChangeDescriptionEditor = async (e) => {
    setEditorDescState(e);
  };

  const handleChangearDescriptionEditor = async (e) => {
    setarEditorDescState(e);
  };

  const handleCategories = (e) => {
    const arr = [];
    e.map((item, index) => arr.push(item.value));
    setCategoryID(arr);
  };



  // useEffect(() => {
  const handleTranslate = async (type, value) => {
    try {
      if(value !== "") {
        const formData = new FormData();
        formData.append("text", value);
        const response = await api.create(`/translate`,formData);
        if (response.code === 200) {
          if (type === 'name') {
            setArNametranslate(response.message);
          }else if(type ==='shortDescription'){
            console.log('shortDescription');
            setArShortDescritiontranslate(response.message);
          }else if(type ==='description'){
            setArDescritiontranslate(response.message);
          }
        } else {
          toast.error(response.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      }
    } catch (err) {
      toast.error(err.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  // Call the function to initiate the translation when productName changes
  // }, [productName]);
  useEffect(() => {
    handleTranslate('name',productName);
    if(editorState){
      const htmlString = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      handleTranslate('shortDescription', htmlString);
    }
    if(editorDescState){
      const htmlString = draftToHtml(convertToRaw(editorDescState.getCurrentContent()));
      handleTranslate('description', htmlString);
    }

  }, [productName,editorState,editorDescState]);
  const handleNameTranslate = () => {
    setarProductName(arNametranslate);
  };
  const ShortDescriptionTranslate = () => {
    setarEditorState(
        EditorState.createWithContent(
            convertFromHTML(arShortDescritiontranslate)
        )
    );
  };


  const DescriptionTranslate = () => {
    setarEditorDescState(
        EditorState.createWithContent(
            convertFromHTML(arDescritiontranslate)
        )
    );
  };





  return (
    <>
      <Row>
        <Col xl="12">
          <h2 className="small-title">Product Info</h2>
          <Card className="mb-5">
            <Card.Body>
              <div className="mb-3">
                <Row>
                  <Col xs="10">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={(e) => setProductName(e.target.value)}
                        defaultValue={data?.name_translate?.en}
                    />
                    <small className="text text-danger">
                      {error.name ?? error.name}
                    </small>
                    <small className="text text-danger">{nameError}</small>
                  </Col>
                  <Col xs="2">
                    <button type="button"  className="btn btn-primary mt-5 mb-5"
                        title={arNametranslate}
                        onClick={handleNameTranslate}
                    >
                      translate
                    </button>
                  </Col>
                </Row>
            </div>

            <div className="mb-3">
              <Form.Label>Arabic Name</Form.Label>
                <Form.Control
                    type="text"
                    value={arproductName}
                    onChange={(e) => setarProductName(e.target.value)}
                  />
                  <small className="text text-danger">
                    {error.name ?? error.name}
                  </small>
                  <small className="text text-danger">{nameError}</small>
                </div>

                <div className="mb-5 mt-5 shadow-sm p-3 mb-5 bg-white rounded">
                  <Form.Label>Short Description</Form.Label>
                  <Editor
                      editorState={editorState}
                      onEditorStateChange={handleChangeEditor}
                      wrapperClassName="w-100 "
                      editorClassName="border border-secondary text-dark"
                  />
                  <small className="text text-danger">
                    {error.short_description ?? error.short_description}
                  </small>
                    <button type="button"  className="btn btn-primary mt-5 mb-5"
                            title={arShortDescritiontranslate}
                            onClick={ShortDescriptionTranslate}
                    >
                      translate
                    </button>
                </div>

                <div className="mb-5 mt-5 shadow-sm p-3 mb-5 bg-white rounded">
                  <Form.Label> Arabic Short Description</Form.Label>
                  <Editor
                      editorState={areditorState}
                      onEditorStateChange={handleChangearEditor}
                      wrapperClassName="w-100 "
                      editorClassName="border border-secondary text-dark"
                  />
                  <small className="text text-danger">
                    {error.short_description ?? error.short_description}
                  </small>
                </div>

              <div className="mb-5 mt-5 shadow-sm p-3 mb-5 bg-white rounded">
                <Form.Label>Description</Form.Label>
                <Editor
                    editorState={editorDescState}
                    onEditorStateChange={handleChangeDescriptionEditor}
                    wrapperClassName="w-100 "
                    editorClassName="border border-secondary text-dark"
                />
                <small className="text text-danger">
                  {error.description ?? error.description}
                </small>

                <button type="button" className="btn btn-primary mt-5 mb-5"
                        title={arDescritiontranslate}
                        onClick={DescriptionTranslate}
                >
                  translate
                </button>
              </div>

              <div className="mb-5 mt-5 shadow-sm p-3 mb-5 bg-white rounded">
                <Form.Label>Arabic Description</Form.Label>
                <Editor
                    editorState={areditorDescState}
                    onEditorStateChange={handleChangearDescriptionEditor}
                      wrapperClassName="w-100 "
                      editorClassName="border border-secondary text-dark"
                  />
                  <small className="text text-danger">
                    {error.description ?? error.description}
                  </small>
                </div>

                <div className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Select
                      className="input-select__input"
                      options={categories}
                      name="categories"
                      onChange={handleCategories}
                      isMulti
                      defaultValue={
                        data?.categories !== undefined
                            ? data?.categories.map((item, index) => ({
                              value: item.id,
                              label: item.name,
                            }))
                            : "Pick your category"
                      }
                  />
                  <small className="text text-danger">
                    {error.categories ?? error.categories}
                  </small>
                  <small className="text text-danger">
                    {error["categories.0"] ?? error["categories.0"]}
                  </small>
                </div>
                <div className="mb-3">
                  <Form.Label>Vendor</Form.Label>
                  <Select
                      className="input-select__input"
                      options={vendors}
                      name="categories"
                      onChange={(e) => setVendorID(e.value)}
                      onInputChange={handleVendorSearch}
                      onBlurResetsInput={false}
                      defaultValue={
                        data?.vendor !== undefined
                            ? {value: data?.vendor.id, label: data?.vendor.name}
                            : "Pick your vendor"
                      }
                  />
                  <small className="text text-danger">
                    {error.vendor_id ?? error.vendor_id}
                  </small>
                </div>

                  <div className="mb-3">
                <Row>
                  <Col xs="12">
                    <Form.Label>Item Order</Form.Label>
                    <Form.Control
                      type="number" min="0"
                        onChange={(e) => setItemOrder(e.target.value)}
                        defaultValue={data?.order ?? 0}
                    />
                    <small className="text text-danger">
                      {error.order ?? error.order}
                    </small>
                  </Col>
                </Row>
            </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductInfo;
