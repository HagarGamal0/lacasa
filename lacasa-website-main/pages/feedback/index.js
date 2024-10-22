import React, { useEffect, useState } from "react";
import { TabContent, Row, Col, Container } from "reactstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import FirstSlide from "./common/firstSlide";
import Router from "next/router";

const FeedBack = () => {
  const [data, setData] = useState({});
  const [sliderStatus, setSliderStatus] = useState(1);
  const [getStart, setGetStart] = useState(true);
  const marks = {
    1: {
      style: {
        left: window.innerWidth < 1024 ? "10%" : "0%",
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 1 ? (
            <div className="mark-status-feedback">Get Start</div>
          ) : (
            ""
          )}
        </>
      ),
    },

    2: {
      style: {
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 2 ? (
            <div className="mark-status-feedback">Here We Go</div>
          ) : (
            ""
          )}
        </>
      ),
    },
    3: {
      style: {
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 3 ? (
            <div className="mark-status-feedback">Get Start</div>
          ) : (
            ""
          )}
        </>
      ),
    },
    4: {
      style: {
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 4 ? (
            <div className="mark-status-feedback">Done</div>
          ) : (
            ""
          )}
        </>
      ),
    },
    5: {
      style: {
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 5 ? (
            <div className="mark-status-feedback">Done</div>
          ) : (
            ""
          )}
        </>
      ),
    },
    6: {
      style: {
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 6 ? (
            <div className="mark-status-feedback">Done</div>
          ) : (
            ""
          )}
        </>
      ),
    },
    7: {
      style: {
        left: window.innerWidth < 1024 ? "95%" : "100%",
        top: "-60px",
      },
      label: (
        <>
          {sliderStatus === 7 ? (
            <div className="mark-status-feedback">Done</div>
          ) : (
            ""
          )}
        </>
      ),
    },
  };

  const marksRange = {
    0: {
      style: {
        fontSize: "32px",
      },
      label: 1,
    },
    1: {
      style: {
        fontSize: "32px",
      },
      label: 2,
    },
    2: {
      style: {
        fontSize: "32px",
      },
      label: 3,
    },
    3: {
      style: {
        fontSize: "32px",
      },
      label: 4,
    },
    4: {
      style: {
        fontSize: "32px",
      },
      label: 5,
    },
    5: {
      style: {
        fontSize: "32px",
      },
      label: 6,
    },
    6: {
      style: {
        fontSize: "32px",
      },
      label: 7,
    },
    7: {
      style: {
        fontSize: "32px",
      },
      label: 8,
    },
    8: {
      style: {
        fontSize: "32px",
      },
      label: 9,
    },
  };

  return (
    <>
      <div className="container entry-content mt-5">
        {getStart ? (
          <div className="mt-5 feedBack-start">
            <h3>
              Thank you for taking this survey! We are interested in your honest
              opinions so that we can continue to improve our customer support
            </h3>
            <div className="button-container mt-5 ">
              <button className="btn-solid" onClick={() => setGetStart(false)}>
                Get Start
              </button>
            </div>
          </div>
        ) : (
          <div>
            <TabContent activeTab={sliderStatus}>
              <Slider
                min={1}
                max={7}
                marks={marks}
                value={sliderStatus}
                railStyle={{ backgroundColor: "#a7a7a798", height: "5px" }}
                trackStyle={{ backgroundColor: "black", height: "5px" }}
                handleStyle={{
                  backgroundColor: "black",
                  height: "0px",
                  border: "solid 0px #d4d4d4",
                }}
                dotStyle={{
                  backgroundColor: "black",
                  height: "0px",
                  border: "solid 0px #d4d4d4",
                }}
              />
              {sliderStatus === 1 ? (
                <FirstSlide
                  title={
                    "Overall, how satisfied were you with the experience with our customer support?"
                  }
                  options={[
                    "Extremely satisfied",
                    "Very satisfied",
                    "Somewhat satisfied",
                    "Not so satisfied",
                    "Not at all satisfied",
                  ]}
                  setSliderStatus={setSliderStatus}
                  nextPage={2}
                />
              ) : (
                ""
              )}
              {sliderStatus === 2 ? (
                <div>
                  <FirstSlide
                    title={
                      "How knowledgeable was the customer representative who assisted you?"
                    }
                    options={[
                      "Extremely knowledgeable",
                      "Very knowledgeable",
                      "Somewhat knowledgeable",
                      "Not so knowledgeable",
                      "Not at all knowledgeable",
                    ]}
                    setSliderStatus={setSliderStatus}
                    prevPage={1}
                    nextPage={3}
                  />
                </div>
              ) : (
                ""
              )}
              {sliderStatus === 3 ? (
                <div>
                  <FirstSlide
                    title={
                      "How much time did it take us to address your questions and concerns?"
                    }
                    options={[
                      "Much shorter than expected",
                      "Shorter than expected",
                      "About what I expected",
                      "Longer than expected",
                      "Much longer than expected",
                    ]}
                    setSliderStatus={setSliderStatus}
                    prevPage={2}
                    nextPage={4}
                  />
                </div>
              ) : (
                ""
              )}
              {sliderStatus === 4 ? (
                <div>
                  <FirstSlide
                    title={"Was your issue completely resolved?"}
                    options={["Yes", "No"]}
                    setSliderStatus={setSliderStatus}
                    prevPage={3}
                    nextPage={5}
                  />
                </div>
              ) : (
                ""
              )}
              {sliderStatus === 5 ? (
                <div>
                  <Row>
                    <Col lg="12" xs="12">
                      <Container fluid={true}>
                        <div className="feedBack-options mt-5 mx=5">
                          <h3 className="mb-5" style={{ fontSize: "28px" }}>
                            Based on your interaction with our customer support
                            team, how likely is it that you would recommend La
                            Casa to a friend or colleague?
                          </h3>
                          <Slider
                            min={0}
                            max={8}
                            marks={marksRange}
                            def={sliderStatus}
                            railStyle={{
                              backgroundColor: "#a7a7a798",
                              height: "15px",
                            }}
                            trackStyle={{
                              backgroundColor: "black",
                              height: "15px",
                            }}
                            handleStyle={{
                              backgroundColor: "black",
                              height: "0px",
                              border: "solid 0px #d4d4d4",
                            }}
                            dotStyle={{
                              backgroundColor: "black",
                              border: "solid 0px #d4d4d4",
                              width: "25px",
                              height: "0px",
                              transform: "translateY(55%)",
                            }}
                          />
                          <div className="mt-5">
                            <button
                              className="btn-solid mt-5 mx-5"
                              onClick={() => setSliderStatus(4)}
                            >
                              Back
                            </button>
                            <button
                              className="btn-solid mt-5"
                              onClick={() => {
                                const timer = setTimeout(() => {
                                  setSliderStatus(6);
                                }, 500);
                                return () => clearTimeout(timer);
                              }}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </Container>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
              {sliderStatus === 6 ? (
                <div>
                  <Row>
                    <Col lg="12" xs="12">
                      <Container fluid={true}>
                        <div className="feedBack-options mt-5 mx=5">
                          <h3 className="mb-5" style={{ fontSize: "28px" }}>
                            Is there anything that you think would improve our
                            customer support?
                          </h3>
                          <textarea
                            style={{
                              width: "90%",
                              height: "200px",
                              padding: "30px",
                              fontSize: "18px",
                            }}
                          />
                          <div>
                            <button
                              className="btn-solid mt-5 mx-5"
                              onClick={() => setSliderStatus(5)}
                            >
                              Back
                            </button>
                            <button
                              className="btn-solid mt-5"
                              onClick={() => setSliderStatus(7)}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </Container>
                    </Col>
                  </Row>
                </div>
              ) : (
                ""
              )}
              {sliderStatus === 7 ? (
                <div className="mt-5 feedBack-start">
                  <h3>
                    Thank you for taking this survey! We are interested in your
                    honest opinions so that we can continue to improve our
                    customer support
                  </h3>
                  <div className="button-container mt-3">
                    <button
                      className="btn-solid"
                      onClick={() => Router.push("/")}
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </TabContent>
          </div>
        )}
        {/* <img className="bg-feedback" src="" alt="" /> */}
      </div>
    </>
  );
};

export default FeedBack;
