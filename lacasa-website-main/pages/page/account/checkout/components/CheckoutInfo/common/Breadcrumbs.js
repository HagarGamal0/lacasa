import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";

const Breadcrumb = ({ state, setState }) => {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Breadcrumbs
        separator="›"
        style={{ color: "#CBAE78", marginBottom: "40px" }}
        aria-label="breadcrumb"
      >
        <span
          style={
            state === "cart"
              ? { color: "#000", fontWeight: "800" }
              : { color: "#212020", fontWeight: "300", cursor: "pointer" }
          }
          href="/"
        >
          {t("Cart")}
        </span>
        <span
          onClick={() => {
            setState("shipping");
          }}
          style={
            state === "shipping"
              ? { color: "#000", fontWeight: "800" }
              : { color: "#212020", fontWeight: "300", cursor: "pointer" }
          }
          href="/"
        >
          {t("Shipping")}
        </span>
        <span
          style={
            state === "payment"
              ? { color: "#000", fontWeight: "800" }
              : { color: "#212020", fontWeight: "300" }
          }
        >
          {t("Payment")}
        </span>
      </Breadcrumbs>
    </Grid>
  );
};
export default Breadcrumb;
