import React, { Fragment, useState, useEffect } from "react";
import API from "../../../../helpers/API/API";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AllProfile = ({ id, name, products_count, handleView }) => {
  return (
    <tr key={id}>
      <td style={{ verticalAlign: "middle" }}>{id}</td>
      <td style={{ verticalAlign: "middle" }}>{name}</td>
      <td style={{ verticalAlign: "middle" }}>{products_count}</td>
      <td style={{ verticalAlign: "middle" }}>
        <center>
          <i
            style={{ fontSize: "16px", cursor: "pointer" }}
            className="fa fa-eye mr-1"
            aria-hidden="true"
            onClick={() => handleView(id)}
          ></i>
        </center>
      </td>
    </tr>
  );
};

const Shipping_Fees = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, data: [] });
  useEffect(() => {
    setIsLoading(true);
    API.readAll(`/vendor/shipping_profiles`)
      .then(async (response) => {
        await setData(response);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const toggle = async () => {
    setModal({ open: false, data: [] });
  };
  const handleView = (id) => {
    API.readAll(`/shipping_profiles/${id}`)
      .then(async (response) => {
        setModal({ open: true, data: response.data.rules });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      {isLoading ? (
        ""
      ) : (
        <>
          <Container fluid={true}>
            <Row>
              <Col sm="12">
                <Card>
                  <CardHeader>
                    <h5>{t("Shipping Fees")}</h5>
                  </CardHeader>
                  <CardBody>
                    <Row className="product-adding">
                      <Col xl="12">
                        <table className="table-responsive-md table mb-0">
                          <thead>
                            <tr>
                              <th scope="col">ID #</th>
                              <th scope="col">{t("name")}</th>
                              <th scope="col">{t("Product Count")}</th>
                              <th scope="col">
                                <center>{t("View")}</center>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.data.map((data, i) => {
                              return (
                                <>
                                  {isLoading ? (
                                    ""
                                  ) : (
                                    <AllProfile
                                      id={data.id}
                                      name={data.name}
                                      products_count={data.products_count}
                                      handleView={handleView}
                                    />
                                  )}
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      )}
      <Modal
        isOpen={modal.open}
        toggle={toggle}
        className="modal-xl quickview-modal"
        dir={t("dir")}
        centered
      >
        <ModalHeader toggle={toggle}>{t("Qick View")}</ModalHeader>
        <ModalBody className="p-4">
          <Row>
            <Col lg="12" xs="12">
              <table className=" table-striped table-responsive-md table mb-0 text-initial">
                <thead>
                  <tr>
                    <th scope="col">{t("City")}</th>
                    <th scope="col">{t("fees")}</th>
                    <th scope="col">{t("estimated time")}</th>
                  </tr>
                </thead>
                <tbody>
                  {modal.data.map((item, i) => {
                    return (
                      <>
                        <tr key={item.id}>
                          <td style={{ verticalAlign: "middle" }}>
                            {item.city.name}
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {item.fee} LE
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {item.estimated_delivery}
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Shipping_Fees;
