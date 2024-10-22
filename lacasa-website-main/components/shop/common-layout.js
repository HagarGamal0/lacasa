import React, { useEffect } from "react";
import Breadcrubs from "../common/widgets/breadcrubs";
import Helmet from "react-helmet";
import HeaderOne from "../headers/header-one";
import MasterFooter from "../footers/common/MasterFooter";
import Search from "../../pages/layouts/Furniture/components/search";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../helpers/redux/actions/cartActions";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const CommonLayout = ({
  children,
  title,
  parent,
  subTitle,
  innerProduct,
  isCategory,
  removeBreadcrubs,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartList);
  const { cartList } = cartItems;

  useEffect(() => {
    if (!cartList) dispatch(getCart());
  }, [dispatch]);

  const { t } = useTranslation();

  return (
    <div style={{ position: "relative" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          {t("La Casa Egypt")} | {t(title.toUpperCase())}
        </title>
      </Head>
      <HeaderOne topClass="top-header" logoName="logo/full-logo-lacasa.png" />
      <Search />
      {!removeBreadcrubs && (
        <Breadcrubs
          title={t(title)}
          parent={t(parent)}
          isCategory={isCategory}
          subTitle={t(subTitle)}
          innerProduct={innerProduct}
        />
      )}
      {children}
      <MasterFooter
        footerClass={`footer-light`}
        // footerLayOut={"upper-footer"}
        // footerSection={"border-top-0"}
        belowSection={"section-b-space pt-0"}
        newLatter={true}
        logoName={"logo/1.png"}
      />
    </div>
  );
};

export default CommonLayout;
