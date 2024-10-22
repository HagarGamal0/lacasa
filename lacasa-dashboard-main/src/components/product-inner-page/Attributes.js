import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Modal, ModalBody, ModalFooter, ModalHeader, Card } from 'reactstrap';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import api from '../../API/API';

const Attributes = ({ attributeData, setAttributeData }) => {
  const [attributes, setAttributes] = useState([]);
  const [attributeValue, setAttributeValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const [valueAtt, setValueAtt] = useState([]);
  const [value, setValue] = useState([]);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);
  const [sizePrice, setSizePrice] = useState({});

  useEffect(() => {
    api
      .readAll('/attributes')
      .then(async (response) => {
        const arr = [];
        response.data.map((item) => arr.push({ value: item.id, label: item.name }));
        await setAttributes(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangeAttributes = async (e) => {
    setValue([]);
    setValueAtt(e);
    setIsLoading(true);
    const arr = [];
    if (Number.isInteger(e.value)) {
      api
        .read('/attributes', e.value)
        .then(async (response) => {
          response.data.values.map((item, index) => {
            arr.push({ value: item.id, label: item.value });
            return arr;
          });
          await setAttributeValue(arr);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleAddAttributes = async () => {
    const valueNew = document.getElementById('newAttribute').value;
    if (attributes.find(({ label }) => label === valueNew)) {
      setErrors({
        ...errors,
        ...{ attributes: 'This attribute is already used' },
      });
    } else if (valueNew === '') {
      setErrors({ ...errors, ...{ attributes: 'Please Enter attribute' } });
    } else {
      setAttributes([...attributes, { value: valueNew, label: valueNew }]);
      setValueAtt({ value: valueNew, label: valueNew });
      setAttributeValue([]);
      toggle();
      setErrors({});
      setValue([]);
    }
  };

  const handleChangeAttributeValue = (_, action) => {
    switch (action.action) {
      case 'select-option': {
        setValue([...value, action.option]);
        break;
      }
      default: {
        setValue([...value.filter((o) => o.value !== action.removedValue.value)]);
        break;
      }
    }
  };

  const handleAddAttributeValue = async (e) => {
    setIsLoading(true);
    const data = document.getElementById('newValue').value;
    if (attributeValue.find(({ label }) => label === data)) {
      setErrors({ ...errors, ...{ values: 'This value is already used' } });
    } else if (value === '') {
      setErrors({ ...errors, ...{ values: 'Please Enter Value' } });
    } else {
      await setAttributeValue([...attributeValue, { value: data, label: data }]);
      setValue([...value, { value: data, label: data }]);
      toggle2();
      setErrors({});
      setIsLoading(false);
    }
  };

  const addAttribute = async () => {
    setIsLoadingTable(true);
    if (valueAtt.label && value.length > 0) {
      if (valueAtt.value === 3 && value.length > 0) {
        const sizeArr = attributeData.filter((e) => e.key === 'Size');
        if (sizeArr.length > 0) {
          const arr = sizeArr[0].value;
          for (let i = 0; i < value.length; i += 1) {
            arr.push({ ...sizeArr[0].value, ...{ value: value[i].label, price: sizePrice.price, price_after_sale: sizePrice.price_after_sale } });
          }
          const dataArr = attributeData.filter((e) => e.key !== 'Size');
          await setAttributeData([...dataArr, { key: valueAtt.label, value: arr }]);
        } else {
          const arr = [];
          for (let i = 0; i < value.length; i += 1) {
            arr.push({ value: value[i].label, price: sizePrice.price, price_after_sale: sizePrice.price_after_sale });
          }
          await setAttributeData([...attributeData, { key: valueAtt.label, value: arr }]);
        }
      } else {
        const arr = [];
        for (let i = 0; i < value.length; i += 1) {
          arr.push({ value: value[i].label });
        }
        await setAttributeData([...attributeData, { key: valueAtt.label, value: arr }]);
      }
      setErrors({});
      setValue([]);
      setValueAtt([]);
    } else if (valueAtt.value === 2) {
      const arr = [];
      await setAttributeData([...attributeData, { key: valueAtt.label, value: arr }]);
      setErrors({});
      setValue([]);
      setValueAtt([]);
    }
  };
  const handleClearAtt = async (index) => {
    await setIsLoadingTable(false);
    const arr = attributeData;
    for (let i = 0; i < arr.length; i += 1) {
      if (i === index) {
        arr.splice(i, 1);
      }
    }
    await setAttributeData(arr);
    await setIsLoadingTable(true);
  };

  const handleClearValue = async (index, itemIndex) => {
    await setIsLoadingTable(false);
    const arr = attributeData;

    for (let j = 0; j < arr.length; j += 1) {
      if (j === itemIndex) {
        for (let i = 0; i < arr[itemIndex].value.length; i += 1) {
          if (i === index) {
            arr[itemIndex].value.splice(i, 1);
          }
        }
      }
    }

    await setAttributeData(arr);
    await setIsLoadingTable(true);
  };

  const handlEditValue = async (e, index, itemIndex, string) => {
    // await setIsLoadingTable(false);
    const arr = attributeData;

    for (let j = 0; j < arr.length; j += 1) {
      if (j === itemIndex) {
        for (let i = 0; i < arr[itemIndex].value.length; i += 1) {
          if (i === index) {
            if (string === 'price') {
              arr[itemIndex].value[index].price = e.target.value;
            } else if (string === 'price after discount') {
              arr[itemIndex].value[index].price_after_sale = e.target.value;
            }
          }
        }
      }
    }

    await setAttributeData(arr);
    // await setIsLoadingTable(true);
  };

  const handleChangeSizePrice = (e) => {
    const newData = {
      [e.target.name]: e.target.value,
    };
    setSizePrice({ ...sizePrice, ...newData });
  };

  const inputTypeNumbers = document.querySelectorAll('input[type=number]');
  for (let a = 0; a < inputTypeNumbers.length; a += 1) {
    inputTypeNumbers[a].onwheel = function (event) {
      event.target.blur();
    };
  }

  return (
    <div className="mb-5">
      <Row>
        <Col xs="10">
          <label>Attribute</label>
          <Select className="input-fields-layout" value={valueAtt} options={attributes} onChange={handleChangeAttributes} />
        </Col>

        <Col xs="2" className="d-flex justify-content-center">
          <a onClick={toggle} className="btn btn-primary mt-4 ">
            +
          </a>
        </Col>
        <Col sm="4" className="d-flex justify-content-center">
          <Modal isOpen={modal} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Add Attribute</ModalHeader>
            <ModalBody className="p-4">
              <input id="newAttribute" className="form-control" placeholder="Attribute Name" />
              {errors.attributes ? (
                <p
                  style={{
                    fontSize: '12px',
                    marginTop: '5px',
                    color: 'red',
                  }}
                >
                  {errors.attributes}
                </p>
              ) : (
                ''
              )}
            </ModalBody>
            <ModalFooter>
              <a className="btn-solid btn-custom text-primary" onClick={handleAddAttributes}>
                Add
              </a>
              <Button className="btn-solid btn-custom text-primary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
      {valueAtt.value === 2 ? (
        ''
      ) : (
        <>
          {valueAtt.value === 3 ? (
            <Row>
              <Col sm="12">
                {isLoading ? (
                  <div>Loading</div>
                ) : (
                  <Row className="mt-2">
                    <Col xs="3">
                      <label>Price</label>
                      <input className="form-control" name="price" placeholder="Price" onChange={handleChangeSizePrice} />
                    </Col>
                    <Col xs="3">
                      <label>Price after sale</label>
                      <input className="form-control" name="price_after_sale" placeholder="Price after sale" onChange={handleChangeSizePrice} />
                    </Col>
                    <Col xs="4">
                      <label>Values</label>
                      <Select value={value} options={attributeValue} isMulti onChange={handleChangeAttributeValue} />
                    </Col>
                    <Col xs="2" className="d-flex justify-content-center">
                      <a onClick={toggle2} className="btn btn-primary mt-4 ">
                        +
                      </a>
                    </Col>
                  </Row>
                )}
                <Modal isOpen={modal2} toggle={toggle2} centered>
                  <ModalHeader toggle={toggle2}>Add Value</ModalHeader>
                  <ModalBody className="p-4">
                    <input id="newValue" className="form-control" placeholder="Add new value" />
                    {errors.values ? <p style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>{errors.values}</p> : ''}
                  </ModalBody>
                  <ModalFooter>
                    <a className="btn-solid btn-custom text-primary" onClick={handleAddAttributeValue}>
                      Add
                    </a>
                    <a className="btn-solid btn-custom text-primary" color="secondary" onClick={toggle2}>
                      Cancel
                    </a>
                  </ModalFooter>
                </Modal>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col sm="12">
                {isLoading ? (
                  <div>Loading</div>
                ) : (
                  <Row className="mt-2">
                    <Col xs="10">
                      <label>Values</label>
                      <Select value={value} options={attributeValue} isMulti onChange={handleChangeAttributeValue} />
                    </Col>
                    <Col xs="2" className="d-flex justify-content-center">
                      <a onClick={toggle2} className="btn btn-primary mt-4 ">
                        +
                      </a>
                    </Col>
                  </Row>
                )}
                <Modal isOpen={modal2} toggle={toggle2} centered>
                  <ModalHeader toggle={toggle2}>Add Value</ModalHeader>
                  <ModalBody className="p-4">
                    <input id="newValue" className="form-control" placeholder="Add new value" />
                    {errors.values ? <p style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>{errors.values}</p> : ''}
                  </ModalBody>
                  <ModalFooter>
                    <a className="btn-solid btn-custom" onClick={handleAddAttributeValue} color="secondary">
                      Add
                    </a>
                    <a className="btn-solid btn-custom" color="secondary" onClick={toggle2}>
                      Cancel
                    </a>
                  </ModalFooter>
                </Modal>
              </Col>
            </Row>
          )}
        </>
      )}
      <Row>
        <Col sm="12" className="d-flex justify-content-center">
          <a onClick={addAttribute} className="btn btn-primary btn-accept mt-4">
            Add
          </a>
        </Col>
      </Row>
      {isLoadingTable && (
        <div>
          {isLoadingTable && (
            <div>
              {attributeData.map((item, index) => (
                <Row className="mt-3 attribute-list" key={index}>
                  <Col xs="2">
                    <div>{item.key}</div>
                  </Col>
                  <Col xs="9">
                    {item.value.map((itemValue, valueIndex) => (
                      <Row key={valueIndex} className="mt-3">
                        <Card className=" mb-5 bg-white rounded shadow-lg bg-primary p-3 text-white">
                          <Row>
                            {itemValue.price ? (
                              <>
                                <Col xs="4">
                                  <ul>
                                    <li>
                                      {valueIndex + 1}-{itemValue.value}
                                    </li>
                                  </ul>
                                </Col>
                                <Col xs="7">
                                  <ul key={valueIndex}>
                                    <li className="d-flex justify-content-around align-items-center">
                                      Price:{' '}
                                      <Form.Control
                                        type="number"
                                        className="w-50"
                                        defaultValue={itemValue.price}
                                        onChange={(e) => handlEditValue(e, valueIndex, index, 'price')}
                                      />
                                    </li>
                                    <br />
                                    <li className="d-flex justify-content-around align-items-center">
                                      price after sale:{' '}
                                      <Form.Control
                                        type="number"
                                        className="w-50"
                                        defaultValue={itemValue.price_after_sale}
                                        onChange={(e) => handlEditValue(e, valueIndex, index, 'price after discount')}
                                      />
                                    </li>
                                  </ul>
                                </Col>
                              </>
                            ) : (
                              <Col xs="11">
                                <ul>
                                  <li>
                                    {valueIndex + 1}-{itemValue.value}
                                  </li>
                                </ul>
                              </Col>
                            )}
                            {item.value.length > 1 ? (
                              <Col xs="1">
                                <a role="button" tabIndex={valueIndex} onClick={() => handleClearValue(valueIndex, index)}>
                                  X
                                </a>
                              </Col>
                            ) : (
                              ''
                            )}
                          </Row>
                        </Card>
                      </Row>
                    ))}
                  </Col>
                  <Col xs="1">
                    <a onClick={() => handleClearAtt(index)}>X</a>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </div>
      )}
      <hr />
    </div>
  );
};

export default Attributes;
