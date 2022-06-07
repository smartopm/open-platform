import React, { useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { CardMedia } from "@mui/material";
import CustomMediaStepper from "./MediaStepper";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default function CustomCarousel({ imageUrls, videoUrls }) {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = Number(imageUrls.length + videoUrls.length);

  function handleStepChange(step) {
    setActiveStep(step);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const children = [];

  if (imageUrls.length > 0) {
   imageUrls.map((url) => children.push(<CardMedia key={url} component="img" height="194" src={url} />))
  }

  if (videoUrls.length > 0) {
    videoUrls.map((url) => children.push(<CardMedia key={url} component="iframe" height="194" src={url} />))
   }
 

  return (
    <div data-testid="carousel-container">
      <AutoPlaySwipeableViews
        axis="x-reverse"
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {children}
      </AutoPlaySwipeableViews>
      {maxSteps > 0 && (
      <CustomMediaStepper
        activeStep={activeStep}
        maxSteps={maxSteps}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleStepChange={handleStepChange}
      />
)}
    </div>
  );
}

CustomCarousel.defaultProps = {
  imageUrls: [],
  videoUrls: [],
};

CustomCarousel.propTypes = {
  imageUrls: PropTypes.arrayOf(PropTypes.string),
  videoUrls: PropTypes.arrayOf(PropTypes.string),
};
