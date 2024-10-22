import React, { useContext } from "react";
import { Container, Row, Col, Table } from "reactstrap";
import { WishlistContext } from "../../../../helpers/wishlist/WishlistContext";
import CartContext from "../../../../helpers/cart/index";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const WishlistPage = () => {
  const router = useRouter();
  const context = useContext(WishlistContext);
  const cartContext = useContext(CartContext);

  const wishlist = context.wishlistItems;
  const removeFromWish = context.removeFromWish;
  const addCart = cartContext.addToCart;
  const { t } = useTranslation();
  return (
    <>
      {wishlist.length >= 0 ? (
        <section className="wishlist-section section-b-space">
          <Container>
            <Row>
              <Col sm="12">
                <table className="table cart-table table-responsive-xs">
                  <thead>
                    <tr className="table-head">
                      <th scope="col">{t("image")}</th>
                      <th scope="col">{t("product name")}</th>
                      <th scope="col">{t("price")}</th>
                      <th scope="col">{t("action")}</th>
                    </tr>
                  </thead>
                  {wishlist.map((item, i) => (
                    <tbody key={i}>
                      <tr>
                        <td>
                          <a href={`/product-details/${item.slug}`}>
                            <img src={item.images[0].url} alt="" />
                          </a>
                        </td>
                        <td>
                          <a href={`/product-details/${item.slug}`}>
                            {item.name}
                          </a>
                          <Row className="mobile-cart-content">
                            <div className="col-xs-3">
                              <h2 className="td-color">
                                {item.price_after_sale
                                  .toFixed(0)
                                  .replace(
                                    /(\d)(?=(\d{3})+(?!\d))/g,
                                    "$1,"
                                  )}{" "}
                                EGP
                              </h2>
                            </div>
                            <div className="col-xs-3">
                              <h2
                                className="td-color"
                                style={{ display: "flex" }}
                              >
                                {" "}
                                <a href="#" className="icon mr-1">
                                  <i
                                    className="fa fa-trash"
                                    onClick={() => removeFromWish(item)}
                                  ></i>
                                </a>
                              </h2>
                            </div>
                          </Row>
                        </td>
                        <td>
                          <h2>
                            {item.price_after_sale
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                            EGP
                          </h2>
                        </td>
                        <td>
                          <a
                            href={null}
                            className="icon"
                            onClick={() => removeFromWish(item)}
                          >
                            <i className="fa fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </Col>
            </Row>
            <Row className="wishlist-buttons">
              <Col sm="12">
                <Link
                  href={{ pathname: "/shop", query: { category: "", page: 1 } }}
                >
                  <a href={null} className="btn btn-solid">
                    {t("continue shopping")}
                  </a>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        ""
      )}
    </>
  );
};

export default WishlistPage;
