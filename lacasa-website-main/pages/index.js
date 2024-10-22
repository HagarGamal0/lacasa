import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Furniture = dynamic(() => import("./layouts/Furniture/index"));
const Loader = dynamic(() => import("../components/Loader/loder"));

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setIsLoading(false);
    }, 100);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loader-wrapper">
          <div className="loader">
            <Loader />
          </div>
        </div>
      )}
      <Furniture />
    </>
  );
};

export default Home;
