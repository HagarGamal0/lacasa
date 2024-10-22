import React, { useState, useEffect } from "react";
import NavBar from "./common/navbar";
import Cart from "../containers/Cart";
import CartContainer from "../containers/CartContainer";
import { Container, Row, Col } from "reactstrap";
import LogoImage from "./common/logo";
import Link from "next/link";
import Image from "next/image";
import pro_icon from "../../public/assets/images/pro.png";
import en_icon from "../../public/assets/images/en.png";
import ar_icon from "../../public/assets/images/egypt.jpg";

import {
  svgCart,
  svgHeart,
  svgAccount,
  svgSearch,
  svgProfessional,
} from "../../services/script";
import { useRouter } from "next/router";
import SearchOverlay from "./common/search-overlay";
import { useSelector } from "react-redux";
import API from "../../helpers/API/API";
import { useTranslation } from "react-i18next";

const HeaderOne = ({ direction }) => {
  const router = useRouter();
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const [userLogged, setUserLogged] = useState(true);
  const [sidebarView, setSidebarView] = useState(false);
  const [promotions, setPromotions] = useState(false);
  const [promotionsData, setPromotionsData] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("lang") || "en";
    document.getElementsByTagName("html")[0].setAttribute("lang", storedLocale);
    if (storedLocale) {
      setSelectedLocale(storedLocale);
    }
  }, []);

  useEffect(async () => {
    if (user) {
      setUserLogged(false);
    } else {
      setUserLogged(true);
    }
  }, [user]);
  const handleLocaleChange = (locale) => {
    router.push(router.pathname, router.asPath, { locale });
    setSelectedLocale(locale);
    localStorage.setItem("lang", locale);
    // Reload the page to apply the selected language
    window.location.reload();
  };

  useEffect(() => {
    API.readAll("/dynamic/top-notifications/items")
      .then((response) => {
        if (response.data.length > 0) {
          setPromotionsData(response.data[0]);
          setPromotions(true);
        } else {
          setPromotions(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 1000);

    if (router.asPath !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 300) {
      if (window.innerWidth < 576)
        document.getElementById("sticky")?.classList.remove("fixed");
      else document.getElementById("sticky")?.classList.add("fixed");
    } else {
      document.getElementById("sticky")?.classList.remove("fixed");
    }
  };

  const openNav = () => {
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
    }
  };

  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "block";
  };

  const handleSearch = (e) => {
    if (e.target.value.length === 3) {
      router.push({
        pathname: "/shop",
        query: { category: "", search: e.target.value, page: 1 },
      });
    } else if (e.target.value.length > 3) {
      setTimeout(() => {
        router.push({
          pathname: "/shop",
          query: { category: "", search: e.target.value, page: 1 },
        });
      }, 3000);
    }
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "Arabic" },
    // Add more language options as needed
  ];

  const handleLang = (lang) => {
    localStorage.setItem("lang", lang);
    location.reload();
  };
  const langStyle =
    localStorage.getItem("lang") === "ar"
      ? { paddingLeft: "170px" }
      : { paddingRight: "170px", marginLeft: "-75px", marginTop: "10px" };

  const { t, i18n } = useTranslation("");
  return (
    <div>
      {sidebarView && (
        <div
          style={{ zIndex: "9" }}
          className="side-close-container"
          onClick={() => setSidebarView(false)}
        />
      )}
      <header id="sticky" className={`sticky mb-3`}>
        {promotionsData.title ? (
          <div className={"promotionContainer"}>
            {promotionsData?.link && (
              <Link
                href={promotionsData?.link == "!" ? "" : promotionsData?.link}
              >
                <div className={"discountTitle"}>{promotionsData?.title}</div>
              </Link>
            )}
            <div
              className={"closeDiscount"}
              onClick={() => setPromotions(false)}
            >
              X
            </div>
          </div>
        ) : (
          ""
        )}
        <Row>
          <Col>
            <div className="main-menu">
              <div className="row m-0 d-flex justify-content-between align-items-center w-100">
                <div className="col-lg-2 col-md-4 col-4 menu-left">
                  <Container>
                    <Row
                      style={{ textAlign: "center" }}
                      className={"desktop-display justify-content-center"}
                    >
                      <div className="brand-logo position-relative">
                        <LogoImage decor={false} />
                      </div>

                      {/* <NavBar
                        sidebarView={sidebarView}
                        setSidebarView={setSidebarView}
                      /> */}
                    </Row>
                  </Container>
                </div>
                <div className="col-md-3 col-4 menu-right pull-right ">
                  <div className="mobile-display brand-logo ">
                    <LogoImage decor={false} />
                  </div>
                  <div className="search_center">
                    <div className="navbar desktop-display w-100">
                      <div className="search_desktop">
                        <div
                          className="search-container"
                          style={{ display: "flex" }}
                        >
                          <input
                            className="form-control end-ar"
                            id="searchleft"
                            onChange={handleSearch}
                            type="search"
                            name="q"
                            placeholder={t("What are you looking for")}
                          />
                          <label className="button" htmlFor="searchleft">
                            <span className="mglass">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: svgSearch,
                                }}
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="search_mobile">
                        <div className="icon-nav">
                          <ul className="flex-ar" style={{ display: "flex" }}>
                            {/* <li className="onhover-div pl-md-2">
                            <select
                              style={{
                                padding: "10px",
                                border: "none",
                                cursor: "pointer",
                              }}
                              defaultValue={
                                localStorage.getItem("lang") || "en"
                              }
                              onChange={handleLang}
                            >
                              <option value="en">English</option>
                              <option value="ar">عربي</option>
                            </select>
                          </li>
                          <li
                            style={{
                              paddingLeft: "20px",
                              display: "flex",
                              gap: "10px",
                            }}
                            className={"onhover-div"}
                          >
                            {userLogged && (
                              <div>
                                <Link
                                  href={{
                                    pathname: "/page/account/login",
                                    query: { prevURL: "/" },
                                  }}
                                >
                                  <div>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        // here professionals branch
                                        __html: svgAccount,
                                      }}
                                    />
                                  </div>
                                </Link>
                              </div>
                            )}

                            {userLogged && (
                              <div>
                                <Link
                                  href={{
                                    pathname: "/professionals/sign-up",
                                    query: { prevURL: "/" },
                                  }}
                                >
                                  <div>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        // here professionals branch
                                        __html: svgProfessional,
                                      }}
                                    />
                                  </div>
                                </Link>
                              </div>
                            )}

                            {!userLogged && (
                              <div>
                                <Link
                                  href={
                                    user?.data.type === "Vendor"
                                      ? `/page/vendor/vendor-dashboard`
                                      : `/page/account/dashboard`
                                  }
                                >
                                  <div
                                    className={
                                      " name-container position-relative"
                                    }
                                  >
                                    <h5>{user?.data?.name.charAt(0)}</h5>
                                  </div>
                                </Link>
                              </div>
                            )}
                          </li> */}
                            <li className={"onhover-div"}>
                              <div
                                className="search-container"
                                style={{ display: "flex", paddingLeft: "20px" }}
                              >
                                <input
                                  className="search end-ar"
                                  id="searchleft"
                                  onChange={handleSearch}
                                  type="search"
                                  name="q"
                                  placeholder={t("Search")}
                                />
                                <label
                                  className="button searchbutton"
                                  htmlFor="searchleft"
                                >
                                  <span className="mglass">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: svgSearch,
                                      }}
                                    />
                                  </span>
                                </label>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-5 col-4 menu-left menu-right icon_nav justify-content-end">
                  <div className="navbar" style={{ display: "flex" }}>
                    <div>
                      <div className="icon-nav home_icon">
                        <ul className="d-flex align-items-center">
                          <li className={"onhover-div mobile-wishlist"}>
                            <div>
                              <Link href={`/page/account/wishlist`}>
                                <div className="onhover-dropdown d-flex align-items-center">
                                  <i
                                    className="mt-1 fa fa-heart"
                                    aria-hidden="true"
                                  ></i>
                                  <div
                                    className="desktop-display"
                                    dangerouslySetInnerHTML={{
                                      __html: svgHeart,
                                    }}
                                  />
                                  <span className="cart_mobile_text">
                                    Wishlist
                                  </span>
                                </div>
                              </Link>
                            </div>
                          </li>

                          <li className={"onhover-div"}>
                            <div className="d-flex">
								              {userLogged && (
                                <div>
                                  <Link
                                    href={{
                                      pathname: "/page/account/login",
                                      query: { prevURL: "/" },
                                    }}
                                  >
                                    <div>
                                      <span
                                        dangerouslySetInnerHTML={{
                                          // here professionals branch
                                          __html: svgAccount,
                                        }}
                                      />
									                    <span className="cart_mobile_text">
                                        Login 
                                      </span>
                                    </div>
                                  </Link>
                                </div>
                              )}
                              {userLogged && (
                                <div>
                                  <Link
                                    href={{
										pathname: "/professionals/sign-up",
										query: { prevURL: "/" },
                                    }}
                                  >
                                    <div>
                                      <img src={pro_icon} />
                                      <span className="cart_mobile_text">
                                        Join as a Pro
                                      </span>
                                    </div>
                                  </Link>
                                </div>
                              )}

                              {!userLogged && (
                                <div>
                                  <Link
                                    href={
                                      user?.data.type === "Vendor"
                                        ? `/page/vendor/vendor-dashboard`
                                        : `/page/account/dashboard`
                                    }
                                  >
                                    <div
                                      className={
                                        " name-container position-relative"
                                      }
                                    >
                                      <h5>{user?.data?.name.charAt(0)}</h5>
                                    </div>
                                    
                                  </Link>
                                </div>
                              )}
                            </div>
                          </li>
                          {direction === undefined ? (
                            <CartContainer layout={direction} icon={svgCart} />
                          ) : (
                            <Cart layout={direction} icon={svgCart} />
                          )}
                          

                          {/* <li className="onhover-div mobile-display mobile-search">
                            {userLogged ? (
                              <Link
                                href={{
                                  pathname: "/page/account/login",
                                  query: { prevURL: "/" },
                                }}
                              >
                                <i
                                  className="mt-1 fa fa-user"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                            ) : (
                              <Link
                                href={
                                  user?.data.type === "Vendor"
                                    ? `/page/vendor/vendor-dashboard`
                                    : `/page/account/dashboard`
                                }
                              >
                                <div
                                  className={"name-container position-relative"}
                                >
                                  <h5>{user?.data?.name.charAt(0)}</h5>
                                </div>
                              </Link>
                            )}
                          </li> */}
                          <li className="onhover-div lang_select">
                            {localStorage.getItem("lang") == "ar" && <button
                              class="btn btn_lang_flag px-0 px-md-2 en_lang"
                              onClick={() => (handleLang("en"))}
                            >
                              <img src={en_icon}></img> <span className="lang_name">English</span>
                            </button>}
                            {localStorage.getItem("lang") != "ar" &&<button
                              class="btn btn_lang_flag px-0 px-md-2 ar_lang"
                              onClick={() => (handleLang("ar"))}
                            >
                              <img src={ar_icon}></img> <span className="lang_name">عربي</span>
                            </button>}
                          </li>
                        </ul>
                      </div>

                      <div className="icon-nav mobile_footer-icons">
                        <ul>
                          <li className={"onhover-div mobile-wishlist"}>
                            <div>
                              <Link href={`/page/account/wishlist`}>
                                <div className="onhover-dropdown">
                                  <i
                                    className="mt-1 fa fa-heart"
                                    aria-hidden="true"
                                  ></i>
                                  <div
                                    className="desktop-display"
                                    dangerouslySetInnerHTML={{
                                      __html: svgHeart,
                                    }}
                                  />
                                </div>
                              </Link>
                            </div>
                          </li>

                          <li className={"onhover-div"}>
                            <div className="d-flex">
                              {userLogged && (
                                <div>
                                  <Link
                                    href={{
                                      pathname: "/page/account/login",
                                      query: { prevURL: "/" },
                                    }}
                                  >
                                    <div>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          // here professionals branch
                                          __html: svgAccount,
                                        }}
                                      />
                                    </div>
                                  </Link>
                                </div>
                              )}

                              {!userLogged && (
                                <div>
                                  <Link
                                    href={
                                      user?.data.type === "Vendor"
                                        ? `/page/vendor/vendor-dashboard`
                                        : `/page/account/dashboard`
                                    }
                                  >
                                    <div
                                      className={
                                        " name-container position-relative"
                                      }
                                    >
                                      <h5>{user?.data?.name.charAt(0)}</h5>
                                    </div>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </li>
                          {direction === undefined ? (
                            <CartContainer layout={direction} icon={svgCart} />
                          ) : (
                            <Cart layout={direction} icon={svgCart} />
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <div className={"justify-content-center"}>
                    <div className="mobile-display">
                      <NavBar
                        sidebarView={sidebarView}
                        setSidebarView={setSidebarView}
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="all_nav">
              <Container>
                <NavBar
                  sidebarView={sidebarView}
                  setSidebarView={setSidebarView}
                />
              </Container>
            </div>
          </Col>
        </Row>
      </header>
      <SearchOverlay />
    </div>
  );
};

export default HeaderOne;
