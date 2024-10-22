import React from "react";
import { useTranslation } from "react-i18next";
import SpecialProducts from "../../../components/common/Collections/TabCollection2";
import { Product4 } from "../../../services/script";
const ProductSection = ({ pathId }) => {
  const { t } = useTranslation();
  return (
    <section className="section-b-space ratio_asos">
      <SpecialProducts
        type={"furniture"}
        designClass="section-b-space mb-5 p-t-0 ratio_asos"
        productSlider={Product4}
        noSlider="true"
        cartClass="cart-info cart-wrap"
        title={t("Related Prodcuts")}
        innerProduct={true}
        path={`/products/${pathId}/similar`}
      />
      <SpecialProducts
        type={"furniture"}
        designClass="section-b-space mb-5 p-t-0 ratio_asos"
        productSlider={Product4}
        noSlider="true"
        cartClass="cart-info cart-wrap "
        title={t("Customers Also Viewed")}
        innerProduct={true}
        path={"/frontend/products?paginate=8&sort=-sales"}
      />
    </section>
  );
};

export default ProductSection;
