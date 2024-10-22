import React, { useState, useEffect, useRef } from "react";
import Service from "../common/service";
import NewProduct from "../../shop/common/newProduct";
import Slider from "react-slick";
import ImageZoom from "../common/image-zoom";
import DetailsWithPrice from "../common/detail-price";
import { Container, Row, Col, Media } from "reactstrap";
import API from "../../../helpers/API/API";
import PostLoader from "../../../components/common/PostLoader";
import { helmetJsonLdProp } from "react-schemaorg";
import { Helmet } from "react-helmet";
import ProductSection from "../common/product_section";
import ProductReview from "../ProductReview";
import Head from "next/head";

const LeftSidebarPage = ({ path, pathId, setTitle }) => {
  const [infinite, setInfinite] = useState();
  const [data, setData] = useState();
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    API.read(path, pathId)
      .then((response) => {
        if(response.data?.status != "Published") {
          return {
            notFound: true
          }
        }

        import("react-facebook-pixel")
          .then((x) => x.default)
          .then((ReactPixel) => {
            ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
            ReactPixel.track("ViewContent", {
              contents: [
                {
                  id: response.data?.id,
                  title: response.data?.name,
                  price: response.data?.price_after_sale,
                  image_link: response.data?.images[0]?.url,
                },
              ],
            });
          });
          setData(response);
          window.gtag("event", "view_item", {
            items: [
              {
                item_id: response?.data?.id,
                item_name: response?.data?.name,
                discount: +response?.data?.discount,
                item_brand: response?.data?.brand ?? "",
                item_category:
                  response?.data?.categories?.map((cat) => {
                    return {
                      category_id: cat.id,
                      category_name: cat.name,
                    };
                  }) ?? "",
                item_image: response?.data?.images?.[0]?.url ?? "",
                price: response?.data?.price,
                price_after_discount: response?.data?.price_after_sale,
              },
            ],
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pathId]);

  const [state, setState] = useState({ nav1: null, nav2: null });
  const slider1 = useRef();
  const slider2 = useRef();

  useEffect(() => {
    setTitle(data?.data?.name);
    if (data?.data?.images?.length <= 3) {
      setInfinite(false);
    } else {
      setInfinite(true);
    }
  }, [data]);

  var productsnav = {
    slidesToShow: 3,
    swipeToSlide: true,
    arrows: false,
    dots: false,
    focusOnSelect: true,
    infinite: infinite,
  };

  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, [data]);

  const { nav1, nav2 } = state;

  const changeColorVar = (img_id) => {
    slider2.current.slickGoTo(img_id);
  };

  const handleChangeImage = (index) => {
    setImageIndex(index);
  };
  return (
    <>
      {data ? (
        <Head
          script={[
            helmetJsonLdProp({
              id: `${data?.data?.id}`,
              title: `${data?.data?.name}`,
              price: `${data?.data?.price_after_sale}`,
              description: `${data?.data?.description}`,
              image_link: `${data?.data?.images[0]?.url}`,
            }),
          ]}
        />
      ) : (
        ""
      )}
      <section className="">
        <div className="collection-wrapper">
          <Container>
            <Row className="flex-ar">
              <Col sm="3" className="collection-filter">
                {/* <Filter /> */}
                <Service />
                {/* <!-- side-bar single product slider start --> */}
                <NewProduct path={"/frontend/products?paginate=7&sort=-new"} />
                {/* <!-- side-bar single product slider end --> */}
              </Col>
              <Col lg="9" sm="12" xs="12">
                <Container fluid={true}>
                  {!data || !data?.data || data?.data.length === 0 ? (
                    <div className="col-xl-12 col-lg-12 col-12">
                      <PostLoader />
                    </div>
                  ) : (
                    <Row>
                      <Col lg="6" className="product-thumbnail">
                        <ImageZoom
                          isZoom={window.innerWidth > 1024 ? true : false}
                          image={data?.data.images[imageIndex]}
                        />
                        <Slider
                          className="slider-nav"
                          {...productsnav}
                          asNavFor={nav1}
                          ref={(slider) => (slider2.current = slider)}
                        >
                          {data
                            ? data?.data.images.map((vari, index) => (
                                <div key={index}>
                                  <Media
                                    onClick={() => handleChangeImage(index)}
                                    style={{ height: "100px" }}
                                    src={`${vari.url}`}
                                    key={index}
                                    alt={vari.alt}
                                    className="img-fluid"
                                  />
                                </div>
                              ))
                            : ""}
                        </Slider>
                      </Col>
                      <Col lg="6" className="rtl-text">
                        <DetailsWithPrice
                          item={data.data}
                          changeColorVar={changeColorVar}
                        />
                        <ProductReview data={data?.data} />
                      </Col>
                    </Row>
                  )}
                </Container>
              </Col>
            </Row>
          </Container>
          <ProductSection pathId={pathId} />
        </div>
      </section>
    </>
  );
};

export default LeftSidebarPage;
