import { HasAccess } from "@permify/react-role";
import imageCompression from "browser-image-compression";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Card, Col, Form, Image, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { MutatingDots } from "react-loader-spinner";
import { NavLink, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Unauthorized from "views/default/Unauthorized";
import api from "../../../API/API";

import "react-toastify/dist/ReactToastify.css";

const CreateProfessional = () => {
  const title = "Create Professional";
  const description = "LaCasa Create Professional Page";
  const [vName, setVName] = useState("");
  const [vInitials, setVInitials] = useState();
  const [logo, setLogo] = useState("");
  const [cover, setCover] = useState("");
  const [profileLoding, setProfileLoding] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [bioar, setBioar] = useState("");
  const [website, setWebsite] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [commercialRegistration, setCommercialRegistration] = useState("");
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState(1);
  const [selectedArea, setSelectedArea] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyNamear, setCompanyNamear] = useState("");
  const [experience, setExperience] = useState();
  const [jobTitle, setJobTitle] = useState("");
  const [jobTitlear, setJobTitlear] = useState("");
  const [commercial, setCommercial] = useState("");
  const [tax, setTax] = useState("");
  const [designer, setDesigner] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [professional, setProfessional] = useState("1");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState([]);
  const [errors, setErrors] = useState("");

  const { register, handleSubmit } = useForm();
  const history=useHistory();
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

  const formData = new FormData();
  
  const onSubmit = (dataForm) => {
    console.log('job title',jobTitle, typeof jobTitlear);
    formData.append("name", vName);
    formData.append("bio[en]", bio);
    formData.append("bio[ar]", bioar);
     if(logo instanceof Blob)
    formData.append("avatar", logo);
   if(cover instanceof Blob)
    formData.append("cover_photo",cover);
    formData.append("email", email);

    if(website)
    formData.append("website", website);

    if(instagram)
    formData.append("instagram", instagram);

    if(instagram)
    formData.append("facebook", facebook);

    if(twitter)
    formData.append("twitter", twitter);

    formData.append("phone", mobile);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    // formData.append("commerical_registeration", commercialRegistration);
    formData.append("area_id", selectedArea);
    formData.append("company_name[en]", companyName);
    formData.append("company_name[ar]", companyNamear);
    formData.append("price_range", priceRange);

    if(commercial instanceof Blob)
    formData.append("commerical_registeration", commercial);

    if(designer instanceof Blob)
    formData.append("designer_identity", designer);

    if(tax instanceof Blob)
    formData.append("tax_id", tax);

    if(experience)
    formData.append("experience", experience);
  
    formData.append("job_title[en]", jobTitle);
    formData.append("job_title[ar]", jobTitlear);
    formData.append("type", professional);
    category.map(item=>formData.append("categories[]",item.value));

    api
      .create(`/designers`, formData)
      .then((response) => {
        if (response.data) {
          toast.success("Professional Created!", {
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
        } else {
          setErrors(response?.errors);
        }
      })
      .catch((err) => console.log(err));
  };

  // const professionals = { Designer: 1, Supplier: 2 };
  useEffect(() => {
    setCategory([]);
    api.readAll(`/designers/categories?find[type]=${professional}`)
      .then(async (response) => {
        const cats = response.data.map((cat) => ({
          label: cat.name,
          value: cat.id,
        }));
        setCategories(cats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [professional]);

  const handleArea = (e) => {
    setSelectedArea(e.target.value);
  };
  const handleCity = (e) => {
    setSelectedCity(e.target.value);
  };
  const handleProfessional = (e) => {
    setProfessional(e.target.value);
  };
  const handleCategory = (e) => {
    // setCategory([e.target.value]);
    const arr = [];
    e.map((item, index) => arr.push(item));
    setCategory(arr);
  };
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
              <Card className="mb-4">
                <Card.Body className="mb-2">
                  <div className="d-flex align-items-center flex-column mb-2">
                    <div className=" d-flex align-items-center flex-column">
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
                        <div className="sw-10 sh-10 mb-5 d-inline-block bg-primary d-flex justify-content-center align-items-center rounded-xl overflow-hidden">
                          {logo === undefined || logo === '' ? (
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
                        <Form.Control type="text" onChange={handleName} />
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
                          onChange={(e) => setBio(e.target.value)}
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
                          onChange={(e) => setBioar(e.target.value)}
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
                          onChange={(e) => setWebsite(e.target.value)}
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
                          onChange={(e) => setFacebook(e.target.value)}
                        />
                        <small className="text-danger">
                          {errors?.facebook !== undefined
                            ? errors.facebook
                            : ""}
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
                          onChange={(e) => setInstagram(e.target.value)}
                        />
                        <small className="text-danger">
                          {errors?.instagram !== undefined
                            ? errors.instagram
                            : ""}
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
                          onChange={(e) => setTwitter(e.target.value)}
                        />
                        <small className="text-danger">
                          {errors?.twitter !== undefined ? errors.twitter : ""}
                        </small>
                      </Col>
                    </Row>
                  </div>
                  <div className="mb-1">
                    <Row className="g-0 align-items-center mb-2">
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
                              onChange={(e) => setMobile(e.target.value)}
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
                                name="createEmailProfessional"
                                onChange={(e) => setEmail(e.target.value)}
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
                    <Form.Control type="file" onChange={handleDesigner} />
                    <small className="text-danger">
                      {errors?.designer_identity!== undefined
                        ? errors?.designer_identity: "" }
                    </small>
                  </div>
                  <div className=" d-flex flex-column">
                    <Form.Label>Price Range</Form.Label>
                    <small className="text-danger">
                      {errors?.priceRange !== undefined
                        ? errors.priceRange
                        : ""}
                    </small>
                    <div className="d-inline-block float-md-start me-1 mb-5 search-input-container w-100 border bg-foreground">
                      <Form.Control
                        type="number"
                        onChange={(e) => setPriceRange(e.target.value)}
                      />
                      <span className="search-magnifier-icon">
                        <CsLineIcons icon="dollar" />
                      </span>
                    </div>
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
                    <Form.Control type="file" onChange={handleCommercial} />
                    <small className="text-danger">
                      {errors?.commerical_registeration !== undefined
                        ? errors?.commerical_registeration
                        : ""}
                    </small>
                  </div>
                  <div className="mb-3">
                    <Form.Label>Tax ID </Form.Label>
                    <Form.Control type="file" onChange={handleTax} />
                    <small className="text-danger">
                      {errors?.tax_id !== undefined
                        ? errors?.tax_id
                        : ""}
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
                      <Form.Select onChange={handleCity}>
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
                      <Form.Select onChange={handleArea}>
                        <option hidden>Select a city first</option>
                        {areas?.map((area, index) => (
                          <option key={area.id} value={area.id}>
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
                    <Form.Control type="file" onChange={handleImage} />
                    <small className="text-danger">
                      {errors?.avatar !== undefined
                        ? errors?.avatar
                        : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Cover Photo</Form.Label>
                    <Form.Control type="file" onChange={handleCover} />
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
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <small className="text-danger">
                      {errors?.company_name !== undefined
                        ? errors.company_name
                        : ""}
                    </small>
                  </div>

                  <div className="mb-2">
                    <Form.Label>Arabic Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setCompanyNamear(e.target.value)}
                    />
                    <small className="text-danger">
                      {errors?.company_name !== undefined
                        ? errors.company_name
                        : ""}
                    </small>
                  </div>
                  <div className="mb-2">
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                    <small className="text-danger">
                      {errors?.job_title !== undefined ? errors?.job_title : ""}
                    </small>
                  </div>

                  <div className="mb-2">
                    <Form.Label>Arabic Job Title</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setJobTitlear(e.target.value)} />
                    <small className="text-danger">
                      {errors?.job_title !== undefined ? errors?.job_title : ""}
                    </small>
                  </div>

                  <div className=" d-flex flex-column">
                    <Form.Label>Experience</Form.Label>
                    <div className="d-inline-block float-md-start me-1 mb-5 search-input-container w-100 border bg-foreground">
                      <Form.Control
                        type="number"
                        placeholder="Years"
                        min={0}
                        onChange={(e) => setExperience(e.target.value)}
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
                    <Form.Label>Professional</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={handleProfessional}
                      value={professional}
                    >
                      {[
                        { label: "Designer", value: "1" },
                        { label: "Supplier", value: "2" },
                      ].map((item, index) => (
                        <option key={item.value} value={item.value}>
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
                      value={category} > 
                      {categories.map((item, index) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Form.Select> */}
                    <Select
                      className="input-select__input"
                      options={categories}
                      name="categories"
                      onChange={handleCategory}
                      isMulti
                      value={category}
                    />
                    <small className="text-danger">
                      {errors?.categories !== undefined ? errors.categories : ""}
                    </small>
                    {/* <small className="text text-danger">
                      {errors["categories.0"] ?? errors["categories.0"]}
                    </small> */}
                  </div>
                  <div className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="new-password"
                      name="createPasswordProfessional"
                      onChange={(e) => setPassword(e.target.value)}
                      defaultValue=""
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
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    <small className="text-danger">
                      {errors?.password_confirmation !== undefined ? errors.password_confirmation : ""}
                    </small>
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

export default CreateProfessional;
