import React from "react";
import CommonLayout from "../../../components/shop/common-layout";
import ProfilePage from "./common/profile-page";

const Profile = () => {
  return (
    <CommonLayout parent="home" title="Profile">
      <ProfilePage />
    </CommonLayout>
  );
};

export default Profile;
