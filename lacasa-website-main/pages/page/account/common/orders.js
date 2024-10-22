import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Media } from "reactstrap";
import ReactPaginate from "react-paginate";
import API from "../../../../helpers/API/API";
import moment from "moment";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const [data, setData] = useState();
  const [page, setPage] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    API.readAll(`/profile/orders?page=${page + 1}`)
      .then(async (response) => {
        setData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const handlePageChange = (event) => {
    setPage(event.selected);
  };
  const { t } = useTranslation();
  return (
    <Col lg="8">
      <Container className={""}>
        <Row>
          {data?.data.map((item, index) => (
            <Col
              key={index}
              style={{ padding: "0px" }}
              className={"mb-3"}
              sm="12"
            >
              <Card>
                <Container className={""}>
                  <Row
                    className={"Order_header"}
                    style={{
                      backgroundColor: "#dcdcdc4a",
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    <Col xs="4">
                      <h3>
                        {t("Order#:")} {item.id}{" "}
                      </h3>
                    </Col>
                    <Col className="justify-content-end d-flex" xs="8">
                      <div>
                        <h3>
                          {t("Order Date:")}{" "}
                          {moment(item?.created_at).format("MMM Do YY")}
                        </h3>
                        <h3>
                          {t("Total:")}{" "}
                          {item.payment_detail.total
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                          EGP
                        </h3>
                      </div>
                    </Col>
                  </Row>
                  {item.items.map((product, index) => (
                    <Row key={index} className={"mt-3 mb-3"}>
                      <Col
                        className="order_img_container justify-content-center d-flex"
                        xs="3"
                      >
                        <Media
                          src={product.image.url}
                          className="order_img img-fluid blur-up lazyload"
                        />
                      </Col>
                      <Col className={"order_product mt-2"} xs="5">
                        <h4>{product.name}</h4>
                        <h4>
                          {t("Quantity:")} {product.quantity}
                        </h4>
                        <h4>
                          {t("Price/item:")}{" "}
                          {product.price
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                          EGP
                        </h4>
                        <h4>
                          {t("Shipping fees:")}{" "}
                          {product.shipping_fees
                            .toFixed(0)
                            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                          EGP
                        </h4>
                      </Col>
                      <Col
                        xs={"4"}
                        className="justify-content-center d-flex mt-2"
                      >
                        <h4>{product.status}</h4>
                      </Col>
                      {item.items.length - 1 > index ? (
                        <hr style={{ width: "90%" }} />
                      ) : (
                        <></>
                      )}
                    </Row>
                  ))}
                </Container>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <div className="section-t-space">
        <div className="text-center">
          <Row>
            <Col xl="12" md="12" sm="12">
              <div className="typo-content d-flex justify-content-center product-pagination">
                <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  breakLabel="..."
                  breakClassName="page-item"
                  breakLinkClassName="page-link"
                  pageCount={data ? data?.meta.last_page : 0}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName="pagination"
                  activeClassName="active"
                  forcePage={page}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default Orders;
