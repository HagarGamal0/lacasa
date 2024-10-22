import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import API from "../../../../helpers/API/API";

const SectionCollection = ({ path }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.readAll(path)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  }, [path]);

  return (
    <>
      <Container fluid={false}>
        {data?.map((item, index) => {
          return (
            <Link href={item?.link}>
              <img
                style={
                  data?.length === 1 && window.innerWidth > 450
                    ? { height: "250px", borderRadius: 10 }
                    : { borderRadius: 10 }
                }
                className={"section-coll-container mt-5"}
                alt={""}
                src={window.innerWidth > 1024 ? item.image : item.mobile_image}
              />
            </Link>
          );
        })}
      </Container>
    </>
  );
};
export default SectionCollection;
