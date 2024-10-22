import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Input,
  List,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { Box, Container } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CommonLayout from "../../../../components/shop/common-layout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import imageCompression from "browser-image-compression";
import { Label, Media } from "reactstrap";
import API from "../../../../helpers/API/API";
const defReq = {
  projectSector: "",
  projectLocation: "",
  projectScope: "",
  projectArea: "",
  projectDescription: "",
  desiredService: "",
  name: "",
  email: "",
  phone: "",
  drawings: [],
  inspirations: [],
  styleBrandDesc: "",
  communicatoinWays: "",
  timesToReach: "",
};
const RequestService = () => {
  const router = useRouter();
  const { _id } = router.query;
  const [request, setRequest] = useState({
    ...defReq,
  });

  const [errors, seterrors] = useState({
    projectScope: false,
    desiredService: false,
    projectSector: false,
    projectLocation: false,
    projectArea: false,
    projectDescription: false,
  });

  const [conerrors, setconerrors] = useState({
    name: false,
    email: false,
    phone: false,
    communicatoinWays: false,
    timesToReach: false,
  });

  const [expand, setExpand] = useState(1);
  const names = [
    "ٌResidential",
    "Commercial",
    "Corporate",
    "Education",
    "Hospitality",
    "Carlos Abbott",
    "Food & Beverage",
    "Other",
  ];

  const [loading, setloading] = useState(false);
  const ref = useRef(null);
  const secref = useRef(null);
  const handleSelectBlob = (name) => {
    let files = null;
    if (request.drawings.length) {
      files = request.drawings.map(
        (image) =>
          new File([image], `${request.drawings.length} file(s)`, {
            type: "text/plain",
          })
      );
    }

    // Get the file input element by using a ref

    // Create a DataTransfer object and add the File to it
    const dataTransfer = new DataTransfer();
    files?.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // Set the DataTransfer object as the files property of the file input
    setTimeout(() => {
      ref.current.files = dataTransfer.files;
    }, 100);
  };

  const handleSelectBlobIns = (name) => {
    let files = null;
    if (request.inspirations.length) {
      files = request.inspirations.map(
        (image) =>
          new File([image], `${request.inspirations.length} file(s)`, {
            type: "text/plain",
          })
      );
    }

    // Get the file input element by using a ref

    // Create a DataTransfer object and add the File to it
    const dataTransfer = new DataTransfer();
    files?.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // Set the DataTransfer object as the files property of the file input
    setTimeout(() => {
      secref.current.files = dataTransfer.files;
    }, 100);
  };

  useEffect(() => {
    handleSelectBlob();
  }, [request.drawings.length]);
  useEffect(() => {
    handleSelectBlobIns();
  }, [request.inspirations.length]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    if (errors[name]) seterrors({ ...errors, [name]: false });
    if (conerrors[name]) setconerrors({ ...conerrors, [name]: false });
    if (e.target.type == "checkbox") {
      if (!request[name].includes(e.target.value)) {
        setRequest({
          ...request,
          [name]: request[name] + e.target.value + ",",
        });
      } else {
        let tempVal = request[name].replace(`${e.target.value},`, "");
        setRequest({ ...request, [name]: tempVal });
      }
    } else setRequest({ ...request, [name]: e.target.value });
  };

  const handleInputImage = (e) => {
    const imageFiles = Object.values(e.target.files);
    const name = e.target.name;
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFiles = [];
    try {
      imageFiles.forEach(async (imageFile, index) => {
        const compressedFile = await imageCompression(imageFile, options);
        compressedFiles.push(compressedFile);
        const val = request[name];
        if (index === imageFiles.length - 1)
          setRequest({ ...request, [name]: [...val, ...compressedFiles] });
      });
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handleContinue = (e, stage) => {
    e.preventDefault();
    let errs = {};
    Object.keys(errors).forEach((error, index) => {
      if (!request[error]) {
        errs = { ...errs, [error]: true };
      }
    });

    seterrors({ ...errors, ...errs });
    setExpand(1);

    if (!Object.keys(errs).length) {
      setExpand(stage);
      return 1;
    } else {
      return 0;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!handleContinue(e, 3)) {
      setExpand(1);

      return;
    }

    let errs = {};
    Object.keys(conerrors).forEach((error, index) => {
      if (!request[error]) {
        errs = { ...errs, [error]: true };
      }
    });
    setconerrors({ ...conerrors, ...errs });
    Object.keys(errors).forEach((perror) => {
      if (errors[perror]) {
        setExpand(1);
      }
    });
    if (!Object.keys(errs).length) {
      const formData = new FormData();
      formData.append("designer_id", _id);
      formData.append("project_sector", request.projectSector);
      formData.append("project_location", request.projectLocation);
      formData.append("project_scope", request.projectScope);
      formData.append("project_descreption", request.projectDescription);
      formData.append("project_area", request.projectArea);
      formData.append("desired_service", Number(request.desiredService));
      request.drawings.forEach((image, index) => {
        formData.append(`drawings[${index}]`, image);
      });
      request.inspirations.forEach((image, index) => {
        formData.append(`inspirations[${index}]`, image);
      });
      formData.append("style_descreption", request.styleBrandDesc);
      formData.append("name", request.name);
      formData.append("email", request.email);
      formData.append("phone", request.phone);
      formData.append(
        "phone_communication",
        Number(request.communicatoinWays.includes("Phone"))
      );
      formData.append(
        "email_communication",
        Number(request.communicatoinWays.includes("Email"))
      );
      formData.append(
        "whatsapp_communication",
        Number(request.communicatoinWays.includes("Whats"))
      );

      formData.append(
        "f_10_to_5_am",
        Number(request.timesToReach.includes("Weekdays from 10 to 5"))
      );

      formData.append(
        "f_5_to_10_am",
        Number(request.timesToReach.includes("Weekdays from 10 to 5"))
      );

      formData.append(
        "f_10_to_5_pm",
        Number(request.timesToReach.includes("Weekends from 10 to 5"))
      );

      formData.append(
        "f_5_to_10_pm",
        Number(request.timesToReach.includes("Weekends from 5 to 10,"))
      );

      setloading(true);
      API.create("/designers/request/add", formData)
        .then((res) => {
          setloading(false);
          if (res.code === 401) {
            router.push("/page/account/login");
            return;
          }

          if (res.message) {
            toast.error(res.message);

            return;
          }

          toast.success("Request created Successfully");
          router.push(`/professionals/profile/${_id}/request-success`);
          setRequest(defReq);
        })
        .catch((err) => {
          setloading(false);
          // toast.error(err.message);
        });
    }
  };

  const removeImage = (e, image) => {
    e.stopPropagation();
    let name = e.target.name;
    let images = request[name].filter((img) => img !== image);
    setRequest({ ...request, [name]: images });
  };

  return (
    <CommonLayout removeBreadcrubs={true} title={"Request Service"}>
      <Container>
        <Box sx={{ width: { xs: "100%", md: "95%" } }}>
          <h3 style={{ margin: "15px", color: "#ff9b00" }}>
            Note:- Must login before request a service
          </h3>
          <Accordion sx={{ mb: 3 }} expanded={expand == 1}>
            <AccordionSummary
              onClick={() => {
                if (expand != 1) setExpand(1);
                else setExpand(0);
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Project Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                dense
                sx={{
                  height: "auto",
                  overflow: "auto",
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <form style={{ width: "90%", margin: "auto" }}>
                  {errors.projectSector ? (
                    <span style={{ color: "red" }}>
                      Please fill the field below
                    </span>
                  ) : (
                    ""
                  )}
                  <Label
                    style={{ fontSize: "18px", display: "block" }}
                    for="projectSector"
                  >
                    Project Sector
                  </Label>
                  <Select
                    sx={{ width: "100%" }}
                    displayEmpty
                    id="projectSector"
                    name="projectSector"
                    required
                    value={request.projectSector}
                    onChange={handleInputChange}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      <em>Select sector</em>
                    </MenuItem>
                    {names.map((name, index) => (
                      <MenuItem key={name} value={index + 1}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>

                  <div className="form-group mt-5">
                    {errors.projectLocation ? (
                      <span style={{ color: "red" }}>
                        Please fill the field below
                      </span>
                    ) : (
                      ""
                    )}

                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      for="projectLocation"
                    >
                      Project location
                    </Label>
                    <input
                      required
                      type="text"
                      id="projectLocation"
                      name="projectLocation"
                      className="form-control"
                      placeholder="Project Location"
                      onChange={handleInputChange}
                      value={request.projectLocation}
                    />
                  </div>

                  <div className="form-group mt-5">
                    {errors.projectScope ? (
                      <span style={{ color: "red" }}>
                        Please fill the field below
                      </span>
                    ) : (
                      ""
                    )}
                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      name="projectScope"
                      for="projectScope"
                    >
                      Project Scope
                    </Label>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={1}
                        />
                      }
                      label="Architecture"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={2}
                        />
                      }
                      label="Interior Design"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={3}
                        />
                      }
                      label="Furniture Selection"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={4}
                        />
                      }
                      label="LandScape"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={5}
                        />
                      }
                      label="Urban Design"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={6}
                        />
                      }
                      label="Product Design"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={7}
                        />
                      }
                      label="Architectural Modifications"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={9}
                        />
                      }
                      label="Interior Finishes"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={10}
                        />
                      }
                      label="Firniture Selection"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="projectScope"
                          onChange={handleInputChange}
                          name="projectScope"
                          value={11}
                        />
                      }
                      label="Styling"
                    />
                  </div>

                  <div className="form-group mt-5">
                    {errors.projectArea ? (
                      <span style={{ color: "red" }}>
                        Please fill the field below
                      </span>
                    ) : (
                      ""
                    )}
                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      for="projectArea"
                    >
                      Project Area (Meter Square)
                    </Label>
                    <input
                      required
                      type="number"
                      id="projectArea"
                      name="projectArea"
                      className="form-control"
                      placeholder="Project Area"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group mt-5">
                    {errors.projectDescription ? (
                      <span style={{ color: "red" }}>
                        Please fill the field below
                      </span>
                    ) : (
                      ""
                    )}
                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      for="projectArea"
                    >
                      Project Description
                    </Label>
                    <input
                      required
                      type="text"
                      id="projectDescription"
                      name="projectDescription"
                      className="form-control"
                      placeholder="Project Description"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group mt-5 ">
                    {errors.desiredService ? (
                      <span style={{ color: "red" }}>
                        Please choose at least one Service
                      </span>
                    ) : (
                      ""
                    )}
                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      name="desiredService"
                      for="desiredService"
                      aria-required
                    >
                      Desired Service
                    </Label>

                    <RadioGroup
                      defaultValue="outlined"
                      name="radio-buttons-group"
                    >
                      <div style={{ display: "flex" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Radio
                            id="Consultancy"
                            value={1}
                            name="desiredService"
                            label="Consultancy (Advice)"
                            variant="soft"
                            onChange={handleInputChange}
                          />
                          <Label
                            htmlFor="Consultancy"
                            style={{ fontSize: "18px" }}
                          >
                            Consultancy (Advice)
                          </Label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Radio
                            id="Contracting"
                            value={2}
                            name="desiredService"
                            label="Contracting (Excecution)"
                            variant="soft"
                            onChange={handleInputChange}
                          />
                          <Label
                            htmlFor="Contracting"
                            style={{ fontSize: "18px" }}
                          >
                            Contracting (Excecution)
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <button
                    onClick={(e) => handleContinue(e, 2)}
                    className="btn btn-solid"
                  >
                    continue
                  </button>
                </form>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "95%", marginTop: "10px" } }}>
          <Accordion sx={{ mb: 3 }} expanded={expand == 2}>
            <AccordionSummary
              onClick={() => {
                if (expand != 2) setExpand(2);
                else setExpand(0);
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Project Images</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                dense
                sx={{
                  height: "auto",
                  overflow: "auto",
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <form style={{ width: "90%", margin: "auto" }}>
                  <Label style={{ fontSize: "18px" }} for="projectSector">
                    Drawings
                  </Label>
                  <input
                    ref={ref}
                    style={{
                      width: "100%",
                      border: "1px solid black",
                      padding: "7px",
                      borderRadius: "7px",
                    }}
                    id="file-upload"
                    type="file"
                    name="drawings"
                    accept="image/*"
                    onChange={handleInputImage}
                    multiple
                    // onChange={handleFileChange}
                  />

                  <div className="mt-3" style={{ display: "flex", gap: "7px" }}>
                    {request.drawings.map((image) => (
                      <div style={{ position: "relative" }}>
                        <Media
                          src={
                            image instanceof Blob
                              ? URL.createObjectURL(image)
                              : image
                          }
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "5px",
                          }}
                          className="blur-up lazyloaded"
                        />
                        <button
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            fontWeight: "bold",
                            zIndex: "1000",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                          type="button"
                          onClick={(e) => removeImage(e, image)}
                          name="drawings"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  <Label
                    style={{ fontSize: "18px" }}
                    className="mt-5"
                    for="projectSector"
                  >
                    Inspirations
                  </Label>
                  <input
                    style={{
                      width: "100%",
                      border: "1px solid black",
                      padding: "7px",
                      borderRadius: "7px",
                    }}
                    id="file-upload"
                    type="file"
                    name="inspirations"
                    accept="image/*"
                    onChange={handleInputImage}
                    multiple
                    ref={secref}
                    // onChange={handleFileChange}
                  />

                  <div className="mt-3" style={{ display: "flex", gap: "7px" }}>
                    {request.inspirations.map((image) => (
                      <div style={{ position: "relative" }}>
                        <Media
                          src={
                            image instanceof Blob
                              ? URL.createObjectURL(image)
                              : image
                          }
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "5px",
                          }}
                          className="blur-up lazyloaded"
                        />
                        <button
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            fontWeight: "bold",
                            zIndex: "1000",
                            width: "20px",
                            height: "20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                          }}
                          type="button"
                          name="inspirations"
                          onClick={(e) => removeImage(e, image)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="form-group mt-5">
                    <Label style={{ fontSize: "18px" }} for="projectLocation">
                      Your Style or Brand
                    </Label>
                    <textarea
                      style={{
                        width: "100%",
                        border: "1px solid black",
                        padding: "7px",
                        borderRadius: "7px",
                      }}
                      placeholder="Tell us more about the style you like or the brand you represent."
                      type="text"
                      id="styleBrandDesc"
                      name="styleBrandDesc"
                      className="form-control"
                      onChange={handleInputChange}
                      // {...register("email", {
                      //   required: "Email field is required*",
                      // })}
                    />
                  </div>
                  <button
                    onClick={(e) => handleContinue(e, 3)}
                    className="btn btn-solid"
                  >
                    continue
                  </button>
                </form>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box sx={{ width: { xs: "100%", md: "95%", margin: "10px 0" } }}>
          <Accordion sx={{ mb: 3 }} expanded={expand == 3}>
            <AccordionSummary
              onClick={() => {
                if (expand != 3) setExpand(3);
                else setExpand(0);
              }}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">Contact Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                dense
                sx={{
                  height: "auto",
                  overflow: "auto",
                  width: "100%",
                  bgcolor: "background.paper",
                  position: "relative",
                }}
              >
                {loading ? (
                  <CircularProgress
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "50px",
                    }}
                  />
                ) : (
                  ""
                )}
                <form
                  onSubmit={handleSubmit}
                  style={{ width: "90%", margin: "auto" }}
                >
                  <div className="form-group ">
                    {conerrors.name ? (
                      <span style={{ color: "red" }}>
                        Please choose at least one communication
                      </span>
                    ) : (
                      ""
                    )}
                    <Label style={{ fontSize: "18px" }} for="name">
                      Name
                    </Label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={request.name}
                      className="form-control"
                      placeholder="Name"
                      onChange={handleInputChange}
                      // {...register("email", {
                      //   required: "Email field is required*",
                      // })}
                    />
                    {/* <ErrorMessage
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
                  /> */}
                  </div>

                  <div className="form-group mt-5">
                    {conerrors.email ? (
                      <span style={{ color: "red" }}>
                        Please choose at least one communication
                      </span>
                    ) : (
                      ""
                    )}
                    <Label style={{ fontSize: "18px" }} for="email">
                      Email
                    </Label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={request.email}
                      className="form-control"
                      placeholder="Email"
                      onChange={handleInputChange}
                      // {...register("email", {
                      //   required: "Email field is required*",
                      // })}
                    />
                    {/* <ErrorMessage
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
                  /> */}
                  </div>

                  <div className="form-group mt-5">
                    {conerrors.phone ? (
                      <span style={{ color: "red" }}>
                        Please choose at least one communication
                      </span>
                    ) : (
                      ""
                    )}
                    <Label style={{ fontSize: "18px" }} for="phone">
                      Phone
                    </Label>
                    <input
                      required
                      type="phone"
                      id="phone"
                      value={request.phone}
                      name="phone"
                      className="form-control"
                      placeholder="Phone"
                      onChange={handleInputChange}
                      // {...register("email", {
                      //   required: "Email field is required*",
                      // })}
                    />
                    {/* <ErrorMessage
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
                  /> */}
                  </div>

                  <div className="form-group mt-5">
                    {conerrors.communicatoinWays ? (
                      <span style={{ color: "red" }}>
                        Please choose at least one communication
                      </span>
                    ) : (
                      ""
                    )}
                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      name="communicatoinWays"
                      for="communicatoinWays"
                    >
                      What is your preferred way of communication?
                    </Label>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="communicatoinWays"
                          onChange={handleInputChange}
                          name="communicatoinWays"
                          value="Phone Calls"
                        />
                      }
                      label="Phone Calls"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="communicatoinWays"
                          onChange={handleInputChange}
                          name="communicatoinWays"
                          value="Emails"
                        />
                      }
                      label="Emails"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="communicatoinWays"
                          onChange={handleInputChange}
                          name="communicatoinWays"
                          value="WhatsApp"
                        />
                      }
                      label="WhatsApp"
                    />
                  </div>

                  <div className="form-group mt-5">
                    {conerrors.timesToReach ? (
                      <span style={{ color: "red" }}>
                        Please choose at least one communication
                      </span>
                    ) : (
                      ""
                    )}
                    <Label
                      style={{ fontSize: "18px", display: "block" }}
                      name="timesToReach"
                      for="timesToReach"
                    >
                      What is the best time to reach you?
                    </Label>
                    <FormControlLabel
                      control={
                        <Checkbox
                          id="timesToReach"
                          onChange={handleInputChange}
                          name="timesToReach"
                          value="Weekdays from 10 to 5"
                        />
                      }
                      label="Weekdays from 10 to 5"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="timesToReach"
                          onChange={handleInputChange}
                          name="timesToReach"
                          value="Weekdays from 5 to 10"
                        />
                      }
                      label="Weekdays from 5 to 10"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="timesToReach"
                          onChange={handleInputChange}
                          name="timesToReach"
                          value="Weekends from 10 to 5"
                        />
                      }
                      label="Weekends from 10 to 5"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          id="timesToReach"
                          onChange={handleInputChange}
                          name="timesToReach"
                          value="Weekends from 5 to 10"
                        />
                      }
                      label="Weekends from 5 to 10"
                    />
                  </div>
                  <ToastContainer
                    position="bottom-center"
                    closeOnClick
                    autoClose={4000}
                  />
                  {!loading ? (
                    <button type="submit" className="btn btn-solid">
                      Finish
                    </button>
                  ) : (
                    <button disabled className="btn btn-solid">
                      Finish
                    </button>
                  )}
                </form>
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </CommonLayout>
  );
};

export default RequestService;
