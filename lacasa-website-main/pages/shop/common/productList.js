import React, { useState, useContext, useEffect } from "react";
import { Col, Row, Media, Button, Spinner } from "reactstrap";
import ProductItem from "../../../components/common/product-box/ProductBox1";
import { useRouter } from "next/router";
import PostLoader from "../../../components/common/PostLoader";
import CartContext from "../../../helpers/cart";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import ReactPaginate from "react-responsive-pagination";
import Image from "next/image";
import { useTranslation } from "react-i18next";
const ProductList = ({
  products,
  isLoading,
  setSortBy,
  setPage,
  colClass,
  layoutList,
  openSidebar,
  noSidebar,
}) => {
  const cartContext = useContext(CartContext);
  const router = useRouter();
  const quantity = cartContext.quantity;
  const wishlistContext = useContext(WishlistContext);
  const [grid, setGrid] = useState(colClass);
  const [layout, setLayout] = useState(layoutList);

  useEffect(() => {
    const myInterval = setInterval(function () {
      if (
        document.getElementById("pagination")?.firstChild?.classList.length > 0
      ) {
        document
          .getElementById("pagination")
          .firstChild?.classList.remove("pagination");
        clearInterval(myInterval);
      }
    }, 1000);
  }, [document.getElementById("pagination")]);

  const handlePageChange = async (event) => {
    await setPage(event);
    var rangePrice = {};
    if (router.query.min && router.query.max) {
      rangePrice = {
        min: router.query.min,
        max: router.query.max,
      };
    }
    router.push({
      query: {
        category: router.query.category,
        page: event,
        sale: router.query.sale ? router.query.sale : 0,
        search: router.query.search ? router.query.search : "",
        vendor: router.query.vendor ? router.query.vendor : "",
        vendors: router.query.vendors ? router.query.vendors : "",
        products: router.query.products ? router.query.products : "",
        custom_products: router.query.custom_products ? router.query.custom_products : "",
        free_shipping: router.query.free_shipping
          ? router.query.free_shipping
          : "",
        tag: router.query.tag ? router.query.tag : "",
        ...rangePrice,
      },
    });
  };

  const { t } = useTranslation();

  return (
    <Col className="collection-content">
      <div className="page-main-content">
        <Row>
          <Col sm="12">
            <div className="collection-product-wrapper">
              <div className="product-top-filter">
                {!noSidebar ? (
                  <Row>
                    <Col xs="6">
                      <div
                        className="filter-main-btn"
                        onClick={() => openSidebar()}
                      >
                        <span className="filter-btn btn btn-theme">
                          <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                          {t("Filter")}
                        </span>
                      </div>
                    </Col>
                    <Col xs="6">
                      <div className="mobile-display product-filter-content justify-content-between">
                        <div className=" product-page-filter">
                          <select
                            style={{ borderRadius: 5 }}
                            onChange={(e) => setSortBy(e.target.value)}
                          >
                            <option value="" hidden>
                              {t("Sort")}
                            </option>
                            <option value="price">{t("Low To High")}</option>
                            <option value="-price">{t("High To Low")}</option>
                            <option value="-new">{t("Newest")}</option>
                          </select>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
                <Row>
                  <Col>
                    <div className="product-filter-content justify-content-between">
                      <div className="collection-view">
                        <ul>
                          <li>
                            <i
                              className="fa fa-th grid-layout-view"
                              onClick={() => {
                                setLayout("");
                                setGrid("col-lg-4");
                              }}
                            ></i>
                          </li>
                          <li>
                            <i
                              className="fa fa-list-ul list-layout-view"
                              onClick={() => {
                                setLayout("list-view");
                                setGrid("col-lg-12");
                              }}
                            ></i>
                          </li>
                        </ul>
                      </div>
                      <div
                        className="collection-grid-view"
                        style={
                          layout === "list-view"
                            ? { opacity: 0 }
                            : { opacity: 1 }
                        }
                      >
                        <ul>
                          <li>
                            <Media
                              src={`/assets/images/icon/3b.png`}
                              alt=""
                              className="product-3-layout-view"
                              onClick={() => setGrid("col-lg-4")}
                            />
                          </li>
                          <li>
                            <Media
                              src={`/assets/images/icon/4b.png`}
                              alt=""
                              className="product-4-layout-view"
                              onClick={() => setGrid("col-lg-3")}
                            />
                          </li>
                        </ul>
                      </div>
                      <div className=" desktop-display product-page-filter">
                        <select onChange={(e) => setSortBy(e.target.value)}>
                          <option value="" hidden>
                            {t("Sort")}
                          </option>
                          <option value="-price">{t("High To Low")}</option>
                          <option value="price">{t("Low To High")}</option>
                          <option value="-new">{t("Newest")}</option>
                        </select>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={`product-wrapper-grid p-0 ${layout}`}>
                <Row>
                  {/* Product Box */}
                  {!products ||
                  !products?.data.products ||
                  !products?.data.products.items ||
                  products?.data.products.items.length === 0 ||
                  isLoading ? (
                    products &&
                    products?.data.products &&
                    products?.data.products.items &&
                    products?.data.products.items.length === 0 ? (
                      <Col xs="12">
                        <div>
                          <div className="col-sm-12 empty-cart-cls text-center">
                            <Image
                              width={"250%"}
                              height={"300%"}
                              src={`/assets/images/empty-search.jpg`}
                              className="img-fluid mb-4 mx-auto"
                              alt=""
                            />
                            <h3>
                              <strong>{t("No products found")}</strong>
                            </h3>
                            <h4>{t("Explore more shortlist some items")}.</h4>
                          </div>
                        </div>
                      </Col>
                    ) : (
                      <div className="row mx-0 margin-default mt-4">
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid}  col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                        <div className={`${grid} col-6`}>
                          <PostLoader />
                        </div>
                      </div>
                    )
                  ) : (
                    products &&
                    products?.data.products.items.map((product, i) => (
                      <div className={grid} key={i}>
                        <div className="product">
                          <div>
                            <ProductItem
                              product={product}
                              cartClass="cart-info cart-wrap"
                              addWishlist={() =>
                                wishlistContext.addToWish(product)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </Row>
              </div>
              <div className="section-t-space">
                <div className="text-center">
                  <Row>
                    <Col xl="12" md="12" sm="12">
                      <div
                        id={"pagination"}
                        className="typo-content mb-5 d-flex justify-content-center pagination"
                      >
                        <ReactPaginate
                          current={parseInt(router.query.page)}
                          total={products ? products?.meta.last_page : 0}
                          onPageChange={handlePageChange}
                          previousLabel={"<"}
                          nextLabel={">"}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default ProductList;
