import React from "react";
import { Container, Row, Col, Input } from "reactstrap";
import dynamic from "next/dynamic";
const CommonLayout = dynamic(() =>
  import("../../components/shop/common-layout")
);
const Search = () => {
  return (
    <CommonLayout parent="home" title="search">
      <section className="authentication-page section-b-space">
        <Container>
          <section className="search-block">
            <Container>
              <Row>
                <Col lg="6" className="offset-lg-3">
                  <form className="form-header">
                    <div className="input-group">
                      <Input
                        type="text"
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                        placeholder="Search Products......"
                      />
                      <div className="input-group-append">
                        <button className="btn btn-solid">
                          <i className="fa fa-search"></i>Search
                        </button>
                      </div>
                    </div>
                  </form>
                </Col>
              </Row>
            </Container>
          </section>
        </Container>
      </section>
    </CommonLayout>
  );
};

export default Search;
