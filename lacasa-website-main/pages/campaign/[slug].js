import React, { useState, useEffect } from "react";
import ProductList from "./components/productList";
import { Container, Row } from "reactstrap";
import API from "../../helpers/API/API";
import router from "next/router";
import { ToastContainer } from "react-toastify";
import { helmetJsonLdProp } from "react-schemaorg";
import dynamic from "next/dynamic";
import SectionBanner from "./components/Sectionbanner";
import Head from "next/head";
import { useTranslation } from "react-i18next";

const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);
const ShopByCategory = dynamic(() => import("./components/shopByCategory"));
const Banner = dynamic(() => import("./components/Banner"));
const Collections = dynamic(() => import("./components/Collection"));
const ServiceLayout = dynamic(() =>
  import("../../components/common/Service/service1")
);
const CountDown = dynamic(() => import("./components/CountDown"));

const Campaign = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-deafult", "#d4b196");
  });

  const { t } = useTranslation();

  /* product */
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(router.query.page ? router.query.page : 2);

  useEffect(async () => {
    setIsLoading(true);
    API.readAll(
      `/campaigns/${router.query.slug}?page=${
        router.query.page ? router.query.page : 1
      }&paginate=${
          window.innerWidth < 780 ? 18 : 24
        }`
    )
    .then(async (response) => {
      await setProducts(response);
      await setPage(1);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
    });
  },[
    router.query.page,
  ]);

  return (
    <>
      <Head
        script={[
          helmetJsonLdProp({
            "@context": "https://schema.org",
            "@type": "FurnitureStore",
            name: "La Casa",
            image:
              "Zoom https-- - yellow.place - file - image - thumb - 0 - 0 - 6671 - fmjldivrijuroomn.jpg https://yellow.place/file/image/thumb/0/0/6671/fmjldivrijuroomn.jpg",
            "@id": "https://lacasa-egy.com/",
            url: "https://lacasa-egy.com/",
            telephone: "01063117666",
            address: {
              "@type": "PostalAddress",
              streetAddress: "South Academy Area Z Villa 117",
              addressLocality: "Cairo",
              postalCode: "11865",
              addressCountry: "EG",
              addressRegion: "New Cairo",
            },
            priceRange: "$$$",
            sameAs: [
              "https://www.facebook.com/lacasa.egy2020",
              "https://www.instagram.com/lacasa.egypt/",
            ],
          }),
        ]}
      />
	  <Head>
		<script
			dangerouslySetInnerHTML={{
				__html: `
				window.criteo_q = window.criteo_q || [];
				var deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
				window.criteo_q.push(
					{ event: "setAccount", account: 111775 },
					{ event: "setEmail", email: "" },
					{ event: "setSiteType", type: deviceType},
					{ event: "viewHome" }
				);
				`,
			}}
		/>
	  </Head>
      <CommonLayout
        title={t("Best Furniture & Everything Home Need Online")}
        removeBreadcrubs={true}
      >
        <ShopByCategory dots={true} />
        <Banner classes={"mb-2"} path={"/dynamic/home-slider/items"} />
        <SectionBanner cols={4} path={"/dynamic/promotion/items"} />
        <SectionBanner cols={2} path={"/dynamic/spin-banner/items"} />
        <CountDown />
       
        {/* products */ }
        <section className="section-b-space ratio_asos pt-0">
          <div className="collection-wrapper container">
            <Container>
              <Row className="flex-ar">
                <ProductList
                  isLoading={isLoading}
                  setPage={setPage}
                  page={page}
                  products={products}
                  colClass="p-2 col-xl-3 col-6 col-grid-box"
                  layoutList=""
                />
              </Row>
            </Container>
          </div>
        </section>

        <ServiceLayout sectionClass={"service small-section pb-0"} />

      </CommonLayout>
      <ToastContainer position="bottom-center" closeOnClick autoClose={2000} />
    </>
  );
};
export default Campaign;
