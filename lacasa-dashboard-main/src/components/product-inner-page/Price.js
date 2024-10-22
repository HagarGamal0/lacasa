import React, { useState, useEffect } from 'react';
import { Col, Form, Card } from 'react-bootstrap';

const Price = ({ setPrice, setDiscount, setDiscountType, price, discount, discountType, data = [], error = '' }) => {

  const [priceAfterDiscount, setPriceAfterDiscount] = useState();

  useEffect(() => {
    if (discountType === "fixed") {
      setPriceAfterDiscount(price - discount)
    } else if (discountType === "percentage") {
      setPriceAfterDiscount(price - ((discount / 100) * price))
    }

  }, [discount, price])

  const handlePriceAfterDiscount = (e) => {
    if (discountType === 'fixed') {
      setDiscount(price - e.target.value)
      setPriceAfterDiscount(e.target.value)
    } else if (discountType === "percentage") {
      setDiscount(100 - ((e.target.value / price) * 100))
      setPriceAfterDiscount(e.target.value)
    }
  }


  const handleDiscount = (e) => {
    if (discountType === "fixed") {
      setPriceAfterDiscount(price - e.target.value)
      setDiscount(e.target.value);
    } else if (discountType === "percentage") {
      setPriceAfterDiscount(price - ((e.target.value / 100) * price))
      setDiscount(e.target.value)
    }
  }


  return (
    <>
      <Col xl="12">
        <h2 className="small-title">Price</h2>
        <Card className="mb-5">
          <Card.Body>
            <div className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" defaultValue={data?.price} onChange={e => setPrice(e.target.value)} />
              <small className="text text-danger">{error.price ?? error.price}</small>
            </div>
            <div className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control type="number" defaultValue={data?.discount} value={discount} onChange={handleDiscount} />
              <small className="text text-danger">{error.discount ?? error.discount}</small>
            </div>
            <div className="mb-3">
              <Form.Label>Discount Type</Form.Label>
              <Form.Select onChange={e => setDiscountType(e.target.value)}>
                {data?.discount_type !== undefined ? <option hidden>{data.discount_type === "fixed" ? "Fixed" : "Percentage"}</option> : <option hidden>Choose a Discount Type</option>}
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </Form.Select>
              <small className="text text-danger">{error.discount_type ?? error.discount_type}</small>
            </div>
            <div className="mb-3">
              <Form.Label>Price After Discount</Form.Label>
              <Form.Control type="number" onChange={handlePriceAfterDiscount} value={priceAfterDiscount} />
              <small className="text text-danger">{error.discount_type ?? error.discount_type}</small>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default Price;
