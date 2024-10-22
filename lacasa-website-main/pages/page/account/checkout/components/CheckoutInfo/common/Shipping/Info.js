import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const Info = ({ data }) => {
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;
  const address = user?.data?.addressbook?.shipping?.filter(
    (address) => parseInt(address.id) === parseInt(data.address_id)
  )?.[0];

  useEffect(() => {
    if (data)
      user?.data?.addressbook?.shipping?.filter(
        (address) => parseInt(address.id) === parseInt(data.address_id)
      );
  }, [data]);

  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="card-body">
        {user ? (
          <>
            <div className={"d-flex"}>
              <div className=" mr-3 mr-md-5">
                <span>{t("contact")}</span>
              </div>
              <div>
                <div>
                  <span>{user.data?.email}</span>
                </div>
                <div>
                  <span>{user.data?.name}</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={"d-flex"}>
              <div className=" mr-3 mr-md-5">
                <span>{t("Method")}</span>
              </div>
              <div>
                <div>
                  <span>{t("Ship To")}</span>
                </div>
                <div>
                  <span>
                    {data?.address ? data.address.address : address.address}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={"d-flex"}>
              <div className=" mr-3 mr-md-5">
                <span>{t("Contact")}</span>
              </div>
              <div>
                <div>
                  <span>{data?.address.email}</span>
                </div>
                <div>
                  <span>{data?.address.phone}</span>
                </div>
              </div>
            </div>
            <hr />
            <div className={"d-flex"}>
              <div className=" mr-3 mr-md-5">
                <span>{t("Method")}</span>
              </div>
              <div>
                <div>
                  <span>{t("Ship To")}</span>
                </div>
                <div>
                  <span>{data?.address.address}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Info;
