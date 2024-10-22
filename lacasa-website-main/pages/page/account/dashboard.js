import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "reactstrap";
import { signout } from "../../../helpers/redux/actions/userActions";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../../../helpers/redux/actions/userActions";
import { useSwipeable } from "react-swipeable";
import accountOrder from "../../../public/assets/images/svgImg/account-order.svg";
import accountUser from "../../../public/assets/images/svgImg/account-user.svg";
import accountLocation from "../../../public/assets/images/svgImg/account-location.svg";
import accountLogOut from "../../../public/assets/images/svgImg/account-logout.svg";
import accountProfile from "../../../public/assets/images/svgImg/profileIcon.svg";
import rightArrow from "../../../public/assets/images/svgImg/right-arrow.svg";
import project from "../../../public/assets/images/svgImg/project.svg";
import request from "../../../public/assets/images/svgImg/request.svg";
import dynamic from "next/dynamic";
import Slider from "react-slick";
import Projects from "./common/Projects";

import Requests from "./common/Requests";
import { useTranslation } from "react-i18next";

const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);
const Info = dynamic(() => import("./common/infoNew"));
const Address = dynamic(() => import("./common/addressNew"));
const Orders = dynamic(() => import("./common/orders"));
const AccountSetting = dynamic(() => import("./common/accountSetting"));

const account = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  const usr = JSON.parse(localStorage.getItem("user"));
  const toggle = () => setModal(!modal);
  const tab = router.query.active;
  const myRef = useRef();
  const [modal, setModal] = useState(false);
  const [accountInfo, setAccountInfo] = useState(false);
  const [active, setActive] = useState(tab ? tab : "Info");
  const [password, setPassword] = useState(false);
  const [info, setInfo] = useState(true);
  const handlers = useSwipeable({
    onSwipedLeft: () => setAccountInfo(!accountInfo),
  });

  useEffect(() => {
    dispatch(detailsUser());
  }, []);
  useEffect(() => {
    // professionals here
    if (
      usr?.user.type == "Regular" &&
      (tab == "Projects" || tab == "Requests")
    ) {
      router.back();
    }
  }, []);

  const refPassthrough = (el) => {
    handlers.ref(el);
    myRef.current = el;
  };

  const handleActive = (e) => {
    const ac = e.target.id;

    if (usr.user.type === "Regular" && (ac == "Projects" || ac == "Requests")) {
      console.log("active");
      return;
    }
    setActive(e.target.id);
    router.push({
      query: {
        active: e.target.id,
      },
    });
  };

  const logOut = async () => {
    const state = await dispatch(signout());
    if (state) router.push("/") ;
  };

  const { t } = useTranslation();
  return (
    <>
      {accountInfo && (
        <div
          style={{ zIndex: "10" }}
          className="side-close-container"
          onClick={() => setAccountInfo(false)}
        />
      )}
      <CommonLayout removeBreadcrubs={true} parent="home" title="Account">
        <section className="section-b-space">
          <Container>
            <Row>
              {window.innerWidth <= 991 ? (
                <div class="container p-0 scrolled-menu mb-3">
                  <header class="scroll">
                    <nav class="vertical-align-middle">
                      <span
                        className={`nav-item ${
                          active === "Info" && "underline"
                        }`}
                        id={"Info"}
                        onClick={(e) => {
                          handleActive(e);
                          setAccountInfo(false);
                        }}
                      >
                        {t("Account Info")}
                      </span>
                      <span
                        className={`nav-item ${
                          active === "Address" && "underline"
                        }`}
                        id={"Address"}
                        onClick={(e) => {
                          handleActive(e);
                          setAccountInfo(false);
                        }}
                      >
                        {t("Address Book")}
                      </span>
                      <span
                        className={`nav-item ${
                          active === "Orders" && "underline"
                        }`}
                        id={"Orders"}
                        onClick={(e) => {
                          handleActive(e);
                          setAccountInfo(false);
                        }}
                      >
                        {t("My Orders")}
                      </span>
                      <span className="nav-item" onClick={toggle}>
                        {t("Log Out")}
                      </span>
                    </nav>
                  </header>
                </div>
              ) : (
                ""
              )}
              {window.innerWidth >= 991 ||
              (active === "Info" && window.innerWidth <= 991) ? (
                <Col lg={"4"}>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                    }}
                    className="account-Info"
                  >
                    <img src={accountProfile} />
                    <div>
                      <p>{user?.data.name}</p>
                      <span style={{ flexDirection: "nowrap" }}>
                        {user?.data.email}
                      </span>
                    </div>
                  </div>
                </Col>
              ) : (
                ""
              )}
              {window.innerWidth >= 991 && (
                <Col lg={"8"}>
                  <div className="account-title">
                    {active === "Info" && <p>{t("Account Info")}</p>}
                    {active === "Address" && <p>{t("Address Book")}</p>}
                    {active === "Orders" && <p>{t("My Orders")}</p>}
                    {/* msdckm */}
                    {active === "Projects" && <p>{t("My Projects")}</p>}

                    {active === "Requests" && <p>{t("My Requests")}</p>}
                  </div>
                </Col>
              )}
            </Row>
            <Row>
              <Col lg="4">
                <div
                  {...handlers}
                  ref={refPassthrough}
                  className="dashboard-left"
                  style={accountInfo ? { left: "0px" } : {}}
                >
                  <div
                    className="collection-mobile-back"
                    onClick={() => setAccountInfo(!accountInfo)}
                  >
                    <span className="filter-back">
                      <i className="fa fa-angle-left" aria-hidden="true"></i>
                      {t("back")}
                    </span>
                  </div>
                  <div className="block-content-n">
                    <ul>
                      <li
                        className={active === "Info" ? "active" : ""}
                        id={"Info"}
                        onClick={(e) => {
                          handleActive(e);
                          setAccountInfo(false);
                        }}
                      >
                        <div id={"Info"}>
                          <img
                            id={"Info"}
                            className="iconImg"
                            src={accountUser}
                          />
                          <span id={"Info"}>{t("Account Info")}</span>
                        </div>
                        <img className="iconArrow" src={rightArrow} />
                      </li>
                      <li
                        className={active === "Address" ? "active" : ""}
                        id={"Address"}
                        onClick={(e) => {
                          handleActive(e);
                          setAccountInfo(false);
                        }}
                      >
                        <div id={"Address"}>
                          <img
                            id={"Address"}
                            className="iconImg"
                            src={accountOrder}
                          />
                          <span id={"Address"}>{t("Address Book")}</span>
                        </div>
                        <img className="iconArrow" src={rightArrow} />
                      </li>
                      <li
                        className={active === "Orders" ? "active" : ""}
                        id={"Orders"}
                        onClick={(e) => {
                          handleActive(e);
                          setAccountInfo(false);
                        }}
                      >
                        <div id={"Orders"}>
                          <img
                            id={"Orders"}
                            className="iconImg"
                            src={accountLocation}
                          />
                          <span id={"Orders"}>{t("My Orders")}</span>
                        </div>
                        <img className="iconArrow" src={rightArrow} />
                      </li>

                      {usr?.user.type !== "Regular" && (
                        <li
                          className={active === "Projects" ? "active" : ""}
                          id={"Projects"}
                          onClick={(e) => {
                            handleActive(e);
                            setAccountInfo(false);
                          }}
                        >
                          <div id={"Projects"}>
                            <img
                              id={"Projects"}
                              className="iconImg"
                              src={project}
                            />
                            <span id={"Projects"}>{t("My Projects")}</span>
                          </div>

                          <img className="iconArrow" src={rightArrow} />
                        </li>
                      )}

                      {usr?.user.type !== "Regular" && (
                        <li
                          //csdcdsc
                          className={active === "Requests" ? "active" : ""}
                          id={"Requests"}
                          onClick={(e) => {
                            handleActive(e);
                            setAccountInfo(false);
                          }}
                        >
                          {/* csdcs */}
                          <div id={"Requests"}>
                            {/* // */}
                            <img
                              id={"Requests"}
                              className="iconImg"
                              src={request}
                            />
                            {/*  */}
                            <span id={"Requests"}>{t("My Requests")}</span>
                          </div>

                          <img className="iconArrow" src={rightArrow} />
                        </li>
                      )}

                      <li className="last">
                        <a onClick={toggle}>
                          <img className="iconImg" src={accountLogOut} />
                          {t("Log Out")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              {active === "Info" && (
                <Info
                  user={user}
                  handleActive={handleActive}
                  setAccountInfo={setAccountInfo}
                  setPassword={setPassword}
                  setInfo={setInfo}
                />
              )}
              {active === "Address" && <Address isLoggedIn={true} />}
              {active === "Orders" && <Orders />}
              {active === "Projects" && <Projects />}
              {/*  */}
              {active === "Requests" && <Requests />}
              {/*  */}
              {active === "AccountSetting" && (
                <AccountSetting
                  user={user}
                  info={info}
                  password={password}
                  setActive={setActive}
                  setPassword={setPassword}
                  setInfo={setInfo}
                />
              )}
            </Row>
          </Container>
          <Modal isOpen={modal} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>
              <div className="end-ar">{t("Logging Out")}</div>
            </ModalHeader>
            <ModalBody className="p-4 end-ar">
              {t("Do you want to logout?")}
            </ModalBody>
            <ModalFooter>
              <div
                className="start-ar"
                style={{ width: "100%", textAlign: "end" }}
              >
                <a
                  className="btn-solid btn-custom"
                  onClick={logOut}
                  color="secondary"
                >
                  {t("Yes")}
                </a>
                <Button
                  className="btn-solid btn-custom"
                  color="secondary"
                  onClick={toggle}
                >
                  {t("No")}
                </Button>
              </div>
            </ModalFooter>
          </Modal>
        </section>
      </CommonLayout>
    </>
  );
};

export default account;