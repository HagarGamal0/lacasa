import React, { useEffect, useState } from "react";
import { Container, Modal, ModalBody, ModalHeader } from "reactstrap";
import Link from "next/link";
import API from "../../helpers/API/API";
import dynamic from "next/dynamic";
import WheelComponent from "./common/wheelComponent";
import { confetti1 } from "../../services/script";
import { toast, ToastContainer } from "react-toastify";
import Lottie from "react-lottie-player";
import SectionBanner from "../layouts/Furniture/components/Sectionbanner";
const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);

const Wheel = () => {
  const [data, setData] = useState([]);
  const [segments, setSegments] = useState([]);
  const [segColors, setSegColors] = useState([]);
  const [winningSegment, setWinningSegment] = useState(false);
  const [coupon, setCoupon] = useState(false);
  const [is_Done, setIs_Done] = useState(
    localStorage.getItem("spin-win") ? true : false
  );
  const [modal, setModal] = useState(
    localStorage.getItem("spin-win") ? true : false
  );
  const [errorModal, seterrorModal] = useState(false);

  const toggle = () => setModal(!modal);
  const toggleError = () => seterrorModal(!errorModal);

  useEffect(() => {
    API.readAll("/wheel_offers").then((res) => {
      setData(res.data);
      const names = [];
      const colors = [];
      var winable = "";
      res.data.map((item) => {
        winable = winable + " " + item.name;
        names.push(item.name);
        colors.push(item.color);
      });
      setWinningSegment(winable);
      setSegments(names);
      setSegColors(colors);
    });
  }, []);

  const onFinished = (winner) => {
    const id = data.filter((item) => item.name === winner)[0].id;
    API.create(`/wheel_offers/${id}/win`).then((res) => {
      if (res.data?.coupon) {
        setCoupon(res.data.coupon.coupon_code);
        setIs_Done(true);
        localStorage.setItem("spin-win", JSON.stringify(res.data));
        toggle();
      } else {
        toggleError();
        localStorage.removeItem("spin-win");
      }
    });
  };

  return (
    <div className="position-relative">
      <CommonLayout removeBreadcrubs={true} title={"Spin To Win"} parent="home">
        {/* <div className="d-flex justify-content-center">
                    <h2>Spin The Wheel</h2>
                </div> */}
        <Container>
          <SectionBanner
            cols={1}
            data_test={[
              { link: "", image: { url: "/assets/images/spinBanner.png" } },
            ]}
          />
          <div className="mt-3 mt-md-5 mb-3 mb-md-3 d-flex justify-content-center">
            {segments.length > 0 && segColors.length > 0 && winningSegment && (
              <WheelComponent
                segments={segments}
                segColors={segColors}
                winningSegment={`${winningSegment}`}
                onFinished={(winner) => onFinished(winner)}
                primaryColor="black"
                primaryColoraround="#ffffffb4"
                contrastColor="white"
                buttonText="Spin"
                isOnlyOnce={is_Done}
                size={290}
                width={600}
                height={600}
                upDuration={1000}
                downDuration={50}
              />
            )}
          </div>
        </Container>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className="modal-md quickview-modal position-relative"
          centered
        >
          <ModalHeader style={{ zIndex: 10 }} toggle={toggle}></ModalHeader>
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "0",
              height: "100vh",
            }}
          >
            <Lottie
              loop
              animationData={confetti1}
              play
              style={{ width: 500, height: "100%" }}
            />
          </div>
          <ModalBody className="modal1">
            <div className="d-flex justify-content-center">
              <div style={{ textAlign: "center" }}>
                <h2>You Won! 🎁</h2>
                <h3
                  style={{
                    fontSize: "16px",
                    marginTop: "20px",
                    marginBottom: "15px",
                  }}
                >
                  REDEEM YOUR COUPON AND ENJOY YOUR PRIZE
                </h3>
                {coupon ? (
                  <h2
                    style={{
                      color: "green",
                      border: "none",
                      background: "#8080803d",
                      padding: "20px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      toast.success("Copied to clipboard");
                      navigator.clipboard.writeText(coupon);
                    }}
                  >
                    {coupon}
                  </h2>
                ) : (
                  <>
                    {modal && (
                      <h2
                        style={{
                          color: "green",
                          border: "none",
                          background: "#8080803d",
                          padding: "20px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          toast.success("Copied to clipboard");
                          navigator.clipboard.writeText(coupon);
                        }}
                      >
                        {
                          JSON.parse(localStorage.getItem("spin-win")).coupon
                            .coupon_code
                        }
                      </h2>
                    )}
                  </>
                )}
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={errorModal}
          toggle={toggleError}
          className="modal-md quickview-modal"
          centered
        >
          <div>
            <ModalBody className="modal1">
              <div className="d-flex justify-content-center">
                <div style={{ textAlign: "center" }}>
                  <h2>Oops! 😞</h2>
                  <h3
                    style={{
                      fontSize: "16px",
                      marginTop: "20px",
                      marginBottom: "15px",
                    }}
                  >
                    You Lost, Have Another Go !!
                  </h3>
                </div>
              </div>
            </ModalBody>
          </div>
        </Modal>
        <ToastContainer
          position="bottom-center"
          closeOnClick
          autoClose={2000}
        />
      </CommonLayout>
    </div>
  );
};
export default Wheel;
