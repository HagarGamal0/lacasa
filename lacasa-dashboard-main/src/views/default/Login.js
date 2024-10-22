import { usePermify } from "@permify/react-role";
import HtmlHead from "components/html-head/HtmlHead";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { useFormik } from "formik";
import LayoutFullpage from "layout/LayoutFullpage";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import * as Yup from "yup";
import api from "../../API/API";
import logo from "../../assets/logo/lacasa-logo.png";

const Login = () => {
  const { setUser } = usePermify();
  const title = "Login";
  const description = "Login Page";
  const [error, setError] = useState();
  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .min(6, "Must be at least 6 chars!")
      .required("Password is required"),
  });
  const initialValues = { email: "", password: "" };
  const onSubmit = (values) => {
    api
      .create("/authenticate", values)
      .then(async (response) => {
        const rolesArr = [];
        response.data.roles.map((item, index) => rolesArr.push(item.name));
        setUser({
          id: response.data.user.id,
          roles: rolesArr,
          permissions: response.data.user.permissions,
        });

        if (response.code === 200) {
          localStorage.setItem("accessToken", response.data.access_token);
          history.push(`${process.env.PUBLIC_URL}/dashboard`);
        } else {
          setError(response);
        }
      })
      .catch((err) => console.log(err));
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <h1 className="text-white font-weight-bold">LaCasa</h1>
            <h1 className="display-3 text-white">Admin Dashboard</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            La Casa is an e-commerce platform that helps furnish houses for
            customers by choosing the right tools, colors, and furniture to
            decorate and complete their dream homes. Established in 2020 and
            based in Cairo, Egypt.
          </p>
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11">
          <div className="d-flex justify-content-center align-items-center">
            <img src={`${logo}`} alt="logo" style={{ width: "20%" }} />
          </div>
        </div>
        <div className="mb-5">
          <h2 className="mb-0 text-primary font-weight-bold">Welcome,</h2>
          <h2 className="cta-1 text-primary">let's get started!</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Please use your credentials to login.</p>
        </div>
        <div>
          <form
            id="loginForm"
            className="tooltip-end-bottom"
            onSubmit={handleSubmit}
          >
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control
                type="text"
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
              />
              {errors.email && touched.email && (
                <div className="d-block invalid-tooltip">{errors.email}</div>
              )}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={values.password}
                placeholder="Password"
              />
              <NavLink
                className="text-small position-absolute t-3 e-3"
                to="/forgot-password"
              >
                Forgot?
              </NavLink>
              {errors.password && touched.password && (
                <div className="d-block invalid-tooltip">{errors.password}</div>
              )}
            </div>
            <Button size="lg" type="submit">
              Login
            </Button>
            <br />
            {error ? (
              <small style={{ color: "red" }}>{error.message}</small>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default Login;
