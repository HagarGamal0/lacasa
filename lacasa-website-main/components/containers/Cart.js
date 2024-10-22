import React, { Fragment, useState } from "react";
import Link from "next/link";
import { Media } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../helpers/redux/actions/cartActions";

const CartComponent = ({ icon, layout }) => {
  const dispatch = useDispatch();
  const cartItemsa = useSelector((state) => state.cartList);
  const { cart } = cartItemsa;
  console.log("cart", cart);
  const [openSide, setOpenSide] = useState(false);

  return (
    <Fragment>
      {
        <li
          className="onhover-div mobile-cart"
          onClick={() => setOpenSide(true)}
        >
          {cart.items.length > 0 && (
            <div className="cart-qty-cls">{cart.items.length}</div>
          )}
          <div href={null} className="d-flex align-items-center">
            <div dangerouslySetInnerHTML={{ __html: icon }} />
            <i className="fa fa-shopping-cart"></i>
            <span className="cart_mobile_text this ">Cart</span>
          </div>
        </li>
      }
      <div
        id="cart_side"
        className={`add_to_cart ${layout} ${openSide ? "open-side" : ""} `}
      >
        <a href={null} className="overlay"></a>
        <div className="cart-inner">
          <div className="cart_top">
            <h3>my cart</h3>
            <div className="close-cart" onClick={() => setOpenSide(false)}>
              <a href={null}>
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
            </div>
          </div>
          <div className="cart_media">
            <ul className="cart_product">
              {cart.items.length > 0 &&
                cart.items.map((item, index) => (
                  <li key={`cart-popup-${index}`}>
                    <div className="media">
                      <a href={null}>
                        <Media
                          alt=""
                          className="mr-3"
                          src={`${
                            item.images.length > 0 ? item.images[0].url : ""
                          }`}
                        />
                      </a>
                      <div className="media-body">
                        <a href={null}>
                          <h4>{item.title}</h4>
                        </a>
                        <h4>
                          <span>
                            {item.quantity}{" "}
                            {parseInt(item.price)
                              .toFixed(0)
                              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="close-circle">
                      <a
                        href="#"
                        onClick={() => dispatch(deleteFromCart(item.id))}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
            <ul className="cart_total">
              <li>
                <div className="total">
                  <h5>
                    subtotal : <span>${cart.subtotal}</span>
                  </h5>
                </div>
              </li>
              <li>
                <div className="buttons">
                  <Link href="/page/account/cart">
                    <a className="btn btn-solid btn-xs view-cart">view cart</a>
                  </Link>
                  <Link href="/page/account/checkout">
                    <a className="btn btn-solid btn-xs checkout">checkout</a>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CartComponent;
