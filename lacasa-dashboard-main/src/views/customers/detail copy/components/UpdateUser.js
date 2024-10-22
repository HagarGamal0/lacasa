import React from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';


const UpdateUser = ({ data, setName, setPhone, setPassword, setPasswordConfirmation }) => {


  return (

    <>
      <h2 className="small-title">Update User Info</h2>
      <Card className="mb-5">
        <Card.Body className="mb-n5">
          <div className="mb-5">
            <Row className="g-0 mb-2">
              <Col xl="12" >
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" defaultValue={data?.name} onChange={e => setName(e.target.value)} />
              </Col>
            </Row>
            <Row className="g-0 mb-2">
              <Col xl="12" >
                <Form.Label>Phone</Form.Label>
                <Form.Control type="number" defaultValue={data?.phone} onChange={e => setPhone(e.target.value)} />
              </Col>
            </Row>
            <Row className="g-0 mb-2">
              <Col xl="12" >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" defaultValue="" onChange={e => setPassword(e.target.value)} />
              </Col>
            </Row>
            <Row className="g-0 mb-2">
              <Col xl="12" >
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" defaultValue="" onChange={e => setPasswordConfirmation(e.target.value)} />
              </Col>
            </Row>

          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default UpdateUser;
