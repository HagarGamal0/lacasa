import React, { useContext } from "react";
import router from "next/router";
import { Modal, ModalBody, ModalFooter, Button } from "reactstrap";
import CartHeader from "../headers/common/cart-header";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
const ModelProduct = ({ modalState, setModalState }) => {
  const cartItemsa = useSelector((state) => state.cartList);
  const { cart } = cartItemsa;

  const toggle = () => setModalState(false);
  const { t } = useTranslation();

  return (
    <Modal isOpen={modalState} toggle={toggle} centered>
      <ModalBody className="p-4">
        {cart?.items.length > 0 ? (
          <div className="model-Checkout">
            <ul className="show-div shopping-cart">
              {cart?.items.map((item, index) => (
                <CartHeader key={index} item={item} />
              ))}
            </ul>
          </div>
        ) : (
          <li>
            <h5>{t("Your cart is currently empty.")}</h5>
          </li>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          style={{ cursor: "pointer" }}
          className="btn-solid "
          color="secondary"
          onClick={toggle}
        >
          {t("Continue shopping")}
        </Button>
        {cart?.items.length > 0 ? (
          <a
            style={{ cursor: "pointer" }}
            className="btn btn-solid "
            onClick={() => {
              router.push("/page/account/cart"); 
            }}
            color="secondary"
          >
            {t("Cart")}
          </a>
        ) : (
          ""
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ModelProduct;
