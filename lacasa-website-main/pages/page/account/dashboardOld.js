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
import dynamic from "next/dynamic";
const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);
const Info = dynamic(() => import("./common/info"));
const Address = dynamic(() => import("./common/address"));
const Orders = dynamic(() => import("./common/orders"));
const AccountSetting = dynamic(() => import("./common/accountSetting"));

const Dashboard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const handlers = useSwipeable({
    onSwipedLeft: () => setAccountInfo(!accountInfo),
  });
  const myRef = useRef();
  const refPassthrough = (el) => {
    handlers.ref(el);
    myRef.current = el;
  };
  const [modal, setModal] = useState(false);
  const [accountInfo, setAccountInfo] = useState(false);
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;

  useEffect(() => {
    dispatch(detailsUser());
  }, []);

  const tab = router.query.active;
  const [active, setActive] = useState(tab ? tab : "Info");
  const [password, setPassword] = useState(false);
  const [info, setInfo] = useState(true);
  const toggle = () => setModal(!modal);
  const handleActive = (e) => {
    setActive(e.target.id);
    router.push({
      query: {
        active: e.target.id,
      },
    });
  };

  const logOut = async () => {
    const state = await dispatch(signout());
    if (state) router.push("/");
  };

  return (
    <>
      {accountInfo && (
        <div
          style={{ zIndex: "10" }}
          className="side-close-container"
          onClick={() => setAccountInfo(false)}
        />
      )}

      <CommonLayout parent="home" title="Account">
        <section className="section-b-space">
          <Container>
            <Row>
              <Col lg="3">
                {window.innerWidth <= 991 ? (
                  <div
                    className="account-sidebar"
                    onClick={() => setAccountInfo(!accountInfo)}
                  >
                    <a className="popup-btn">my account</a>
                  </div>
                ) : (
                  ""
                )}
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
                      back
                    </span>
                  </div>
                  <div className="block-content">
                    <ul>
                      <li className={active == "Info" ? "active" : ""}>
                        <a
                          id={"Info"}
                          onClick={(e) => {
                            handleActive(e);
                            setAccountInfo(false);
                          }}
                        >
                          Account Info
                        </a>
                      </li>
                      <li className={active == "Address" ? "active" : ""}>
                        <a
                          id={"Address"}
                          onClick={(e) => {
                            handleActive(e);
                            setAccountInfo(false);
                          }}
                        >
                          Address Book
                        </a>
                      </li>
                      <li className={active == "Orders" ? "active" : ""}>
                        <a
                          id={"Orders"}
                          onClick={(e) => {
                            handleActive(e);
                            setAccountInfo(false);
                          }}
                        >
                          My Orders
                        </a>
                      </li>
                      <li
                        className={active == "AccountSetting" ? "active" : ""}
                      >
                        <a
                          id={"AccountSetting"}
                          onClick={(e) => {
                            setPassword(false);
                            setInfo(true);
                            handleActive(e);
                            setAccountInfo(false);
                          }}
                        >
                          Account Setting
                        </a>
                      </li>
                      {/* <li className="last"><a onClick={logOut}>Log Out</a></li> */}
                      <li className="last">
                        <a onClick={toggle}>Log Out</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
              {active === "Info" && (
                <Info
                  user={user}
                  handleActive={handleActive}
                  setPassword={setPassword}
                  setInfo={setInfo}
                />
              )}
              {active === "Address" && <Address isLoggedIn={true} />}
              {active === "Orders" && <Orders />}
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
            <ModalHeader toggle={toggle}>Logging Out</ModalHeader>
            <ModalBody className="p-4">Do you want to logout?</ModalBody>
            <ModalFooter>
              <a
                className="btn-solid btn-custom"
                onClick={logOut}
                color="secondary"
              >
                Yes
              </a>
              <Button
                className="btn-solid btn-custom"
                color="secondary"
                onClick={toggle}
              >
                No
              </Button>
            </ModalFooter>
          </Modal>
        </section>
      </CommonLayout>
    </>
  );
};

export default Dashboard;
