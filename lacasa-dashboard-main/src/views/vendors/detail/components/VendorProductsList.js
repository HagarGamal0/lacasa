import { HasAccess } from '@permify/react-role';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Bars } from 'react-loader-spinner';
import ReactPaginate from 'react-paginate';
import { NavLink, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../../API/API';

const ProductsList = () => {
  const title = 'Product List';
  const description = 'Ecommerce Product List Page';
  const [data, setData] = useState();
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState([]);
  const [timer, setTimer] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState([]);
  const [shippingProfileName, setShippingProfileName] = useState([]);
  const [shippingProfilePage, setShippingProfilePage] = useState([]);
  const [shippingProfile, setShippingProfile] = useState([]);
  const [sort, setSort] = useState([]);
  const [sku, setSku] = useState([]);
  const [key, setKey] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [stock, setStock] = useState([]);
  const [disableExport, setDisableExport] = useState(false);
  const [reprice, setReprice] = useState(true);
  const [repriceValue, setRepriceValue] = useState(1);
  const [repriceLoading, setRepriceLoading] = useState(false)
  const { id } = useParams();
  const arr = [];

  const createParentId = (childs) => {
    for (let i = 0; i < childs.length; i += 1) {
      arr.push(childs[i]);
      if (childs[i].childs.length > 0) {
        createParentId(childs[i].childs);
      }
    }
    return arr;
  };

  const handlePageChange = (event) => {
    setPage(event.selected + 1);
  };

  useEffect(() => {
    api
      .readAll(`/vendors/${id}`)
      .then(async (response) => {
        setLoading(true);
        api
          .readAll(
            `/products?page=${page}&find[vendor.vendor.status]=${response.data.vendor.status}&paginate=20&find[shipping_profile_id]=${shippingProfile}&find[status]=${key}&find[name]=${name}&find[category]=${category}&find[vendor_id]=${id}&sort=${sort}&find[sku]=${sku}&find[featured]=${featured}&find[stock]=${stock}`
          )
          .then((responseData) => {
            setData(responseData.data);
            setMeta(responseData.meta);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });

  }, [page, key, name, category, shippingProfile, sku, sort, featured, stock]);

  useEffect(() => {
    api
      .readAll(`/categories`)
      .then(async (response) => {
        await setCategoryData(createParentId(response.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  useEffect(() => {
    api
      .readAll(`/shipping_profiles?page=${shippingProfilePage}`)
      .then(async (response) => {
        if (shippingProfilePage < response.meta.last_page) {
          const shippingArr = [...shippingProfileName];
          response.data.map((item) => shippingArr.push({ value: item.id, label: item.name }));
          await setShippingProfileName(shippingArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [shippingProfilePage]);

  const categorySearch = (e) => {
    setPage(1);
    setCategory(e.target.value);
  };

  const nameSearch = (e) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    setTimer(
      window.setTimeout(function () {
        setTimer(null);

        setPage(1);
        setName(e.target.value);
      }, 1000)
    );
  };

  const scrollShipping = (e) => {
    setShippingProfilePage(shippingProfilePage + 1);
  };
  const shippingProfileFilter = (e) => {
    setShippingProfile(e.value);
  };
  const handleSort = (e) => {
    setSort(e.target.value);
  };
  const handleSku = (e) => {
    setSku(e.target.value);
  };

  function downloadBlob(blob, fName) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) return window.navigator.msSaveOrOpenBlob(blob);

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const dataBlob = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = dataBlob;
    link.download = fName;

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );

    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
      link.remove();
    }, 100);

    return 1;
  }
  const handleExport = async () => {
    await setDisableExport(true)
    api
      .readAll(`/export/products?find[shipping_profile_id]=${shippingProfile}&find[status]=${key}&find[name]=${name}&find[category]=${category}&find[vendor_id]=${id}&sort=${sort}&find[sku]=${sku}&find[featured]=${featured}&find[stock]=${stock}`)
      .then(async (response) => {
        const blob = new Blob([response], { type: 'text/csv' });
        await downloadBlob(blob, `Products--export.csv`);
        await setDisableExport(false)
      });
  };

  const handleReprice = () => {
    setRepriceLoading(true);
    let values = [];
    if (parseInt(reprice, 10) === 1) {
      values = {
        plus: repriceValue,
      };
    } else {
      values = {
        minus: repriceValue,
      };
    }
    api.create(`/vendors/${id}/reprice/${category}`, values)
      .then(async response => {
        setRepriceLoading(false);
        toast.success('Vendor Product Prices are Updated!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <HasAccess permissions="View Products" renderAuthFailed={<Unauthorized />} isLoading="loading...">
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
              <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/">
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Home</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}
            {repriceLoading ? "updating products prices..." :
              <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
                {/* eslint-disable-next-line */}
                <select className="form-select form-select-sm form-select-box-shadow w-100 me-3 text-dark font-weight-bold" onChange={e => setReprice(e.target.value)}>
                  <option hidden>INCREASE/DECREASE</option>
                  <option value={1}>INCREASE</option>
                  <option value={0}>DECREASE</option>
                </select>
                <Form.Control type="text" placeholder="RE-PRICE" onChange={(e) => setRepriceValue(e.target.value)} />
                <button type="button" className="btn btn-primary" onClick={handleReprice}>Submit</button>
              </Col>}


            <Col xs="12" sm="auto" className="d-flex align-items-end justify-content-end mb-2 mb-sm-0 order-sm-3">
              {disableExport ? "Getting your data ready..." :
                <Button variant="outline-primary" onClick={handleExport} className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                  <span>Export Products</span>
                </Button>}
            </Col>
          </Row>
        </div>

        <div className="d-flex justify-content-between">
          {/* eslint-disable  */}
          <div className="text-small text-muted w-75 d-flex mb-3">
            <select className="form-select form-select-sm form-select-box-shadow w-50 me-3 text-dark font-weight-bold" onChange={categorySearch}>
              <option value="">CATEGORY</option>
              {categoryData?.map((item, index) => (
                <option value={item.name} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <Select
              className="w-50 text-dark font-weight-bold"
              placeholder="SHIPPING PROFILE"
              options={shippingProfileName}
              onMenuScrollToBottom={scrollShipping}
              onChange={shippingProfileFilter}
            />
            <input type="text" className="form-control ms-3 me-3 w-25" placeholder="SKU" onChange={handleSku} />
            <select className="form-select form-select-sm form-select-box-shadow w-25 me-3 text-dark font-weight-bold" onChange={handleSort}>
              <option hidden>SORT</option>
              <option value="new">NEW TO OLD</option>
              <option value="-new">OLD TO NEW</option>
            </select>
            <select className="form-select form-select-sm form-select-box-shadow w-25 me-3 text-dark font-weight-bold" onChange={e => setFeatured(e.target.value)}>
              <option hidden>FEATURED</option>
              <option value={[]}>All</option>
              <option value={1}>Featured Products</option>
              <option value={0}>Not Featured Products</option>
            </select>
            <select className="form-select form-select-sm form-select-box-shadow w-25 me-3 text-dark font-weight-bold" onChange={e => setStock(e.target.value)}>
              <option hidden>STOCK</option>
              <option value={[]}>All</option>
              <option value={1}>In Stock</option>
              <option value={0}>Out Of stock</option>
            </select>

          </div>

          <div>
            <p>
              <span className="bg-danger p-2 rounded">{meta?.total}</span> PRODUCTS
            </p>
          </div>
        </div>
        <Card>
          <Tabs
            id="products-tab"
            activeKey={key}
            onSelect={(k) => {
              setKey(k);
            }}
            className="mb-3"
          >
            <Tab eventKey={[]} title="Total">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 custom-sort ps-5 pe-4 h-100">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control type="text" placeholder="TITLE" onChange={nameSearch} />
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div>
                        <div className="text-muted text-small">VENDOR</div>
                      </div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col xs="1" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">EDIT</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
              ) : (
                <>
                  {data?.products.items.map((item, index) => (
                    <Card className={`mb-2 ${selectedItems.includes(index + 1) && 'selected'}`} key={index}>
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.slug}`}>
                            <img
                              src={`${item.images.length > 0 ? item.images[0].url : ''}`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col xs="11" lg="2" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">#{item.id}</div>
                              </NavLink>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.vendor.name}</div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.quantity}</div>
                            </Col>

                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3">
                              {item.status === 'Draft' ? <Badge bg="outline-secondary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' ? <Badge bg="outline-tertiary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' || item.status === 'Draft' ? '' : <Badge bg="outline-primary">{item.status.toUpperCase()}</Badge>}
                            </Col>
                            <Col lg="1" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4">
                              <HasAccess permissions="Edit Products" renderAuthFailed={"You don't have access to edit products."} isLoading="loading...">
                                <NavLink to={`/products/detail/${item.slug}`}>
                                  <div className="lh-1 text-alternate">
                                    <CsLineIcons icon="edit" />
                                  </div>
                                </NavLink>
                              </HasAccess>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Published" title="Published">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control type="text" placeholder="TITLE" onChange={nameSearch} />
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div><div className="text-muted text-small">VENDOR</div></div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col xs="1" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">EDIT</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
              ) : (
                <>
                  {data?.products.items.map((item, index) => (
                    <Card className={`mb-2 ${selectedItems.includes(index + 1) && 'selected'}`} key={index}>
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.slug}`}>
                            <img
                              src={`${item.images.length > 0 ? item.images[0].url : ''}`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col xs="11" lg="2" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">#{item.id}</div>
                              </NavLink>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.vendor.name}</div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.quantity}</div>
                            </Col>

                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3">
                              {item.status === 'Draft' ? <Badge bg="outline-secondary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' ? <Badge bg="outline-tertiary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' || item.status === 'Draft' ? '' : <Badge bg="outline-primary">{item.status.toUpperCase()}</Badge>}
                            </Col>
                            <Col lg="1" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <div className="lh-1 text-alternate">
                                  {' '}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Pending" title="Pending">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control type="text" placeholder="TITLE" onChange={nameSearch} />
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div><div className="text-muted text-small">VENDOR</div></div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col xs="1" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">EDIT</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
              ) : (
                <>
                  {data?.products.items.map((item, index) => (
                    <Card className={`mb-2 ${selectedItems.includes(index + 1) && 'selected'}`} key={index}>
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.slug}`}>
                            <img
                              src={`${item.images.length > 0 ? item.images[0].url : ''}`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col xs="11" lg="2" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">#{item.id}</div>
                              </NavLink>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.vendor.name}</div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.quantity}</div>
                            </Col>

                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3">
                              {item.status === 'Draft' ? <Badge bg="outline-secondary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' ? <Badge bg="outline-tertiary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' || item.status === 'Draft' ? '' : <Badge bg="outline-primary">{item.status.toUpperCase()}</Badge>}
                            </Col>
                            <Col lg="1" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <div className="lh-1 text-alternate">
                                  {' '}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Draft" title="Draft">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control type="text" placeholder="TITLE" onChange={nameSearch} />
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div><div className="text-muted text-small">VENDOR</div></div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col xs="1" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">EDIT</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
              ) : (
                <>
                  {data?.products.items.map((item, index) => (
                    <Card className={`mb-2 ${selectedItems.includes(index + 1) && 'selected'}`} key={index}>
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.slug}`}>
                            <img
                              src={`${item.images.length > 0 ? item.images[0].url : ''}`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col xs="11" lg="2" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">#{item.id}</div>
                              </NavLink>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.vendor.name}</div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.quantity}</div>
                            </Col>

                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3">
                              {item.status === 'Draft' ? <Badge bg="outline-secondary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' ? <Badge bg="outline-tertiary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' || item.status === 'Draft' ? '' : <Badge bg="outline-primary">{item.status.toUpperCase()}</Badge>}
                            </Col>
                            <Col lg="1" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <div className="lh-1 text-alternate">
                                  {' '}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
            <Tab eventKey="Trash" title="Trash">
              <Row className="g-0 mb-2 d-none d-lg-flex">
                <Col xs="auto" className="sw-11 d-none d-lg-flex" />
                <Col>
                  <Row className="g-0 h-100 align-content-center custom-sort ps-5 pe-4 h-100">
                    <Col xs="2" lg="2" className=" mb-lg-0 pe-3">
                      <Form.Control type="text" placeholder="TITLE" onChange={nameSearch} />
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div><div className="text-muted text-small">VENDOR</div></div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">PRICE</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">QUANTITY</div>
                    </Col>
                    <Col xs="2" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">STATUS</div>
                    </Col>
                    <Col xs="1" lg="2" className="d-flex flex-column mb-lg-0 pe-3 d-flex">
                      <div className="text-muted text-small">EDIT</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
              ) : (
                <>
                  {data?.products.items.map((item, index) => (
                    <Card className={`mb-2 ${selectedItems.includes(index + 1) && 'selected'}`} key={index}>
                      <Row className="g-0 h-100 sh-lg-9 position-relative">
                        <Col xs="auto" className="position-relative ">
                          <NavLink to={`/products/detail/${item.slug}`}>
                            <img
                              src={`${item.images.length > 0 ? item.images[0].url : ''}`}
                              alt="product broken image"
                              className="card-img card-img-horizontal sh-9 sw-11 h-100"
                            />
                          </NavLink>
                        </Col>
                        <Col className="py-4 py-lg-0 ps-5 pe-4 h-100">
                          <Row className="g-0 h-100 align-content-center">
                            <Col xs="11" lg="2" className="d-flex flex-column mb-lg-0 mb-3 pe-3 d-flex order-1 h-lg-100 justify-content-center">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <small>{item.name}</small>
                                <div className="text-small text-muted text-truncate">#{item.id}</div>
                              </NavLink>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.vendor.name}</div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">
                                {item.price}
                                <small className="text-muted">EGP</small>
                              </div>
                            </Col>
                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-3">
                              <div className="lh-1 text-alternate">{item.quantity}</div>
                            </Col>

                            <Col lg="2" className="d-flex flex-column pe-1 mb-2 mb-lg-0 align-items-start justify-content-center order-3">
                              {item.status === 'Draft' ? <Badge bg="outline-secondary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' ? <Badge bg="outline-tertiary">{item.status.toUpperCase()}</Badge> : ''}

                              {item.status === 'Published' || item.status === 'Draft' ? '' : <Badge bg="outline-primary">{item.status.toUpperCase()}</Badge>}
                            </Col>
                            <Col lg="1" className="d-flex flex-column pe-1 mb-2 mb-lg-0 justify-content-center order-4">
                              <NavLink to={`/products/detail/${item.slug}`}>
                                <div className="lh-1 text-alternate">
                                  {' '}
                                  <CsLineIcons icon="edit" />
                                </div>
                              </NavLink>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Tab>
          </Tabs>
        </Card>
        <div className="d-flex justify-content-center mt-5">
          <ReactPaginate
            previousLabel="<<"
            nextLabel=">>"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={meta?.last_page > 0 ? meta?.last_page : 0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
        {/* Pagination End */}
      </HasAccess>
    </>
  );
};

export default ProductsList;
