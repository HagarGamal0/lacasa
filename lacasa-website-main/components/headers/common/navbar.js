import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MENUITEMS } from "../../constant/menu";
import { Container, Row } from "reactstrap";
import { useRouter } from "next/router";
import API from "../../../helpers/API/API";
import { useSwipeable } from "react-swipeable";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";

const NavBar = ({ setSidebarView, sidebarView }) => {
  const [navClose, setNavClose] = useState();
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  // here professionals branch
  const [catsProf, setCatsProf] = useState([]);
  const handlers = useSwipeable({ onSwipedRight: () => closeNav() });
  const myRef = useRef();
  const refPassthrough = (el) => {
    handlers.ref(el);
    myRef.current = el;
  };

  const { t } = useTranslation();

  useEffect(() => {
    API.readAll("/categories")
      .then((response) => {
        let arr = response.data?.filter(
          (item) => item.name.toLocaleLowerCase() != "sectional sofas"
        );
        let sectionalSofas = response.data?.find(
          (item) => item.name?.toLocaleLowerCase() == "sectional sofas"
        );
        if (sectionalSofas) arr.splice(1, 0, sectionalSofas);
        return setCategories(arr);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //
    API.readAll(`/designers/categories`)
      .then(async (response) => {
        const cats = response.data.map((cat) => ({
          label: cat.id,
          value: cat.name,
          childs: cat.childs,
        }));
        setCatsProf(cats);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    // if (window.innerWidth < 750) {
    //   setNavClose({ left: "-410px" });
    // }
    // if (window.innerWidth < 1199) {
    //   setNavClose({ left: "-300px" });    }
  }, []);
  useEffect(() => {
    if (!sidebarView) {
      closeNav();
    }
  }, [sidebarView]);

  const openNav = () => {
    setSidebarView(true);
    // setNavClose({ left: "0px" });
    if (router.asPath == "/layouts/Gym")
      document.querySelector("#topHeader").classList.add("zindex-class");
    document.querySelector("ul.nav-menu").classList.add("direction_style");
  };

  const closeNav = () => {
    setSidebarView(false);
    // setNavClose({ left: "-410px" });
    if (router.asPath == "/layouts/Gym")
      document.querySelector("#topHeader").classList.remove("zindex-class");
    document.querySelector("ul.nav-menu").classList.remove("direction_style");
  };

  const handleMegaSubmenu = (event, slug) => {
    if (event.target.classList.contains("sub-arrow")) return;
    else {
      router.push({
        pathname: "/shop",
        query: { category: slug, page: 1, sale: "0" },
      });
      closeNav();
    }
  };
  const handleMegaSubmenuCat = (event, slug) => {
    if (event.target.classList.contains("sub-arrow")) return;
    else {
      router.push({
        pathname: "/professionals",
        query: { category: slug, page: 1 },
      });
      closeNav();
    }
  };

  const [mainmenu, setMainMenu] = useState(MENUITEMS);

  useEffect(() => {
    const currentUrl = location.pathname;
    MENUITEMS.filter((items) => {
      if (items.path === currentUrl) setNavActive(items);
      if (!items.children) return false;
      items.children.filter((subItems) => {
        if (subItems.path === currentUrl) setNavActive(subItems);
        if (!subItems.children) return false;
        subItems.children.filter((subSubItems) => {
          if (subSubItems.path === currentUrl) setNavActive(subSubItems);
        });
      });
    });
  }, []);

  const setNavActive = (item) => {
    MENUITEMS.filter((menuItem) => {
      if (menuItem != item) menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true;
      if (menuItem.children) {
        menuItem.children.filter((submenuItems) => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = false;
          }
        });
      }
    });
    setMainMenu({ mainmenu: MENUITEMS });
  };
  const openMblNav = (event) => {
    if (window.innerWidth > 670) {
      router.push({
        pathname: "/shop",
        query: { category: "", page: 1, sale: "0" },
      });
    } else {
      if (event.target.classList.contains("sub-arrow")) return;
      if (event.target.nextElementSibling.classList.contains("opensubmenu"))
        event.target.nextElementSibling.classList.remove("opensubmenu");
      else {
        document.querySelectorAll(".nav-submenu").forEach(function (value) {
          value.classList.remove("opensubmenu");
        });
        document
          .querySelector(".mega-menu-container")
          .classList.remove("opensubmenu");
        event.target.nextElementSibling.classList.add("opensubmenu");
      }
    }
  };
  return (
    <>
      <div>
        <div className="main-navbar">
          <div id="mainnav">
            <div className="toggle-nav" onClick={openNav.bind(this)}>
              <i className="fa fa-bars sidebar-bar"></i>
            </div>
            <ul
              {...handlers}
              ref={refPassthrough}
              className="nav-menu flex-ar set_location"
              style={navClose}
            >
              <li className="back-btn" onClick={closeNav.bind(this)}>
                <div className="mobile-back text-right">
                  <span>{t("Back navbar")}</span>
                  <i className="fa fa-angle-right pl-2" aria-hidden="true"></i>
                </div>
              </li>
              <li>
                <Link href={"/"} className="nav-link">
                  {t("Home")}
                </Link>
              </li>
              <li className={`mega-menu`}>
                <a className="nav-link" onClick={(e) => openMblNav(e)}>
                  {t("Shop By Department")}
                </a>
                <div className={`mega-menu-container`}>
                  <Container>
                    <Row>
                      {categories?.map((category, index) => (
                        <div className={`col-md-2 mega-box`} key={index}>
                          <div className="link-section">
                            <div className="menu-title">
                              <h5
                                className="mt-3"
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  handleMegaSubmenu(e, category?.slug)
                                }
                              >
                                {category?.name}
                              </h5>
                            </div>
                            <div className="menu-content">
                              <ul>
                                {category?.childs.map((category, i) => (
                                  <li key={i}>
                                    <a
                                      onClick={async () => {
                                        closeNav();
                                        router.push({
                                          pathname: `/shop`,
                                          query: {
                                            category: category?.slug,
                                            page: 1,
                                            sale: "0",
                                          },
                                        });
                                      }}
                                    >
                                      {category?.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Row>
                  </Container>
                </div>
              </li>
              {/* <li>
                <a className="nav-link" onClick={() => {
                  router.push({ pathname: '/offers' });
                  closeNav();
                }}>
                  {"Mother's Day offers"}
                </a>
              </li> */}
              <li>
                <a
                  className="nav-link"
                  onClick={() => {
                    router.push({
                      pathname: "/shop",
                      query: { category: "", page: 1, sale: 0, tag: "flash" },
                    });
                    closeNav();
                  }}
                >
                  {t("Flash Sale")}
                </a>
              </li>
              <li>
                {/* <Tooltip
                  sx={{ fontSize: "20px" }}
                  title={t("Comming Soon!")}
                  placement="top"
                  arrow
                > */}
                <a
                  className="nav-link"
                  onClick={async () => {
                    router.push({
                      pathname: "/professionals",
                      query: { category: "", page: 1 },
                    });
                    closeNav();
                  }}
                >
                  {t("Professionals")}
                </a>
                {/* </Tooltip> */}
                {/* <div className={`mega-menu-container`}>
                  <Container>
                    <Row>
                      {catsProf?.map((catProf, index) => (
                        <div className={`col-md-2 mega-box`} key={index}>
                          <div className="link-section">
                            <div className="menu-title">
                              <h5
                                className="mt-3"
                                style={{ cursor: "pointer" }}
                                onClick={(e) =>
                                  handleMegaSubmenuCat(e, catProf?.label)
                                }
                              >
                                {catProf?.value}
                              </h5>
                            </div>
                            <div className="menu-content">
                              <ul>
                                {catProf?.childs.map((child, i) => (
                                  
                                  <li key={i}>
                                    <a
                                      onClick={async () => {
                                        closeNav();
                                        router.push({
                                          pathname: `/professionals`,
                                          query: {
                                            category: child?.id,
                                            page: 1,
                                            sale: "0",
                                          },
                                        });
                                      }}
                                    >
                                      {child?.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Row>
                  </Container>
                </div> */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
