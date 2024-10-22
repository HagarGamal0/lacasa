import React, { useEffect, useState, useContext } from "react";
import { Input } from "reactstrap";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { useDispatch, useSelector } from "react-redux";
import ModelProduct from "../../../components/modal/modalProduct";
import { addToCart } from "../../../helpers/redux/actions/cartActions";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import Router from "next/router";
import { useTranslation } from "react-i18next";

const DetailsWithPrice = ({ item, stickyClass, changeColorVar }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartList);
  const { error: errorAddToCart } = cartItems;
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const product = item;
  const wishContext = useContext(WishlistContext);
  const [quantity, setQuantity] = useState(1);
  const [modalState, setModalState] = useState(false);
  const [productsVariants, setProductsVariants] = useState({});
  const { t } = useTranslation();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.sympl.ai/widgets/ecom-prod-dtls/widget.min.js";
    script.async = true;
    script.strategy = "beforeInteractive";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [Router]);

  const handleQtyUpdate = (quantity) => {
    if (quantity >= 1) {
      setQuantity(quantity);
    }
  };

  const handleChange = (e) => {
    const newData = {
      [e.target.name]: JSON.parse(e.target.value),
    };
    setProductsVariants({ ...productsVariants, ...newData });
  };
  console.log(cartItems);
  const onSubmit = async () => {
    dispatch(addToCart(product, quantity, productsVariants));
    setModalState(true);
    console.log("product", product, quantity);
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

  return (
    <div className="end-ar">
      {product?.vendor.id === user?.data.id && (
        <a
          className="mb-3 btn btn-solid"
          href={`/page/vendor/vendor-dashboard?active=2&edit=true&id=${product.id}`}
          target={"_blank"}
        >
          {t("Edit Your Product")}
        </a>
      )}
      {_.findIndex(user?.data.permissions, function (item) {
        return item == "Edit Products";
      }) > 0 && (
        <a
          className="mb-3 btn btn-solid"
          href={`https://dashboard.lacasa-egy.com/products/detail/${
            product?.id
          }?token=${localStorage.getItem("userInfo")}`}
        >
          {t("Edit Product")}
        </a>
      )}
      <div className={`product-right end-ar ${stickyClass}`}>
        <h2 style={{ marginBottom: "0px" }}> {product.name} </h2>
        <h5
          style={{ marginBottom: "10px", marginTop: "0px", fontSize: "14px" }}
        >
          SKU: {product.sku} -{" "}
          <span
            style={{
              background: "var(--theme-deafult)",
              color: "white",
              padding: 3,
              borderRadius: "3px",
            }}
          >
            {t("Produced on Demand")}
          </span>
        </h5>
        {product.brand && (
          <h5
            style={{ marginBottom: "10px", marginTop: "0px", fontSize: "14px" }}
          >
            {t("Brand Name:")}
            <strong
              className={"instock-cls"}
              style={{ fontSize: "16px", textTransform: "capitalize" }}
            >
              {product.brand}
            </strong>
          </h5>
        )}

        {product.stock && product.status === "Published" ? (
          <span className="mb-5 instock-cls">{t("InStock")}</span>
        ) : (
          <span className="mb-5 instock-cls">{t("Out of Stock")}</span>
        )}
        {product.is_free && (
          <span className="mb-5 instock-cls"> - {t("Free Shipping")} </span>
        )}
        <h4 className="mt-2">
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
        <h3>
          {productsVariants?.Size
            ? parseInt(productsVariants.Size.price_after_sale)
                .toFixed(0)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            : product.price_after_sale
                .toFixed(0)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
          EGP
        </h3>
        <div>
          <sympl-widget
            productprice={
              productsVariants?.Size
                ? productsVariants.Size.price_after_sale
                : product.price_after_sale
            }
            storecode={`STR-3107403`}
          ></sympl-widget>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: product.short_description }}
          className="border-product product-desc"
        ></div>
        <div className="product-description border-product end-ar">
          {product.attributes.length > 0 ? (
            <>
              {product.attributes.map((item, index) => (
                <>
                  {item[0].type === "text" ? (
                    <>
                      {item?.map((variant, index) => (
                        <div key={index}>
                          <h6 className="product-title mb-1 mt-3 size-text">
                            {item[0].attribute}
                          </h6>
                          <input
                            type={"number"}
                            name={item[0].attribute}
                            onChange={handleChange}
                            style={{ display: "inline" }}
                            className="form-control"
                            placeholder="Choose color Code"
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>
                      <h6 className="product-title mb-1  size-text">
                        {item[0].attribute}
                      </h6>
                      <select
                        name={item[0].attribute}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="" hidden>
                          t{"Choose"} {item[0].attribute}
                        </option>
                        {item.map((variant, index) => (
                          <>
                            {variant.attribute === "Size" ? (
                              <option
                                value={JSON.stringify(variant)}
                                key={index}
                              >
                                {variant.value} - {variant.price_after_sale} EGP
                              </option>
                            ) : (
                              <option
                                value={JSON.stringify(variant)}
                                key={index}
                              >
                                {variant.value}
                              </option>
                            )}
                          </>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              ))}
              {errorAddToCart ? (
                <p style={{ fontSize: "12px", marginTop: "5px", color: "red" }}>
                  {"Please Choose your variants"}
                </p>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
          <h6 className="product-title mt-3">{t("quantity")}</h6>
          <div style={{ gap: "5px" }} className="qty-box flex-ar">
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
        </div>
        <div style={{ gap: "1px" }} className="product-buttons flex-ar">
          {product.stock && product.status === "Published" ? (
            <button
              onClick={() => onSubmit()}
              type="submit"
              className="btn btn-solid"
            >
              {t("add to cart")}
            </button>
          ) : (
            <button disabled type="submit" className="btn btn-solid">
              {t("Out of Stock")}
            </button>
          )}

          {modalState && !errorAddToCart ? (
            <ModelProduct
              modalState={modalState}
              setModalState={setModalState}
            />
          ) : (
            ""
          )}
          <a
            className="fav-btn btn btn-solid"
            onClick={() => wishContext.addToWish(product)}
          >
            <i className="fa fa-heart" aria-hidden="true"></i>
          </a>
        </div>
        <div className="border-product">
          <h6 className="product-title">{t("product details")}</h6>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="border-product product-desc"
          ></div>
        </div>
      </div>
      <div className="end-ar">
        <FacebookShareButton
          className="mr-2"
          url={`https://lacasa-egy.com/product-details/${product.slug}`}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>

        <TwitterShareButton
          className="mr-2"
          url={`https://lacasa-egy.com/product-details/${product.slug}`}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>

        <LinkedinShareButton
          className="mr-2"
          url={`https://lacasa-egy.com/product-details/${product.slug}`}
        >
          <LinkedinIcon size={32} round={true} />
        </LinkedinShareButton>

        <FacebookMessengerShareButton
          className="mr-2"
          url={`https://lacasa-egy.com/product-details/${product.slug}`}
        >
          <FacebookMessengerIcon size={32} round={true} />
        </FacebookMessengerShareButton>

        <WhatsappShareButton
          className="mr-2"
          url={`https://lacasa-egy.com/product-details/${product.slug}`}
        >
          <WhatsappIcon size={32} round={true} />
        </WhatsappShareButton>

        <TelegramShareButton
          className="mr-2"
          url={`https://lacasa-egy.com/product-details/${product.slug}`}
        >
          <TelegramIcon size={32} round={true} />
        </TelegramShareButton>
      </div>
    </div>
  );
};

export default DetailsWithPrice;
