import React from "react";
import { useRouter } from "next/router";
import { Row, Col, Card, CardBody, Input, Label } from "reactstrap";

const Settings = () => {
  return (
    <>
      <Row>
        <Col sm="12">
          <Card className="mt-0">
            <CardBody>
              <div className="dashboard-box">
                <div className="dashboard-title">
                  <h4>settings</h4>
                </div>
                <div className="dashboard-detail">
                  <div className="account-setting">
                    <h5>Notifications</h5>
                    <Row>
                      <Col>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios1"
                            value="option1"
                            defaultChecked
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios1"
                          >
                            Allow Desktop Notifications
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios2"
                            value="option2"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios2"
                          >
                            Enable Notifications
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios3"
                            value="option3"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios3"
                          >
                            Get notification for my own activity
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios"
                            id="exampleRadios4"
                            value="option4"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios4"
                          >
                            DND
                          </Label>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="account-setting">
                    <h5>deactivate account</h5>
                    <Row>
                      <Col>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios1"
                            id="exampleRadios4"
                            value="option4"
                            defaultChecked
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios4"
                          >
                            I have a privacy concern
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios1"
                            id="exampleRadios5"
                            value="option5"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios5"
                          >
                            This is temporary
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios1"
                            id="exampleRadios6"
                            value="option6"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios6"
                          >
                            other
                          </Label>
                        </div>
                        <button type="button" className="btn btn-solid btn-xs">
                          Deactivate Account
                        </button>
                      </Col>
                    </Row>
                  </div>
                  <div className="account-setting">
                    <h5>Delete account</h5>
                    <Row>
                      <Col>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios3"
                            id="exampleRadios7"
                            value="option7"
                            defaultChecked
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios7"
                          >
                            No longer usable
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios3"
                            id="exampleRadios8"
                            value="option8"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios8"
                          >
                            Want to switch on other account
                          </Label>
                        </div>
                        <div className="form-check">
                          <Input
                            className="radio_animated form-check-input"
                            type="radio"
                            name="exampleRadios3"
                            id="exampleRadios9"
                            value="option9"
                          />
                          <Label
                            className="form-check-label"
                            for="exampleRadios9"
                          >
                            other
                          </Label>
                        </div>
                        <button type="button" className="btn btn-solid btn-xs">
                          Delete Account
                        </button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Settings;
