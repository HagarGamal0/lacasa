import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
const Dashboard = dynamic(() => import("./common/dashboard"));
const ReviewPage = dynamic(() => import("./common/reviewPage"));
const CommonLayout = dynamic(() =>
  import("../../../components/shop/common-layout")
);

const VendorDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const userInfo = user;

  useEffect(async () => {
    if (user?.data.vendor.status === "Active") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [userInfo]);

  return (
    <div>
      <CommonLayout parent="home" title="vendor dashboard">
        {isActive ? <Dashboard /> : <ReviewPage />}
        <ToastContainer position="bottom-left" closeOnClick autoClose={2000} />
      </CommonLayout>
    </div>
  );
};
export default VendorDashboard;
