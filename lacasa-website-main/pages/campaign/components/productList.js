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
  setPage,
  colClass,
  layoutList,
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
        slug: router.query.slug,
        page: event
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
