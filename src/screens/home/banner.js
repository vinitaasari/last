import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useHistory } from "react-router-dom";

const HomeScreenBanner = ({ images }) => {
  const properties = {
    duration: 5000,
    autoplay: true,
    transitionDuration: 500,
    arrows: false,
    infinite: true,
    easing: "ease",
    indicators: true,
  };
  const history = useHistory();

  return (
    <div className="slide-container">
      <Slide {...properties}>
        {images.map((image) => (
          <div
            key={image.id}
            className="each-slide"
            // style={{
            //   marginLeft: "20px",
            //   marginRight: "20px",
            //   marginTop: "20px",
            // }}
            onClick={() => {
              window.location.href = image.redirect_url;
            }}
          >
            <img
              className="lazy"
              src={image.image_web_url}
              alt={image.title}
              height="450"
              width="100%"
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default HomeScreenBanner;
