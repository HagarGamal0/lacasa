import React, { Fragment, useState, useEffect } from "react";
import { Container } from "reactstrap";
import Link from "next/link";
import Slider from "react-slick";
import API from "../../../../helpers/API/API";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import router from "next/router";
const MasterCollectionBanner = ({ img, link, key }) => {
  return (
    <div key={key} className="p-1 ">
      <Link href={link} passHref>
        <a style={{ cursor: "pointer" }} rel="noopener noreferrer">
          <LazyLoadImage
            style={{ borderRadius: "3%" }}
            alt={""}
            effect="blur"
            src={img?.url}
          />
        </a>
      </Link>
    </div>
  );
};

const Collections = ({
  path,
  fullWidth,
  classes,
  rows,
  linkTitle,
  title,
  subTitle,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false,
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
          rows: rows ? rows : 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          rows: rows ? rows : 1,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const [data, setData] = useState([]);
  useEffect(() => {
    API.readAll(path).then((response) => {
      setData(response?.data);
    });
  }, []);

  const lang = localStorage.getItem("lang");
  return (
    <Fragment>
      <Container className={`${classes}`} fluid={fullWidth ? true : false}>
        {title && (
              <div className="title1 section-t-space">
                {subTitle && <h4>{subTitle}</h4>}

              <h2
                className={`title-inner1 ${linkTitle ? "pointer-cursor" : ""}`}
                onClick={() => {
                  if (linkTitle) router.push(`${linkTitle}`);
                }}
              >
                  {title}
                </h2>
              </div>
            )}
        {data?.length > 0 && (
          <>
           
            <Slider {...settings}>
              {data?.map((data) => {
                return (
                  <MasterCollectionBanner
                    key={data.id}
                    img={data.image}
                    link={data?.link.slice(22)}
                  />
                );
              })}
            </Slider>
          </>
        )}
      </Container>
    </Fragment>
  );
};

export default Collections;
