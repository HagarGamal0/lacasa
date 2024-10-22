import { HasAccess } from '@permify/react-role';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import 'quill/dist/quill.bubble.css';
import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Bars } from 'react-loader-spinner';
import { NavLink, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import Unauthorized from 'views/default/Unauthorized';
import api from '../../../API/API';

import 'react-toastify/dist/ReactToastify.css';

const RolesCreate = () => {
  const title = 'Roles Create';
  const description = 'Lacasa Roles Create Page';
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [permissions, setPermissions] = useState();
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [detachPermissions, setDetachPermissions] = useState([]);
  const [users, setUsers] = useState();
  const [userSearch, setUserSearch] = useState([]);
  const [name, setName] = useState();
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState();

  const [selectedUsers, setSelectedUsers] = useState([])
  const [detachedUsers, setDetachedUsers] = useState([]);

  useEffect(() => {
    api
      .readAll(`/permissions`)
      .then(async (response) => {
        const permissionsArr = [];
        response.data.map((item, index) => permissionsArr.push({ value: item.id, label: item.name }));
        await setPermissions(permissionsArr);
        await setLoading(false);

      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .readAll(`/users?find[name]=${userSearch}`)
      .then(async (response) => {
        const usersArr = [];
        response.data.map((item, index) => usersArr.push({ value: item.id, label: item.name }));
        await setUsers(usersArr);
        await setUsersLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userSearch]);

  const handlePermissions = (e) => {
    const attachArr = [...e];
    setSelectedPermissions(attachArr)
  }

  const handleUsers = (e) => {
    const attachArr = [...e];
    setSelectedUsers(attachArr)
  }

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name ?? data.name);
    for (let i = 0; i < selectedPermissions.length; i += 1) {
      formData.append('permissions[]', selectedPermissions[i].value)
    }
    for (let i = 0; i < selectedUsers.length; i += 1) {
      formData.append('users[]', selectedUsers[i].value)
    }

    api
      .create(`/roles`, formData)
      .then((response) => {
        if (response.errors) {
          setError(response?.errors);
        } else {
          toast.success('Role Created!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <HasAccess roles="Super Admin" renderAuthFailed={<Unauthorized />} isLoading="loading...">
      <>
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
              <NavLink className="muted-link pb-1 d-inline-block hidden breadcrumb-back" to="/roles/list">
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Roles</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                {title}
              </h1>
            </Col>
            {/* Title End */}
          </Row>
        </div>
        {loading ? (
          <Bars height="80" width="80" color="black" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" />
        ) : (
          <>
            <Row>
              <Col xl="12">
                {/* Category Info Start */}
                <h2 className="small-title">Roles Info</h2>
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" onChange={e => setName(e.target.value)} />
                          </div>
                        </Col>
                        <Col xl="6">
                          <div className="mb-3">
                            <Form.Label>Permissions</Form.Label>
                            {data?.name === 'Super Admin' ? (
                              <Form.Control
                                type="text"
                                defaultValue="
                            Super Admin has access to all website permissions"
                                disabled
                              />
                            ) : (
                              <Select
                                className="input-select__input"
                                options={permissions}
                                name="users"
                                isMulti
                                onChange={handlePermissions}
                              />
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className="mb-5">
                  <Card.Body>
                    <Form>
                      <Row>
                        <Col xl="12" className="d-flex flex-column">
                          <Form.Label>Users</Form.Label>
                          {usersLoading ? "loading..." :
                            <Select
                              className="input-select__input"
                              options={users}
                              name="users"
                              isMulti
                              onInputChange={e => setUserSearch(e)}
                              onChange={handleUsers}
                            />}
                        </Col>
                        <Col xl="2">
                          <div className="vr">
                            <br />
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
                {/* Category Info End */}
                <Row className="d-flex justify-content-end">
                  <Col xl="3">
                    <button type="button" className="btn btn-primary w-100" onClick={onSubmit}>
                      Save
                    </button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </>
    </HasAccess>
  );
};

export default RolesCreate;
