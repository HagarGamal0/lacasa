import React, { useEffect, useState } from "react";
import { Col } from "reactstrap";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ReactPaginate from "react-paginate";
import API from "../../../../helpers/API/API";
import moment from "moment";

const Orders = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    API.readAll(`/profile/orders?page=${page + 1}`)
      .then(async (response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [page]);

  const handlePageChange = (event) => {
    setPage(event.selected);
  };
  return (
    <Col lg="9">
      <Box className="dashboard-right-n" sx={{ p: 0, m: 0 }}>
        <TableContainer
          className="dashboard"
          sx={{ padding: "0px !important", m: 0 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ background: "#f0f0f0" }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Order placed</TableCell>
                <TableCell>No of items</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ padding: "50px" }}>
              {data?.map((order) => {
                return (
                  <TableRow
                    key={order.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {order.id}
                    </TableCell>
                    <TableCell scope="row">{order.id}</TableCell>
                    <TableCell scope="row">{order.id}</TableCell>
                    <TableCell scope="row">
                      {order.payment_detail.total
                        .toFixed(0)
                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
                      EGP
                    </TableCell>
                    <TableCell align="right">{order.id}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Col>
  );
};

export default Orders;
