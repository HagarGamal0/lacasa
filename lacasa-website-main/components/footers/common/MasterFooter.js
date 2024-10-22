import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Media, Collapse } from "reactstrap";
import LogoImage from "../../headers/common/logo";
import CopyRight from "./copyright";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const MasterFooter = ({
  containerFluid,
  logoName,
  layoutClass,
  footerClass,
  footerLayOut,
  footerSection,
  belowSection,
  belowContainerFluid,
  copyRightFluid,
  newLatter,
}) => {
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);

  const [userLogged, setUserLogged] = useState(true);
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const { t } = useTranslation();
  const width = window.innerWidth < 750;
  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth < 750) {
        setCollapse(0);
        setIsOpen(false);
      } else setIsOpen(true);
    };
    window.addEventListener("resize", changeCollapse);
    return () => {
      window.removeEventListener("resize", changeCollapse);
    };
  }, []);
  useEffect(async () => {
    if (localStorage.getItem("userInfo")) {
      setUserLogged(false);
    }
  }, [user]);
  return (
    <div>
      <footer className={footerClass}>
        {newLatter ? (
          <div className={footerLayOut}>
            <Container fluid={containerFluid ? containerFluid : ""}>
              <section className={footerSection}>
                <Row></Row>
              </section>
            </Container>
          </div>
        ) : (
          ""
        )}

        <section>
          <div className="footer_box">
            <Container fluid={belowContainerFluid ? belowContainerFluid : ""}>
              <Row className="footer-theme partition-f flex-ar end-ar">
                <Col>
                  <div className="sub-title end-ar">
                    <div
                      className={`footer-title ${
                        isOpen && collapse == 3 ? "active" : ""
                      } `}
                    >
                      <h4
                        onClick={() => {
                          if (width) {
                            setIsOpen(!isOpen);
                            setCollapse(3);
                          } else setIsOpen(true);
                        }}
                      >
                        {t("Company")}
                        <span className="according-menu"></span>
                      </h4>
                    </div>
                    <Collapse
                      isOpen={width ? (collapse === 3 ? isOpen : false) : true}
                    >
                      <div className="footer-contant">
                        <ul>
                          <li>
                            <a href="/about-us">{t("About us")}</a>
                          </li>
                          <li>
                            <a href="/page/account/contact">
                              {t("Contact Us")}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                </Col>
                <Col>
                  <div className="sub-title">
                    <div
                      className={`footer-title ${
                        isOpen && collapse == 2 ? "active" : ""
                      } `}
                    >
                      <h4
                        onClick={() => {
                          if (width) {
                            setIsOpen(!isOpen);
                            setCollapse(2);
                          } else setIsOpen(true);
                        }}
                      >
                        {t("Important Links")}
                        <span className="according-menu"></span>
                      </h4>
                    </div>
                    <Collapse
                      isOpen={width ? (collapse === 2 ? isOpen : false) : true}
                    >
                      <div className="footer-contant">
                        <ul>
                          <li>
                            <Link href={"/return-policy"}>{t("Return Policy")}</Link>
                          </li>
                          <li className="d-none">
                            <Link href={""} >{t("Privacy Policy")}</Link>
                          </li>
                          <li>
                            <Link href={"/terms-conditions"}>{t("Terms & Conditions")}</Link>
                          </li>
                          <li>
                            <Link href={"/shipping-policy"}>{t("Shipping policy")}</Link>
                          </li>
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                </Col>
                <Col>
                  <div className="sub-title">
                    <div
                      className={`footer-title ${
                        isOpen && collapse == 2 ? "active" : ""
                      } `}
                    >
                      <h4
                        onClick={() => {
                          if (width) {
                            setIsOpen(!isOpen);
                            setCollapse(2);
                          } else setIsOpen(true);
                        }}
                      >
                        {t("my account")}
                        <span className="according-menu"></span>
                      </h4>
                    </div>
                    <Collapse
                      isOpen={width ? (collapse === 2 ? isOpen : false) : true}
                    >
                      <div className="footer-contant">
                        <ul>
                          <li>
                            {userLogged ? (
                              <Link
                                href={{
                                  pathname: "/page/account/login",
                                  query: { prevURL: "/" },
                                }}
                              >
                                <a>{t("Profile")}</a>
                              </Link>
                            ) : (
                              <Link
                                href={
                                  user?.data.type === "Vendor"
                                    ? `/page/vendor/vendor-dashboard`
                                    : `/page/account/dashboard`
                                }
                              >
                                <a>{t("Profile")}</a>
                              </Link>
                            )}
                          </li>
                          <li>
                            <Link href={`/page/vendor/signup-vendor`}>
                              {/* <Link href={`#`}> */}
                              <a>{t("signup as vendor")}</a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                </Col>
                {/* <Col>
                  <div className="sub-title">
                    <div
                      className={`footer-title ${
                        isOpen && collapse == 4 ? "active" : ""
                      } `}
                    >
                      <h4
                        onClick={() => {
                          if (width) {
                            setIsOpen(!isOpen);
                            setCollapse(4);
                          } else setIsOpen(true);
                        }}
                      >
                        {t("NEED HELP ?")}
                        <span className="according-menu"></span>
                      </h4>
                    </div>
                    <Collapse
                      isOpen={width ? (collapse === 4 ? isOpen : false) : true}
                    >
                      <div className="footer-contant">
                        <ul className="contact-list">
                        
                          <li>
                            <i className="fa fa-phone"></i>
                            {t("Call Us:")} 01063117666
                          </li>
                          <li>
                            <i className="fa fa-envelope-o end-ar"></i>
                            {t("Email Us")}{" "}
                            <a href="mailto:support@lacasa-egy.com">
                              support@lacasa-egy.com
                            </a>
                          </li>
                        </ul>
                      </div>
                    </Collapse>
                  </div>
                </Col> */}
                <Col></Col>
                <Col>
                  <div className="footer-social mt-0 pull-right">
                    <ul>
                      <li>
                        <a
                          href="https://www.facebook.com/lacasa.egy2020"
                          target="_blank"
                        >
                          <i className="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#" target="_blank">
                          <i className="fa fa-linkedin" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.instagram.com/lacasa.egypt/"
                          target="_blank"
                        >
                          <i className="fa fa-instagram" aria-hidden="true"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col className="end-ar" lg="12" md="12">
                  <div
                    className={`footer-title ${
                      isOpen && collapse == 1 ? "active" : ""
                    } footer-mobile-title`}
                  >
                    <h4
                      onClick={() => {
                        setCollapse(1);
                        setIsOpen(!isOpen);
                      }}
                    >
                      {t("about")}
                      <span className="according-menu"></span>
                    </h4>
                  </div>
                  <Collapse
                    isOpen={width ? (collapse === 1 ? isOpen : false) : true}
                  >
                    <div className="footer-contant mt-5">
                      {/* <div className="footer-logo">
                      <LogoImage />
                    </div> */}
                      <p>
                        {`${t(
                          "La Casa is an e-commerce platform that helps furnish"
                        )}
                     ${t(
                       "houses for customers by choosing the right tools, colors,"
                     )}
                      ${t(
                        "and furniture to decorate and complete their dream homes."
                      )}
                      ${t("Established in 2020 and based in Cairo, Egypt.")}`}
                      </p>
                    </div>
                  </Collapse>
                </Col>
                <Col>
                  <CopyRight
                    layout={layoutClass}
                    fluid={copyRightFluid ? copyRightFluid : ""}
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </section>
      </footer>
    </div>
  );
};
export default MasterFooter;
