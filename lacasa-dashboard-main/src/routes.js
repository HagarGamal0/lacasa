/* eslint-disable */
import { lazy } from "react";
import { DEFAULT_PATHS } from "config.js";
import Banner from "./views/storefront/banner/Banner";

const dashboard = lazy(() => import("views/dashboard/Dashboard"));
const gallery = lazy(() => import("views/gallery/Gallery"));
const requests = lazy(() => import("views/request/request"));
const login = lazy(() => import("views/default/Login"));

const products = {
  list: lazy(() => import("views/products/list/ProductsList")),
  detail: lazy(() => import("views/products/detail/ProductsDetail")),
  create: lazy(() => import("views/products/create/CreateProduct")),
  bulk: lazy(() => import("views/products/bulk/Bulk")),
};
const categories = {
  list: lazy(() => import("views/categories/list/CategoriesList")),
  detail: lazy(() => import("views/categories/detail/CategoriesDetail")),
  create: lazy(() => import("views/categories/create/CreateCategory")),
};

const roles = {
  list: lazy(() => import("views/roles/list/RolesList")),
  detail: lazy(() => import("views/roles/detail/RolesDetails")),
  create: lazy(() => import("views/roles/create/RolesCreate")),
};
const professionalsCategory = {
  list: lazy(() =>
    import("views/professionalsCategory/list/ProfessionalsCategory")
  ),
  detail: lazy(() =>
    import("views/professionalsCategory/detail/ProfessionalsCategoriesDetail")
  ),
  create: lazy(() =>
    import("views/professionalsCategory/create/ProfessionalsCreateCategory")
  ),
};
const orders = {
  list: lazy(() => import("views/orders/list/OrdersList")),
  analytics: lazy(() => import("views/orders/analytics/analytics")),
  draft: lazy(() => import("views/orders/draft-orders/OrdersList")),
  draftDetails: lazy(() =>
    import("views/orders/draft-orders-detail/OrdersDetail")
  ),
  detail: lazy(() => import("views/orders/detail/OrdersDetail")),
  old: lazy(() => import("views/orders/old-orders-list/OrdersList")),
  oldDetails: lazy(() => import("views/orders/old-orders-detail/OrdersDetail")),
  abandoned: lazy(() =>
    import("views/orders/old-abandoned-orders-list/OrdersList")
  ),
  abandonedDetails: lazy(() =>
    import("views/orders/old-abandoned-orders-detail/OrdersDetail")
  ),
};
const customers = {
  list: lazy(() => import("views/customers/list/CustomersList")),
  detail: lazy(() => import("views/customers/detail/CustomersDetail")),
};
const vendors = {
  list: lazy(() => import("views/vendors/list/VendorList")),
  detail: lazy(() => import("views/vendors/detail/VendorDetail")),
  create: lazy(() => import("views/vendors/create/CreateVendor")),
  vendorproduct: lazy(() =>
    import("views/vendors/detail/components/VendorProductsList")
  ),
};
const professionals = {
  list: lazy(() => import("views/professionals/list/ProfessionalsList")),
  detail: lazy(() => import("views/professionals/detail/ProfessionalsDetail")),
  create: lazy(() => import("views/professionals/create/CreateProfessional")),
};

const storefront = {
  adbanner: (props) => (
    <Banner
      {...props}
      titleProp="Ad Banners"
      linkProp="/dynamic/ad-banners/items"
    />
  ),
  spinbanner: (props) => (
    <Banner
      {...props}
      titleProp="Spin Banners"
      linkProp="/dynamic/spin-banners/items"
    />
  ),
  homebanner: (props) => (
    <Banner
      {...props}
      titleProp="Home Banners"
      linkProp="/dynamic/home-slider/items"
    />
  ),
  homecarousel: (props) => (
    <Banner
      {...props}
      titleProp="Home Carousel"
      linkProp="/dynamic/home-slider-banners/items"
    />
  ),
  bottomadbanner: (props) => (
    <Banner
      {...props}
      titleProp="Bottom Ad Banners"
      linkProp="/dynamic/bad-banners/items"
    />
  ),
  prombanner: (props) => (
    <Banner
      {...props}
      titleProp="Promotional Banners"
      linkProp="/dynamic/promotion/items"
    />
  ),
  bottomprombanner: (props) => (
    <Banner
      {...props}
      titleProp="Bottom Promotional Banners"
      linkProp="/dynamic/bottom-promotional-banner/items"
    />
  ),
  landingpage: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Banners"
      linkProp="/dynamic/black-friday-banner/items"
    />
  ),
  landingpagec1: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Carousel"
      linkProp="/dynamic/bf-col-1/items"
    />
  ),
  landingpagec2: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Carousel"
      linkProp="/dynamic/bf-col-2/items"
    />
  ),
  landingpagec3: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Carousel"
      linkProp="/dynamic/bf-col-3/items"
    />
  ),
  landingpageb1: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Banner"
      linkProp="/dynamic/bf-b-1/items"
    />
  ),
  landingpageb2: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Banner"
      linkProp="/dynamic/bf-b-2/items"
    />
  ),
  landingpageb3: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Banner"
      linkProp="/dynamic/bf-b-3/items"
    />
  ),
  landingpageb4: (props) => (
    <Banner
      {...props}
      titleProp="Landing Page Banner"
      linkProp="/dynamic/bf-b-4/items"
    />
  ),
  carouselv1: (props) => (
    <Banner
      {...props}
      titleProp="Carousel V1"
      linkProp="/dynamic/carousel-v1/items"
    />
  ),
  carouselv2: (props) => (
    <Banner
      {...props}
      titleProp="Carousel V2"
      linkProp="/dynamic/carousel-v2/items"
    />
  ),
  livingcarousel: (props) => (
    <Banner
      {...props}
      titleProp="Living Carousel"
      linkProp="/dynamic/living-slider-banners/items"
    />
  ),
  homedecor: (props) => (
    <Banner
      {...props}
      titleProp="Home Decor"
      linkProp="/dynamic/home-decor-slider-banners/items"
    />
  ),
  bedroom: (props) => (
    <Banner
      {...props}
      titleProp="Bedrooms"
      linkProp="/dynamic/bedrooms-slider-banners/items"
    />
  ),

  campaignonebanner: (props) => (
    <Banner
      {...props}
      titleProp="Campaign One"
      linkProp="/dynamic/campaign-one-banner/items"
    />
  ),
  cobannerone: (props) => (
    <Banner
      {...props}
      titleProp="Banner One"
      linkProp="/dynamic/campaign-one-b-1/items"
    />
  ),
  cocollectionone: (props) => (
    <Banner
      {...props}
      titleProp="Collection One"
      linkProp="/dynamic/campaign-one-col-1/items"
    />
  ),
  cocollectiontwo: (props) => (
    <Banner
      {...props}
      titleProp="Collection Two"
      linkProp="/dynamic/campaign-one-col-2/items"
    />
  ),
  cocollectionthree: (props) => (
    <Banner
      {...props}
      titleProp="Collection Three"
      linkProp="/dynamic/campaign-one-col-3/items"
    />
  ),
  cocollectionfour: (props) => (
    <Banner
      {...props}
      titleProp="Collection Four"
      linkProp="/dynamic/campaign-one-col-4/items"
    />
  ),
  cocollectionfive: (props) => (
    <Banner
      {...props}
      titleProp="Collection Five"
      linkProp="/dynamic/campaign-one-col-5/items"
    />
  ),

  campaigntwobanner: (props) => (
    <Banner
      {...props}
      titleProp="Campaign Two"
      linkProp="/dynamic/campaign-two-banner/items"
    />
  ),
  cobannertwo: (props) => (
    <Banner
      {...props}
      titleProp="Banner One"
      linkProp="/dynamic/campaign-two-b-1/items"
    />
  ),
  ctcollectionone: (props) => (
    <Banner
      {...props}
      titleProp="Collection One"
      linkProp="/dynamic/campaign-two-col-1/items"
    />
  ),
  ctcollectiontwo: (props) => (
    <Banner
      {...props}
      titleProp="Collection Two"
      linkProp="/dynamic/campaign-two-col-2/items"
    />
  ),
  ctcollectionthree: (props) => (
    <Banner
      {...props}
      titleProp="Collection Three"
      linkProp="/dynamic/campaign-two-col-3/items"
    />
  ),
  ctcollectionfour: (props) => (
    <Banner
      {...props}
      titleProp="Collection Four"
      linkProp="/dynamic/campaign-two-col-4/items"
    />
  ),
  ctcollectionfive: (props) => (
    <Banner
      {...props}
      titleProp="Collection Five"
      linkProp="/dynamic/campaign-two-col-5/items"
    />
  ),
  countdown: lazy(() => import("views/storefront/countdown/countdown")),
  notification: lazy(() =>
    import("views/storefront/notification/Notification")
  ),
};
const shipping = {
  home: lazy(() => import("views/shipping/Shipping")),
  details: lazy(() => import("views/shipping/detail/ShippingDetail")),
  create: lazy(() => import("views/shipping/ShippingCreate")),
  bulk: lazy(() => import("views/shipping/Bulk")),
};
const reviews = {
  home: lazy(() => import("views/reviews/list/ReviewsList")),
};

const discount = {
  coupons: lazy(() => import("views/discount/Coupons/Coupons")),
  couponDetail: lazy(() =>
    import("views/discount/Coupons/CouponDetails/CouponDetails")
  ),
  wheel: lazy(() => import("views/discount/Wheel/Wheel")),
};

const appRoot = DEFAULT_PATHS.APP.endsWith("/")
  ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length)
  : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/login`,
    },
    {
      path: `${appRoot}/login`,
      component: login,
      label: "Logout",
      icon: "logout",
    },
    {
      path: `${appRoot}/dashboard`,
      component: dashboard,
      label: "menu.dashboard",
      icon: "dashboard-1",
    },
    {
      path: `${appRoot}/gallery`,
      component: gallery,
      label: "Gallery",
      icon: "brush",
    },

    {
      path: `${appRoot}/requests`,
      component: requests,
      label: "Requests",
      icon: "brush",
    },

    {
      path: `${appRoot}/products`,
      exact: true,
      redirect: true,
      to: `${appRoot}/products/list`,
      label: "menu.products",
      icon: "box",
      subs: [
        { path: "/list", label: "menu.list", component: products.list },
        { path: "/create", label: "Add", component: products.create },
        { path: "/bulk", label: "Bulk Actions", component: products.bulk },
        { path: "/detail/:id", component: products.detail },
      ],
    },
    {
      path: `${appRoot}/reviews`,
      component: discount,
      label: "Reviews",
      icon: "star",
      subs: [{ path: `/list`, label: "List", component: reviews.home }],
    },
    {
      path: `${appRoot}/orders`,
      exact: true,
      redirect: true,
      to: `${appRoot}/orders/list`,
      label: "menu.orders",
      icon: "cart",
      subs: [
        {
          path: "/order-analytics",
          label: "Analytics",
          component: orders.analytics,
        },
        { path: "/list", label: "menu.list", component: orders.list },
        {
          path: "/draft/list",
          label: "New Abandoned Orders",
          component: orders.draft,
        },
        { path: "/draft/detail/:id", component: orders.draftDetails },
        { path: "/detail/:id", component: orders.detail },
        {
          path: "/abandoned/list",
          label: "Old Abandoned Orders",
          component: orders.abandoned,
        },
        { path: "/abandoned/detail/:id", component: orders.abandonedDetails },
        { path: "/old/list", label: "Old Orders", component: orders.old },
        { path: "/old/detail/:id", component: orders.oldDetails },
      ],
    },
    {
      path: `${appRoot}/categories`,
      exact: true,
      redirect: true,
      to: `${appRoot}/categories/list`,
      label: "menu.categories",
      icon: "grid-5",
      subs: [
        { path: "/list", label: "menu.list", component: categories.list },
        { path: "/create", label: "Create", component: categories.create },
        { path: "/detail/:id", component: categories.detail },
      ],
    },
    {
      path: `${appRoot}/users`,
      exact: true,
      redirect: true,
      to: `${appRoot}/users/list`,
      label: "menu.users",
      icon: "user",
      subs: [
        { path: "/list", label: "menu.list", component: customers.list },
        { path: `/detail/:id`, component: customers.detail },
      ],
    },
    {
      path: `${appRoot}/vendors`,
      exact: true,
      redirect: true,
      to: `${appRoot}/vendors/list`,
      label: "Vendors",
      icon: "shop",
      subs: [
        { path: "/list", label: "menu.list", component: vendors.list },
        { path: `/detail/:id`, component: vendors.detail },
        { path: `/create`, label: "Create", component: vendors.create },
        { path: `/vendor-product/:id`, component: vendors.vendorproduct },
      ],
    },
    {
      path: `${appRoot}/professionals`,
      exact: true,
      redirect: true,
      to: `${appRoot}/professionals/list`,
      label: "Professionals",
      icon: "brush",
      subs: [
        { path: "/list", label: "menu.list", component: professionals.list },
        { path: `/detail/:id`, component: professionals.detail },
        { path: `/create`, component: professionals.create },
		{ path: `${appRoot}/professionals-category`, exact: true, redirect: true, to: `${appRoot}/professionals-category/list`, label: "Categories", component: professionals.create },
      ],
    },
    {
      path: `${appRoot}/professionals-category`,
      exact: true,
      redirect: true,
      to: `${appRoot}/professionals-category/list`,
      subs: [
        {
          path: "/list",
          component: professionalsCategory.list,
        },
        {
          path: "/create",
          component: professionalsCategory.create,
        },
        { path: "/detail/:id", component: professionalsCategory.detail },
      ],
    },
    {
      path: `${appRoot}/storefront`,
      exact: true,
      redirect: true,
      to: `${appRoot}/storefront/home`,
      label: "Banners",
      icon: "screen",
      subs: [
        {
          path: "/adbanner",
          label: "Ad Banner",
          component: storefront.adbanner,
        },
        {
          path: "/spinbanners",
          label: "Spin Banner",
          component: storefront.spinbanner,
        },
        {
          path: "/homebanner",
          label: "Home Banner",
          component: storefront.homebanner,
        },
        {
          path: "/homecarousel",
          label: "Home Crousel",
          component: storefront.homecarousel,
        },
        {
          path: "/badbanners",
          label: "Bottom Ad Banners",
          component: storefront.bottomadbanner,
        },
        {
          path: "/prombanner",
          label: "Promotional Banners",
          component: storefront.prombanner,
        },
        {
          path: "/bottomprombanner",
          label: "Bottom Promotional Banners",
          component: storefront.bottomprombanner,
        },
        {
          path: "/lpbanner",
          label: "Landing Page Banners",
          component: storefront.landingpage,
        },
        {
          path: "/lpc1banner",
          label: "Landing Page Carousel 1",
          component: storefront.landingpagec1,
        },
        {
          path: "/lpc2banner",
          label: "Landing Page Carousel 2",
          component: storefront.landingpagec2,
        },
        {
          path: "/lpc3banner",
          label: "Landing Page Carousel 3",
          component: storefront.landingpagec3,
        },
        {
          path: "/lpb1banner",
          label: "Landing Page Banner 1",
          component: storefront.landingpageb1,
        },
        {
          path: "/lpb2banner",
          label: "Landing Page Banner 2",
          component: storefront.landingpageb2,
        },
        {
          path: "/lpb3banner",
          label: "Landing Page Banner 3",
          component: storefront.landingpageb3,
        },
        {
          path: "/lpb4banner",
          label: "Landing Page Banner 4",
          component: storefront.landingpageb4,
        },
        {
          path: "/carouselv1",
          label: "Carousel V1",
          component: storefront.carouselv1,
        },
        {
          path: "/carouselv2",
          label: "Carousel V2",
          component: storefront.carouselv2,
        },
        {
          path: "/living-carousel",
          label: "Living Carousel",
          component: storefront.livingcarousel,
        },
        {
          path: "/home-decor",
          label: "Home Decor",
          component: storefront.homedecor,
        },
        { path: "/bedrooms", label: "Bedroom", component: storefront.bedroom },
        {
          path: "/countdown",
          label: "Count Down",
          component: storefront.countdown,
        },
        {
          path: "/notification",
          label: "Top Notification",
          component: storefront.notification,
        },
      ],
    },
    {
      path: `${appRoot}/campaign-one`,
      exact: true,
      redirect: true,
      label: "Campaign One",
      icon: "screen",
      subs: [
        {
          path: "/banner",
          label: "Campaign One Banner",
          component: storefront.campaignonebanner,
        },
        {
          path: "/banner-one",
          label: "Banner one",
          component: storefront.cobannerone,
        },
        {
          path: "/collection-one",
          label: "Collection One",
          component: storefront.cocollectionone,
        },
        {
          path: "/collection-two",
          label: "Collection Two",
          component: storefront.cocollectiontwo,
        },
        {
          path: "/collection-three",
          label: "Collection Three",
          component: storefront.cocollectionthree,
        },
        {
          path: "/collection-four",
          label: "Collection Four",
          component: storefront.cocollectionfour,
        },
        {
          path: "/collection-five",
          label: "Collection Five",
          component: storefront.cocollectionfive,
        },
      ],
    },
    {
      path: `${appRoot}/campaign-two`,
      exact: true,
      redirect: true,
      label: "Campaign Two",
      icon: "screen",
      subs: [
        {
          path: "/banner",
          label: "Campaign Two Banner",
          component: storefront.campaigntwobanner,
        },
        {
          path: "/banner-one",
          label: "Banner one",
          component: storefront.cobannertwo,
        },
        {
          path: "/collection-one",
          label: "Collection One",
          component: storefront.ctcollectionone,
        },
        {
          path: "/collection-two",
          label: "Collection Two",
          component: storefront.ctcollectiontwo,
        },
        {
          path: "/collection-three",
          label: "Collection Three",
          component: storefront.ctcollectionthree,
        },
        {
          path: "/collection-four",
          label: "Collection Four",
          component: storefront.ctcollectionfour,
        },
        {
          path: "/collection-five",
          label: "Collection Five",
          component: storefront.ctcollectionfive,
        },
      ],
    },
    {
      path: `${appRoot}/shipping`,
      exact: true,
      redirect: true,
      to: `${appRoot}/shipping/list`,
      label: "menu.shipping",
      icon: "shipping",
      subs: [
        { path: `/list`, label: "menu.list", component: shipping.home },
        { path: `/create`, label: "create", component: shipping.create },
        { path: `/bulk`, label: "bulk", component: shipping.bulk },
        { path: `/details/:id`, component: shipping.details },
      ],
    },
    {
      path: `${appRoot}/discount`,
      component: discount,
      label: "menu.discount",
      icon: "tag",
      subs: [
        { path: `/coupons`, label: "Coupons", component: discount.coupons },
        { path: `/coupon/detail/:id`, component: discount.couponDetail },
        { path: `/wheel`, label: "Wheel", component: discount.wheel },
      ],
    },

    {
      path: `${appRoot}/roles`,
      component: roles,
      label: "Roles",
      icon: "lock-on",
      subs: [
        { path: `/list`, label: "List", component: roles.list },
        { path: `/create`, label: "Create", component: roles.create },
        { path: `/edit/:id`, component: roles.detail },
      ],
    },
  ],
  sidebarItems: [],
};
export default routesAndMenuItems;
