import React, { useEffect, useState } from "react";
import "../public/assets/scss/app.scss";
import TapTop from "../components/common/widgets/Tap-Top";
import CartContextProvider from "../helpers/cart/CartContext";
import { WishlistContextProvider } from "../helpers/wishlist/WishlistContext";
import FilterProvider from "../helpers/filter/FilterProvider";
import Helmet from "react-helmet";
import { Provider } from "react-redux";
import store from "../helpers/redux/store";
import router, { useRouter } from "next/router";
import AuthUser from "../helpers/AuthUser/AuthUser";
import favicon from "../public/assets/images/favicon/1.png";
import Head from "next/head";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "i18next";
import enTranslation from "/public/locales/en.json";
import arTranslation from "/public/locales/ar.json";

const FacebookPixel = () => {
  React.useEffect(async () => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.FACEBOOb_PIXEL_ID);
        ReactPixel.pageView();
        router.events.on("routeChangeComplete", () => {
          ReactPixel.pageView();
        });
      });
    const handleRouteChange = (url) => {
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);
  }, [router.events]);
  return null;
};
function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setlang] = useState("en");
  useEffect(async () => {
    if (JSON.parse(localStorage.getItem("addresses"))?.length > 0) {
      var address = JSON.parse(localStorage.getItem("addresses"));
      localStorage.setItem(
        "addresses",
        JSON.stringify(address?.filter((e) => e.first_name && e.street))
      );
    } else {
      localStorage.removeItem("addresses");
    }
    const path = window.location.pathname.split("/");
    const url = path[path.length - 1];
    if (
      (url === "login" ||
        url === "register" ||
        url === "forget-pwd" ||
        url === "reset") &&
      localStorage.getItem("userInfo")
    ) {
      router.push("/");
    } else if (url === "dashboard" && !localStorage.getItem("userInfo")) {
      router.push("/page/account/login");
    } else if (
      url === "dashboard" &&
      localStorage.getItem("isVendor") === "true"
    ) {
      router.push("/page/vendor/vendor-dashboard");
    } else if (
      url === "vendor-dashboard" &&
      localStorage.getItem("isVendor") === "false" &&
      localStorage.getItem("userInfo")
    ) {
      router.push("/page/account/dashboard");
    } else if (
      url === "vendor-dashboard" &&
      !localStorage.getItem("userInfo")
    ) {
      router.push({
        pathname: "/page/account/login",
        query: { active: 4 },
      });
    }
    setTimeout(function () {
      setIsLoading(false);
    }, 300);
  }, []);

  const router = useRouter();

  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: enTranslation, // Use English translations
      },
      ar: {
        translation: arTranslation, // Use Arabic translations
      },
    },
    lng: lang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
  const [query, setQuery] = useState();

  useEffect(() => {
    setlang(localStorage.getItem("lang")); // Check if the "lang" query parameter is missing
    if (!router.query.lang) {
      // Append "lang=en" to the current URL
      const { pathname, query, asPath } = router;
      const q = query;
      query.lang = localStorage.getItem("lang") || "en";

      // router.replace({ pathname, query }, undefined, {
      //   shallow: true,
      // });
    }
  }, [router.query]);

  return (
    <>
      {isLoading ? (
        <div className="loader-wrapper">
          <div className="loader">{/* <Loader /> */}</div>
        </div>
      ) : (
        <>
          <Head>
            <link rel="icon" type="image/x-icon" href={favicon} />
            <title>
              {lang == "en"
                ? "La Casa Egypt | Best Furniture & Everything Home Need Online"
                : "لاكاسا مصر | أفضل أثاث وكل أحتياجات المنزل من خلال الانترنت"}
            </title>
          </Head>
          <div>
            <Provider store={store}>
              <AuthUser>
                <CartContextProvider>
                  <WishlistContextProvider>
                    <FilterProvider>
                      <I18nextProvider i18n={i18n}>
                        <Component {...pageProps} />
                      </I18nextProvider>
                      <FacebookPixel />
                    </FilterProvider>
                  </WishlistContextProvider>
                </CartContextProvider>
              </AuthUser>
            </Provider>
            <TapTop />
          </div>
        </>
      )}
    </>
  );
}
export default MyApp;
