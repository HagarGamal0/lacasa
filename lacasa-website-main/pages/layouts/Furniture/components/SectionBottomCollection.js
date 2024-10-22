import React, { useEffect, useLayoutEffect, useState } from "react";
import { Container } from "reactstrap";
import Link from "next/link";
import API from "../../../../helpers/API/API";

const SectionBottomCollection = ({ name, path, data_test }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (path) {
      API.readAll(path)
        .then((response) => {
          setData(response);
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
    <Container fluid={false} className={"mb-3"}>
      <div className="row justify-content-center">
        {data?.[name]?.map((item) => {
          return (
            <div
              key={item?.id}
              style={{ paddingLeft: "5px" }}
              className={`col-md-${
                data?.[name]?.length > 2
                  ? data?.[name]?.length === 3
                    ? "4"
                    : "3"
                  : data?.[name]?.length === 1
                  ? "12"
                  : "6"
              } mb-1 mb-md-2 mt-1 mt-md-2`}
            >
              <div>
                <Link
                  href={item?.link}
                  onClick={(e) => {
                    !item?.link && e.preventDefault();
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                    alt={item?.title}
                    src={isMobile && item?.mobile_image ? item?.mobile_image?.url : item?.image?.url}
                  />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};
export default SectionBottomCollection;
