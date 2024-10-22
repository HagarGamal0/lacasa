import React, { useState } from "react";
import SettingContext from "./SettingContext";
import { config } from "../../components/customizer/config.json";
import { useEffect } from "react";
const SettingProvider = (props) => {
  const [layoutState, setLayoutState] = useState(
    localStorage.getItem("layout") ? localStorage.getItem("layout") : "RTL"
  );
  const [layoutColor, setLayoutColor] = useState("#ff4c3b");
  const layoutFun = (item) => {
    if (item === "RTL") {
      document.body.classList.remove("ltr");
      document.body.classList.add("rtl");
      setLayoutState("LTR");
      localStorage.setItem("layout", "LTR");
    } else {
      document.body.classList.remove("rtl");
      document.body.classList.add("ltr");
      setLayoutState("RTL");
      localStorage.setItem("layout", "RTL");
    }
  };
  useEffect(() => {
    if (layoutState === "RTL") {
      document.body.classList.remove("rtl");
      document.body.classList.add("ltr");
    } else {
      document.body.classList.remove("ltr");
      document.body.classList.add("rtl");
    }
  }, [layoutState]);

  const layoutColorFun = (item) => {
    document.documentElement.style.setProperty(
      "--theme-deafult",
      item.target.value
    );
    config.color = item.target.value;
    setLayoutColor(item.target.value);
  };

  return (
    <SettingContext.Provider
      value={{
        ...props,
        state: layoutState,
        layoutFun: layoutFun,
        layoutColorFun: layoutColorFun,
      }}
    >
      {props.children}
    </SettingContext.Provider>
  );
};

export default SettingProvider;
