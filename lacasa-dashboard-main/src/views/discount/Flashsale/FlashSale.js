import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner';
import Modal from 'react-modal';
import { NavLink } from 'react-router-dom';
import api from '../../../API/API';
import FlashDetail from './FlashsaleDetails/FlashDetails';


const FlashSale = () => {
  const title = 'Flash Sale';
  const description = 'Flash Sale List Page';

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  let subtitle;
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "75%"
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


  const [selectedItems, setSelectedItems] = useState([]);
  const checkItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((x) => x !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {
    setLoading(true);
    api
      .readAll(`/flash_sales`)
      .then(async (response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [])

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Modal isOpen={modalIsOpen} onAfterOpen={() => afterOpenModal} onRequestClose={() => closeModal} style={customStyles} contentLabel="Create Coupon">
          <div className="d-flex flex-column">
            <div className="d-flex justify-content-between">
              <h3>Create Coupon</h3>
              <span id="close__modal-button" onClick={closeModal}>
                &times;
              </span>
            </div>
            <Card>
              <Card.Body>
                <FlashDetail />
              </Card.Body>
            </Card>
          </div>
        </Modal>
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
          <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
            <Button variant="outline-primary" className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto" onClick={openModal}>
              <CsLineIcons icon="plus" /> <span>Add Flash Sale</span>{' '}
            </Button>
          </Col>
        </Row>
      </div>

      <Row className="mb-3">
        <Col md="5" lg="3" xxl="2" className="mb-1">
          <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
            <Form.Control type="text" placeholder="Search" />
            <span className="search-magnifier-icon">
              <CsLineIcons icon="search" />
            </span>
            <span className="search-delete-icon d-none">
              <CsLineIcons icon="close" />
            </span>
          </div>
        </Col>
      </Row>
      <Row className="g-0 h-100 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
        <Col lg="1" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
          <div className="text-muted text-small cursor-pointer sort">ID</div>
        </Col>
        <Col lg="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">NAME</div>
        </Col>
        <Col lg="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">DISCOUNT</div>
        </Col>
        <Col lg="2" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">PRODUCTS COUNT</div>
        </Col>
        <Col lg="3" className="d-flex flex-column pe-1 justify-content-center">
          <div className="text-muted text-small cursor-pointer sort">EXPIRE AT</div>
        </Col>
      </Row>
      {loading ?
        <div className="d-flex justify-content-center align-items-center h-100">
          <Bars
            height="80"
            width="80"
            color="black"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div> : <>
          {data?.map((item, index) => (
            <Card className="mb-2" key={item.id}>
              <Card.Body className="pt-0 pb-0 sh-30 sh-lg-8">
                <Row className="g-0 h-100 align-content-center" onClick={() => checkItem(1)}>
                  <Col xs="11" lg="1" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-1 order-lg-1 h-lg-100 position-relative">
                    <div className="text-muted text-small d-lg-none">Id</div>
                    <NavLink to={`/users/detail/${item.id}`} className="text-truncate h-100 d-flex align-items-center">
                      {item.id}
                    </NavLink>
                  </Col>
                  <Col xs="6" lg="3" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-3 order-lg-2">
                    <div className="text-muted text-small d-lg-none">Campaign Name</div>
                    <div className="text-alternate">{item.campaign_name}</div>
                  </Col>
                  <Col xs="6" lg="3" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-3">
                    <div className="text-muted text-small d-lg-none">Discount</div>
                    <div className="text-alternate">{item.precentage_discount}</div>
                  </Col>
                  <Col xs="6" lg="2" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-4 order-lg-4">
                    <div className="text-muted text-small d-lg-none">Products Count</div>
                    <div className="text-alternate">{item.products_count}</div>
                  </Col>
                  <Col xs="6" lg="3" className="d-flex flex-column justify-content-center mb-2 mb-lg-0 order-5 order-lg-4">
                    <div className="text-muted text-small d-lg-none">Expire At</div>
                    <div className="text-alternate">{item.expire_at.split(" ")[0]}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}</>}
    </>
  );
};

export default FlashSale;
