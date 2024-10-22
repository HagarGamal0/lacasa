import React from "react";
import styled, { keyframes } from "styled-components";

const textWrite = keyframes`
0%   {stroke-dashoffset:1000; fill: #ffffff;}
25%  {stroke-dashoffset:500; fill:#c79f9f;}
50%  {stroke-dashoffset:400; fill:#9c5a5a;}
100%  {stroke-dashoffset:0; fill:#79132b;}
`;
const Loader = styled.a`
  animation-name: ${textWrite};
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
`;
const Cwrite = keyframes`
0%   {stroke-dashoffset:1100; fill: #ffffff;}
25%  {stroke-dashoffset:800; fill: #b3b3b3;}
50%  {stroke-dashoffset:700; fill:#787878;}
75%  {stroke-dashoffset:600; fill:#4a4a4a;}
100%{stroke-dashoffset:0;fill:#000000;}
`;
const LoaderC = styled.a`
  animation-name: ${Cwrite};
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
`;

const LoaderLogo = () => {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 70 111"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Loader>
        <path
          style={{ strokeDasharray: 1200 }}
          d="M59 24.5V46C58.1667 42 56.3 33.4 55.5 31C54.5 28 49.5 23.5 43.5 21.5C37.5 19.5 36 20 24.5 21.5C13 23 6 38.5 5 46.5C4 54.5 7 68.5 13 76C19 83.5 25.5 86 42 85.5C55.2 85.1 64.5 68.6667 67.5 60.5C67.3333 61.5 66.9 63.8 66.5 65C66 66.5 62 75 55.5 82C50.3 87.6 40.3333 89.6667 36 90C29.1667 89.6667 13.8 86.4 7 76C-1.5 63 0.499999 50 1.5 45C2.5 40 6.5 30.5 14.5 24.5C22.5 18.5 28 17 39 17C47.8 17 56 22 59 24.5Z"
          stroke="black"
        />
      </Loader>
      <LoaderC>
        <path
          style={{ strokeDasharray: 1200 }}
          d="M26 9.49999C26 2.29999 21 2.16666 18.5 2.99999V1H39.5V2.99999H38.5C30.9 2.99999 30.3333 7.33333 31 9.49999V52L34.5 54.5L31 56V98C31 105.2 33.3333 106.333 34.5 106H55C64.6 106 66.6667 97 66.5 92.5H69L65 110H18C15.6667 109.5 12.4 108.4 18 108C23.6 107.6 25.6667 104.833 26 103.5V55.5L22 54.5L26 52V9.49999Z"
          stroke="black"
        />
      </LoaderC>
    </svg>
  );
};

export default LoaderLogo;
