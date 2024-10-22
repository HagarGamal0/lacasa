import React, { useState } from "react";
import { useRouter } from "next/router";
import CommonLayout from "../../components/shop/common-layout";
import LeftSidebarPage from "./product/leftSidebarPage";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

const LeftSidebar = () => {
  const router = useRouter();
  const id = router.query.id;
  const path = window.location.pathname.split("/");
  const url = path[path.length - 1];
  const [title, setTitle] = useState();
  return (
	<>
		<Head>
			<script
				dangerouslySetInnerHTML={{
					__html: `
					window.criteo_q = window.criteo_q || [];
					var deviceType = /iPad/.test(navigator.userAgent) ? "t" : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent) ? "m" : "d";
					window.criteo_q.push(
						{ event: "setAccount", account: 111775 },
						{ event: "setEmail", email: "" },
						{ event: "setSiteType", type: deviceType},
						{ event: "viewItem",
							item: ${id}
						}
					);
					`,
				}}
			/>
		</Head>
		<CommonLayout
		parent="Home"
		innerProduct={true}
		isCategory={true}
		title={`${router.query.category ? router.query.category : ""}`}
		>
		<LeftSidebarPage
			path={"/products"}
			pathId={id ? id : url}
			setTitle={setTitle}
		/>

		<ToastContainer position="bottom-left" closeOnClick autoClose={2000} />
		</CommonLayout>
	</>
  );
};

export default LeftSidebar;
