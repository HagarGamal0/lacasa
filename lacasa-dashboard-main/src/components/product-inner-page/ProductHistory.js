import React from 'react';
import { Form, Card } from 'react-bootstrap';

const ProductHistory = () => {

  return (
    <>
      <h2 className="small-title">History</h2>
      <Card className="mb-5">
        <Card.Body className="mb-n3">
          <div className="mb-3">
            <div className="text-small text-muted">FEATURED</div>
            <Form.Select >
              <option value={0}>False</option>
              <option value={1}>True</option>
            </Form.Select>
          </div>
          <div className="mb-3">
            <div className="text-small text-muted">STATUS</div>
          </div>

          <div className="mb-3">
            <div className="text-small text-muted">URL</div>
            <div>{window.location.href}</div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductHistory;
