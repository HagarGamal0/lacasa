import React, { useState, useContext } from "react";
import { Collapse } from "reactstrap";
import FilterContext from "../../../helpers/filter/FilterContext";
import { Menu } from "antd";
import "antd/dist/antd.css";
import router from "next/router";
import { useTranslation } from "react-i18next";

const Category = ({ data, sidebarView, closeSidebar }) => {
  const context = useContext(FilterContext);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const setSelectedCategory = context.setSelectedCategory;
  const setSelectedSearch = context.setSelectedSearch;
  const { SubMenu } = Menu;
  const handleClick = (slug) => {
    setSelectedSearch("");
    const pathname = window.location.pathname;
    router.push({
      pathname: pathname,
      query: {
        category: slug,
        tag: router.query.tag ? router.query.tag : "",
        page: 1,
      },
    });
    if (sidebarView) {
      closeSidebar();
    }
  };

  const { t } = useTranslation();

  const list = (category) => {
    return (
      <>
        {category?.childs?.length > 0 ? (
          <>
            <SubMenu key={category.slug} title={category.name}>
              {category?.childs?.map((category, index) => (
                <div key={index}>
                  {category?.childs?.length > 0 ? (
                    list(category)
                  ) : (
                    <Menu.Item onClick={() => handleClick(category.slug)}>
                      {" "}
                      {category.name}
                    </Menu.Item>
                  )}
                </div>
              ))}
            </SubMenu>
          </>
        ) : (
          <Menu.Item>{category.name}</Menu.Item>
        )}
      </>
    );
  };

  return (
    <>
      <div className="collection-collapse-block open">
        <h3 className="collapse-block-title" onClick={toggleCategory}>
          {t("Category")}
        </h3>
        <Collapse isOpen={isCategoryOpen}>
          <div>
            <div className="collection-collapse-block-content">
              <div className="collection-brand-filter">
                {data?.data.map((category, index) => (
                  <Menu key={index} mode="inline">
                    {category.childs.length === 0 ? (
                      <Menu.Item onClick={() => handleClick(category.slug)}>
                        {category.name}
                      </Menu.Item>
                    ) : (
                      list(category)
                    )}
                  </Menu>
                ))}
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default Category;
