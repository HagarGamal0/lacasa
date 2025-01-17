import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import { config } from "./config.json";
import {
  Media,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse,
} from "reactstrap";

const ThemeSettings = () => {
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const context = useContext(SettingContext);
  const [themeLayout, setThemeLayout] = useState(false);
  const layoutType = context.layoutFun;
  const layoutColorFunc = context.layoutColorFun;
  const layoutState = context.state;
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  /*=====================
     Tap on Top
     ==========================*/

  const path = window.location.pathname.split("/");
  const url = path[path.length - 1];
  useEffect(() => {
    if (config.layout_version && config.layout_type) {
      document.body.className = `${config.layout_version}  ${config.layout_type}`;
    }

    if (localStorage.getItem("color")) {
      document.documentElement.style.setProperty(
        "--theme-deafult",
        localStorage.getItem("color")
      );
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);

  const handleScroll = () => {
    if (process.browser) {
      if (document.documentElement.scrollTop > 600) {
        document.querySelector(".tap-top").style = "display: block";
      } else {
        document.querySelector(".tap-top").style = "display: none";
      }
    }
  };

  const openSetting = () => {
    if (process.browser) {
      document.getElementById("setting_box").classList.add("open-setting");
      document.getElementById("setting-icon").classList.add("open-icon");
    }
  };

  const closeSetting = () => {
    if (process.browser) {
      document.getElementById("setting_box").classList.remove("open-setting");
      document.getElementById("setting-icon").classList.remove("open-icon");
    }
  };

  const changeThemeLayout = () => {
    setThemeLayout(!themeLayout);
  };


  if (url === "vendor-dashboard") {
    if (themeLayout) {
      if (process.browser) {
        document.body.classList.add("dark");
        config.layout_version = "dark";
        localStorage.setItem("color", "dark");
      }
    } else {
      if (process.browser) {
        document.body.classList.remove("dark");
        config.layout_version = "light";
        localStorage.setItem("color", "light");
      }
    }
  } else {
    document.body.classList.remove("dark");
    config.layout_version = "light";
    localStorage.setItem("color", "light");
  }

  const MasterComponent = ({ ribon, bg, name, link, btnName }) => {
    return (
      <Col sm="6" className="text-center demo-effects">
        <div className="set-position">
          <div className={`layout-container ${bg}`}>
            {ribon ? (
              <div className="ribbon-1">
                <span>n</span>
                <span>e</span>
                <span>w</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="demo-text">
            <h4>{name}</h4>
            <div
              className="btn-group demo-btn"
              role="group"
              aria-label="Basic example"
            >
              <Link href={link}>
                <a className="btn new-tab-btn">{btnName} </a>
              </Link>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <div>
      <a href={null} onClick={() => openSetting()}>
        <div className="setting-sidebar" id="setting-icon">
          <div>
            <i className="fa fa-cog" aria-hidden="true"></i>
          </div>
        </div>
      </a>
      <div id="setting_box" className="setting-box">
        <a href="# " className="overlay" onClick={() => closeSetting()}></a>
        <div className="setting_box_body">
          <div onClick={() => closeSetting()}>
            <div className="sidebar-back text-left">
              <i className="fa fa-angle-left pr-2" aria-hidden="true"></i> Back
            </div>
          </div>
          <div className="setting-body">
            {/* <div
              className={`setting-title ${isOpen && collapse == 1 ? "active" : ""
                }`}
            >
              <h4
                onClick={() => {
                  setCollapse(1);
                  setIsOpen(!isOpen);
                }}
              >
                layout
                <span className="according-menu"></span>
              </h4>
            </div>
            <Collapse isOpen={collapse === 1 ? isOpen : false}>
              <div className="setting-contant">
                <Row className="demo-section">
                  {LayoutData.map((data, i) => {
                    return (
                      <MasterComponent
                        key={i}
                        ribon={data.ribon}
                        name={data.name}
                        link={data.link}
                        btnName={data.btnName}
                      />
                    );
                  })}
                </Row>
              </div>
            </Collapse> */}
            {/* <div
              className={`setting-title ${isOpen && collapse == 2 ? "active" : ""
                }`}
            >
              <h4
                onClick={() => {
                  setCollapse(2);
                  setIsOpen(!isOpen);
                }}
              >
                shop
                <span className="according-menu"></span>
              </h4>
            </div>
            <Collapse isOpen={collapse === 2 ? isOpen : false}>
              <div className="setting-contant">
                <Row className="demo-section">
                  {ShopData.map((data, i) => {
                    return (
                      <MasterComponent
                        key={i}
                        ribon={data.ribon}
                        name={data.name}
                        link={data.link}
                        btnName={data.btnName}
                      />
                    );
                  })}
                </Row>
              </div>
            </Collapse> */}
            {/* <div
              className={`setting-title ${isOpen && collapse == 3 ? "active" : ""
                }`}
            >
              <h4
                onClick={() => {
                  setCollapse(3);
                  setIsOpen(!isOpen);
                }}
              >
                product
                <span className="according-menu"></span>
              </h4>
            </div>
            <Collapse isOpen={collapse === 3 ? isOpen : false}>
              <div className="setting-contant">
                <Row className="demo-section">
                  {ProductData.map((data, i) => {
                    return (
                      <MasterComponent
                        key={i}
                        ribon={data.ribon}
                        name={data.name}
                        link={data.link}
                        btnName={data.btnName}
                      />
                    );
                  })}
                </Row>
              </div>
            </Collapse> */}
            {/* <div
              className={`setting-title ${isOpen && collapse == 4 ? "active" : ""
                }`}
            >
              <h4
                onClick={() => {
                  setCollapse(4);
                  setIsOpen(!isOpen);
                }}
              >
                color option
                <span className="according-menu"></span>
              </h4>
            </div>
            <Collapse isOpen={collapse === 4 ? isOpen : false}>
              <div className="setting-contant">
                <ul className="color-box">
                  <li>
                    <input
                      id="colorPicker1"
                      type="color"
                      defaultValue="#ff4c3b"
                      name="Background"
                      onChange={(e) => layoutColorFunc(e)}
                    />
                  </li>
                  <span className="ml-3">theme deafult color</span>
                </ul>
              </div>
            </Collapse> */}
            <div
              className={`setting-title ${isOpen && collapse == 5 ? "active" : ""
                }`}
            >
              <h4
                onClick={() => {
                  setCollapse(5);
                  setIsOpen(!isOpen);
                }}
              >
                Language
                <span className="according-menu"></span>
              </h4>
            </div>
            <Collapse isOpen={collapse === 5 ? isOpen : false}>
              <div className="setting-contant">
                <ul className="setting_buttons">
                  <li className="active" id="ltr_btn">
                    <a
                      href="#"
                      className="btn setting_btn"
                      onClick={() => layoutType(layoutState)}
                    >
                      {layoutState === "LTR" ? "English" : "العربية"}
                    </a>
                  </li>
                </ul>
              </div>
            </Collapse>


            <div
              className={`setting-title ${isOpen && collapse == 5 ? "active" : ""
                }`}
            >
              <h4
                onClick={() => {
                  setCollapse(6);
                  setIsOpen(!isOpen);
                }}
              >
                Layout Color
                <span className="according-menu"></span>
              </h4>
            </div>
            <Collapse isOpen={collapse === 6 ? isOpen : false}>
              <div className="setting-contant">
                <ul className="setting_buttons">
                  <li className="active" id="ltr_btn">
                    <a
                      href="#"
                      className="btn setting_btn"
                      onClick={() => changeThemeLayout()}
                    >
                      {themeLayout ? "Light" : "Dark"}
                    </a>
                  </li>
                </ul>
              </div>
            </Collapse>


          </div>
        </div>
      </div>
      {/* <div className="sidebar-btn dark-light-btn">
        <div className="dark-light">
          <div
            className="theme-layout-version"
            onClick={() => changeThemeLayout()}
          >
            {themeLayout ? "Light" : "Dark"}
          </div>
        </div>
      </div> */}
      {/* <div className="addcart_btm_popup" id="fixed_cart_icon">
        <a href={null} className="fixed_cart">
          <i
            className="fa fa-clone"
            aria-hidden="true"
            onClick={toggle}
            title="Configuration"
          ></i>
        </a>
      </div> */}
      {/* <Modal centered={true} isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Config</ModalHeader>
        <ModalBody className="p-3">
          {Object.keys(config).map((key, i) => (
            <p key={i}>
              <span>{key}:</span>
              <span>{config[key]}</span>
            </p>
          ))}
        </ModalBody>
        <ModalFooter>
          <p className="lh-cls">
            <b>Note: </b>Copy upper config and paste it in{" "}
            <b>"/components/customizer/config.json"</b>{" "}
          </p>
        </ModalFooter>
      </Modal> */}
    </div>
  );
};

export default ThemeSettings;
