import React from "react";
import { Product4 } from "../../services/script";
import Helmet from "react-helmet";
import { ToastContainer } from "react-toastify";
import { helmetJsonLdProp } from "react-schemaorg";
import dynamic from "next/dynamic";
import SectionBanner from "../layouts/Furniture/components/Sectionbanner";
import SectionBottomCollection from "../layouts/Furniture/components/SectionBottomCollection";
const CountDown = dynamic(() =>
  import("../layouts/Furniture/components/CountDown")
);
import Head from "next/head";
import { useTranslation } from "react-i18next";
const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);
const ShopByCategory = dynamic(() =>
  import("../layouts/Furniture/components/shopByCategory")
);
const Banner = dynamic(() => import("../layouts/Furniture/components/Banner"));
const Collections = dynamic(() =>
  import("../layouts/Furniture/components/Collection")
);
const SpecialProducts = dynamic(() =>
  import("../../components/common/Collections/TabCollection2")
);

const CampaignOne = () => {
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          {t("La Casa Egypt | Best Furniture & Everything Home Need Online")}
        </title>
      </Head>
      <CommonLayout
        removeBreadcrubs={true}
        title={t("Campaign")}
        parent={t("home")}
      >
        <Banner
          classes={"mb-4 mt-0"}
          path={"/dynamic/campaign-one-banner/items"}
          fullWidth={false}
        />
        <ShopByCategory child={true} dots={false} />
        <SectionBanner cols={4} path={"/dynamic/promotion/items"} />
        <CountDown />
        <SectionBottomCollection name="Main_banner" path={"/dynamic/campaign-one-b-1/banners"} />
        <Collections
          title={t("Living Rooms")}
          classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-one-col-1/items"}
          linkTitle={"/shop?category=living&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=living&page=1&sale=0"}
          path={"/frontend/products?paginate=8&find[category]=living&sort=random"}
        />

         <SectionBottomCollection name="Living_Rooms_banner" path={"/dynamic/campaign-one-b-1/banners"} />


         <Collections
          title={t("Dining Rooms")}
          classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-one-col-4/items"}
          linkTitle={"/shop?category=dining-rooms&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=dining-rooms&page=1&sale=0"}
          path={"/frontend/products?paginate=8&find[category]=dining-rooms&sort=random"}
        />
        <SectionBottomCollection name="Dining_Rooms_banner" path={"/dynamic/campaign-one-b-1/banners"} />



        <Collections
          title={t("Bedrooms")}
          classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-one-col-2/items"}
          linkTitle={"/shop?category=bedrooms&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=bedrooms&page=1&sale=0"}
          
          path={"/frontend/products?paginate=8&find[category]=bedrooms&sort=random"}
        />

        
        <SectionBottomCollection name="Bedrooms_banner" path={"/dynamic/campaign-one-b-1/banners"} />

        <Collections
          title={t("Essential Buys")}
          classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-one-col-3/items"}
          linkTitle={"/shop?category=kids-furniture&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=kids-furniture&page=1&sale=0"}
          path={
            "/frontend/products?paginate=8&find[category]=kids-furniture&sort=random"
          }
        />
         <SectionBottomCollection name="Essential_Buys_banner" path={"/dynamic/campaign-one-b-1/banners"} />


        <Collections
          title={t("Limited Time Mega Deals")}
          classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-one-col-5/items"}
          linkTitle={"/shop?category=offices&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          linkTitle={"/shop?category=offices&page=1&sale=0"}
          path={"/frontend/products?paginate=8&find[category]=offices&sort=random"}
        />
         <SectionBottomCollection name="Limited_Time_Mega_Deals_banner" path={"/dynamic/campaign-one-b-1/banners"} />

        <ToastContainer
          position="bottom-center"
          closeOnClick
          autoClose={2000}
        />
      </CommonLayout>
    </>
  );
};
export default CampaignOne;
