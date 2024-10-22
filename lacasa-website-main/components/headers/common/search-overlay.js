import React, { useContext } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import { useForm } from "react-hook-form";
import Router from "next/router";
import FilterContext from "../../../helpers/filter/FilterContext";

const closeSearch = () => {
  document.getElementById("search-overlay").style.display = "none";
};

const SearchOverlay = () => {
  const {
    register,
    handleSubmit,
    formState: { data, errors },
    watch,
  } = useForm();
  const filterContext = useContext(FilterContext);
  const setSelectedCategory = filterContext.setSelectedCategory;
  const setSelectedSearch = filterContext.setSelectedSearch;

  const onSubmit = (data, e) => {
    e.preventDefault();
    Router.push({
      pathname: "/shop",
      query: { category: "", search: data.search, page: 1 },
    });
    closeSearch();
  };

  return (
    <div id="search-overlay" className="search-overlay">
      <div>
        <span className="closebtn" onClick={closeSearch} title="Close Overlay">
          ×
        </span>
        <div className="overlay-content">
          <Container>
            <Row>
              <Col xl="12">
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <input
                      {...register("search")}
                      type="text"
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Search a Product"
                    />
                  </FormGroup>
                  <Button type="submit" className="btn btn-primary">
                    <i className="fa fa-search"></i>
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
