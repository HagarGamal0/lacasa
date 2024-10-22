import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner';
import { NavLink, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import UserInfo from './components/Info';
import UserOrders from './components/Orders';
import UpdateUser from './components/UpdateUser';

import api from '../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const CustomersDetail = () => {
  const title = 'User Detail';
  const description = 'User Detail Page';
  const { id } = useParams();
  const [data, setData] = useState();
  const [orders, setOrders] = useState();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState()
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState()

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/users/${id}`)
      .then(async (response) => {
        setData(response.data)
      }).catch((err) => {
        console.log(err);
      });

    api
      .readAll(`/orders?find[user.id]=${id}&page=1`)
      .then(async (response) => {
        setOrders(response.data)
        setLoading(false);
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  const formData = new FormData();
  const submitUser = () => {
    formData.append('name', name ?? data.name)
    formData.append('phone', phone ?? data.phone)
    if (password) {
      formData.append('password', password)
    }
    if (passwordConfirmation) {
      formData.append('password_confirmation', passwordConfirmation)
    }
    formData.append('_method', "PATCH");
    api
      .create(`/users/${id}`, formData)
      .then((response) => {
        if (response.errors) {
          setError(response?.errors);
        } else {
          toast.success('User Updated!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <>
      {loading ? <Bars
        height="80"
        width="80"
        color="black"
        ariaLabel="bars-loading"
        wrapperStyle={{}}
        wrapperClass=""
      /> : <>
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
              <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/users/list">
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Users</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}


          </Row>
        </div>

        <Row>
          <Col xl="4">
            <UserInfo data={data} />
          </Col>

          <Col xl="8">
            {orders?.length > 0 ?
              <UserOrders orders={orders} />
              : ""}
            <UpdateUser data={data} setName={setName} setPhone={setPhone} setPassword={setPassword} setPasswordConfirmation={setPasswordConfirmation} />
          </Col>
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" type="button" onClick={submitUser}>Save</button>
          </div>
        </Row>
      </>}
    </>
  );
};

export default CustomersDetail;
