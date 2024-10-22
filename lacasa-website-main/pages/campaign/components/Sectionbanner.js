import React, { useEffect, useLayoutEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import API from "../../../helpers/API/API";
import Image from "next/image";

const SectionBanner = ({ path, data_test, cols }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (path) {
      API.readAll(path)
        .then((response) => {
          if (cols) {
                        setData(_.chunk(response.data, cols));
          } else {
            setData([response.data]);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setData(_.chunk(data_test, cols));
    }
  }, [path]);

  useLayoutEffect(() => {
    if (window.innerWidth > 1024) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);
  return (
    <>
      <Container fluid={false} className={"mb-3"}>
        {data?.map((items, index) => {
          return (
            <div className="row justify-content-center" key={index}>
              {items?.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={
                      window.innerWidth < 740 && items.length !== 1
                        ? index % 2 === 0 && cols === 4
                          ? { paddingRight: "5px" }
                          : { paddingLeft: "5px" }
                        : {}
                    }
                    className={`col-${
                      cols === 5
                        ? index === 4
                          ? "12"
                          : "6"
                        : cols === 3 || items.length === 3
                        ? index === 2
                          ? "12"
                          : items.length === 1
                          ? "12"
                          : "6"
                        : items.length === 1
                        ? "12"
                        : "6"
                    } col-md-${
                      cols === 5
                        ? index === 4
                          ? "12"
                          : "6"
                        : items.length > 2
                        ? items.length === 3
                          ? "4"
                          : "3"
                        : items.length === 1
                        ? "12"
                        : "6"
                    } mb-1 mb-md-2 mt-1 mt-md-2`}
                  >
                    <div>
                      <Link href={item.link?item.link:'/'}>
                        <img
                          style={{
                            width: "100%",
                            borderRadius: 10,
                            cursor: "pointer",
                          }}
                          alt={""}
                          src={
                            isMobile && item?.mobile_image
                              ? item?.mobile_image?.url
                              : item?.image?.url
                          }
                        />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </Container>
    </>
  );
};
export default SectionBanner;
