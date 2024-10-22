import React from "react";
import { useTranslation } from "react-i18next";
import MasterServiceContent from "../../../components/common/Service/MasterServiceConternt";
import {
  svgFreeShipping,
  svgservice,
  svgoffer,
  svgpayment,
} from "../../../services/script";
const Data = [
  {
    link: svgFreeShipping,
    title: "fast shipping",
    service: "fast shipping all over egypt",
  },
  {
    link: svgservice,
    title: "24 X 7 service",
    service: "online service for new customer",
  },
  {
    link: svgoffer,
    title: "festival offer",
    service: "new online special festival offer",
  },
  {
    link: svgpayment,
    title: "online payment",
    service: "new online special festival offer",
    lastChild: true,
  },
];

const Service = () => {
  const { t } = useTranslation();
  return (
    <div className="collection-filter-block">
      <div className="product-service">
        {Data.map((data, index) => {
          return (
            <MasterServiceContent
              key={index}
              link={data.link}
              title={t(data.title)}
              service={t(data.service)}
              lastChild={data.lastChild}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Service;
