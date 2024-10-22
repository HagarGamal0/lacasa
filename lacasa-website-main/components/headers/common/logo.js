import React, { Fragment } from "react";
import Link from "next/link";
import Logo from "../../../public/assets/images/icon/logo/full-logo-lacasa.png";
import Image from "next/image";
import { christmas } from "../../../services/script";
import Lottie from "react-lottie-player";

const LogoImage = ({ decor }) => {
  return (
    <Fragment>
      <Link href={"/"}>
        <a>
          {decor && (
            <div className="logoDecoration">
              <div>
                <Lottie
                  className="lottie"
                  loop
                  animationData={christmas}
                  play
                />
              </div>
            </div>
          )}
          <Image
            src={`${Logo ? Logo : "/assets/images/icon/logo.png"}`}
            alt=""
            width={"100%"}
            height={100}
            className="img-fluid"
            unoptimized
          />
        </a>
      </Link>
    </Fragment>
  );
};

export default LogoImage;
