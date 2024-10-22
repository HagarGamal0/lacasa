import React, { useState, useEffect } from "react";
import { Collapse, Label } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { Menu } from "antd";
import "antd/dist/antd.css";
import router from "next/router";
import API from "../../../helpers/API/API";
import { useTranslation } from "react-i18next";

const Brand = () => {
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const toggleCategory = () => setIsBrandOpen(!isBrandOpen);
  const [data, setData] = useState([]);
  const getAll = async () => {
    try {
      const response = await API.readAll(
        `/brands?find[category]=${router.query.category}`
      );
      setData(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAll();
    // API.readAll(`/brands?find[category]=${router.query.category}`)
    //   .then(async (response) => {
    //     await setData(response.data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, [router.query.category]);

  const handleCheckboxChange = (item) => {
    let arr = [...(router.query.brand ? JSON.parse(router.query.brand) : [])];
    if (
      _.includes(router.query.brand ? JSON.parse(router.query.brand) : [], item)
    ) {
      arr = _.without(arr, item);
    } else {
      arr.push(item);
    }
    router.push({
      query: {
        category: router.query.category,
        page: router.query.page,
        free_shipping: router.query.free_shipping,
        brand: JSON.stringify(arr),
      },
    });
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="collection-collapse-block open">
        <h3 className="collapse-block-title" onClick={toggleCategory}>
          {t("Brand")}
        </h3>
        <Collapse isOpen={isBrandOpen}>
          <div>
            <div className="collection-collapse-block-content">
              <div className="collection-brand-filter">
                {data?.map((item) => {
                  return (
                    <div>
                      <input
                        type="checkbox"
                        id="default"
                        className={"mr-2"}
                        defaultChecked={
                          _.includes(
                            router.query.brand
                              ? JSON.parse(router.query.brand)
                              : [],
                            item
                          )
                            ? true
                            : false
                        }
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <Label for="default"> {item}</Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Brand;
