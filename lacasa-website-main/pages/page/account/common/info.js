import { Container, Row, Col } from "reactstrap";

const Info = ({ user, handleActive, setPassword, setInfo }) => {
  let defaultAddress = [];
  defaultAddress = user?.data.addressbook.shipping.filter(
    (shipping) => shipping.default === true
  );

  let defaultBilling = [];
  defaultBilling = user?.data.addressbook.billing.filter(
    (billing) => billing.default === true
  );

  return (
    <Col lg="9">
      <div className="dashboard-right">
        <div className="dashboard">
          <div>
            <div className="page-title">
              <h2>Account Info</h2>
            </div>
            <div className="welcome-msg">
              <p>Hello, {user?.data.name} !</p>
            </div>
            <div className="box-account box-info">
              <div className="box-head">
                <h2>Account Information</h2>
              </div>
              <Row>
                <Col sm="6">
                  <div className="box">
                    <div className="box-title">
                      <h3>Contact Information</h3>
                      <a
                        id={"AccountSetting"}
                        onClick={async (e) => {
                          await setInfo(true);
                          await setPassword(false);
                          handleActive(e);
                        }}
                        href="#"
                      >
                        Edit
                      </a>
                    </div>
                    <div className="box-content">
                      <h6>{user?.data.name}</h6>
                      <h6>{user?.data.email}</h6>
                      <h6>{user?.data.phone}</h6>
                      <h6>
                        <a
                          id={"AccountSetting"}
                          onClick={async (e) => {
                            await setInfo(false);
                            await setPassword(true);
                            handleActive(e);
                          }}
                        >
                          Change Password
                        </a>
                      </h6>
                    </div>
                  </div>
                </Col>
                <Col sm="6"></Col>
              </Row>
              <div>
                <div className="box">
                  <div className="box-title">
                    <h3>Address Book</h3>
                    <a id={"Address"} onClick={handleActive} href="#">
                      Manage Addresses
                    </a>
                  </div>
                  <Row>
                    {defaultBilling?.length > 0 && (
                      <Col sm="6">
                        <h6>Default Billing Address</h6>
                        <address>
                          {defaultBilling[0]?.address},{defaultBilling[0]?.area}
                          ,{defaultBilling[0]?.city}
                          <br />
                        </address>
                      </Col>
                    )}
                    {defaultAddress?.length > 0 && (
                      <Col sm="6">
                        <h6>Default Shipping Address</h6>
                        <address>
                          {defaultAddress[0]?.address},{defaultAddress[0]?.area}
                          ,{defaultAddress[0]?.city}
                          <br />
                        </address>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default Info;
