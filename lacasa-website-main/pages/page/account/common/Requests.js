import { CircularProgress } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import API from "../../../../helpers/API/API";

const Requests = () => {
  const [requests, setRequests] = useState();
  const [request, setRequest] = useState({});
  const [modal, setModal] = useState(false);
  const booleans = `
  _communication
  _communication
  _communication
  f_10_to_5_am 
  f_5_to_10_am 
  f_10_to_5_pm
  f_5_to_10_pm
  `;
  const [id, setId] = useState();
  const [loading, setloading] = useState(false);
  const [statusLoading, setstatusLoading] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };
  useEffect(() => {
    if (modal) setRequest(requests.find((req) => req.id == id));
  }, [id]);
  let ObjStatus = {
    1: "Pending",
    2: "Contacted",
    3: "Closed",
  };
  const usr = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    setloading(true);
    API.readAll(`/designers/request`)
      .then((res) => {
        setRequests(res?.data);
        setloading(false);
      })
      .catch((err) => {
        // toast.error(err.message);
        setloading(false);
      });
  }, []);

  const update = (id, status) => {
    setstatusLoading(true);

    API.create(`/designers/request/status/${id}`, { status })
      .then((res) => {
        // setProjects([project, ...projects]);
        setstatusLoading(false);
        let reqs = requests.map((req) => {
          if (req.id == id) {
            return { ...req, status: ObjStatus[status], status_id: status };
          } else return req;
        });
        setRequests(reqs);
      })
      .catch((err) => {
        // toast.error(err.message);
        setstatusLoading(false);
      });
  };

  return (
    <div style={{ width: "65%" }}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            style={{
              zIndex: "10000000",
              width: "50px",
            }}
          />
        </div>
      ) : !loading && requests?.length === 0 ? (
        <Col xs="12">
          <div>
            <div className="col-sm-12 empty-cart-cls text-center">
              <Image
                width={"250%"}
                height={"300%"}
                src={`/assets/images/empty-search.jpg`}
                className="img-fluid mb-4 mx-auto"
                alt=""
              />
              <h3>
                <strong>No Requests Found</strong>
              </h3>
            </div>
          </div>
        </Col>
      ) : (
        <div>
          <div style={{ width: "100%", display: "flex" }}>
            <h4 style={{ width: "25%", color: "black" }}>Name</h4>
            <h4 style={{ width: "25%", color: "black" }}>Desired Service</h4>
            <h4 style={{ width: "25%", color: "black" }}>Project Sector</h4>
            <h4 style={{ width: "25%", color: "black" }}>Status</h4>
          </div>
          <div
            style={{ width: "100%", maxHeight: "700px", overflowY: "scroll" }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                width: "100%",
                padding: "15px",
              }}
            ></div>
            {requests?.map((request) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  padding: "15px 15px 0px",
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                  margin: "10px 0",
                  cursor: "pointer",
                  position: "relative",
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
                    toggle();
                    setId(request.id);
                  }}
                >
                  <p style={{ width: "25%" }}>{request.name}</p>
                  <p style={{ width: "25%" }}>{request.desired_service}</p>
                  <p style={{ width: "25%" }}>{request.project_sector}</p>
                </div>

                <select
                  disabled={statusLoading}
                  onChange={(e) => {
                    update(request.id, e.target.value);
                  }}
                  value={request.status_id}
                  className={`${ObjStatus[request.status_id]}`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "7px",
                    padding: "7px",
                    width: "110px",
                    marginBottom: "10px",
                  }}
                >
                  <option value={"1"}>Pending</option>
                  <option value={"2"}>Contacted</option>
                  <option value={"3"}>Closed</option>
                </select>
              </div>
            ))}

            <Modal isOpen={modal} toggle={toggle} centered size="lg">
              <ModalHeader toggle={toggle}>Request Details</ModalHeader>
              <ModalBody className="p-4">
                {Object.keys(request).map((key) => (
                  <div>
                    <span style={{ fontSize: "18px" }}>{key} : </span>
                    {!Array.isArray(request[key]) ? (
                      <span style={{ fontSize: "18px" }}>
                        {booleans.includes(
                          key.split("_")[1] || key.split("_")[0]
                        )
                          ? `${Boolean(request[key])}`
                          : request[key]}
                      </span>
                    ) : key == "project_scope" ? (
                      request[key].map((scope) => (
                        <span style={{ fontSize: "18px" }}>
                          {scope.project},
                        </span>
                      ))
                    ) : (
                      <div>
                        {request[key].map((img) => (
                          <img
                            style={{ marginLeft: "10px" }}
                            height="80px"
                            src={img?.url}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
                </div>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
