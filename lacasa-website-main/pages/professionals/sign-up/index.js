import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Form,
  Label,
  Row,
  Col,
  TabContent,
  TabPane,
} from "reactstrap";
import Select from "react-select";
import API from "../../../helpers/API/API";
import imageCompression from "browser-image-compression";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Stepper from "react-stepper-horizontal";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { emailAnimation } from "../../../services/script";
import Lottie from "react-lottie-player";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { LocationCity } from "@mui/icons-material";
import { useSelector } from "react-redux";

const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);

const Signup = () => {
  const router = useRouter();
  const [data, setData] = useState({});
  const [validateErrors, setValidateErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [cover_photo, setCover_photo] = useState();
  const [pics, setPics] = useState({});
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const [active, setActive] = useState(0);
  const userDetails = useSelector((state) => state.userDetails);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user) router.push("/");
  }, []);

  const buttonStyle = {
    background: "#E0E0E0",
    width: 100,
    padding: 10,
    textAlign: "center",
    cursor: "pointer",
    marginTop: 12,
  };
  const [catsProf, setCatsProf] = useState([]);
  const [loading, setloading] = useState(false);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [companyName, setcompanyName] = useState("");
  const [jTitle, setJTitle] = useState("");
  const handleCity = (e) => {
    setSelectedCity(e.value);
  };
  const handleArea = (e) => {
    setSelectedArea(e.value);
  };

  const handleImage = async (e) => {
    const imageFile = e.target.files[0];
    const name = e.target.name;
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setPics({ ...pics, [name]: compressedFile });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChangecategoryies = (e) => {
    const arr = [];
    for (let i = 0; i < e.length; i++) {
      arr.push(e[i].value);
    }
    setCategories(arr);
  };
  const steps = [
    {
      title: "Getting Started",
      icon: "/assets/images/lock.png",
      href: "onClick",
      onClick: (e) => {
        e.preventDefault();
        if (active < 3) {
          setActive(0);
        }
      },
    },
    {
      title: "Personal Information",
      icon: "/assets/images/card.png",
      href: "onClick",
      onClick: (e) => {
        e.preventDefault();
        if (active < 3) {
          setActive(1);
        }
      },
    },
    {
      title: "Business information",
      icon: "/assets/images/bag.png",
      href: "onClick",
      onClick: (e) => {
        e.preventDefault();
        if (active < 3) {
          setActive(2);
        }
      },
    },
    {
      title: "Verification",
      icon: "/assets/images/true.png",
      href: "onClick",
      onClick: (e) => {
        e.preventDefault();
        if (active < 3) {
          setActive(3);
        }
      },
    },
  ];

  useEffect(() => {
    API.readAll(`/world/cities`)
      .then(async (response) => {
        let ci = response?.data?.map((city) => ({
          label: city.name,
          value: city.id,
        }));
        setCities(ci);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    API.readAll(`/world/cities/${selectedCity}/areas`)
      .then(async (response) => {
        let _areas = response?.data?.map((area) => ({
          label: area.name,
          value: area.id,
        }));
        setAreas(_areas);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedCity]);

  useEffect(() => {
    if (active !== 2) return;
    API.readAll(`/designers/categories`)
      .then(async (response) => {
        const cats = response.data.map((cat) => ({
          label: cat.name,
          value: cat.name,
        }));
        const ccats = [];
        response.data.forEach((cat) => {
          ccats.push(
            cat.childs.map((child) => ({
              label: child.name,
              value: child.name,
            }))
          );
        });
        let fccats = ccats.flat();
        setCatsProf([...cats, ...fccats]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [active]);

  const onSubmit = async (formData) => {
    categories.forEach((cat, index) => {
      formData[`categories.${index}`] = cat;
    });
    formData.area_id = selectedArea;
    formData.address = selectedCity;

    setloading(true);
    if (active === 0) {
      API.create("/validateEmail", formData).then((res) => {
        if (res?.errors) {
          setValidateErrors(res?.errors);
        } else {
          setData({ ...data, ...formData });
          setValidateErrors({});
          setActive(active + 1);
        }
        setloading(false);
        window.scrollTo({ top: 300 });
      });
    } else if (active === 1) {
      if (data.role) {
        setData({ ...data, ...formData });
        setValidateErrors({});
        setActive(active + 1);
        setloading(false);
        window.scrollTo({ top: 300 });
      } else {
        setValidateErrors({ role: "Please select your role" });
        setloading(false);
      }
    } else if (active === 2) {
      const fData = new FormData();
      formData.type = data.type;
      Object.keys(formData).forEach((key) => {
        fData.append(key, formData[key]);
      });
      fData.append("cover_photo", pics["cover_photo"]);
      fData.append("avatar", pics["avatar"]);
      fData.append("company_name", companyName);
      // fData.append("company_name[ar]", companyName);
      fData.append("job_title", jTitle);
      // fData.append("job_title[ar]", jTitle);
      if (pics["tax_id"]) fData.append("tax_id[]", pics["tax_id"]);
      if (pics["designer_identity"])
        fData.append("designer_identity[]", pics["designer_identity"]);
      if (pics["commerical_registeration"])
        fData.append(
          "commerical_registeration[]",
          pics["commerical_registeration"]
        );

      await API.create("/designers", fData).then((res) => {
        setloading(false);
        if (res.code == 422) {
          console.log(res);
          return;
        }

        setActive(active + 1);
      });
    } else {
      setData({ ...data, ...formData });
      setActive(active + 1);
    }
  };

  return (
    <CommonLayout removeBreadcrubs={true} title={"Sign Up"} parent="home">
      <Container style={{ position: "relative" }}>
        {loading ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: "100000",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          ""
        )}
        <div className="mt-4 steps-container">
          <Stepper
            style={{ width: "100px" }}
            steps={steps}
            size={56}
            defaultOpacity={0.5}
            defaultTitleOpacity={0.5}
            activeStep={active}
            completeColor={"#000"}
            activeColor={"#000"}
            lineMarginOffset={0}
          />
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="theme-form">
          <TabContent activeTab={active}>
            {active === 0 && (
              <Row className="pt-5 mt-5 justify-content-center">
                <Col sm={"12"} md={"6"}>
                  <div className="form-group mb-5 d-flex justify-content-center">
                    <h2 style={{ textAlign: "center" }}>
                      Welcome To La Casa, Let's Get Started !
                    </h2>
                  </div>
                  <div className="form-group mb-3">
                    <Label for="email">Email</Label>
                    <input
                      required
                      type="email"
                      {...register("email", {
                        required: "Email field is required*",
                      })}
                      className="form-control"
                      placeholder="Email"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="email"
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
                  </div>
                  <div className="form-group mb-3">
                    <Label for="password">Password</Label>
                    <input
                      required
                      type="password"
                      {...register("password")}
                      className="form-control"
                      placeholder="Password"
                    />
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
                  </div>
                  <div className="form-group">
                    <Label for="password_confirmation">Confirm Password</Label>
                    <input
                      type="password"
                      {...register("password_confirmation", {
                        validate: (val) => {
                          if (watch("password") != val) {
                            return "Your passwords do no match";
                          }
                        },
                      })}
                      className="form-control"
                      placeholder="Confirm Password"
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
                  </div>
                </Col>
              </Row>
            )}
            {active === 1 && (
              <Row className="pt-5 mt-5 justify-content-center">
                <Col sm={"12"} md={"6"}>
                  <div className="form-group mb-5 d-flex justify-content-center">
                    <h2 style={{ textAlign: "center" }}>
                      Tell Us More About Yourself
                    </h2>
                  </div>
                  <div className="form-group mb-3">
                    <Label for="image">Image</Label>
                    <input
                      className="form-control"
                      name="avatar"
                      required
                      type="file"
                      onChange={handleImage}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="avatar"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="image">Cover Photo</Label>
                    <input
                      onChange={handleImage}
                      required
                      type="file"
                      name="cover_photo"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <Label for="image">{"Tax ID(Optional)"}</Label>
                    <input
                      onChange={handleImage}
                      type="file"
                      name="tax_id"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <Label for="image">{"Designer Identity(Optional)"}</Label>
                    <input
                      onChange={handleImage}
                      type="file"
                      name="designer_identity"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <Label for="image">
                      {"Commerical Registeration(Optional)"}
                    </Label>
                    <input
                      onChange={handleImage}
                      type="file"
                      name="commerical_registeration"
                      className="form-control"
                    />
                  </div>

                  {/* <div className="form-group mb-3">
                    <Label for="email">{"Area ID(Optional)"}</Label>
                    <input
                      type="number"
                      {...register("area_id", {})}
                      className="form-control"
                      placeholder="Area ID"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="area_id"
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
                  </div> */}

                  <div className="form-group mb-3">
                    <Label for="email">{"Price Range"}</Label>
                    <input
                      type="number"
                      {...register("price_range", {})}
                      className="form-control"
                      placeholder="Price Range"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="price_range"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="email">Name</Label>
                    <input
                      required
                      type="text"
                      {...register("name", {
                        required: "Name field is required*",
                      })}
                      className="form-control"
                      placeholder="Full Name"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="name"
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
                  </div>
                  <div className="form-group mb-3">
                    <Label for="password">Phone Number</Label>
                    <input
                      maxLength="11"
                      minLength="11"
                      onInput={(e) => {
                        e.target.value = e.target.value.toString().slice(0, 11);
                      }}
                      type="number"
                      {...register("phone", {
                        required: "Phone field is required*",
                        minLength: {
                          value: 11,
                          message: "The phone number must be 11 characters*",
                        },
                        maxLength: {
                          value: 11,
                          message: "The phone number must be 11 characters*",
                        },
                      })}
                      className="form-control form-number"
                      placeholder="ex:01200000000"
                    />
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="email">City</Label>
                    <Select
                      options={cities}
                      name="city"
                      // value={selectedCity}
                      required
                      onChange={handleCity}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="city"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="email">Area</Label>
                    <Select
                      options={areas}
                      name="area_id"
                      required
                      onChange={handleArea}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="area_id"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="password">{"Twitter(Optional)"}</Label>
                    <input
                      type="url"
                      name="twitter"
                      {...register("twitter", {
                        pattern: {
                          value: /^https:\/\/twitter\.com\/.*/,
                          message:
                            "Please enter a valid Twitter URL starting with 'https://twitter.com/'",
                        },
                      })}
                      className="form-control form-number"
                      placeholder="ex:https://twitter.com/ahmed"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="twitter"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="password">{"Facebook(Optional)"}</Label>
                    <input
                      type="url"
                      name="facebook"
                      {...register("facebook", {
                        pattern: {
                          value: /^https:\/\/(fb|facebook)\.com\/.*/,
                          message:
                            "Please enter a valid Facebook URL starting with 'https://facebook.com/'",
                        },
                      })}
                      className="form-control form-number"
                      placeholder="ex:https://facebook.com/ahmed"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="facebook"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="password">{"Insatgram(Optional)"}</Label>
                    <input
                      type="url"
                      name="instagram"
                      {...register("instagram", {
                        pattern: {
                          value: /^https:\/\/instagram\.com\/.*/,
                          message:
                            "Please enter a valid Instagram URL starting with 'https://instagram.com/'",
                        },
                      })}
                      className="form-control form-number"
                      placeholder="ex:https://instagram.com/ahmed"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="instagram"
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
                  </div>

                  <div className="form-group mb-3">
                    <Label for="password">Bio</Label>
                    <textarea
                      rows="4"
                      type="url"
                      name="bio"
                      {...register("bio", {
                        required: "bio field is required*",
                      })}
                      className="form-control form-number"
                      placeholder="Pitch Yourself..."
                    />
                    <ErrorMessage
                      errors={errors}
                      name="bio"
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
                  </div>

                  <div className="form-group">
                    <Label for="password_confirmation">Professional Role</Label>
                    <div for={"roles"}>
                      <button
                        //
                        type="button"
                        className="btn mr-2"
                        value={"Supplier"}
                        onClick={(e) =>
                          setData({
                            ...data,
                            ...{ role: e.target.value },
                            type: 2,
                          })
                        }
                        style={{
                          ...buttonStyle,
                          ...{
                            background:
                              data.role === "Supplier" ? "black" : "#E0E0E0",
                            color: data.role === "Supplier" ? "white" : "black",
                          },
                        }}
                      >
                        Supplier
                      </button>
                      <button
                        //
                        type="button"
                        className="btn mx-2"
                        value={"Designer"}
                        onClick={(e) =>
                          setData({
                            ...data,
                            ...{ role: e.target.value },
                            type: 1,
                          })
                        }
                        style={{
                          ...buttonStyle,
                          ...{
                            background:
                              data.role === "Designer" ? "black" : "#E0E0E0",
                            color: data.role === "Designer" ? "white" : "black",
                          },
                        }}
                      >
                        Designer
                      </button>
                    </div>
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
                  </div>
                </Col>
              </Row>
            )}
            {active === 2 && (
              <Row className="pt-5 mt-5 justify-content-center">
                <Col sm={"12"} md={"6"}>
                  <div className="form-group mb-5 d-flex justify-content-center">
                    <h2 style={{ textAlign: "center" }}>
                      Tell Us More About Your Business
                    </h2>
                  </div>
                  <div className="form-group mb-3">
                    <Label>Company Name</Label>
                    <input
                      onChange={(e) => setcompanyName(e.target.value)}
                      required
                      type="text"
                      className="form-control"
                      placeholder="Company Name"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="company_name"
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
                  </div>
                  <div className="form-group mb-3">
                    <Label for="email">Job Title</Label>
                    <input
                      onChange={(e) => setJTitle(e.target.value)}
                      required
                      type="text"
                      className="form-control"
                      placeholder="Job Title"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="job_title"
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
                  </div>
                  <div className="form-group mb-3">
                    <Label for="email">Categories</Label>
                    <Select
                      options={catsProf}
                      isMulti={true}
                      name="categories"
                      required
                      onChange={handleChangecategoryies}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <Label for="email">{"Website (Optional)"}</Label>
                    <input
                      type="text"
                      {...register("website", {
                        pattern: {
                          value: /^https:\/\/.*\.com\/.*/,
                          message:
                            "Please enter a vali URL starting with 'https://example.com/'",
                        },
                      })}
                      className="form-control"
                      placeholder="Website URL"
                    />

                    <ErrorMessage
                      errors={errors}
                      name="website"
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
                  </div>
                </Col>
              </Row>
            )}
            {active === 3 && (
              <Row className="pt-5 mt-5 justify-content-center">
                <Col sm={"12"} md={"6"}>
                  <div className="form-group mb-2 d-flex justify-content-center">
                    <h2 style={{ textAlign: "center" }}>
                      Check your email for the next step!
                    </h2>
                  </div>
                  <div className="form-group mb-1 d-flex justify-content-center">
                    <h3 style={{ textAlign: "center" }}>
                      The Verification process takes from 0 to 48 hours.
                    </h3>
                  </div>
                  <div className="form-group mb-1 d-flex justify-content-center">
                    <div>
                      <Lottie
                        loop
                        animationData={emailAnimation}
                        play
                        style={{ width: 300, height: "100%" }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            <div className="mb-5 d-flex justify-content-center">
              {Object.values(validateErrors)
                .slice(0, 1)
                .map((item) => {
                  return (
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "5px",
                          color: "red",
                        }}
                      >
                        {item}
                      </p>
                      <br />
                    </div>
                  );
                })}
            </div>
          </TabContent>
          {active < 3 && (
            <div className="mb-5 d-flex justify-content-center">
              {active > 0 && (
                <button
                  type="button"
                  className="btn mx-2"
                  onClick={() => setActive(active - 1)}
                  style={{
                    ...buttonStyle,
                    ...{ color: "white", background: "black" },
                  }}
                >
                  {" "}
                  Back
                </button>
              )}
              <button type="submit" className="btn mx-2 " style={buttonStyle}>
                Next
              </button>
            </div>
          )}
        </Form>
      </Container>
    </CommonLayout>
  );
};
export default Signup;
