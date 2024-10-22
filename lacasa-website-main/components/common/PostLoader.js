import React, { useLayoutEffect, useState } from "react";
import ContentLoader from "react-content-loader";

const PostLoader = () => {
  const [isMobile, setIsMobile] = useState(false);
  useLayoutEffect(() => {
    if (window.innerWidth < 450) setIsMobile(true);
  });
  return (
    <ContentLoader width={"100%"} height={isMobile ? 240 : 440} speed={2}>
      <rect
        x="10"
        y="0"
        rx="0"
        ry="0"
        width="95%"
        height={isMobile ? "170" : "350"}
      />
      <rect
        x="10"
        y={isMobile ? "180" : "370"}
        rx="3"
        ry="3"
        width="95%"
        height={isMobile ? "7" : "10"}
      />
      <rect
        x="10"
        y={isMobile ? "195" : "390"}
        rx="3"
        ry="3"
        width="80%"
        height={isMobile ? "7" : "10"}
      />
      <rect
        x="10"
        y={isMobile ? "210" : "410"}
        rx="3"
        ry="3"
        width="60%"
        height={isMobile ? "7" : "10"}
      />
    </ContentLoader>
  );
};

export default PostLoader;
