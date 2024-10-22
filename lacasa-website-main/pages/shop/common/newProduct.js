import React, { useContext, useState, useEffect } from "react";
import { Media } from "reactstrap";
import Slider from "react-slick";
import API from "../../../helpers/API/API";
import { useRouter } from "next/router";
import PostLoader from "../../../components/common/PostLoader";
import { useTranslation } from "react-i18next";

const NewProduct = ({ path }) => {
  const router = useRouter();
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
  const clickProductDetail = (slug) => {
    router.push({
      pathname: "/product-details/[id]",
      query: {
        id: slug,
      },
    });
  };
  const { t } = useTranslation();
  return (
    <div className="theme-card">
      <h5 className="title-border end-ar">{t("new product")}</h5>
      <Slider className="offer-slider slide-1">
        <div>
          {!data ||
          !data?.data?.products?.items ||
          data?.data?.products?.items?.length === 0 ? (
            <div
              style={{ height: "300px", overFlow: "hidden" }}
              className="col-xl-12 col-lg-12 col-12"
            >
              <PostLoader />
            </div>
          ) : (
            <>
              {data &&
                data?.data?.products?.items
                  ?.slice(0, 3)
                  .map((product, index) => (
                    <div className="media flex-ar" key={index}>
                      <a
                        href={null}
                        onClick={() => clickProductDetail(product.slug)}
                      >
                        <Media
                          className="img-fluid blur-up lazyload"
                          src={product.images[0]?.url}
                          alt={product.images[0]?.alt}
                        />
                      </a>
                      <div className="media-body align-self-center">
                        {/* <div className="rating">
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>{" "}
                          <i className="fa fa-star"></i>
                        </div> */}
                        <a href={null}>
                          <h6>{product.name}</h6>
                        </a>
                        <del>
                          <h3 style={{ marginTop: "5px", fontSize: "12px" }}>
                            {product.price} EGP
                          </h3>
                        </del>
                        <h4>{product.price_after_sale} EGP</h4>
                      </div>
                    </div>
                  ))}
            </>
          )}
        </div>
        <div>
          {!data ||
          !data?.data?.products?.items ||
          data?.data?.products?.items?.length === 0 ? (
            <div className="col-xl-12 col-lg-12 col-12">
              <PostLoader />
            </div>
          ) : (
            <>
              {data &&
                data.data.products.items.slice(4, 7).map((product, index) => (
                  <div className="media" key={index}>
                    <a
                      href={null}
                      onClick={() => clickProductDetail(product.slug)}
                    >
                      <Media
                        className="img-fluid blur-up lazyload"
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                      />
                    </a>
                    <div className="media-body align-self-center">
                      <a href={null}>
                        <h6>{product.name}</h6>
                      </a>
                      <del>
                        <h3 style={{ marginTop: "5px", fontSize: "12px" }}>
                          {product.price} EGP
                        </h3>
                      </del>
                      <h4>{product.price_after_sale} EGP</h4>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </Slider>
    </div>
  );
};

export default NewProduct;
