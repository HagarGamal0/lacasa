import { HasAccess } from '@permify/react-role';
import imageCompression from 'browser-image-compression';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Image, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { MutatingDots } from 'react-loader-spinner';
import { NavLink, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const EditVendor = () => {
  const title = 'Edit Vendor';
  const description = 'LaCasa Edit Vendor Page';
  const { id } = useParams();
  const [vName, setVName] = useState();
  const [vInitials, setVInitials] = useState();
  const [logo, setLogo] = useState();
  const [profileLoding, setProfileLoding] = useState(false);
  const [cities, setCities] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [areas, setAreas] = useState();
  const [selectedArea, setSelectedArea] = useState();
  const [errors, setErrors] = useState();
  const [vendorErrors, setVendorErrors] = useState();
  const [data, setData] = useState();
  const { register, handleSubmit } = useForm();
  const [accountManagers, setAccountManagers] = useState();
  const [loading, setLoading] = useState(true);
  const [accountManagerSearch, setAccountManagerSearch] = useState([]);
  const [accountManagerID, setAccountManagerID] = useState();
  const [vendorStatus, setVendorStatus] = useState();

  useEffect(() => {
    api
      .readAll(`/vendors/${id}`)
      .then(async (response) => {
        setData(response.data)
        setVName(response.data.name)
        setVendorStatus(response.data.vendor.status)
        setAccountManagerID(response.data.vendor.account_manager.id)
        if (response.data.vendor.logo) {
          setLogo(response.data.vendor.logo)
        }
        await setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);


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

  useEffect(() => {
    const accArr = []
    api
      .readAll(`/users?find[roles.name]=Account Manager&find[name]=${accountManagerSearch}`)
      .then(async (response) => {
        response.data.map((item, index) => (
          accArr.push({ value: item.id, label: item.name })
        ))
        setAccountManagers(accArr)
      })
      .catch((err) => {
        console.log(err);
      });

  }, [accountManagerSearch]);


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

    if (selectedCity !== undefined) { formData.append("vendor[city_id]", selectedCity); }
    if (selectedArea !== undefined) { formData.append("vendor[area_id]", selectedArea); }
    if (dataForm.vendor.street_address !== "") { formData.append("vendor[street_address]", dataForm.vendor.street_address); }
    if (dataForm.phone !== "") { formData.append("phone", dataForm.phone); }
    if (dataForm.email !== "") { formData.append("email", dataForm.email); }
    if (logo instanceof Blob) { formData.append("vendor[logo]", logo); }
    if (dataForm.vendor.company_name !== "") { formData.append("vendor[company_name]", dataForm.vendor.company_name); }
    if (dataForm.vendor.email !== "") { formData.append("vendor[email]", dataForm.vendor.email); }
    formData.append("vendor[account_manager_id]", accountManagerID);
    formData.append("vendor[status]", vendorStatus);
    if (dataForm.vendor.commission !== "") { formData.append("vendor[commission]", dataForm.vendor.commission); }
    if (dataForm.password !== "") { formData.append("password", dataForm.password); }
    if (dataForm.password_confirmation !== "") { formData.append("password_confirmation", dataForm.password_confirmation); }
    formData.append("_method", "PATCH");
    api
      .create(`/vendors/${id}`, formData)
      .then((response) => {
        console.log(response)
        if (response.errors) {
          setErrors(response?.errors);

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
  const handleAccountManagerSearch = (e) => {
    setAccountManagerSearch(e)
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
        <form onSubmit={handleSubmit(onSubmit)} >
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
                        <Form.Control type="text" onChange={handleName} defaultValue={data?.name} />
                        <small className="text-danger">{errors?.name !== undefined ? errors.name : ""}</small>
                      </div>
                      <div className="h5 mb-1">
                        <Form.Select onChange={(e) => setVendorStatus(e.target.value)}>
                          <option hidden>{data?.vendor.status}</option>
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                          <option value="Draft">Draft</option>
                          <option value="Suspend">Suspend</option>
                        </Form.Select>
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
                          <option hidden>{data?.vendor.city}</option>
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
                          <option hidden>{data?.vendor.area}</option>
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
                        <Form.Control type="text" defaultValue={data?.vendor.address} {...register('vendor[street_address]')} />
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
                            <Form.Control type="number" defaultValue={data?.phone} {...register('phone')} />
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
                              <Form.Control type="text" defaultValue={data?.email} {...register('email')} />
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
                  <Row className="d-flex justify-content-end">
                    <Col xl="6" >
                      <NavLink to={`/vendors/vendor-product/${id}`}>
                        <button type="button" className="btn btn-primary w-50 mb-3">View Products - Dashboard</button>
                      </NavLink>
                    </Col>
                    <Col xl="6" >
                      <a href={`https://lacasa-egy.com/shop?category=&page=1&vendor=${data?.name}`}>
                        <button type="button" className="btn btn-primary w-50 mb-3">View Products - User View</button>
                      </a>
                    </Col>
                  </Row>
                  <div className="mb-5">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control type="file" onChange={handleImage} />
                    <small className="text-danger">{errors?.['vendor.logo'] !== undefined ? errors?.['vendor.logo'] : ""}</small>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Vendor Company Name</Form.Label>
                    <Form.Control type="text" defaultValue={data?.vendor.name} {...register('vendor[company_name]')} />
                  </div>
                  <div className="mb-5">
                    <Form.Label>Vendor Email</Form.Label>
                    <Form.Control type="text" defaultValue={data?.vendor.email} {...register('vendor[email]')} />
                    <small className="text-danger">{errors?.['vendor.email'] !== undefined ? errors?.['vendor.email'] : ""}</small>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Account Manager</Form.Label>
                    {loading ? "loading..." :
                      <Select
                        className="input-select__input"
                        options={accountManagers}
                        name="Account Managers"
                        onInputChange={handleAccountManagerSearch}
                        onChange={e => setAccountManagerID(e.value)}
                        defaultValue={{ value: data?.vendor.account_manager.id, label: data?.vendor.account_manager.name }}
                      />}
                    <small className="text-danger">{errors?.['vendor.account_manager_id'] !== undefined ? errors?.['vendor.account_manager_id'] : ""}</small>
                  </div>
                  <div className="mb-5">
                    <Form.Label>Commission</Form.Label>
                    <Form.Control type="decimal" {...register('vendor[commission]')} defaultValue={data?.vendor.commission} />
                    <small className="text-danger">{errors?.['vendor.commisssion'] !== undefined ? errors['vendor.commisssion'] : ""}</small>

                  </div>
                  <div className="mb-5">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" {...register('password')} autoComplete="new-password" />
                    <small className="text-danger">{errors?.password !== undefined ? errors.password : ""}</small>

                  </div>
                  <div className="mb-5">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" {...register('password_confirmation')} autoComplete="new-password" />
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

export default EditVendor;
