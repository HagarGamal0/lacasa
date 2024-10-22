import { HasAccess } from "@permify/react-role";
import imageCompression from "browser-image-compression";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MutatingDots } from "react-loader-spinner";
import { NavLink, useParams, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

import "react-toastify/dist/ReactToastify.css";

const EditProfessional = () => {
  const title = "Edit Professional";
  const description = "LaCasa Edit Professional Page";
  const { id } = useParams();
  const [data, setData] = useState();
  const [vName, setVName] = useState();
  const [vInitials, setVInitials] = useState();
  const [logo, setLogo] = useState();
  const [cover, setCover] = useState();
  const [profileLoding, setProfileLoding] = useState(false);
  const [cities, setCities] = useState();
  const [selectedCity, setSelectedCity] = useState(1);
  const [areas, setAreas] = useState();
  const [selectedArea, setSelectedArea] = useState();
  const [categories, setCategories] = useState([]);
  const [professional, setProfessional] = useState();
  const [category, setCategory] = useState([]);
  const [designer, setDesigner] = useState("");
  const [commercial, setCommercial] = useState();
  const [tax, setTax] = useState();
  const [errors, setErrors] = useState();

  const [changePass,setChangePass]=useState(false);


  const { register, handleSubmit } = useForm();

  // const professions = { Designer: 1, Supplier: 2 };
  const history = useHistory();

  useEffect(() => {
    api
      .readAll(`/designers/${id}`)
      .then(async (response) => {
        console.log(response.data);
        setData(response.data);
        setProfessional(response.data.type);
        setLogo(response.data.avatar);
        setCover(response.data.cover_photo);
        setTax(response.data.tax_id);
        setCommercial(response.data.commerical_registeration);
        setDesigner(response.data.designer_identity);
        setVName(response.data.name);
        setCategory(response.data.categories.map((item, index) => ({
                    label: item.name,
                    value: item.id,
         })));
        setSelectedCity(response.data.area.city.id);
        setSelectedArea(response.data.area.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setCategory([]);
    api.readAll(`/designers/categories?find[type]=${professional}`)
      .then(async (response) => {
        const cats = response.data.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
        console.log('cats',cats);
        setCategories(cats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [professional]);

  const handleName = (e) => {
    setVName(e.target.value);
  };

  const getInitials = function (name) {
    const parts = name.split(" ");
    let initials = "";
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].length > 0 && parts[i] !== "") {
        initials += parts[i][0];
      }
    }
    return initials.toUpperCase();
  };

  useEffect(() => {
    if (vName !== undefined) {
      setVInitials(getInitials(vName));
    }
  }, [vName]);

  useEffect(() => {
    api
      .readAll(`/world/cities`)
      .then(async (response) => {
        setCities(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .readAll(`/world/cities/${selectedCity}/areas`)
      .then(async (response) => {
        setAreas(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedCity]);

  const handleCategory = (e) => {
    // setCategory([e.target.value]);
    const arr = [];
    e.map((item, index) => arr.push(item));
    setCategory(arr);
  };

  const handleImage = async (e) => {
    await setProfileLoding(true);
    const imageFile = e.target.files[0];
    const imageOptions = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, imageOptions);
      setLogo(compressedFile);
    } catch (error) {
      console.log(error);
    }
    await setProfileLoding(false);
  };

  const handleCover = async (e) => {
    const imageFile = e.target.files[0];
    const imageOptions = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, imageOptions);
      setCover(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDesigner = async (e) => {
    const imageFile = e.target.files[0];
    const imageOptions = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, imageOptions);
      setDesigner(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommercial = async (e) => {
    const imageFile = e.target.files[0];
    const imageOptions = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, imageOptions);
      setCommercial(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };
  const handleTax = async (e) => {
    const imageFile = e.target.files[0];
    const imageOptions = {
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, imageOptions);
      setTax(compressedFile);
    } catch (error) {
      console.log(error);
    }
  };

  const handleArea = (e) => {
    setSelectedArea(e.target.value);
  };
  const handleCity = (e) => {
    setSelectedCity(e.target.value);
  };
  const formData = new FormData();

  const onSubmit = (dataForm) => {
    console.log('dataForm all inputs is ',dataForm);
    formData.append("name", dataForm?.name !== '' ? dataForm?.name : data?.name );

    const updbio = data?.bio_translate.en === null ? '' : data?.bio_translate.en;
    formData.append("bio[en]", dataForm?.bio.en !== '' ? dataForm?.bio.en : updbio);

    const updbioar = data?.bio_translate.ar === null ? '' : data?.bio_translate.ar;
    formData.append("bio[ar]", dataForm?.bio.ar !== '' ? dataForm?.bio.ar : updbioar);

    if(dataForm?.website!==''){
      formData.append("website", dataForm?.website);
    }

    if(dataForm?.instagram!==''){
      formData.append("instagram", dataForm?.instagram);
    }

    if(dataForm?.facebook!==''){
      formData.append("facebook", dataForm?.facebook);
    }

    if(dataForm?.twitter!==''){
      formData.append("twitter", dataForm?.twitter);
    }
    formData.append("phone", dataForm?.phone  !== '' ? dataForm?.phone: data?.phone);

    formData.append("email", dataForm?.email  !== '' ? dataForm?.email: data?.email);

    formData.append("experience", dataForm?.experience  !== '' ? dataForm?.experience: data?.experience);

    const updCompany = data?.company_name_translate.en === null ? '' : data?.company_name_translate.en;
    formData.append("company_name[en]", dataForm?.company_name.en  !== '' ? dataForm?.company_name.en : updCompany);

    const updCompanyar = data?.company_name_translate.ar === null ? '' : data?.company_name_translate.ar;
    formData.append("company_name[ar]", dataForm?.company_name.ar  !== '' ? dataForm?.company_name.ar : updCompanyar);

    const updJob = data?.job_title_translate.en === null ? '' : data?.job_title_translate.en;
    formData.append("job_title[en]", dataForm?.job_title.en  !== '' ? dataForm?.job_title.en: updJob);

    const updJobar = data?.job_title_translate.ar === null ? '' : data?.job_title_translate.ar;
    formData.append("job_title[ar]", dataForm?.job_title.ar  !== '' ? dataForm?.job_title.ar: updJobar);

    formData.append("type", dataForm?.type  !== '' ?dataForm?.type : professional);

    category.map(item=> formData.append("categories[]",item.value));

    // formData.append("categories[]", category.map(item=>item.value));
    formData.append("area_id", selectedArea);

    if(logo instanceof Blob)
    formData.append("avatar", logo !== '' ? logo : '');

    if(cover instanceof Blob)
    formData.append("cover_photo",cover !== '' ? cover : '');

    if(commercial instanceof Blob)
    formData.append("commerical_registeration", commercial);

    if(designer instanceof Blob)
    formData.append("designer_identity", designer);

    if(tax instanceof Blob)
    formData.append("tax_id", tax);

    // formData.append("address[en]",'');
    formData.append("password", dataForm?.password === undefined ? '' : dataForm?.password);
    formData.append("password_confirmation", dataForm?.password_confirmation === undefined ? '': dataForm?.password_confirmation);

    formData.append("_method", "PUT");
    api
      .create(`/designers/${id}`, formData)
      .then((response) => {
        console.log('response is',response);
        if (response.errors) {
          setErrors(response?.errors);
        } else if (response.data) {
          toast.success("Professional updated!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          history.push('/professionals/list');
          // window.location.reload();
          // toast.success("Data saved successfully!");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleProfessional = (e) => {
    setProfessional(e.target.value);
    console.log(e.target.value);
  };
  // const handleCity = (e) => {
  //   setSelectedCity(e.target.value);
  // };
  // const handleArea = (e) => {
  //   setSelectedArea(e.target.value);
  // };
  return (
    <HasAccess
      permissions="Edit Vendors"
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
                to="/professionals/list"
              >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">
                  Professionals
                </span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}
          </Row>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col xl="4">
              <h2 className="small-title">Info</h2>
              <Card className="mb-5">
                <Card.Body className="mb-n5">
                  <div className="d-flex align-items-center flex-column mb-5">
                    <div className="mb-5 d-flex align-items-center flex-column">
                      {profileLoding ? (
                        <MutatingDots
                          height="100"
                          width="100"
                          color="black"
                          secondaryColor="#a9270a"
                          radius="12.5"
                          ariaLabel="mutating-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                          visible
                        />
                      ) : (
                        <div className="sw-10 sh-10 mb-5 d-inline-block bg-primary d-flex justify-content-center align-items-center rounded-xl">
                          {logo === undefined || logo === null ? (
                            <div className="text-white">
                              {vInitials === undefined ? "N" : vInitials}
                            </div>
                          ) : (
                            <Image
                              className="w-100 h-100"
                              style={{objectFit:'cover',objectPosition:'center'}}
                              src={
                                logo instanceof Blob
                                  ? URL.createObjectURL(logo)
                                  : logo
                              }
                              thumbnail
                              roundedCircle
                            />
                          )}
                        </div>
                      )}
                      <div className="h5 mb-1">
                        <Form.Control
                          type="text"
                          onChange={handleName}
                          defaultValue={data?.name}
                          {...register("name")}
                        />
                        <small className="text-danger">
                          {errors?.name !== undefined ? errors.name : ""}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="mb-7">
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-start flex-column">
                      <Col xl="2" className="text-alternate d-flex ">
                        <CsLineIcons
                          icon="news"
                          className="text-primary mb-1"
                        />
                        Bio:
                      </Col>
                      <Col xl="12">
                        {" "}
                        <Form.Control
                          as="textarea"
                          rows={4}
                          defaultValue={data?.bio_translate.en}
                          {...register("bio[en]")}
                        />
                        <small className="text-danger">
                          {errors?.bio !== undefined ? errors.bio : ""}
                        </small>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-start flex-column">
                      <Col xl="4" className="text-alternate d-flex ">
                        <CsLineIcons
                          icon="news"
                          className="text-primary mb-1"
                        />
                        Arabic Bio:
                      </Col>
                      <Col xl="12">
                        {" "}
                        <Form.Control
                          as="textarea"
                          rows={4}
                          defaultValue={data?.bio_translate.ar}
                          {...register("bio[ar]")}
                        />
                        <small className="text-danger">
                          {errors?.bio !== undefined ? errors.bio : ""}
                        </small>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-start flex-column">
                      <Col xl="3" className="text-alternate d-flex">
                        <CsLineIcons icon="web" className="text-primary mb-1" />
                        Website:
                      </Col>
                      <Col xl="12">
                        <Form.Control
                          type="text"
                          value={data?.website}
                          defaultValue={data?.website}
                          {...register("website")}
                        />
                        <small className="text-danger">
                          {errors?.website !== undefined ? errors.website : ""}
                        </small>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-start flex-column">
                      <Col xl="4" className="text-alternate d-flex">
                        <CsLineIcons
                          icon="facebook"
                          className="text-primary mb-1"
                        />
                        Facebook:
                      </Col>
                      <Col xl="12">
                        <Form.Control
                          type="text"
                          defaultValue={data?.facebook}
                          {...register("facebook")}
                        />
                        <small className="text-danger">
                          {errors?.facebook !== undefined ? errors.facebook : ""}
                        </small>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-start flex-column">
                      <Col xl="4" className="text-alternate d-flex">
                        <CsLineIcons
                          icon="instagram"
                          className="text-primary mb-1"
                        />
                        Instagram:
                      </Col>
                      <Col xl="12">
                        <Form.Control
                          type="text"
                          defaultValue={data?.instagram}
                          {...register("instagram")}
                        />
                        <small className="text-danger">
                          {errors?.instagram !== undefined ? errors.instagram : ""}
                        </small>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-start flex-column">
                      <Col xl="3" className="text-alternate d-flex">
                        <CsLineIcons
                          icon="twitter"
                          className="text-primary mb-1"
                        />
                        Twitter:
                      </Col>
                      <Col xl="12">
                        <Form.Control
                          type="text"
                          defaultValue={data?.twitter}
                          {...register("twitter")}
                        />
                        <small className="text-danger">
                          {errors?.twitter !== undefined ? errors.twitter : ""}
                        </small>
                      </Col>
                    </Row>
                  </div>
                  <div className="mb-5">
                    <Row className="g-0 align-items-center mb-5">
                      <Col xs="auto">
                        <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="phone" className="text-primary" />
                        </div>
                      </Col>
                      <Col className="ps-1">
                        <Row className="g-0">
                          <Col xl="2">
                            <div className="sh-5 d-flex align-items-center lh-1-25">
                              Mobile
                            </div>
                          </Col>
                          <Col xl="10">
                            <Form.Control
                              type="number"
                              defaultValue={data?.phone}
                              {...register("phone")}
                            />
                            <small className="text-danger">
                              {errors?.phone !== undefined ? errors.phone : ""}
                            </small>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="g-0 align-items-center mb-5">
                      <Col xs="auto">
                        <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                          <CsLineIcons icon="email" className="text-primary" />
                        </div>
                      </Col>
                      <Col className="ps-1">
                        <Row className="g-0">
                          <Col xl="2">
                            <div className="sh-5 d-flex align-items-center lh-1-25">
                              Email
                            </div>
                          </Col>
                          <Col xl="10">
                            <div className="sh-5 d-flex align-items-center">
                              <Form.Control
                                type="text"
                                autoComplete="off"
                                name="UpdateEmailProfessional"
                                defaultValue={data?.email}
                                {...register("email")}
                              />
                            </div>
                            <small className="text-danger">
                              {errors?.email !== undefined ? errors.email : ""}
                            </small>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
              <h2 className="small-title">Designer Identity & Price Range</h2>
              <Card>
                <Card.Body>
                  <div className="mb-2">
                    <Form.Label>Designer Identity</Form.Label>
                    <Form.Control type="file" defaultValue={designer} onChange={handleDesigner} />
                    <small className="text-danger">
                      {errors?.designer_identity!== undefined
                        ? errors?.designer_identity: "" }
                    </small>
                  </div>
                  <div className=" d-flex flex-column mb-5 ">
                    <Form.Label>Price Range</Form.Label>
                    <div className="d-inline-block float-md-start me-1 search-input-container w-100 border bg-foreground">
                      <Form.Control
                        type="number"
                        defaultValue={data?.price_range}
                        {...register("price_range")}
                      />
                      <span className="search-magnifier-icon">
                        <CsLineIcons icon="dollar" />
                      </span>
                    </div>
                    <small className="text-danger">
                      {errors?.priceRange !== undefined
                        ? errors.priceRange
                        : ""}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl="8">
              <h2 className="small-title">Commercial Registration & Tax ID</h2>
              <Card className="mb-5">
                <Card.Body>
                  <div className="mb-3">
                    <Form.Label>Commercial Registration</Form.Label>
                    <Form.Control type="file" defaultValue={commercial} onChange={handleCommercial} />
                    <small className="text-danger">
                      {errors?.commerical_registeration !== undefined
                        ? errors?.commerical_registeration
                        : ""}
                    </small>
                  </div>
                  <div className="mb-3">
                    <Form.Label>Tax ID </Form.Label>
                    <Form.Control type="file" defaultValue={tax} onChange={handleTax} />
                    <small className="text-danger">
                      {errors?.tax_id !== undefined ? errors?.tax_id : ""}
                    </small>
                  </div>
                </Card.Body>
              </Card>
              {/* Additional Info Start */}
              <h2 className="small-title">Professional Info</h2>
              <Card>
                <Card.Body>
                  <Row className="g-0 mb-2 d-flex justify-content-center align-items-center">
                    <Col xs="auto">
                      <div className="sw-3 me-1">
                        <CsLineIcons
                          icon="pin"
                          size="17"
                          className="text-primary"
                        />
                      </div>
                    </Col>
                    <Col className="text-alternate">City: </Col>
                    <Col xl="9">
                      <Form.Select onChange={handleCity} value={selectedCity}>
                        {cities?.map((item, index) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row className="g-0 mb-2 d-flex justify-content-center align-items-center">
                    <Col xs="auto">
                      <div className="sw-3 me-1">
                        {/* eslint-disable-next-line */}
                        <CsLineIcons
                          icon="building-large"
                          size="17"
                          className="text-primary"
                        />
                      </div>
                    </Col>
                    <Col className="text-alternate">Area: </Col>
                    <Col xl="9">
                      <Form.Select onChange={handleArea} value={selectedArea}>
                        <option hidden>Select a city first</option>
                        {areas?.map((area, index) => (
                          <option key={area.id} value={area.id} >
                            {area.name}
                          </option>
                        ))}
                      </Form.Select>
                      <small className="text-danger">
                        {errors?.area !== undefined ? errors.area : ""}
                      </small>
                    </Col>
                  </Row>
                  <div className="mb-2">
                    <Form.Label>Avatar</Form.Label>
                    <Form.Control type="file" defaultValue={logo} onChange={handleImage} />
                    <small className="text-danger">
                      {errors?.avatar !== undefined ? errors?.avatar : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Cover Photo</Form.Label>
                    <Form.Control type="file" defaultValue={cover} onChange={handleCover} />
                    <small className="text-danger">
                      {errors?.cover_photo !== undefined
                        ? errors?.cover_photo
                        : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data?.company_name_translate.en}
                      {...register("company_name[en]")}
                    />
                    <small className="text-danger">
                      {errors?.company_name !== undefined
                        ? errors?.company_name
                        : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Arabic Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={data?.company_name_translate.ar}
                      {...register("company_name[ar]")}
                    />
                    <small className="text-danger">
                      {errors?.company_name !== undefined
                        ? errors?.company_name
                        : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control type="text" defaultValue={data?.job_title_translate.en} {...register("job_title[en]")} />
                    <small className="text-danger">
                      {errors?.job_title !== undefined ? errors?.job_title : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Arabic Job Title</Form.Label>
                    <Form.Control type="text" defaultValue={data?.job_title_translate.ar} {...register("job_title[ar]")} />
                    <small className="text-danger">
                      {errors?.job_title!== undefined ? errors?.job_title : ""}
                    </small>
                  </div>
                  <div className=" d-flex flex-column mb-2">
                    <Form.Label>Experience</Form.Label>
                    <div className="d-inline-block float-md-start me-1  search-input-container w-100 border bg-foreground">
                      <Form.Control
                        type="number"
                        placeholder="Years"
                        defaultValue={data?.experience}
                        min={0}
                        {...register("experience")}
                      />
                      <span className="search-magnifier-icon">
                        <CsLineIcons icon="calendar" />
                      </span>
                    </div>
                    <small className="text-danger">
                      {errors?.experience !== undefined
                        ? errors.experience
                        : ""}
                    </small>
                  </div>

                  <div className="mb-3">
                    <Form.Label>Professional type</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      {...register("type")}
                      onChange={handleProfessional}
                      value={professional}
                      defaultValue={data?.type}
                    >
                      {[
                        { label: "Designer", value: "1" },
                        { label: "Supplier", value: "2" },
                      ].map((item, index) => (
                        <option key={item.value} value={item.value} selected={ item.value === professional}>
                          {item.label}
                        </option>
                      ))}
                    </Form.Select>
                  </div>

                  <div className="mb-3">
                    <Form.Label>Categories</Form.Label>
                    {/* <Form.Select
                      aria-label="Default select example"
                      onChange={handleCategory}
                      defaultValue={category}
                      {...register("categories[]")}
                    >
                      {categories.map((item, index) => (
                        <option key={item.value} value={item.value} selected={item.value === data?.categories[0].id}>
                          {item.label}
                        </option>
                      ))}
                    </Form.Select> */}
                    <Select
                      className="input-select__input"
                      value={category}
                      options={categories}
                      onChange={handleCategory}
                      isMulti
                    />
                    <small className="text-danger">
                      {errors?.categories !== undefined ? errors.categories : ""}
                    </small>
                  </div>
                  <div className="mb-2 mt-4">
                    <label className="form-check w-100 mb-2">
                      <input
                        type="checkbox"
                        id="showInMenu"
                        className="form-check-input"
                        onChange={() => {setChangePass(!changePass)}}
                      />
                      <span className="form-check-label d-block">
                        <span className="mb-1 lh-1-25">Change Current Password</span>
                      </span>
                    </label>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="new-password"
                      name="updatePasswordProfessional"
                      disabled={!changePass}
                      {...register("password")}
                    />
                    <small className="text-danger">
                      {errors?.password !== undefined ? errors.password : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="new-password"
                      name="confirmPasswordProfessional"
                      disabled={!changePass}
                      {...register("password_confirmation")}
                    />
                  </div>
                  <div className="w-100 d-flex justify-content-end align-items-end">
                    <Button type="submit" className="primary">
                      Save
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              {/* Additional Info End */}
            </Col>
          </Row>
        </form>
      </>
    </HasAccess>
  );
};

export default EditProfessional;
