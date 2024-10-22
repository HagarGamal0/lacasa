const withImages = require("next-images");
const { withPlugins } = require("next-compose-plugins");

console.log(process.env.API_KEY);
const nextConfig = {
  env: {
    // NEXT_APP_BASE_URL: "https://api.lacasa.tacverse.com/v1",
    NEXT_APP_BASE_URL: "http://localhost:8000/v1",
    FACEBOOb_PIXEL_ID: process.env.FACEBOOb_PIXEL_ID,
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
    //API_KEY: process.env.FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.FIREBASE_APP_ID,
  },
  images: {
    disableStaticImages: true,
  },
  webpack5: true,
};

module.exports = {
  async rewrites() {
    return [
      {
        source: "/:lang/:path*",
        destination: "/:path*",
      },
      {
        source: "/_next/image/:path*",
        destination: "/_next/image/:path*",
      },
    ];
  },
};
module.exports = withPlugins([withImages], nextConfig);
