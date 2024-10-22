import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Media,
  NavItem,
  NavLink,
  TabContent,
  Nav,
  TabPane,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../../../helpers/redux/actions/userActions";
import Summary from "./summary-dashboard";
import Products from "./products";
import Orders from "./orders";
import Statement from "./statement";
import Shipping from "./shippingFees";
import Profile from "./profile";
import AddProduct from "./addProduct";
import EditProduct from "./editProduct";
import i18next from "../../../../components/constant/i18n";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const active = router.query.active;
  const [activeTab, setActiveTab] = useState(active ? active : "1");
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const [toggleAddProducts, setToggleAddProduct] = useState(false);
  const [toggleEditProducts, setToggleEditProduct] = useState(
    router.query.edit ? router.query.edit : false
  );
  const [dir, setDir] = useState(
    localStorage.getItem("dir") ? localStorage.getItem("dir") : "LTR"
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [activeTab]);

  const logOut = async () => {
    const state = await dispatch(signout());
    if (state) router.push("/");
  };

  const handleLang = async () => {
    if (dir === "LTR") {
      setDir("RTL");
      i18next.changeLanguage("ar");
      localStorage.setItem("dir", "RTL");
    } else {
      setDir("LTR");
      i18next.changeLanguage("en");
      localStorage.setItem("dir", "LTR");
    }
  };

  return (
    <section
      className={`dashboard-section section-b-space ${
        dir === "RTL" ? "rtl" : ""
      }`}
      dir={dir}
      style={{ textAlign: "initial" }}
    >
      <Container>
        <Row dir={dir === "LTR" ? "RTL" : "LTR"}>
          <div className="px-4">
            <a onClick={handleLang} className="">
              {dir === "RTL" ? "English" : "Arabic"}
            </a>
          </div>
        </Row>
        <Row>
          <Col lg="3">
            <div className="dashboard-sidebar" dir={dir}>
              <div className="profile-top">
                <div className="profile-image">
                  <Media
                    src={user?.data.vendor.logo}
                    alt=""
                    className="img-fluid"
                  />
                </div>
                <div className="profile-detail">
                  <h5>{user?.data.vendor.name}</h5>
                  <h6>{user?.data.vendor.email}</h6>
                </div>
              </div>
              <div className="faq-tab">
                <Nav tabs className="border-tab-primary">
                  <NavItem className="nav nav-tabs" id="myTab" role="tablist">
                    <NavLink
                      className={activeTab === "1" ? "active" : ""}
                      onClick={() => {
                        router.push({
                          query: {
                            active: 1,
                          },
                        });
                        setActiveTab("1");
                      }}
                    >
                      {t("dashboard")}
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="nav nav-tabs text-initial"
                    id="myTab"
                    role="tablist"
                  >
                    <NavLink
                      className={activeTab === "2" ? "active" : ""}
                      onClick={() => {
                        router.push({
                          query: {
                            active: 2,
                          },
                        });
                        setActiveTab("2");
                      }}
                    >
                      {t("Products")}
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="nav nav-tabs text-initial"
                    id="myTab"
                    role="tablist"
                  >
                    <NavLink
                      className={activeTab === "3" ? "active" : ""}
                      onClick={() => {
                        router.push({
                          query: {
                            active: 3,
                          },
                        });
                        setActiveTab("3");
                      }}
                    >
                      {t("Shipping")}
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="nav nav-tabs text-initial"
                    id="myTab"
                    role="tablist"
                  >
                    <NavLink
                      className={activeTab === "4" ? "active" : ""}
                      onClick={() => {
                        router.push({
                          query: {
                            active: 4,
                          },
                        });
                        setActiveTab("4");
                      }}
                    >
                      {t("Statement")}
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="nav nav-tabs text-initial"
                    id="myTab"
                    role="tablist"
                  >
                    <NavLink
                      className={activeTab === "5" ? "active" : ""}
                      onClick={() => {
                        router.push({
                          query: {
                            active: 5,
                          },
                        });
                        setActiveTab("5");
                      }}
                    >
                      {t("Orders")}
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="nav nav-tabs text-initial"
                    id="myTab"
                    role="tablist"
                  >
                    <NavLink
                      className={activeTab === "6" ? "active" : ""}
                      onClick={() => {
                        router.push({
                          query: {
                            active: 6,
                          },
                        });
                        setActiveTab("6");
                      }}
                    >
                      {t("Profile")}
                    </NavLink>
                  </NavItem>
                  <NavItem
                    className="nav nav-tabs text-initial"
                    id="myTab"
                    role="tablist"
                  >
                    <NavLink
                      className={activeTab === "8" ? "active" : ""}
                      onClick={toggle}
                    >
                      {t("Logout")}
                    </NavLink>
                  </NavItem>
                </Nav>
              </div>
            </div>
          </Col>

          <Col lg="9">
            <div className="faq-content dashboard-Container">
              <TabContent activeTab={activeTab}>
                {activeTab === "1" ? <Summary /> : ""}
                {activeTab === "2" ? (
                  <>
                    {toggleAddProducts || toggleEditProducts ? (
                      <>
                        {toggleEditProducts ? (
                          <EditProduct
                            setToggleEditProduct={setToggleEditProduct}
                          />
                        ) : (
                          <AddProduct
                            setToggleAddProduct={setToggleAddProduct}
                          />
                        )}
                      </>
                    ) : (
                      <Products
                        setToggleAddProduct={setToggleAddProduct}
                        setToggleEditProduct={setToggleEditProduct}
                      />
                    )}
                  </>
                ) : (
                  ""
                )}
                {activeTab === "3" ? <Shipping /> : ""}
                {activeTab === "4" ? <Statement /> : ""}
                {activeTab === "5" ? <Orders /> : ""}
                {activeTab === "6" ? <Profile /> : ""}
              </TabContent>

              <Modal
                isOpen={modal}
                toggle={toggle}
                dir={dir === "RTL" ? "RTL" : "LTR"}
                centered
              >
                <ModalHeader toggle={toggle} charCode="">
                  {t("Logging Out")}
                </ModalHeader>
                <ModalBody className="p-4 text-initial">
                  {t("Do you want to logout?")}
                </ModalBody>
                <ModalFooter>
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
                </ModalFooter>
              </Modal>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Dashboard;
