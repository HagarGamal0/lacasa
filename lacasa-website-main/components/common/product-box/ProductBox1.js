import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Container,
} from "reactstrap";
import LogoImage from "../../../public/assets/images/furniture/2.jpg";
import freeShipping from "../../../public/assets/images/free-shipping.png";
import SaleImage from "../../../public/assets/images/saleImage.png";
import Truncate from "react-truncate";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import ModelProduct from "../../modal/modalProduct";
import ImageZoom from "../../../pages/product-details/common/image-zoom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../helpers/redux/actions/cartActions";
import { useTranslation } from "react-i18next";

const ProductItem = ({ product, addWishlist, cartClass }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartList);
  const { error } = cartItems;
  const [infinite, setInfinite] = useState();
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState("");
  const [modal, setModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [productsVariants, setProductsVariants] = useState({});

  const lang = localStorage.getItem("lang");

  var productsnav = {
    slidesToShow: 3,
    swipeToSlide: true,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    infinite: infinite,
  };

  const toggle = () => {
    setQuantity(1);
    setModal(!modal);
  };

  useEffect(() => {
    if (product.images.length <= 3) {
      setInfinite(false);
    } else {
      setInfinite(true);
    }
  }, []);

  useEffect(() => {
    setImage(product.images[0]?.url);
  }, [product]);

  const handleQtyUpdate = (quantity) => {
    if (quantity >= 1) {
      setQuantity(quantity);
    }
  };

  const clickProductDetail = (e) => {
    router.push({
      pathname: "/product-details/[id]",
      query: {
        id: product.slug,
        category: router.query.category ? router.query.category : "",
      },
    });
  };

  const onSubmit = async () => {
    dispatch(addToCart(product, quantity, productsVariants));
    setModalState(true);
    window.gtag("event", "add_to_cart", {
      currency: "EGP",
      items: [
        {
          item_id: product?.id,
          item_name: product?.name,
          discount: +product?.discount,
          item_brand: product?.brand ?? "",
          item_category:
            product?.categories?.map((cat) => {
              return {
                category_id: cat.id,
                category_name: cat.name,
              };
            }) ?? "",
          item_image: product?.images?.[0]?.url ?? "",
          price: product?.price,
          price_after_discount: product?.price_after_sale,
          quantity: quantity,
        },
      ],
    });
  };

  const handleChangeImage = (index) => {
    setImageIndex(index);
  };

  const handleChange = (e) => {
    const newData = {
      [e.target.name]: JSON.parse(e.target.value),
    };
    setProductsVariants({ ...productsVariants, ...newData });
  };

  const { t } = useTranslation();
  return (
    <div className="p-0 p-md-2 product-box product-wrap">
      <div
        style={{
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
          borderRadius: 10,
          marginBottom: 1,
          marginTop: 1,
        }}
        className={"position-relative p-3 p-md-4 bg-white"}
      >
        {product.discount > 0 ? (
          <span className="lable3">
            <Media src={SaleImage} />
          </span>
        ) : (
          ""
        )}
        <div className="img-wrapper">
          <div className="lable-block">
            {product.is_free ? <Media src={freeShipping} /> : ""}
          </div>
          <div className="front">
            <a
              href={`/product-details/${product.slug}?category=${
                router.query.category ? router.query.category : ""
              }`}
            >
              <LazyLoadImage
                alt={""}
                effect="blur"
                src={`${image ? image : LogoImage}`}
              />
            </a>
          </div>
          <div className={cartClass}>
            <a href={null} title="Add To Wishlist" onClick={addWishlist}>
              <i className="mb-2 fa fa-heart" aria-hidden="true"></i>
            </a>
            <a href={null} title="Quick View" onClick={toggle}>
              <i className="fa fa-eye" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div className="title5 pt-3">
          <h4>
            <Truncate lines={1} width={110}>
              {product.name}
            </Truncate>
          </h4>
          <div className="mt-1 d-sm-flex justify-content-center">
            <h3 className="discount mb-2 mr-1">
              {product.price_after_sale
                .toFixed(0)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
              EGP
            </h3>
            {product.discount > 0 ? (
              <h3>
                <del>
                  {product.price
                    .toFixed(0)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                  EGP
                </del>
              </h3>
            ) : (
              <br />
            )}
          </div>
          <div className="mt-2 d-flex justify-content-between">
            {product.stock && product.status === "Published" ? (
              <div
                style={{ width: "100%" }}
                className="d-flex justify-content-between"
              >
                {product.attributes.length > 0 ? (
                  <a
                    style={{ width: "100%" }}
                    className={`btn btn-solid`}
                    onClick={toggle}
                  >
                    {t("Add to cart")}
                  </a>
                ) : (
                  <a
                    style={{ width: "100%" }}
                    className={`btn btn-solid `}
                    onClick={() => {
                      onSubmit();
                    }}
                  >
                    {t("Add to cart")}
                  </a>
                )}
              </div>
            ) : (
              <>
                <button
                  style={{ width: "100%" }}
                  className={`btn btn-solid`}
                  disabled
                >
                  {t("Out Of Stock")}{" "}
                </button>
              </>
            )}
            {modalState && !error ? (
              <ModelProduct
                modalState={modalState}
                setModalState={setModalState}
              />
            ) : (
              ""
            )}
          </div>
        </div>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className="modal-lg quickview-modal"
          centered
        >
          <ModalHeader toggle={toggle}></ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="6" xs="12">
                <Container fluid={true}>
                  <Row>
                    <Col lg="12" className="product-thumbnail end-ar">
                      <ImageZoom
                        isZoom={false}
                        image={product?.images[imageIndex]}
                      />
                      {product.images.length > 1 ? (
                        <Slider
                          className="slider-nav"
                          {...productsnav}
                          asNavFor={slider1}
                          ref={(slider) => setSlider2(slider)}
                        >
                          {product.images.map((vari, index) => (
                            <div key={index} className="flex-ar">
                              <Media
                                onClick={() => handleChangeImage(index)}
                                style={{ height: "100px" }}
                                src={`${vari.url}`}
                                key={index}
                                alt={vari.alt}
                                className="img-fluid"
                              />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                </Container>
              </Col>
              <Col lg="6" className="rtl-text end-ar">
                <div className="product-right end-ar">
                  <h2 className="end-ar"> {product.name} </h2>
                  <h4 className="mt-2 end-ar">
                    {product.discount <= 0 ? (
                      ""
                    ) : (
                      <del>
                        {productsVariants?.Size
                          ? parseInt(productsVariants.Size.price)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                          : product.price
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                        EGP
                      </del>
                    )}
                  </h4>
                  <h3 className="end-ar">
                    {productsVariants?.Size
                      ? parseInt(productsVariants.Size.price_after_sale)
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                      : product.price_after_sale
                          .toFixed(0)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                    EGP
                  </h3>
                  <div className="border-product">
                    <h6 className="product-title end-ar">
                      {t("product details")}
                    </h6>
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                      className="border-product end-ar"
                    ></div>
                  </div>
                  <div className="product-description end-ar">
                    <div className="product-description border-product">
                      {product.attributes.length > 0 ? (
                        <>
                          {product.attributes.map((item, index) => (
                            <div key={index}>
                              {item[0].type === "text" ? (
                                <>
                                  {item?.map((variant, index) => (
                                    <div key={index}>
                                      <h6 className="product-title mb-1 mt-3 size-text">
                                        {t(item[0].attribute)}
                                      </h6>
                                      <input
                                        type={"number"}
                                        name={item[0].attribute}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Choose color Code"
                                      />
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <div>
                                  <h6 className="product-title mb-1  end-ar size-text">
                                    {t(item[0]?.attribute)}
                                  </h6>
                                  <select
                                    name={item[0].attribute}
                                    onChange={handleChange}
                                    className="form-control end-ar"
                                  >
                                    <option value="" hidden>
                                      {t("Choose")} {t(item[0].attribute)}
                                    </option>

                                    {item.map((variant, index) => (
                                      <option
                                        value={JSON.stringify(variant)}
                                        key={index}
                                      >
                                        {variant.value}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          ))}
                          {error ? (
                            <p
                              style={{
                                fontSize: "12px",
                                marginTop: "5px",
                                color: "red",
                              }}
                            >
                              {t("Please Choose your variants")}
                            </p>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        ""
                      )}

                      {product.stock && product.status === "Published" && (
                        <>
                          <h6 className="product-title">{t("quantity")}</h6>

                          <div className="qty-box flex-ar">
                            <div className="input-group">
                              <span className="input-group-prepend">
                                <button
                                  type="button"
                                  className="btn quantity-left-minus"
                                  onClick={() => handleQtyUpdate(quantity - 1)}
                                  data-type="minus"
                                  data-field=""
                                >
                                  <i className="fa fa-angle-left"></i>
                                </button>
                              </span>
                              <Input
                                disabled
                                type="text"
                                name="quantity"
                                value={quantity}
                                className="form-control input-number"
                              />
                              <span className="input-group-prepend">
                                <button
                                  type="button"
                                  className="btn quantity-right-plus"
                                  onClick={() => handleQtyUpdate(quantity + 1)}
                                  data-type="plus"
                                  data-field=""
                                >
                                  <i className="fa fa-angle-right"></i>
                                </button>
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="product-buttons">
                    {product.stock && product.status === "Published" ? (
                      <>
                        <button
                          type="submit"
                          className="btn btn-solid"
                          onClick={onSubmit}
                        >
                          {t("add to cart")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button className={`btn btn-solid`} disabled>
                          {t("Out Of Stock")}{" "}
                        </button>
                      </>
                    )}
                    <a className="btn btn-solid" onClick={clickProductDetail}>
                      {t("View detail")}
                    </a>
                  </div>
                </div>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default ProductItem;
