import React, { useEffect, useMemo } from "react";

// import redux for auth guard
import { useSelector } from "react-redux";

// import layout
import Layout from "layout/Layout";
import { useHistory, useLocation } from "react-router-dom";

// import routing modules
import RouteIdentifier from "routing/components/RouteIdentifier";
import { getRoutes } from "routing/helper";
import routesAndMenuItems from "routes.js";
import Loading from "components/loading/Loading";

const App = () => {
  const { currentUser, isLogin } = useSelector((state) => state.auth);
  const history = useHistory();
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  useEffect(()=>{
    document.body.style.overflowY = 'auto';
  },[location.pathname])
  const routes = useMemo(
    () =>
      getRoutes({
        data: routesAndMenuItems,
        isLogin,
        userRole: currentUser.role,
      }),
    [isLogin, currentUser]
  );
  if (routes) {
    return (
      <>
        {" "}
        {token !== null ? (
          <Layout>
            <RouteIdentifier routes={routes} fallback={<Loading />} />
          </Layout>
        ) : (
          history.push(`${process.env.PUBLIC_URL}/login`)
        )}
      </>
    );
  }
  return <></>;
};

export default App;
