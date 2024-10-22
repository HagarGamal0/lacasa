import React from "react";
import { Row, Col, Container } from "reactstrap";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../../../helpers/redux/actions/userActions";
const reviewPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const logOut = async () => {
    const state = await dispatch(signout());
    if (state) router.push("/");
  };

  return (
    <>
      <section className="p-0">
        <Container>
          <Row>
            <Col sm="12">
              <div className="error-section">
                <h3>Hello {user?.data.name}</h3>
                <h2>Your vendor profile is under review</h2>
                <h3>You can still shop our product</h3>
                <a href="/" className="btn btn-solid mt-4">
                  back to home
                </a>
                <button onClick={logOut} className="btn btn-solid mt-4 mx-5">
                  Log out
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default reviewPage;
