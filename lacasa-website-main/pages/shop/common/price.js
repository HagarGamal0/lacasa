import React, { useState, useContext, useEffect } from "react";
import InputRange from "react-input-range";
import FilterContext from "../../../helpers/filter/FilterContext";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const Price = ({ priceRange, setPrice, price }) => {
  const context = useContext(FilterContext);
  const setSelectedPrice = context.setSelectedPrice;

  const { t } = useTranslation();
  return (
    <div className="collection-collapse-block border-0 open">
      <h3 className="collapse-block-title">{t("price")}</h3>
      <div className="collection-collapse-block-content">
        <div className="wrapper mt-3">
          <div style={{ zIndex: "100" }} className="range-slider">
            <InputRange
              maxValue={priceRange?.max}
              minValue={priceRange?.min}
              value={price}
              onChange={(price) => {
                setPrice(price);
              }}
              onChangeComplete={(price) => {
                setSelectedPrice(price);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Price;
