import { HasAccess } from '@permify/react-role';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Bars } from 'react-loader-spinner';
import { NavLink } from 'react-router-dom';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';

const Banner = () => {
  const title = `Top Notification Page`;
  const description = `Top Notification Page`;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState();
  const [text, setText] = useState();
  const [textAr, setTextAr] = useState();
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setLoading(true);
    async function fetchData(){
      api.readAll(`/dynamic/top-notifications/items`)
        .then(async (response) => {
			setText(response.data[0]?.title_translate?.en);
			setTextAr(response.data[0]?.title_translate?.ar)
			setLink(response.data[0]?.link);
          setData(response.data[0]);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
    }, []);
  useEffect(()=>{
    api.update(`/dynamic/top-notifications/items`, formData, data?.id).then(() => {setLoading(false);});
  }, [formData]);
  const onSubmit = () => {
    setFormData({"_method":"PATCH","link": link, "title": {"en": text, "ar": textAr} });
    setEdit(!edit);
    setLoading(true);
  };
  return (
      <HasAccess permissions="View Settings" renderAuthFailed={<Unauthorized />} isLoading="loading...">
        <>
          <HtmlHead title={title} description={description} />
          <div className="page-title-container">
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

              {/* Top Buttons Start */}
              {/* Top Buttons End */}
            </Row>
          </div>
          <Row className="mb-3">
            <Col md="5" lg="3" xxl="2" className="mb-1">
              {/* Search Start */}
              <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
                <Form.Control type="text" placeholder="Search" />
                <span className="search-magnifier-icon">
                <CsLineIcons icon="search" />
              </span>
                <span className="search-delete-icon d-none">
                <CsLineIcons icon="close" />
              </span>
              </div>
              {/* Search End */}
            </Col>
          </Row>
          <Row className="g-0 align-content-center d-none d-lg-flex ps-5 pe-5 mb-2 custom-sort">
            <h1>Edit Notification</h1>
          </Row>
          {/* List Items Start */}
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
              </div>
              :
              <Card>
                <div className='d-flex flex-column align-items-center'>
                  <div className='d-flex flex-row  justify-content-between w-100'>
                    <div className='p-2 flex flex-column justify-content-start'>
                      <p className='font-weight-bold'>Id</p>
                      <p>{data?.id}</p>
                    </div>
                    <div className='p-2 flex flex-column justify-content-start'>
                      <p className='font-weight-bold'>TiTle</p>
                      {edit ?
                          <Form.Control type="text" onChange={(e) => setText(e.target.value)} defaultValue={text}/> :
                          <div className="text-alternate">{text}</div>
                      }
                    </div>

                    <div className='p-2 flex flex-column justify-content-start'>
                      <p className='font-weight-bold'>TiTle Ar</p>
                      {edit ?
                          <Form.Control type="textAr" onChange={(e) => setTextAr(e.target.value)} defaultValue={textAr}/> :
                          <div className="text-alternate">{textAr}</div>
                      }
                    </div>
                    <div className='p-2 flex flex-column justify-content-start'>
                      <p className='font-weight-bold'>Link</p>
                      {edit ?
                          <Form.Control className='m-2' type="text" onChange={(e) => setLink(e.target.value)}
                                        defaultValue={link}/> :
                          <p className="text-alternate">{link}</p>
                      }
                    </div>
                    <div className='p-2 flex flex-column justify-content-start'>
                      <p className='font-weight-bold'>Edit</p>
                      <Button variant="outline-primary" className="text-alternate btn-icon btn-icon-start"
                              onClick={() => setEdit(!edit)}>Edit</Button>
                    </div>
                  </div>
                  <div className='d-flex flex-row align-items-center'>
                    <div>
                      {edit ?
                          <Button onClick={onSubmit} variant="outline-primary mb-3"
                                  className="btn-icon btn-icon-start ms-0 ms-sm-1 w-100 w-md-auto">
                            <CsLineIcons icon="save"/>
                            <span>Save</span>
                          </Button> : ''
                      }
                    </div>
                  </div>
                </div>
              </Card>}
          {/* List Items End */}
        </>
      </HasAccess>
  );
};

export default Banner;
