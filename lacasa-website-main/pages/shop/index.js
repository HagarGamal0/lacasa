import React, { useState, useEffect, useContext } from "react";
import CommonLayout from "../../components/shop/common-layout";
import ProductList from "./common/productList";
import { Container, Row } from "reactstrap";
import FilterPage from "./common/filter";
import { ToastContainer } from "react-toastify";
import FilterContext from "../../helpers/filter/FilterContext";
import Slider from "react-slick";
import API from "../../helpers/API/API";
import router from "next/router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Link from "next/link";

const LeftSidebar = () => {
  const context = useContext(FilterContext);
  const [data, setData] = useState();
  const [sidebarView, setSidebarView] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState(
    router.query.sort ? router.query.sort : ""
  );
  const selectedPrice = context.selectedPrice;
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(router.query.page ? router.query.page : 1);
  const [price, setPrice] = useState({
    min: router.query.min ? router.query.min : 0,
    max: router.query.max ? router.query.max : 500000,
  });
  const [categoryStatus, setCategoryStatus] = useState("");
  const [banner, setBanner] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: categories?.length < 8 ? categories?.length : 8,
    slidesToScroll: 4,
    arrows: false,
    responsive: [
      {
        breakpoint: 1367,
        settings: {
          slidesToShow: categories?.length < 4 ? categories?.length : 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: categories?.length < 4 ? categories?.length : 4,
          slidesToScroll: 4,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: categories?.length < 4 ? categories?.length : 4,
          slidesToScroll: 4,
        },
      },
    ],
  };

  const openCloseSidebar = () => {
    if (sidebarView) {
      setSidebarView(!sidebarView);
    } else {
      setSidebarView(!sidebarView);
    }
  };

  useEffect(() => {
    API.readAll("/categories")
      .then(async (response) => {
        await setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    API.read("/categories", router.query.category)
      .then(async (response) => {
        if (router.query.category === "") {
          setBanner(false);
          await setCategories(response?.data);
        } else {
          setBanner(response?.data.banner ? response?.data.banner : false);
          console.log(router.query.category.includes("*"));
          if (router.query.category.includes("*")) {
            setCategories(response?.data);
          } else {
            console.log(response?.data);
            setCategories(response?.data.childs);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [router.query.category]);

  useEffect(async () => {
    setIsLoading(true);
    var newObj = {};
    if (router.query.new) {
      newObj = {
        sort: "-new",
      };
    }
      API.readAll(
        `/frontend/products?${router.query.category?'find[category]='+ router.query.category : ''}&page=${
          router.query.page ? router.query.page : 1
        }&paginate=${
          window.innerWidth < 780 ? 18 : 24
        }&sort=${sortBy}&find[is_free_shipping]=${
          router.query.free_shipping ? router.query.free_shipping : ""
        }&find[search]=${
          router.query.search ? router.query.search : ""
        }&find[is_sale]=${
          router.query.sale ? router.query.sale : ""
        }&find[price_between]=${
          router.query.min ? router.query.min : selectedPrice?.min
        },${
          router.query.max ? router.query.max : selectedPrice?.max
        }&find[vendor.name]=${
          router.query.vendor ? encodeURIComponent(router.query.vendor) : ""
        }&find[vendors]=${
          router.query.vendors ? encodeURIComponent(router.query.vendors) : ""
        }&find[products]=${
          router.query.products ? encodeURIComponent(router.query.products) : ""
        }&find[custom_products]=${
          router.query.custom_products
            ? encodeURIComponent(router.query.custom_products)
            : ""
        }
        &find[tags.name]=${
          router.query.tag ? router.query.tag : ""
        }&find[brand]=${
          router.query.brand
            ? router.query.brand
                .replace("[", "")
                .replace("]", "")
                .replaceAll('"', "")
            : ""
        }`
      )
        .then(async (response) => {
          await setPriceRange(response.meta.price_range);
          await setPrice(response.meta.price_range);
          await setProducts(response);
          await setPage(1);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    setCategoryStatus(router.query.category);
  }, [
    router.query.category,
    router.query.free_shipping,
    router.query.search,
    selectedPrice,
    sortBy,
    router.query.page,
    router.query.sale,
    router.query.brand,
  ]);

  const handlecategory = async (slug) => {
    if (router.query.sale === "1") {
      router.push({ query: { category: slug, page: 1, sale: 1 } });
    } else {
      router.push({ query: { category: slug, page: 1 } });
    }
  };

  return (
    <>
      {sidebarView && (
        <div
          className="filter-close-container"
          onClick={() => openCloseSidebar()}
        />
      )}
      <CommonLayout
        removeBreadcrubs={true}
        title={
          router.query.category === ""
            ? "All Categories"
            : `${router.query.category} ${
                router.query.sale === "1" ? `Sale` : ""
              }`
        }
        parent="home"
      >
        <section
          className="section-b-space ratio_asos"
          style={{ paddingTop: "0px" }}
        >
          <div className="collection-wrapper container">
            {banner ? (
              <Container className={"p-0"}>
                <Link href={"/shop?category=&page=1&sale=0&tag=bf-fs"}>
                  <img
                    style={
                      window.innerWidth < 450
                        ? {
                            height: "100%",
                            marginBottom: "10px",
                            cursor: "pointer",
                            borderRadius: "10px",
                          }
                        : {
                            borderRadius: "10px",
                            height: "100%",
                            marginBottom: "20px",
                            cursor: "pointer",
                          }
                    }
                    className={"section-coll-container"}
                    alt={""}
                    src={banner}
                  />
                </Link>
              </Container>
            ) : (
              ""
            )}
            <Container>
              <div>
                {categories?.length > 0 ? (
                  <div className="mb-4">
                    <Slider {...settings}>
                      {categories?.map((item, index) => (
                        <div className="d-flex justify-content-center category-img-container">
                          <div className="mx-2 category_index">
                            <LazyLoadImage
                              alt={""}
                              onClick={() => handlecategory(item.slug)}
                              effect="blur"
                              src={item.image}
                            />
                            <h1>{item.name}</h1>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <Row className="flex-ar">
                <FilterPage
                  data={data}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  price={price}
                  setPrice={setPrice}
                  sm="3"
                  sidebarView={sidebarView}
                  closeSidebar={() => openCloseSidebar(sidebarView)}
                />
                <ProductList
                  isLoading={isLoading}
                  setSortBy={setSortBy}
                  sortBy={sortBy}
                  setPage={setPage}
                  page={page}
                  products={products}
                  setPriceRange={setPriceRange}
                  colClass="p-2 col-xl-4 col-6 col-grid-box"
                  layoutList=""
                  openSidebar={() => openCloseSidebar(sidebarView)}
                />
                <ToastContainer
                  position="bottom-left"
                  closeOnClick
                  autoClose={2000}
                />
              </Row>
            </Container>
          </div>
          {/* <MasterFooter
                        footerClass={`footer - light`}
                        footerLayOut={"light-layout upper-footer"}
                        footerSection={"small-section border-section border-top-0"}
                        belowSection={"section-b-space light-layout"}
                        newLatter={true}
                        logoName={"logo/1.png"}
                    /> */}
        </section>
      </CommonLayout>
    </>
  );
};

export default LeftSidebar;
