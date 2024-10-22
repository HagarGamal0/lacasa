import React, { useState, useEffect } from 'react';
import { Col, Row, Button, Modal, ModalBody, ModalFooter, ModalHeader, Card } from 'reactstrap';
import { Form } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import api from '../../API/API';

const Tags = ({ totalNewTags = [], setTotalNewTags }) => {
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [name, setName] = useState([]);

  useEffect(() => {
    const tagsArr = [];
    const labels = [];

    totalNewTags.map((item, index) => {
      tagsArr.push({ label: item.name, value: item.id });
      labels.push(item.name)
      return tagsArr;
    });
    setTags(tagsArr);
    setTotalNewTags(labels)
  }, []);

  useEffect(() => {
    api
      .readAll(`/tags?find[name]=${name}`)
      .then(async (response) => {
        const arrTags = [];
        response.data.map((item, index) => {
          arrTags.push({ value: item.id, label: item.name });
          return arrTags;
        });
        await setAllTags(arrTags);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [name]);

  const handleTags = (e) => {
    const arr = [];
    e.map((item, index) => {
      arr.push(item.label);
      return arr;
    })
    setTotalNewTags(arr);
  }

  return (
    <div className="mb-5">
      <Row>
        <label>Tags</label>
        <Row>
          <div className="mt-5">
            {/* <Select
        id="vendor__select"
        className="input-fields-layout"
        onInputChange={e=>setName(e)}
        options={allTags}
        defaultValue={totalNewTags.map((item,index)=>(
            {label:item.name, value:item.id}
        ))}
        isMulti
      /> */}

            <CreatableSelect
              className="input-select__input"
              options={allTags}
              name="tags"
              onChange={handleTags}
              onInputChange={(e) => setName(e)}
              onBlurResetsInput={false}
              defaultValue={totalNewTags.map((item, index) => ({ label: item.name, value: item.id }))}
              isMulti
            />
          </div>
          {/* {error?.vendors && <p style={{ fontSize: '12px', marginTop: '5px', color: 'red' }}>The vendors field is required when has vendors is true.</p>} */}
        </Row>
      </Row>
    </div>
  );
};

export default Tags;
