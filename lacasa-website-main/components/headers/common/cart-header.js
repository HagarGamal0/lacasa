import React, { Fragment, useContext } from "react";
import Link from "next/link";
import { Media } from "reactstrap";
import { useDispatch } from "react-redux";
import { deleteFromCart } from "../../../helpers/redux/actions/cartActions";

const CartHeader = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <Fragment>
      <li style={{ marginBottom: "5px" }}>
        <div className="media">
          <Link href={"/product-details/" + item.slug}>
            <a>
              <Media
                alt=""
                className="mr-3"
                src={`${item?.image ? item.image.url : ""}`}
              />
            </a>
          </Link>
          <div className="media-body">
            <Link href={"/product-details/" + item?.slug}>
              <a>
                <h4 style={{ width: "90%" }}>{item?.name}</h4>
              </a>
            </Link>
            {item.attributes.map((attribute, index) => (
              <p style={{ marginBottom: "5px" }}>
                <span>
                  {attribute.attribute}:{attribute.value}{" "}
                </span>
              </p>
            ))}
            <h4>
              <span>
                {item.quantity} x{" "}
                {parseInt(item.price)
                  .toFixed(0)
                  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                EGP
              </span>
            </h4>
          </div>
        </div>
        <div className="close-circle" style={{ cursor: "pointer" }}>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => dispatch(deleteFromCart(item.id))}
          ></i>
        </div>
      </li>
    </Fragment>
  );
};

export default CartHeader;
