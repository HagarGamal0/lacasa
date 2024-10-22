import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import Slider from "react-slick";
import Link from "next/link";
import API from "../../../../helpers/API/API";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const shopByCategory = ({ title, child, dots }) => {
  const [data, setData] = useState();
  useEffect(() => {
    API.readAll("/categories")
      .then((response) => {
        if (child) {
          let arr = response.data?.filter(
            (item) => item.name.toLocaleLowerCase() != "sectional sofas"
          );
          let sectionalSofas = response.data?.find(
            (item) => item.name?.toLocaleLowerCase() == "sectional sofas"
          );
          if (sectionalSofas) arr.splice(1, 0, sectionalSofas);
          setData(getChildsCategories(arr));
        } else {
          let arr = response.data?.filter(
            (item) => item.name.toLocaleLowerCase() != "sectional sofas"
          );
          let sectionalSofas = response.data?.find(
            (item) => item.name?.toLocaleLowerCase() == "sectional sofas"
          );
          if (sectionalSofas) arr.splice(1, 0, sectionalSofas);

          setData(arr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getChildsCategories = (data) => {
    const arr = [];
    data.map((category) => {
      if (category.childs) {
        category.childs.map((child) => {
          if (child.childs.length > 0) {
            getChildsCategories(child.childs);
          } else {
            arr.push(child);
          }
        });
      }
    });
    return arr;
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 8,
    arrows: true,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 6,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
    ],
  };

  return (
    <div className={"mb-3"}>
      {!title ? (
        ""
      ) : (
        <div className="title1 section-t-space">
          <h2 className="title-inner1">{title}</h2>
        </div>
      )}
      <Container fluid={false}>
        <Row>
          <Col className="p-0 slider-dots mt-2" md={12}>
            {data?.length > 0 ? (
              <Slider {...settings}>
                {data?.map((item, index) => (
                  <Link
                    href={{
                      pathname: "/shop",
                      query: {
                        category: item.slug,
                        page: 1,
                      },
                    }}
                    key={item.id}
                    passHref
                  >
                    <a rel="noopener noreferrer">
                      <div
                        key={index}
                        className=" d-flex justify-content-center category-img-container"
                      >
                        <div className="mx-2 category_index">
                          <LazyLoadImage
                            alt={""}
                            effect="blur"
                            src={item.image}
                          />
                          <h1 className="font-ar">{item.name}</h1>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </Slider>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default shopByCategory;
