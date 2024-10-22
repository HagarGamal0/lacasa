import React, { useState } from "react";

const ImageZoom = (props) => {
  const { image, isZoom } = props;
  const [state, setState] = useState();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setState({
      backgroundImage: `url(${image.url})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleLeaveMuse = (e) => {
    setState({});
  };

  return (
    <div className="imageZoom-container">
      <figure
        className="image"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeaveMuse}
        style={state}
      >
        <img
          src={image.url}
          alt={image.alt}
          className={isZoom ? `imgHover` : ``}
        />
      </figure>
    </div>
  );
};

export default ImageZoom;
