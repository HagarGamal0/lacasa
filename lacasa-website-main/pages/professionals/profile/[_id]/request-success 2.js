import { useRouter } from "next/router";
import React from "react";
import CommonLayout from "../../../../components/shop/common-layout";

const RequestSuccess = () => {
  const router = useRouter();
  return (
    <CommonLayout removeBreadcrubs={true} title={"Request Success"}>
      <div style={{ height: "400px" }} className="success-text">
        <i className="fa fa-check-circle" aria-hidden="true"></i>
        <h2>thank you</h2>
        <p>Request has been sent</p>
        <button
          onClick={() =>
            router.push({
              pathname: "/professionals",
              query: { category: "", page: 1 },
            })
          }
          className="btn btn-solid"
        >
          Search for other professionals
        </button>
      </div>
    </CommonLayout>
  );
};

export default RequestSuccess;
