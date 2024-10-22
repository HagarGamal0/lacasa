import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser } from "../../helpers/redux/actions/userActions";
import router, { useRouter } from "next/router";

const AuthUser = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      dispatch(detailsUser());
    }
  }, []);

  return props.children;
};

export default AuthUser;
