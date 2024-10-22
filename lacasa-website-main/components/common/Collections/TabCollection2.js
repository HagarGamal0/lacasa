import React, { useState, useContext, useEffect } from "react";
import ProductItem from "../product-box/ProductBox1";
import { Container } from "reactstrap";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import PostLoader from "../PostLoader";
import API from "../../../helpers/API/API";
import Slider from "react-slick";
import router from "next/router";
import { useTranslation } from "react-i18next";
const TabContent = ({
  data,
  loading,
  cartClass,
  startIndex,
  endIndex,
  innerProduct,
}) => {
  const wishListContext = useContext(WishlistContext);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    cssEase: "linear",
    autoplaySpeed: 10000,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const { t } = useTranslation();
  return (
    <>
      <div className="no-slider">
        {!data?.data ||
        !data?.data.products ||
        !data?.data.products.items ||
        data?.data.products.items.length === 0 ||
        loading ? (
          data?.data &&
          data?.data.products &&
          data?.data.products.items &&
          data?.data.products.items.length === 0 ? (
            <div xs="12">
              <div>
                <div className="col-sm-12 empty-cart-cls text-center">
                  <img
                    src={`/static/images/empty-search.jpg`}
                    className="img-fluid mb-4 mx-auto"
                    alt=""
                  />
                  <h3>
                    <strong>{t("Your Cart is Empty")}</strong>
                  </h3>
                  <h4>{t("Explore more shortlist some items.")}</h4>
                </div>
              </div>
            </div>
          ) : (
            <div className="row mx-5 margin-default">
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
              <div className="col-xl-3 col-lg-4 col-6">
                <PostLoader />
              </div>
            </div>
          )
        ) : (
          <div>
            <Slider {...settings} className="slide-1 Product-home-slider">
              {data?.data.products.items.slice(0, 8).map((product, i) => (
                <div>
                  <ProductItem
                    product={product}
                    key={i}
                    addWishlist={() => wishListContext.addToWish(product)}
                    cartClass={cartClass}
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </>
  );
};

const SpecialProducts = ({
  type,
  designClass,
  cartClass,
  noTitle,
  linkTitle,
  title,
  subTitle,
  innerProduct,
  path,
}) => {
  const [activeTab, setActiveTab] = useState(type);
  const [data, setData] = useState();
  useEffect(() => {
    API.readAll(path)
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
      <section className={designClass}>
        <Container>
          <div className="title1 section-t-space p-0">
            {subTitle && <h4>{subTitle}</h4>}
            {!title ? (
              ""
            ) : (
              <h2
                className={`title-inner1 ${linkTitle ? "pointer-cursor" : ""}`}
                onClick={() => {
                  if (linkTitle) router.push(`${linkTitle}`);
                }}
              >
                {title}
              </h2>
            )}
          </div>
          <TabContent
            data={data}
            cartClass={cartClass}
            innerProduct={innerProduct}
          />
        </Container>
      </section>
    </div>
  );
};

export default SpecialProducts;
