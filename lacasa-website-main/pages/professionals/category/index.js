import React, { useEffect, useState } from "react";
import API from "../../../helpers/API/API";
import dynamic from "next/dynamic";
import ReactPaginate from "react-responsive-pagination";
import { useRouter } from "next/router";
import { CardBody, Container } from "reactstrap";
import { Card, CardMedia, Box, Typography } from "@mui/material";
import Link from "next/link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Slider from "react-slick";
const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);

const CardChild = ({ data }) => {
  return (
    <Card sx={{ width: "200px" }}>
      <CardMedia
        sx={{ objectFit: "cover !important" }}
        component="img"
        alt="green iguana"
        height={"120"}
        image={data.image || "/assets/images/1.jpg"}
      />
      <CardBody sx={{ p: 1 }}>
        <Typography noWrap sx={{ textAlign: "center", p: "0px" }}>
          {data.name}
        </Typography>
      </CardBody>
    </Card>
  );
};

const Professionals = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  const settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    API.readAll(`/designers/categories?include=childs&paginate=1000`).then(
      (res) => {
        setCategories(res.data);
      }
    );
  }, []);

  return (
    <CommonLayout title={"Professionals"} parent="home">
      <Container>
        {categories.map((category) => {
          return (
            <Box sx={{ mt: 5 }}>
              <Typography
                variant="h1"
                sx={{
                  mb: 2,
                  fontSize: { xs: "20px", md: "32px" },
                  fontWeight: "500",
                }}
              >
                {category.name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: { xs: "nowrap", md: "wrap" },
                  overflow: "auto",
                }}
              >
                {category.childs.map((item) => {
                  return (
                    <Box
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        router.push(`/professionals?category=${item.id}`);
                      }}
                    >
                      <CardChild data={item} />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Container>
    </CommonLayout>
  );
};
export default Professionals;
