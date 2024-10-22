import React, { useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { toast } from "react-toastify";
import HtmlHead from "components/html-head/HtmlHead";
import { Col, NavLink, Row } from "react-bootstrap";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import api from "../../API/API";

const request = () => {
  const [loading, setloading] = useState(true);
  const [requests, setRequests] = useState([]);

  const colors = {
    Pending: " #ffbd02",
    Contacted: " lightgreen",
    Closed: " rgb(255, 71, 71)",
  };

  useEffect(() => {
    try {
      setloading(true);
      api.readAll(`/designers/list/requests`).then((res) => {
        console.log("res", res);
        if (res.message) {
          toast.error(res.message, {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        setRequests(res.data);
      });
    } catch (error) {
      console.log(error.message);
      toast.success(error.message, {
        position: "top-right",

        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setTimeout(() => {
        setloading(false);
      }, 500);
    }
  }, []);

  const ObjStatus = {
    1: "Pending",
    2: "Contacted",
    3: "Closed",
  };
  const update = (id, status) => {
    setloading(true);

    api
      .create(`/designers/request/status/${id}`, { status })
      .then((res) => {
        console.log(res);
        // setProjects([project, ...projects]);
        setloading(false);
        const reqs = requests.map((req) => {
          if (req.id === id) {
            return { ...req, status: ObjStatus[status], status_id: status };
          }
          return req;
        });
        setRequests(reqs);
      })
      .catch((err) => {
        // toast.error(err.message);
        setloading(false);
      });
  };

  return (
    <>
      <HtmlHead title="Requests" description="Requests Page" />
        <div className="page-title-container">
            <Col className="col-auto mb-3 mb-sm-0 me-auto">
              <NavLink
                className="muted-link pb-1 d-inline-block hidden breadcrumb-back px-0"
                to="/" >
                <CsLineIcons icon="chevron-left" size="13" />
                <span className="align-middle text-small ms-1">Home</span>
              </NavLink>
              <h1 className="mb-0 pb-0 display-4" id="title">
                Requests
              </h1>
            </Col>
            {/* Title End */}
        </div>

      <div style={{ width: "95%", margin: "auto" }}>
        <div style={{ width: "100%", display: "flex" }}>
          <h4 style={{ width: "20%", textAlign: "center", color: "black" }}>
            Professional
          </h4>
          <h4 style={{ width: "20%", textAlign: "center", color: "black" }}>
            Name
          </h4>
          <h4 style={{ width: "20%", textAlign: "center", color: "black" }}>
            Desired Service
          </h4>
          <h4 style={{ width: "20%", textAlign: "center", color: "black" }}>
            Project Sector
          </h4>
          <h4 style={{ width: "20%", textAlign: "center", color: "black" }}>
            Status
          </h4>
        </div>
        <div style={{ width: "100%", overflowY: "auto" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              width: "100%",
              padding: "15px",
            }}
          >
            {loading && (
              <div
                style={{
                  background: "transparent",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  height: "100vh",
                  width: "100vw",
                  zIndex: "100",
                }}
                className="d-flex justify-content-center align-items-center h-100"
              >
                <Bars
                  height="80"
                  width="80"
                  color="black"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            )}
          </div>
          {requests?.map((Request) => (
            <div
              key={Request.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "white",
                padding: "15px 15px 0px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                margin: "10px 0",
                cursor: "pointer",
                position: "relative",
                justifyContent: "space-evenly",
              }}
            >
              <div
                style={{
                  width: "75%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  //   toggle();
                  //   setId(request.id);
                }}
              >
                <p style={{ width: "20%" }}>{Request.designer}</p>
                <p style={{ width: "20%" }}>{Request.name}</p>
                <p style={{ width: "20%" }}>{Request.desired_service}</p>
                <p style={{ width: "20%" }}>{Request.project_sector}</p>
              </div>

              <select
                disabled={loading}
                onBlur={(e) => {
                  update(Request.id, e.target.value);
                }}
                value={Request.status_id}
                className={`${ObjStatus[Request.status_id]}`}
                style={{
                  cursor: "pointer",
                  borderRadius: "7px",
                  padding: "7px",
                  width: "110px",
                  marginBottom: "10px",
                  background: `${colors[ObjStatus[Request.status_id]]}`,
                }}
              >
                <option value="1">Pending</option>
                <option value="2">Contacted</option>
                <option value="3">Closed</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default request;
