import React, { useState, useEffect } from "react";
import { Col, Form, Card } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import api from '../../API/API';

const Metalinks = ({setSlug,setMetakeys,setMetaDesc,setMetaTitle,setArMetakeys,setArMetaDesc,setArMetaTitle,data = [],error = ''}) => {

  return (
    <Col xl="12">
      <h2 className="small-title">Meta </h2>
      <Card className="mb-5">
        <Card.Body>
          <div className="mb-3">
            <Form.Label>URL Slug</Form.Label>
            <Form.Control type="text" onChange={e => setSlug(e.target.value)} defaultValue={data?.slug} />
            <small className="text text-danger">{error.slug ?? error.slug}</small>
          </div>
          <div className="mb-3">
            <Form.Label>Meta keywords (en)</Form.Label>
            <Form.Control type="text" onChange={e => setMetakeys(e.target.value)} defaultValue={data?.meta_keywords_translate?.en} />
            <small className="text text-danger">{error.meta_keywords?.en ?? error.meta_keywords?.en}</small>
          </div>
          <div className="mb-3">
            <Form.Label>Meta Description (en)</Form.Label>
            <Form.Control type="text" onChange={e => { setMetaDesc(e.target.value); }} defaultValue={data?.meta_description_translate?.en} />
            <small className="text text-danger">{error.meta_description?.en ?? error.meta_description?.en}</small>
          </div>
          <div className="mb-3">
            <Form.Label>Meta Title (en)</Form.Label>
            <Form.Control type="text" onChange={e => setMetaTitle(e.target.value)} defaultValue={data?.meta_title_translate?.en} />
            <small className="text text-danger">{error.meta_title?.en ?? error.meta_title?.en}</small>
          </div>
		  <div className="mb-3">
            <Form.Label>Meta keywords (ar)</Form.Label>
            <Form.Control type="text" onChange={e => setArMetakeys(e.target.value)} defaultValue={data?.meta_keywords_translate?.ar} />
            <small className="text text-danger">{error.meta_keywords?.ar ?? error.meta_keywords?.ar}</small>
          </div>
          <div className="mb-3">
            <Form.Label>Meta Description (ar)</Form.Label>
            <Form.Control type="text" onChange={e => { setArMetaDesc(e.target.value); }} defaultValue={data?.meta_description_translate?.ar} />
            <small className="text text-danger">{error.meta_description?.ar ?? error.meta_description?.ar}</small>
          </div>
          <div className="mb-3">
            <Form.Label>Meta Title (ar)</Form.Label>
            <Form.Control type="text" onChange={e => setArMetaTitle(e.target.value)} defaultValue={data?.meta_title_translate?.ar} />
            <small className="text text-danger">{error.meta_title?.ar ?? error.meta_title?.ar}</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Metalinks;
