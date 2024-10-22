import React, { useRef } from "react";
import { Col, Label } from "reactstrap";
import NewProduct from "./newProduct";
import Category from "./category";
import Brand from "./brand";
import Price from "./price";
import { useSwipeable } from "react-swipeable";
import router from "next/router";
import { useTranslation } from "react-i18next";

const FilterPage = ({
  data,
  sm,
  sidebarView,
  closeSidebar,
  priceRange,
  price,
  setPrice,
}) => {
  const handlers = useSwipeable({ onSwipedLeft: () => closeSidebar() });
  const myRef = useRef();

  const refPassthrough = (el) => {
    handlers.ref(el);
    myRef.current = el;
  };
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang");
  return (
    <>
      <Col
        sm={sm}
        className="collection-filter"
        style={sidebarView ? { left: "0px" } : {}}
      >
        <div
          {...handlers}
          ref={refPassthrough}
          className="collection-filter-block"
        >
          <div
            className="collection-mobile-back"
            onClick={() => closeSidebar()}
          >
            <span style={{ gap: "4px" }} className="filter-back flex-ar">
              <i
                className={`fa ${
                  lang == "en" ? "fa-angle-left" : "fa-angle-right"
                }`}
                aria-hidden="true"
              ></i>{" "}
              <span>{t("back")}</span>
            </span>
          </div>
          <Category
            data={data}
            closeSidebar={closeSidebar}
            sidebarView={sidebarView}
          />
          <Brand />
          <div className="mt-5 collection-collapse-block border-0 open">
            <h3 className="collapse-block-title">{t("Shipping")}</h3>
            <input
              type="checkbox"
              id="default"
              className={"mr-2"}
              defaultChecked={
                router.query.free_shipping ? router.query.free_shipping : false
              }
              onChange={(e) => {
                router.push({
                  query: {
                    category: router.query.category,
                    page: router.query.page,
                    free_shipping: e.target.checked,
                  },
                });
                if (sidebarView) {
                  closeSidebar();
                }
              }}
            />
            <Label for="default"> {t("Free Shipping")}</Label>
          </div>
          <Price
            priceRange={priceRange}
            price={price}
            setPrice={setPrice}
            closeSidebar={closeSidebar}
          />
        </div>
        <NewProduct path={"/frontend/products?paginate=7&sort=-new"} />
        {/* <div className="collection-sidebar-banner">
                    <a href={null}><Media src={sideBanner} className="img-fluid blur-up lazyload" alt="" /></a>
                </div> */}
      </Col>
    </>
  );
};

export default FilterPage;
