import { HasAccess } from '@permify/react-role';
import imageCompression from 'browser-image-compression';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { MutatingDots } from 'react-loader-spinner';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const CreateVendor = () => {
  const title = 'Create Vendor';
  const description = 'LaCasa Create Vendor Page';
  const [vName, setVName] = useState();
  const [vInitials, setVInitials] = useState();
  const [logo, setLogo] = useState();
  const [profileLoding, setProfileLoding] = useState(false);
  const [cities, setCities] = useState();
  const [selectedCity, setSelectedCity] = useState(1);
  const [areas, setAreas] = useState();
  const [selectedArea, setSelectedArea] = useState();
  const [errors, setErrors] = useState();
  const [vendorErrors, setVendorErrors] = useState();

  const { register, handleSubmit } = useForm();


  const handleName = (e) => {
    setVName(e.target.value);
  };

  const getInitials = function (name) {
    const parts = name.split(' ');
    let initials = '';
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].length > 0 && parts[i] !== '') {
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
        setCities(response.data)
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  useEffect(() => {
    api
      .readAll(`/world/cities/${selectedCity}/areas`)
      .then(async (response) => {
        setAreas(response.data)
      })
      .catch((err) => {
        console.log(err);
      });

  }, [selectedCity]);


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
  const formData = new FormData();

  const onSubmit = (dataForm) => {

    formData.append("name", vName);
    formData.append("vendor[city_id]", selectedCity);
    formData.append("vendor[area_id]", selectedArea);
    formData.append("vendor[street_address]", dataForm.vendor.street_address);
    formData.append("phone", dataForm.phone);
    formData.append("email", dataForm.email);
    formData.append("vendor[logo]", logo);
    formData.append("vendor[company_name]", dataForm.vendor.company_name);
    formData.append("vendor[email]", dataForm.vendor.email);
    formData.append("vendor[commission]", dataForm.vendor.commission);
    formData.append("password", dataForm.password);
    formData.append("password_confirmation", dataForm.password_confirmation);
    api
      .create(`/vendors`, formData)
      .then((response) => {
  
        if (response.errors) {
          setErrors(response?.errors);

          toast.success(response?.errors[0], {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });

        } else if (response.data) {
          toast.success('Vendor Created!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
          // window.location.reload();
          // toast.success("Data saved successfully!");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCity = (e) => {
    setSelectedCity(e.target.value)
  }
  const handleArea = (e) => {
    setSelectedArea(e.target.value)
  }
  return (
    <HasAccess permissions="Edit Vendors" renderAuthFailed={<Unauthorized />} isLoading="loading...">
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
              <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/vendors/list">
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Vendors</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}
          </Row>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                        <div className="sw-10 sh-6 mb-5 d-inline-block bg-primary d-flex justify-content-center align-items-center rounded-xl">
                          {logo === undefined ? (
                            <div className="text-white">{vInitials === undefined ? 'N' : vInitials}</div>
                          ) : (
                            <Image className="w-100" src={logo instanceof Blob ? URL.createObjectURL(logo) : logo} thumbnail roundedCircle />
                          )}
                        </div>
                      )}
                      <div className="h5 mb-1">
                        <Form.Control type="text" defaultValue="Name" onChange={handleName} />
                        <small className="text-danger">{errors?.name !== undefined ? errors.name : ""}</small>
                      </div>
                    </div>
                  </div>
                  <div className="mb-7">
                    <p className="text-small text-muted mb-3">VENDOR ADDRESS</p>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-center">
                      <Col xs="auto">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="pin" size="17" className="text-primary" />
                        </div>
                      </Col>
                      <Col className="text-alternate">City: </Col>
                      <Col xl="9">
                        <Form.Select onChange={handleCity}>
                          {cities?.map((item, index) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-center">
                      <Col xs="auto">
                        <div className="sw-3 me-1">
                          {/* eslint-disable-next-line */}
                          <CsLineIcons icon={`building-large`} size="17" className="text-primary" />
                        </div>
                      </Col>
                      <Col className="text-alternate">Area: </Col>
                      <Col xl="9">
                        <Form.Select onChange={handleArea}>
                          <option hidden>Select a city first</option>
                          {areas?.map((area, index) => (
                            <option key={area.id} value={area.id}>{area.name}</option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Row className="g-0 mb-3 d-flex justify-content-center align-items-center">
                      <Col xs="auto">
                        <div className="sw-3 me-1">
                          <CsLineIcons icon="home" size="17" className="text-primary" />
                        </div>
                      </Col>
                      <Col className="text-alternate">Street: </Col>
                      <Col xl="9">
                        <Form.Control type="text" {...register('vendor[street_address]', { required: true })} />
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
                          <Col>
                            <div className="sh-5 d-flex align-items-center lh-1-25">Mobile</div>
                          </Col>
                          <Col xs="auto">
                            <Form.Control type="number"  {...register('phone', { required: true })} />
                            <small className="text-danger">{errors?.phone !== undefined ? errors.phone : ""}</small>
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
                          <Col>
                            <div className="sh-5 d-flex align-items-center lh-1-25">Email</div>
                          </Col>
                          <Col xs="auto">
                            <div className="sh-5 d-flex align-items-center">
                              <Form.Control type="text" {...register('email', { required: true })} />
                            </div>
                            <small className="text-danger">{errors?.email !== undefined ? errors.email : ""}</small>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xl="8">
              {/* Additional Info Start */}
              <h2 className="small-title">Vendor Info</h2>
              <Card>
                <Card.Body>
                  <div className="mb-5">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control type="file" onChange={handleImage} />
                    <small className="text-danger">{errors?.['vendor.logo'] !== undefined ? errors?.['vendor.logo'] : ""}</small>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Vendor Company Name</Form.Label>
                    <Form.Control type="text" {...register('vendor[company_name]', { required: true })} />
                  </div>
                  <div className="mb-5">
                    <Form.Label>Vendor Email</Form.Label>
                    <Form.Control type="text" {...register('vendor[email]', { required: true })} />
                    <small className="text-danger">{errors?.['vendor.email'] !== undefined ? errors?.['vendor.email'] : ""}</small>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Commission</Form.Label>
                    <Form.Control type="number" {...register('vendor[commission]', { required: true })} />
                    <small className="text-danger">{errors?.['vendor.commisssion'] !== undefined ? errors['vendor.commisssion'] : ""}</small>

                  </div>
                  <div className="mb-5">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" {...register('password', { required: true })} />
                    <small className="text-danger">{errors?.password !== undefined ? errors.password : ""}</small>

                  </div>
                  <div className="mb-5">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" {...register('password_confirmation', { required: true })} />
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

export default CreateVendor;
