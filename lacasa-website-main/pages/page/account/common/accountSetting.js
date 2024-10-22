import { Container, Row, Col, Form, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  updateUserProfile,
  detailsUser,
} from "../../../../helpers/redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const AccountSetting = ({
  user,
  setActive,
  info,
  password,
  setPassword,
  setInfo,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();

  const userUpdate = useSelector((state) => state.userUpdateProfile);
  const { errorUpdate } = userUpdate;

  const onSubmit = async (data) => {
    const status = await dispatch(
      updateUserProfile({ ...{ _method: "PUT" }, ...data })
    );
    await dispatch(detailsUser());
    if (status) {
      setActive("Info");
    }
  };
  return (
    <Col lg="9">
      <div className="dashboard-right">
        <div className="dashboard">
          <div>
            <div className="page-title">
              <h2>Account Setting</h2>
            </div>

            <section className="contact-page register-page section-b-space">
              <Container>
                <Row>
                  <Col sm="12">
                    <Form
                      onSubmit={handleSubmit(onSubmit)}
                      className="theme-form"
                    >
                      {info && (
                        <Row>
                          <Col md="6 mb-3">
                            <Label for="name">Full Name</Label>
                            <input
                              type="text"
                              {...register("name")}
                              className="form-control"
                              defaultValue={user?.data.name}
                            />
                            {/* <ErrorMessage
                                                        errors={errors}
                                                        name="name"
                                                        render={({ message }) => <p style={{ fontSize: "12px", marginTop: "5px", color: 'red' }}>{message}</p>}
                                                    /> */}
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="password">Phone Number</Label>
                            <input
                              maxLength="11"
                              minLength="11"
                              onInput={(e) => {
                                e.target.value = e.target.value
                                  .toString()
                                  .slice(0, 11);
                              }}
                              type="number"
                              {...register("phone", {
                                minLength: {
                                  value: 11,
                                  message:
                                    "The phone number must be 11 characters*",
                                },
                                maxLength: {
                                  value: 11,
                                  message:
                                    "The phone number must be 11 characters*",
                                },
                              })}
                              className="form-control"
                              defaultValue={user?.data.phone}
                            />
                            <ErrorMessage
                              errors={errors}
                              name="phone"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <div className="box">
                              <div className="box-content">
                                <h6>
                                  <a
                                    id={"AccountSetting"}
                                    onClick={async (e) => {
                                      await setInfo(false);
                                      await setPassword(true);
                                    }}
                                  >
                                    Change Password
                                  </a>
                                </h6>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
                      {password && (
                        <Row>
                          <Col md="6 mb-3">
                            <Label for="password">New Passwrd</Label>
                            <input
                              type="password"
                              {...register("password", {
                                required: "Password field is required*",
                                minLength: {
                                  value: 8,
                                  message:
                                    "New password must be more than 8 characters*",
                                },
                              })}
                              className="form-control"
                              placeholder="Password"
                            />
                            {errorUpdate?.errors?.password && (
                              <p
                                style={{
                                  fontSize: "12px",
                                  marginTop: "5px",
                                  color: "red",
                                }}
                              >
                                {errorUpdate.errors.password[0]}
                              </p>
                            )}

                            <ErrorMessage
                              errors={errors}
                              name="password"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                          <Col md="6 mb-3">
                            <Label for="password">Password Confirmation</Label>
                            <input
                              type="password"
                              {...register("password_confirmation", {
                                required:
                                  "Password confirmation field is required*",
                                validate: (value) => {
                                  return (
                                    value === watch("password") ||
                                    "The passwords do not match"
                                  );
                                },
                              })}
                              className="form-control"
                              placeholder="Password"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="password_confirmation"
                              render={({ message }) => (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "5px",
                                    color: "red",
                                  }}
                                >
                                  {message}
                                </p>
                              )}
                            />
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col md="12 mb-3 mt-3">
                          <button type="submit" className="btn btn-solid">
                            Save
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </section>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default AccountSetting;
