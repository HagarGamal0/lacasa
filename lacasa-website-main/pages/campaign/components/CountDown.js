import React, { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import Countdown from "react-countdown";
import API from "../../../helpers/API/API";
import { Container } from "reactstrap";

const CountDown = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    API.readAll("/dynamic/count-down").then((res) => {
      setData(res?.data);
    });
  }, []);

  return (
    <>
      {data?.length > 0 && (
        <Container className="mt-md-4 mt-3">
          {data.map((item) => {
            var arr = item.start_date.split(/[- :]/),
              date = new Date(
                arr[0],
                arr[1] - 1,
                arr[2],
                arr[3],
                arr[4],
                arr[5]
              );
            if (new Date() >= date) {
              var arrEx = item.expire_date.split(/[- :]/),
                expire_date = new Date(
                  arrEx[0],
                  arrEx[1] - 1,
                  arrEx[2],
                  arrEx[3],
                  arrEx[4],
                  arrEx[5]
                );
              return (
                <Countdown
                  date={expire_date}
                  renderer={({ days, hours, minutes, seconds, completed }) => {
                    if (completed) {
                      return <></>;
                    } else {
                      return (
                        <div
                          className="counterContainer"
                          style={{
                            borderRadius: 10,
                            background: `url(${item.image_url})`,
                          }}
                        >
                          <h2
                            className="counter-title"
                            style={{ color: `${item.color}` }}
                          >
                            {item.title}
                          </h2>
                          <div className="container">
                            <div
                              className={
                                "d-flex justify-content-center align-items-center circle-Container"
                              }
                            >
                              <div
                                className={
                                  " d-flex flex-column justify-content-center align-items-center"
                                }
                              >
                                <span
                                  style={{
                                    border: `2px solid ${item.color}`,
                                    color: `${item.color}`,
                                  }}
                                  className={
                                    "countDownCircle d-flex align-items-center justify-content-center flex-column"
                                  }
                                >
                                  {days}{" "}
                                  <span
                                    style={{ color: `${item.color}` }}
                                    className="dial-text"
                                  >
                                    Days
                                  </span>
                                </span>
                              </div>
                              <div
                                className={
                                  " d-flex flex-column justify-content-center align-items-center"
                                }
                              >
                                <span
                                  style={{
                                    border: `2px solid ${item.color}`,
                                    color: `${item.color}`,
                                  }}
                                  className={
                                    "countDownCircle d-flex align-items-center justify-content-center flex-column"
                                  }
                                >
                                  {hours}{" "}
                                  <span className="dial-text">Hours</span>
                                </span>
                              </div>
                              <div
                                className={
                                  " d-flex flex-column justify-content-center align-items-center"
                                }
                              >
                                <span
                                  style={{
                                    border: `2px solid ${item.color}`,
                                    color: `${item.color}`,
                                  }}
                                  className={
                                    "countDownCircle d-flex align-items-center justify-content-center flex-column"
                                  }
                                >
                                  {minutes}{" "}
                                  <span className="dial-text">Minutes</span>
                                </span>
                              </div>
                              <div
                                className={
                                  " d-flex flex-column justify-content-center align-items-center"
                                }
                              >
                                <span
                                  style={{
                                    border: `2px solid ${item.color}`,
                                    color: `${item.color}`,
                                  }}
                                  className={
                                    "countDownCircle d-flex align-items-center justify-content-center flex-column"
                                  }
                                >
                                  {seconds}{" "}
                                  <span className="dial-text">Seconds</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <Link href={item?.link}>
                            <h3
                              style={{ color: `${item.color}` }}
                              className="offer-link"
                            >
                              {item?.link_title}
                            </h3>
                          </Link>
                        </div>
                      );
                    }
                  }}
                />
              );
            }
          })}
        </Container>
      )}
    </>
  );
};
export default CountDown;
