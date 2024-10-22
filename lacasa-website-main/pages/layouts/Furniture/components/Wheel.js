import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Link from "next/link";
import API from "../../../../helpers/API/API";
import WheelComponent from "react-wheel-of-prizes";
const Wheel = ({ path }) => {
  const segments = [
    "better luck next time",
    "won 70",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    localStorage.setItem("spin-win", "true");
  };

  return (
    <Container>
      <div className="d-flex justify-content-center">
        <WheelComponent
          segments={segments}
          segColors={segColors}
          winningSegment="won 10"
          onFinished={(winner) => onFinished(winner)}
          primaryColor="black"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={true}
          size={250}
          upDuration={100}
          downDuration={500}
          fontFamily="Arial"
        />
      </div>
    </Container>
  );
};
export default Wheel;
