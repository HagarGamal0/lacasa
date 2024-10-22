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

const RolesDetails = () => {
  const title = 'Roles Detail';
  const description = 'Lacasa Roles Detail Page';
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
    const permArr = [];
    const userArr = [];
    setLoading(true);
    api
      .readAll(`/roles/${id}`)
      .then(async (response) => {
        setData(response.data);
        response.data.permissions.map((item, index) => (
          permArr.push({ value: item.id, label: item.name })
        ))
        response.data.users.map((item, index) => (
          userArr.push({ value: item.id, label: item.name })
        ))
        setSelectedPermissions(permArr);
        setSelectedUsers(userArr);
      })
      .catch((err) => {
        console.log(err);
      });
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
    const detachArr = detachPermissions;
    const attachArr = [...e];

    for (let i = 0; i < selectedPermissions.length; i += 1) {
      for (let j = 0; j < attachArr.length; j += 1) {

        if (selectedPermissions[i].label === attachArr[j].label) {
          break;
        } else if (selectedPermissions[i].label !== attachArr[j].label && j === attachArr.length - 1) {
          detachArr.push(selectedPermissions[i])
        }
      }
    }
    setDetachPermissions(detachArr)
    setSelectedPermissions(attachArr)
  }

  const handleUsers = (e) => {
    const detachArr = detachedUsers;
    const attachArr = [...e];

    for (let i = 0; i < selectedUsers.length; i += 1) {
      for (let j = 0; j < attachArr.length; j += 1) {

        if (selectedUsers[i].label === attachArr[j].label) {
          break;
        } else if (selectedUsers[i].label !== attachArr[j].label && j === attachArr.length - 1) {
          detachArr.push(selectedUsers[i])
        }
      }
    }
    setDetachedUsers(detachArr)
    setSelectedUsers(attachArr)
  }

  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name ?? data.name);

    if (detachPermissions.length > 0) {
      for (let i = 0; i < detachPermissions.length; i += 1) {
        formData.append('detach-permissions[]', detachPermissions[i].value)
      }
    }
    if (selectedPermissions.length > 0) {
      for (let i = 0; i < selectedPermissions.length; i += 1) {
        formData.append('attach-permissions[]', selectedPermissions[i].value)
      }
    }
    if (detachedUsers.length > 0) {
      for (let i = 0; i < detachedUsers.length; i += 1) {
        formData.append('detach-users[]', detachedUsers[i].value)
      }
    }
    if (selectedUsers.length > 0) {
      for (let i = 0; i < selectedUsers.length; i += 1) {
        formData.append('attach-users[]', selectedUsers[i].value)
      }
    }
    formData.append('_method', 'PATCH');

    api
      .create(`/roles/${id}`, formData)
      .then((response) => {
        if (response.errors) {
          setError(response?.errors);
        } else {
          toast.success('Role Saved!', {
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
                            <Form.Control type="text" defaultValue={data?.name} onChange={e => setName(e.target.value)} />
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
                                defaultValue={data?.permissions !== undefined ? data?.permissions.map((item, index) => ({ value: item.id, label: item.name })) : 'Select permissions'}
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
                              defaultValue={data?.users !== undefined ? data?.users.map((item, index) => ({ value: item.id, label: item.name })) : 'Select users'}
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

export default RolesDetails;
