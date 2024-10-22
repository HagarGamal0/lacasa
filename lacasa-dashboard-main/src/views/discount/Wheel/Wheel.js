import { HasAccess } from '@permify/react-role';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner';
import Modal from 'react-modal';
import { NavLink } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';
import CreateWheel from './CreateWheel/CreateWheel';

import 'react-toastify/dist/ReactToastify.css';

const Wheel = () => {
  const title = 'Wheels';
  const description = 'Wheels List Page';
  let subtitle;

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '75%',
    },
  };

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/wheel_offers`)
      .then(async (response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = (id) => {
    api
      .delete(`/wheel_offers/${id}`)
      .then((response) => {
        toast.success('Wheel Deleted Successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <HasAccess permissions="View Settings" renderAuthFailed={<Unauthorized />} isLoading="loading...">
      <>
        <HtmlHead title={title} description={description} />
        <div className="page-title-container">
          <Modal isOpen={modalIsOpen} onAfterOpen={() => afterOpenModal} onRequestClose={() => closeModal} style={customStyles} contentLabel="Create Coupon">
            <div className="d-flex flex-column">
              <div className="d-flex justify-content-between">
                <h3>Create Wheel</h3>
                <span id="close__modal-button" onClick={closeModal}>
                  &times;
                </span>
              </div>
              <Card>
                <Card.Body>
                  <CreateWheel />
                </Card.Body>
              </Card>
            </div>
          </Modal>
          <ToastContainer
            position="top-right"
            autoClose={1000}
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
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Home</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            <HasAccess permissions="Edit Settings" renderAuthFailed="" isLoading="loading...">
              {/* Top Buttons Start */}
              <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
                {/* eslint-disable-next-line */}
                <Button variant="outline-primary" className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto" onClick={openModal}>
                  <CsLineIcons icon="plus" /> <span>Add Wheel</span>{' '}
                </Button>
              </Col>
            </HasAccess>
          </Row>
        </div>
        <Row className="g-0 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
          <Col lg="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
            <div className="text-muted text-small ">ID</div>
          </Col>
          <Col lg="3" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small ">NAME</div>
          </Col>
          <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small ">IS WINABLE</div>
          </Col>
          <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small ">VALUE</div>
          </Col>
          <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
            <div className="text-muted text-small ">DESCRIPTION</div>
          </Col>
          <Col lg="2" className="d-flex flex-column pe-1 justify-content-center align-items-center">
            <div className="text-muted text-small ">DELETE</div>
          </Col>
        </Row>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
          </div>
        ) : (
          <>
            {data?.map((item, index) => (
              <Card className="mb-2" key={item.id}>
                <Card.Body className="pt-0 pb-0 sh-30 sh-lg-8">
                  <Row className="g-0 h-100 align-content-center">
                    <Col xs="11" lg="1" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 h-lg-100 position-relative">
                      <div className="text-muted text-small d-lg-none">Id</div>
                      {item.id}
                    </Col>
                    <Col xs="6" lg="3" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2">
                      <div className="text-muted text-small d-lg-none">Wheel Name</div>
                      <div className="text-alternate">{item.name}</div>
                    </Col>
                    <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2">
                      <div className="text-muted text-small d-lg-none">Winable</div>
                      <div className="text-alternate">{item.is_winable === 0 ? 'False' : 'True'}</div>
                    </Col>
                    <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2">
                      <div className="text-muted text-small d-lg-none">Value</div>
                      <div className="text-alternate">{item.value}</div>
                    </Col>
                    <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2">
                      <div className="text-muted text-small d-lg-none">Description</div>
                      <div className="text-alternate">{item.description}</div>
                    </Col>
                    <Col xs="6" lg="2" className="d-flex justify-content-center align-items-center mb-2 mb-lg-0 order-5 order-lg-4">
                      <HasAccess permissions="Edit Settings" renderAuthFailed={"You don't have access to delete"} isLoading="loading...">
                        <NavLink to="/discount/wheel" onClick={() => handleDelete(item.id)}>
                          <div className="text-alternate">
                            <CsLineIcons icon="bin" size="13" />
                          </div>
                        </NavLink>
                      </HasAccess>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </>
        )}
      </>
    </HasAccess>
  );
};

export default Wheel;
