import React, { useEffect, useState, Fragment } from "react";
import { Container, Row, Col, Card, Modal, ModalBody } from "reactstrap";
import API from "../../../../helpers/API/API";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { CircularProgress, Typography } from "@mui/material";
import PostLoader from "../../../../components/common/PostLoader";
const CommonLayout = dynamic(() =>
  import("../../../../components/shop/common-layout")
);

const example = {
  "name": "John Doe",
  "job_title": "Software Engineer",
  "bio": "I am a passionate software engineer with experience in building web applications using various technologies.",
  "avatar": "https://esorus.com/uploads/2021/10/13/interior-designer/image/26238.png",
  "cover_photo": "https://esorus.com/images/placeholders/interior-designer-cover-photo.jpg",
  "facebook": "https://www.facebook.com/johndoe",
  "instagram": "https://www.instagram.com/johndoe",
  "twitter": "https://twitter.com/johndoe",
  "projects": [
    {
      "id": 1,
      "title": "E-commerce Website",
      "description": "Built a fully functional e-commerce website using React.js and Node.js.",
      "designer_name": "designer name",
      "gallery": [
        {
          "url": "https://esorus.com/uploads/2021/11/09/interior-designer-project/image/al-sagheer-salon-28029.jpeg",
        },
        {
          "url": "https://esorus.com/uploads/2021/11/09/interior-designer-project/image/al-sagheer-salon-28029.jpeg",
        }
      ]
    },
    {
      "id": 2,
      "title": "Blog Platform",
      "description": "Developed a blog platform with features such as user authentication and CRUD operations.",
      "designer_name": "designer name",
      "gallery": [
        {
          "url": "https://esorus.com/uploads/2021/11/09/interior-designer-project/image/cleopatra-hospitals-head-office-28030.jpeg",
        },
        {
          "url": "https://esorus.com/uploads/2021/11/09/interior-designer-project/image/cleopatra-hospitals-head-office-28030.jpeg",
        }
      ]
    }
  ]
}


const Professional = () => {
  const router = useRouter();
  const id = router.query._id;
  console.log("id", id);
  const [data, setData] = useState('');
  const [isProject, setIsProjects] = useState(true);
  const [project, setProject] = useState({});
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  useEffect(() => {
    API.readAll(`/designers/${id}`).then((res) => {
      if (res.data) {
        setData(res?.data);
      } else {
        setData(example)
      }
    });
  }, [id]);

  useEffect(() => {
    if (modal)
      document.getElementsByTagName("body")[0].style.overflow = "hidden";
    else document.getElementsByTagName("body")[0].style.overflow = "auto";
  }, [modal]);

  return (
    <Fragment>
      {modal ? (
        <div
          onClick={(e) => {
            setModal(false);
          }}
          style={{
            zIndex: "100000",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            overflowY: "auto"
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              style={{
                position: "absolute",
                top: "30px",
                right: "20px",
                zIndex: "9",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                fontWeight: "500",
                background: "rgba(0, 0, 0, 0.7)",
                border: "none",
                fontSize: "20px",
                color: "#fff",
              }}
              onClick={() => setModal(false)}
            >
              X
            </button>

            <div className="p-4 d-flex">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{
                  background: "#fff",
                  width: "96vw",
                  gap: "15px",
                  overflow: "auto",
                  position: "relative",
                  borderRadius: "12px"
                }}
                className="row p-4 shadow"
              >
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    left: 0,
                    padding: "10px",
                  }}
                  className="col-xl-4 col-md-4 col-sm-12 px-2"
                >
                  <h2 style={{ wordWrap: "break-word" }}>{project?.title}</h2>
                  <h5 style={{ wordWrap: "break-word" }}>
                    {project?.description}
                  </h5>
                </div>
                <div
                  style={{
                    position: "relative",
                    height: "90vh",
                    marginRight: "30px",
                  }}
                  className="col-xl-6 col-sm-12 px-2"
                >
                  {project?.gallery?.map((image) => (
                    <div>
                      <div style={{ marginBottom: "30px" }}>
                        <img
                          style={{ borderRadius: "7px" }}
                          height="100%"
                          width="99.5%"
                          src={image.url}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {data ? (
        <div
          style={{ overflow: modal ? "hidden" : "scroll" }}
          className="details-professional"
        >
          <CommonLayout removeBreadcrubs={true} title={data.name}>
            <div
              className="coverBackground"
              style={{
                backgroundImage: `url('${data?.cover_photo ? data?.cover_photo : "/assets/images/about/vendor.jpg"}')`,
                position: "relative",
                height: "25vw",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <div style={{ height: "192px", position: "relative" }}>
                <div
                  style={{
                    borderRadius: "50%",
                    background: "#b1b1b1",
                    boxShadow: "0px 0px 16px 0px rgba(0,0,0,.2)",
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "192px",
                    width: "192px",
                    top:"50%"
                  }}
                  className="shadow overflow-hidden"
                >
                  <img
                    style={{
                      borderRadius: "50%",
                      width: "100%",
                      height: "100%",
                    }}
                    className="shadow"
                    src={data?.avatar ? data.avatar : "/assets/images/male.jpg"}
                  />
                </div>
              </div>
            </div>
            <Container>
              <div
                style={{ marginTop: "70px" }}
                className="info d-md-flex justify-content-center"
              >
                <div className="p-3 mt-md-5">
                  <h1
                    style={{ textAlign: "center", textTransform: "capitalize" }}
                  >
                    {data.name}
                  </h1>
                  <h2
                    style={{
                      fontSize: "16px",
                      textAlign: "center",
                      textTransform: "capitalize",
                    }}
                  >
                    {data.job_title}
                  </h2>

                  <div>
                    <div
                      style={{
                        height: "60px",
                        width: "100vw",
                        borderBottom: "1px  solid black",
                      }}
                    >
                      <Container
                        style={{
                          height: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "25px",
                            alignSelf: "stretch",
                          }}
                        >
                          <span
                            onClick={() => setIsProjects(true)}
                            style={{
                              height: "100%",
                              fontWeight: "600",
                              color: isProject && "#d7b002",
                              cursor: "pointer",
                              borderBottom: isProject && "4px solid #d7b002",
                            }}
                          >
                            Projects
                          </span>
                          <span
                            onClick={() => setIsProjects(false)}
                            style={{
                              height: "100%",
                              fontWeight: "600",
                              cursor: "pointer",
                              color: !isProject && "#d7b002",
                              borderBottom: !isProject && "4px solid #d7b002",
                            }}
                          >
                            About
                          </span>
                        </div>
                        <a
                          style={{ width: "200px" }}
                          className={`btn btn-solid `}
                          onClick={() => {
                            router.push({
                              pathname: `/professionals/profile/${id}/request-service`,
                            });
                          }}
                        >
                          Request a service
                        </a>
                      </Container>
                    </div>
                  </div>

                  <div>
                    {!isProject ? (
                      <Container
                        style={{
                          // background: "red",
                          width: "100vw",
                          display: "flex",
                          gap: "40px",
                          marginTop: "40px",
                        }}
                      >
                        <div
                          style={{
                            width: "300px",
                            borderRadius: "7px",
                            border: "1px solid black",
                          }}
                        >
                          <div
                            style={{
                              padding: "20px 15px",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <h2
                              style={{ fontSize: " 18px", fontWeight: "600" }}
                            >
                              Brand
                            </h2>
                            { data.categories.length > 0 &&
                            <div>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" class="convert-svg replaced-svg mr-2"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="128" x2="224" y2="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><path d="M195.88225,60.11775a95.90539,95.90539,0,1,0,18.76606,26.49271" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><path d="M161.94113,94.05887a47.99886,47.99886,0,1,0,13.98107,31.20092" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path></svg>                                 <Typography variant="subtitle">
                                {/* {
                                data.categories.slice(0, 2).map((item) => {
                                  return item
                                })
                                } */}
                                {
                                data.categories.map((item,x)=>{
                                  if (x<2) 
                                  return `${item.name} ${(x!=data.categories.length-1) ? ' , ' : ''}`
                                })
                                }
                              </Typography>
                            </div>
                            }
                            {data.job_title &&
                            <div>
                              <svg  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" class="convert-svg replaced-svg mr-2"><rect width="256" height="256" fill="none"></rect><rect x="32.00781" y="72.00005" width="192" height="144" rx="8" stroke-width="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"></rect><path d="M168,72V56a16,16,0,0,0-16-16H104A16,16,0,0,0,88,56V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><path d="M224.00806,126.30915A191.11647,191.11647,0,0,1,128,152a191.11667,191.11667,0,0,1-95.99345-25.68239" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path><line x1="116" y1="120" x2="140" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
                              <Typography variant="subtitle">
                                {data.job_title}
                              </Typography>
                            </div>
                            }

                            { data.address &&
                            <div>
                              <i class="fa fa-map-marker" aria-hidden="true"></i>
                              <Typography variant="subtitle">
                                {data.address}
                              </Typography>
                            </div>
                            }
                          </div>
                          
                          <div
                            style={{
                              padding: "20px 15px",
                              borderBottom: "1px solid black",
                            }}
                          >
                            <h2
                              style={{ fontSize: " 18px", fontWeight: "600" }}
                            >
                              Business Account
                            </h2>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                              class="convert-svg replaced-svg mr-2"
                            >
                              <rect width="256" height="256" fill="none"></rect>
                              <polyline
                                points="224 56 128 144 32 56"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                              ></polyline>
                              <path
                                d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                              ></path>
                              <line
                                x1="110.54541"
                                y1="128.00013"
                                x2="34.4668"
                                y2="197.73926"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                              ></line>
                              <line
                                x1="221.53418"
                                y1="197.73926"
                                x2="145.45424"
                                y2="127.99964"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="16"
                              ></line>
                            </svg>
                            <Typography variant="subtitle">
                              {data.email}
                            </Typography>
                          </div>
                          <div
                            style={{ padding: "15px" }}
                            className="social mt-md-1"
                          >
                            <h2
                              style={{ fontSize: " 18px", fontWeight: "600" }}
                            >
                              Social Media Links
                            </h2>
                            <div style={{ marginTop: "20px" }}>
                              <ul className="">
                                {data.facebook ? (
                                  <li className="mr-3">
                                    <a href={data.facebook} target="_blank">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 218.078 218.078"
                                        class="convert-svg replaced-svg"
                                      >
                                        <g
                                          id="facebook-logo_logotyp.us"
                                          data-name="facebook-logo@logotyp.us"
                                          transform="translate(-150 -70)"
                                        >
                                          <path
                                            id="Path_7876"
                                            data-name="Path 7876"
                                            d="M368.078,179.039A109.039,109.039,0,1,0,242,286.76V210.566H214.31V179.039H242V155.011c0-27.325,16.284-42.429,41.187-42.429a167.633,167.633,0,0,1,24.412,2.131v26.835H293.847c-13.539,0-17.772,8.4-17.772,17.036v20.455h30.238l-4.83,31.527H276.074v76.194a109.055,109.055,0,0,0,92-107.721Z"
                                            fill="#1977f3"
                                            fill-rule="evenodd"
                                          ></path>
                                          <path
                                            id="Path_7877"
                                            data-name="Path 7877"
                                            d="M313.874,218.769l4.83-31.527H288.467V166.788c0-8.618,4.217-17.036,17.772-17.036h13.755V122.917a167.618,167.618,0,0,0-24.412-2.131c-24.9,0-41.187,15.089-41.187,42.429v24.028H226.7V218.77H254.4v76.194a109.61,109.61,0,0,0,17.036,1.318,111.489,111.489,0,0,0,17.036-1.318V218.77h25.408Z"
                                            transform="translate(-12.391 -8.204)"
                                            fill="#fefefe"
                                            fill-rule="evenodd"
                                          ></path>
                                        </g>
                                      </svg>
                                    </a>
                                  </li>
                                ) : null}
                                {data.instagram ? (
                                  <li className="mr-3">
                                    <a href={data.instagram} target="_blank">
                                      <svg
                                        width="35px"
                                        height="35px"
                                        viewBox="0 0 32 32"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="2"
                                          y="2"
                                          width="28"
                                          height="28"
                                          rx="6"
                                          fill="url(#paint0_radial_87_7153)"
                                        />
                                        <rect
                                          x="2"
                                          y="2"
                                          width="28"
                                          height="28"
                                          rx="6"
                                          fill="url(#paint1_radial_87_7153)"
                                        />
                                        <rect
                                          x="2"
                                          y="2"
                                          width="28"
                                          height="28"
                                          rx="6"
                                          fill="url(#paint2_radial_87_7153)"
                                        />
                                        <path
                                          d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z"
                                          fill="white"
                                        />
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z"
                                          fill="white"
                                        />
                                        <path
                                          fill-rule="evenodd"
                                          clip-rule="evenodd"
                                          d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z"
                                          fill="white"
                                        />
                                        <defs>
                                          <radialGradient
                                            id="paint0_radial_87_7153"
                                            cx="0"
                                            cy="0"
                                            r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)"
                                          >
                                            <stop stop-color="#B13589" />
                                            <stop
                                              offset="0.79309"
                                              stop-color="#C62F94"
                                            />
                                            <stop
                                              offset="1"
                                              stop-color="#8A3AC8"
                                            />
                                          </radialGradient>
                                          <radialGradient
                                            id="paint1_radial_87_7153"
                                            cx="0"
                                            cy="0"
                                            r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)"
                                          >
                                            <stop stop-color="#E0E8B7" />
                                            <stop
                                              offset="0.444662"
                                              stop-color="#FB8A2E"
                                            />
                                            <stop
                                              offset="0.71474"
                                              stop-color="#E2425C"
                                            />
                                            <stop
                                              offset="1"
                                              stop-color="#E2425C"
                                              stop-opacity="0"
                                            />
                                          </radialGradient>
                                          <radialGradient
                                            id="paint2_radial_87_7153"
                                            cx="0"
                                            cy="0"
                                            r="1"
                                            gradientUnits="userSpaceOnUse"
                                            gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)"
                                          >
                                            <stop
                                              offset="0.156701"
                                              stop-color="#406ADC"
                                            />
                                            <stop
                                              offset="0.467799"
                                              stop-color="#6A45BE"
                                            />
                                            <stop
                                              offset="1"
                                              stop-color="#6A45BE"
                                              stop-opacity="0"
                                            />
                                          </radialGradient>
                                        </defs>
                                      </svg>
                                    </a>
                                  </li>
                                ) : null}
                                {data.twitter ? (
                                  <li className="mr-3">
                                    <a href={data.twitter} target="_blank">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 199.743 199.744"
                                        class="convert-svg replaced-svg"
                                      >
                                        <g
                                          id="linkedin-logo_logotyp.us"
                                          data-name="linkedin-logo@logotyp.us"
                                          transform="translate(-368.677 -154.998)"
                                        >
                                          <path
                                            id="Path_7881"
                                            data-name="Path 7881"
                                            d="M385.127,354.738H551.966a16.453,16.453,0,0,0,16.45-16.45V171.449A16.453,16.453,0,0,0,551.966,155H385.127a16.453,16.453,0,0,0-16.45,16.45V338.288a16.453,16.453,0,0,0,16.45,16.45"
                                            transform="translate(0)"
                                            fill="none"
                                            fill-rule="evenodd"
                                          ></path>
                                          <path
                                            id="Path_7882"
                                            data-name="Path 7882"
                                            d="M385.127,354.742H551.97a16.453,16.453,0,0,0,16.45-16.45V171.449A16.453,16.453,0,0,0,551.97,155H385.127a16.453,16.453,0,0,0-16.45,16.45V338.292A16.453,16.453,0,0,0,385.127,354.742Zm59.922-123.369h27.906v14.046c3.742-7.5,14.639-15.515,29.051-15.515,27.622,0,37.041,12.484,37.041,42.134v53.331H509.674V278.277c0-15.6-3.049-24.14-14.439-24.14-15.4,0-20.809,11.7-20.809,24.14v47.092H445.053v-94Zm-47,94h29.373v-94H398.052Zm32.6-126.307a17.919,17.919,0,1,1-17.919-17.919A17.922,17.922,0,0,1,430.657,199.062Z"
                                            transform="translate(0)"
                                            fill="#0073b0"
                                            fill-rule="evenodd"
                                          ></path>
                                        </g>
                                      </svg>
                                    </a>
                                  </li>
                                ) : null}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h2 style={{ marginBottom: "30px" }}>About</h2>
                          <p>{data.bio}</p>
                        </div>
                      </Container>
                    ) : data?.projects?.length > 0 ? (
                      <Container className=" p-3 projects">
                        <div className="row mx-0" >
                          {data || data.projects || data.projects.length ? (
                            data.projects.map((item) => {
                              return (
                                <div className="col-xl-3 col-md-4 col-sm-6 px-2">
                                  <div className="card-container" onClick={() => { toggle(); console.log(item); setProject(item); }}>
                                    <img
                                      alt="Sample"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                      }}
                                      src={item.gallery.length > 0 ? item.gallery[0].url : "/assets/images/male.jpg"}
                                    />
                                    <div className="overlay">
                                      <div className="overlay-content">
                                        <h3 className="overlay-title">{data.name}</h3>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center w-100">
                                    <img
                                      src={data.avatar}
                                      alt={item.designer_name}
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                        borderRadius: "50%",
                                        marginRight: "8px",
                                      }}
                                    />
                                    <h3
                                      style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        color: "#1c1c1c",
                                        margin: "10px 0",
                                      }}
                                    >
                                      {data.name}
                                    </h3>
                                  </div>
                                </div>

                              );
                            })
                          ) : (
                            <div
                              style={{
                                height: "300px",
                                width: "280px",
                                overflow: "hidden",
                              }}
                            >
                              <div className="col-xl-12 col-lg-12 col-12">
                                <PostLoader />
                              </div>
                            </div>
                          )}
                        </div>
                      </Container>
                    ) : (
                      <h1
                        style={{
                          height: "300px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >{`there are no projects for ${data.name}`}</h1>
                    )}
                  </div>
                </div>
              </div>
            </Container>
          </CommonLayout>
        </div>
      ) : (
        <div
          style={{
            height: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </Fragment>
  );
};
export default Professional;
