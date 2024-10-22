import React from "react";
import { Container, Row, Col } from "reactstrap";
import Slider from "react-slick";
import Link from "next/link";
import Image from "next/image";

const BannerCollection = ({ link }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <>
      <Container>
        <Link href={link}>
          <a>
            <div
              style={{
                padding: "30px",
                width: "100%",
                cursor: "pointer",
                height: "150px",
                background: "#b7cec8",
              }}
            >
              <p
                style={{
                  color: "#540014",
                  fontFamily: "system-ui",
                  fontWeight: "bolder",
                  fontSize: "46px",
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  textTransform: "capitalize",
                }}
              >
                ELECTRONICS{" "}
                <span
                  style={{
                    fontSize: "26px",
                    marginTop: "auto",
                    marginBottom: "auto",
                  }}
                >
                  {" "}
                  &ensp;- UP TO 50% DISCOUNT
                </span>
              </p>
            </div>
          </a>
        </Link>
        <div style={{ width: "100%", height: "auto" }}>
          <Slider {...settings}>
            {data.map((item, index) => {
              return (
                <div key={index} className="d-flex justify-content-center">
                  <div style={{ padding: "20px" }}>
                    <Image
                      style={{ cursor: "pointer" }}
                      src={
                        "https://lacasa.fra1.digitaloceanspaces.com/public/slider_images/lo1ou9-blob"
                      }
                    />
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </Container>
    </>
  );
};
export default BannerCollection;
