import React from "react";
import { Container, Row, Col } from "reactstrap";
import Link from "next/link";
import router from "next/router";
const Breadcrubs = ({ title, parent, subTitle, innerProduct, isCategory }) => {
  return (
    <div className="breadcrumb-section">
      <Container>
        <Row className="flex-ar justify-content-between">
          <Col sm="6" className="end-ar">
            <div className="page-title end-ar">
              {innerProduct ? (
                ""
              ) : (
                <h2
                  className="end-ar"
                  style={{
                    textTransform: "capitalize",
                    width: "100%",
                  }}
                >
                  {title}
                </h2>
              )}
            </div>
          </Col>
          <Col sm="6">
            <nav aria-label="breadcrumb" className="theme-breadcrumb">
              <ol style={{ textAlign: "start" }} className="breadcrumb flex-ar">
                <li className="breadcrumb-item">
                  <Link href="/">{parent}</Link>
                </li>

                {isCategory ? (
                  <>
                    {title === "" ? (
                      ""
                    ) : (
                      <li className="breadcrumb-item" aria-current="page">
                        <Link
                          href={{
                            pathname: "/shop",
                            query: {
                              category: router.query.category
                                ? router.query.category
                                : "",
                              page: 1,
                            },
                          }}
                        >
                          {title}
                        </Link>
                      </li>
                    )}
                  </>
                ) : (
                  <li className="breadcrumb-item" aria-current="page">
                    {title}
                  </li>
                )}
                {subTitle === undefined ? (
                  ""
                ) : (
                  <li className="breadcrumb-item active" aria-current="page">
                    {subTitle}
                  </li>
                )}
              </ol>
            </nav>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Breadcrubs;
