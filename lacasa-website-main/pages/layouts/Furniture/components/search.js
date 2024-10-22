import React, { useContext } from "react";
import { Form, FormGroup } from "reactstrap";
import { useForm } from "react-hook-form";
import Router from "next/router";
import FilterContext from "../../../../helpers/filter/FilterContext";

const Search = () => {
  const {
    register,
    handleSubmit,
    formState: { data, errors },
    watch,
  } = useForm();
  const filterContext = useContext(FilterContext);

  const onSubmit = (data, e) => {
    e.preventDefault();
    Router.push({
      pathname: "/shop",
      query: { category: "", search: data.search, page: 1 },
    });
  };

  return (
    <Form className="mobile-display m-0" onSubmit={handleSubmit(onSubmit)}>
      <FormGroup className="container search-mob">
        <input
          {...register("search")}
          type="text"
          style={{ borderRadius: "25px" }}
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Search"
        />
        <button type="submit">
          <i className="fa fa-search"></i>
        </button>
      </FormGroup>
    </Form>
  );
};

export default Search;
