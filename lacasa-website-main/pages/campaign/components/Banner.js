import React, { useEffect, Fragment, useLayoutEffect } from "react";
import Slider from "react-slick";
import API from "../../../helpers/API/API";
import { useState } from "react";
import { Container } from "reactstrap";
import dynamic from "next/dynamic";

const MasterBanner = dynamic(() => import("./MasterBanner"));

const Banner = ({ path, classes, image, fullWidth }) => {
  const [data, setData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const settingsBanner = {
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  useEffect(() => {
    API.readAll(`${path}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useLayoutEffect(() => {
    if (window.innerWidth > 1024) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);

  return (
    <Fragment>
      <Container className={`${classes}`} fluid={fullWidth ? true : false}>
        {data?.length > 0 && (
          <Slider {...settingsBanner} className="slide-1 home-slider">
            {data?.map((data, i) => {
              return (
                <MasterBanner
                  key={i}
                  img={
                    image
                      ? image
                      : isMobile && data.mobile_image
                      ? data.mobile_image?.url
                      : data.image?.url
                  }
                  link={data.link.slice(22)}
                  title={data.title}
                  desc={data.description}
                  fullWidth={fullWidth}
                  classes={"text-left"}
                />
              );
            })}
          </Slider>
        )}
      </Container>
    </Fragment>
  );
};

export default Banner;
