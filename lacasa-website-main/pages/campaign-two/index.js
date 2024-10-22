import React from "react";
import { Product4 } from "../../services/script";
import Helmet from "react-helmet";
import { ToastContainer } from "react-toastify";
import { helmetJsonLdProp } from "react-schemaorg";
import dynamic from "next/dynamic";
import SectionBanner from "../layouts/Furniture/components/Sectionbanner";
import SectionBottomCollection from "../layouts/Furniture/components/SectionBottomCollection";
import Head from "next/head";
import { useTranslation } from "react-i18next";
const CountDown = dynamic(() =>
  import("../layouts/Furniture/components/CountDown")
);
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
const CampaignTwo = () => {
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
      <CommonLayout removeBreadcrubs={true} title={"Campaign"} parent="home">
        <Banner
          classes={"mb-4 mt-0"}
          path={"/dynamic/campaign-two-banner/items"}
          fullWidth={false}
        />
        <ShopByCategory child={true} dots={false} />
        <SectionBanner cols={4} path={"/dynamic/promotion/items"} />
        <CountDown />
        <SectionBottomCollection name="Main_banner" path={"/dynamic/campaign-two-b-1/banners"} />

        <Collections
          title={t("Home Decor")}
           classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-two-b-1/banners/Home_Decor_card"}
          linkTitle={"/shop?category=home-decor&page=1"}
        />

        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=home-decor&sort=random"}
        />
        <SectionBottomCollection name="Home_Decor_banner" path={"/dynamic/campaign-two-b-1/banners"} />
       

        <Collections
          title={t("Home Appliances")}
           classes={"mt-4 mb-4"}
          fullWidth={false}
          path={"/dynamic/campaign-two-b-1/banners/Home_Appliances_card"}
          linkTitle={"/shop?category=appliances&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=appliances&sort=random"}
        />

        <SectionBottomCollection name="Home_Appliances_banner" path={"/dynamic/campaign-two-b-1/banners"} />

        <Collections title={t("Bathroom")}  classes={"mt-4 mb-4"} fullWidth={false}  path={"/dynamic/campaign-two-b-1/banners/Bathroom_card"}
        linkTitle={"/shop?category=bathrooms&page=1"} />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=bathrooms&sort=random"}
        />
        <SectionBottomCollection name="Bathroom_banner" path={"/dynamic/campaign-two-b-1/banners"} />


        <Collections title={t("Lighting")}  classes={"mt-4 mb-4"} fullWidth={false} path={"/dynamic/campaign-two-b-1/banners/Lighting_card"} 
        linkTitle={"/shop?category=lighting&page=1"}
        />
        <SpecialProducts
          type={"furniture"}
          designClass="mb-5 p-t-0 ratio_asos"
          productSlider={Product4}
          noSlider="true"
          cartClass="cart-info cart-wrap"
          path={"/frontend/products?paginate=8&find[category]=lighting&sort=random"}
        />
        <SectionBottomCollection name="Lighting_banner" path={"/dynamic/campaign-two-b-1/banners"} />

        <ToastContainer
          position="bottom-center"
          closeOnClick
          autoClose={2000}
        />
      </CommonLayout>
    </>
  );
};
export default CampaignTwo;
