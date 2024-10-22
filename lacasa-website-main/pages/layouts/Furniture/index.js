import React, { useEffect } from "react";
import { Product4 } from "../../../services/script";
import Helmet from "react-helmet";
import { ToastContainer } from "react-toastify";
import { helmetJsonLdProp } from "react-schemaorg";
import dynamic from "next/dynamic";
import SectionBanner from "./components/Sectionbanner";
import HeaderOne from "../../../components/headers/header-one";
import Head from "next/head";
import SectionBottomCollection from "./components/SectionBottomCollection";
import { useTranslation } from "react-i18next";

const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);
const ShopByCategory = dynamic(() => import("./components/shopByCategory"));
const Banner = dynamic(() => import("./components/Banner"));
const Collections = dynamic(() => import("./components/Collection"));
const SpecialProducts = dynamic(() =>
  import("../../../components/common/Collections/TabCollection2")
);
const ServiceLayout = dynamic(() =>
  import("../../../components/common/Service/service1")
);
const MasterFooter = dynamic(() =>
  import("../../../components/footers/common/MasterFooter")
);
const CountDown = dynamic(() => import("./components/CountDown"));

const Furniture = () => {
  useEffect(() => {
    document.documentElement.style.setProperty("--theme-deafult", "#d4b196");
  });

  const { t } = useTranslation();
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
        {/* <Collections rows={2} path={"/dynamic/home-slider-banners/items"} /> */}
        <CountDown />

        {/*Living */}
        <Collections
          classes={"mb-0"}
          subTitle={t("Making Home a Happy Place")}
          title={t("Living Room")}
          path={"/dynamic/living-slider-banners/items"}
          linkTitle={"/shop?category=living-room&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=living-room&sort=random"}
        />

        <SectionBottomCollection
          name="Living_banner"
          path={"/dynamic/bottom-promotional-banner/banners"}
        />

        {/* Selling */}

        <Collections
          classes={"mb-0"}
          subTitle={t("Super Sale Up To 50% off")}
          title={t("Best Selling")}
          path={"/dynamic/bottom-promotional-banner/banners/Best_Selling_card"}
          linkTitle={"/shop?category=steel&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=steel-coffee-tables&page=1&sale=0"}
          path={"/frontend/products?paginate=8&find[tags.name]=steel&sort=random"}
        />
        <SectionBottomCollection
          name="Best_Selling_banner"
          path={"/dynamic/bottom-promotional-banner/banners"}
        />

        {/*Bedrooms */}
        <Collections
          classes={"mb-0"}
          subTitle={t("Transforming Bedrooms Into Blissful Retreats")}
          title={t("Trending Bedroom")}
          path={"/dynamic/bedrooms-slider-banners/items"}
          linkTitle={"/shop?category=bed-rooms&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=bed-rooms&sort=random"}
        />
        <SectionBottomCollection
          name="Bedrooms_banner"
          path={"/dynamic/bottom-promotional-banner/banners"}
        />

        {/*Out Doors */}
        <Collections
          classes={"mb-0"}
          subTitle={t("Outdoor Oasis Redefined")}
          title={t("Outdoor Furniture")}
          path={"/dynamic/bottom-promotional-banner/banners/Outdoors_card"}
          linkTitle={"/shop?category=out-doors&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=out-doors&sort=random"}
        />

        <SectionBottomCollection
          name="Outdoors_banner"
          path={"/dynamic/bottom-promotional-banner/banners"}
        />

        {/* steel */}
        <Collections
          classes={"mb-0"}
          subTitle={t("Blending Elegance Wooden and Steel Table")}
          title={t("Revel in Our Range")}
          path={"/dynamic/bottom-promotional-banner/banners/Steel_card"}
          linkTitle={"/shop?category=steel&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[tags.name]=steel&sort=random"}
        />
        <SectionBottomCollection
          name="Steel_banner"
          path={"/dynamic/bottom-promotional-banner/banners"}
        />

        <Collections
          classes={"mb-0"}
          subTitle={t("Explore Our Stunning Lighting Options")}
          title={t("Hot Deals")}
          path={"/dynamic/bottom-promotional-banner/banners/Hot_Deals_card"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=&page=1&sale=1"}
          path={"/frontend/products?paginate=8&find[is_sale]=1&sort=random"}
        />
        <SectionBottomCollection
          name="Hot_Deals_banner"
          path={"/dynamic/bottom-promotional-banner/banners"}
        />

        {/*Home Decor */}
        {/*  <Collections*/}
        {/*     classes={"mt-4 mb-4"}*/}
        {/*    subTitle={t("Shop Now And Have Up To 70% off")}*/}
        {/*    title={t("Home Decor")}*/}
        {/*    path={"/dynamic/home-decor-slider-banners/items"}*/}
        {/*    linkTitle={"/shop?category=home-decor&page=1"}*/}
        {/*  />*/}
        {/*  <SpecialProducts*/}
        {/*    type={"furniture"}*/}
        {/*    designClass="mb-5 p-t-0 ratio_asos"*/}
        {/*    productSlider={Product4}*/}
        {/*    noSlider="true"*/}
        {/*    cartClass="cart-info cart-wrap"*/}
        {/*    path={"/frontend/products?paginate=8&find[category]=home-decor&sort=random"}*/}
        {/*  />*/}

        {/*  <SectionBottomCollection name="Home_Decor_banner" path={"/dynamic/bottom-promotional-banner/banners"} />*/}

        {/* <Collections
          classes={"mt-4 mb-4"}
          subTitle={"Discount on all products"}
          title={"Up to 500 EGP"}
          path={"/dynamic/bottom-promotional-banner/banners/Up_to_500_EGP_card"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=&page=1&min=0&max=500"}
          path={"/frontend/products?paginate=8&find[is_sale]=1&sort=random&find[price_between]=0,500"}
        />
      <SectionBottomCollection name="Up_to_500_EGP_banner" path={"/dynamic/bottom-promotional-banner/banners"} />  */}

        <ServiceLayout sectionClass={"service small-section pb-0"} />
      </CommonLayout>
      <ToastContainer position="bottom-center" closeOnClick autoClose={2000} />
    </>
  );
};
export default Furniture;
