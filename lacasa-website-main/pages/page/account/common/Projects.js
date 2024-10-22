import { CircularProgress, Input, TextField } from "@mui/material";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { useState } from "react";
import {
  Label,
  Media,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import addButton from "../../../../public/assets/images/svgImg/addButton.svg";
import imageCompression from "browser-image-compression";
import API from "../../../../helpers/API/API";
import { toast, ToastContainer } from "react-toastify";
const Projects = () => {
  const [modal, setModal] = useState(false);
  const [project, setProject] = useState({
    title: "",
    description: "",
    gallery: [],
    id: "",
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const ref = useRef(null);
  const handleInputChange = (e) => {
    let name = e.target.name;
    setProject({ ...project, [name]: e.target.value });
  };

  const usr = JSON.parse(localStorage.getItem("user"));
  console.log(usr);
  const handleSelectBlob = () => {
    let files = null;
    if (project.gallery.length) {
      files = project.gallery.map(
        (image) =>
          new File([image], `${project.gallery.length} file(s)`, {
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

  const toggle = () => {
    setModal(!modal);
  };
  const handleDelete = (id) => {
    setLoading(true);
    API.delete("/designers/projects", id)
      .then((res) => {
        setLoading(false);
        let f_projects = projects.filter((project) => project.id !== id);
        setProjects(f_projects);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (modal) {
      handleSelectBlob();
    }
  }, [project.gallery.length, modal]);

  const handleInputImage = async (e) => {
    const imageFiles = Object.values(e.target.files);
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
        if (index === imageFiles.length - 1) {
          const maps = compressedFiles.map((compressedFile) => ({
            url: compressedFile,
          }));
          setProject({
            ...project,
            gallery: [...project.gallery, ...maps],
          });
        }
      });
    } catch (errorss) {
      console.log(errorss);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("description", project.description);

    if (!project.designer_id) {
      project.gallery.forEach((image, index) => {
        formData.append(`images[${index}]`, image.url);
      });
      API.create("/designers/projects", formData)
        .then((res) => {
          toggle();
          setLoading(false);
          setProjects([res.data, ...projects]);
          toast.success("Project created Successfully");
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false);
        });
    } else {
      let images = project.gallery.filter((image) => image.url instanceof Blob);
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image.url);
      });
      formData.append("_method", "PATCH");
      API.update(`/designers/projects/${project.id}`, formData)
        .then((res) => {
          setLoading(false);
          if (!res) {
            toast.error("Data is invalid");
            return;
          }
          toggle();
          toast.success("Project updated Successfully");
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false);
        });
    }
  };
  const removeImage = (e, image) => {
    e.stopPropagation();
    let gallery = project.gallery.filter((img) => img !== image);
    setProject({ ...project, gallery });
  };

  useEffect(() => {
    setLoading(true);
    API.readAll(`/designers/projects?find[designer.user_id]=${usr.user.id}`)
      .then((res) => {
        setProjects(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  }, []);

  return (
    <div style={{ width: "65%" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          rowGap: "10px",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        <ToastContainer
          position="bottom-center"
          closeOnClick
          autoClose={4000}
        />
        {loading ? (
          <CircularProgress
            style={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "10px",
              flexWrap: "wrap",
              position: "absolute",
              top: "20px",
              left: "50%",
              zIndex: "10000000",
            }}
          />
        ) : (
          ""
        )}

        {projects?.map((project) => (
          <div
            key={project.id}
            // className=" col-md-4"
            style={{
              padding: "4px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setProject(project);
              setUpdate(true);
              toggle();
            }}
          >
            <div
              className="dashboard d-flex justify-content-center align-items-center"
              style={{ minHeight: "250px" }}
            >
              <div className="projectC" style={{ position: "relative" }}>
                <Media
                  src={
                    project?.gallery[0]?.url instanceof Blob
                      ? URL.createObjectURL(project?.gallery[0]?.url)
                      : project?.gallery[0]?.url
                  }
                  style={{
                    height: "270px",
                    width: "230px",
                    borderRadius: "5px",
                  }}
                  className="blur-up lazyloaded"
                />

                <span
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: " #fff",
                    fontSize: "18px",
                    fontWeight: "500",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {project.title}
                </span>

                <button
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "-10px",
                    // right: "0px",
                    transform: "translateX(-50%)",
                    color: " #fff",
                    fontSize: "18px",
                    right: "-20px",
                    fontWeight: "500",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",

                    background: "black",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  X
                </button>
              </div>
            </div>
          </div>
        ))}

        <div
          style={{ minWidth: "220px" }}
          className="dashboard-right-n col-md-4"
        >
          <div
            className="dashboard d-flex justify-content-center align-items-center"
            style={{ minHeight: "270px" }}
          >
            <div
              className="text-center"
              onClick={() => {
                toggle();
                setUpdate(false);
                setProject({
                  title: "",
                  description: "",
                  gallery: [],
                });
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={addButton} className={"mb-1"} />
              <h5>Add Project</h5>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle} centered size="lg">
        <form
          style={{
            position: "relative",
          }}
          onSubmit={handleSubmit}
        >
          {/* {loading ? (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                translateX: "transform(-50%)",
                zIndex: "100000",
              }}
            />
          ) : (
            ""
          )} */}

          <ModalHeader toggle={toggle}>
            {project.designer_id ? "Update Project" : "Add Project"}
          </ModalHeader>
          <ModalBody className="p-4">
            <div>
              <div>
                <TextField
                  className="w-100 inputBtn"
                  type={"text"}
                  label="Project Name"
                  variant="filled"
                  required
                  name="title"
                  value={project.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-3">
                <Label>Project Images</Label>
                <input
                  style={{
                    padding: "21px 3px",
                    borderRadius: "3px",
                    borderBottom: "1px solid black",
                    background: "rgba(0, 0, 0, 0.06)",
                  }}
                  className="w-100 inputBtn"
                  type="file"
                  ref={ref}
                  label="Images"
                  multiple
                  required
                  onChange={handleInputImage}
                />

                <div className="mt-3" style={{ display: "flex", gap: "7px" }}>
                  {project?.gallery?.map((image) => (
                    <div style={{ position: "relative" }}>
                      <Media
                        src={
                          image.url instanceof Blob
                            ? URL.createObjectURL(image?.url)
                            : image?.url
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
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <Label>Project Description</Label>
                <textarea
                  style={{ fontSize: "18px" }}
                  rows={7}
                  className="w-100 inputBtn p-2"
                  type={"text"}
                  label="Description"
                  variant="filled"
                  required
                  name="description"
                  value={project.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-0">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={() => {
                  toggle();
                }}
                className={"btn p-0 "}
                style={{ textDecoration: "underline" }}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type="submit"
                className={"btn px-4 pt-3 pb-3 ml-2"}
                style={{ border: "0px", background: "black", color: "white" }}
              >
                Save change
              </button>
            </div>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
