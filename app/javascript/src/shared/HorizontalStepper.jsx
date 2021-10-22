import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { objectAccessor } from '../utils/helpers';
import CustomStepper from './CustomStepper';

export default function HorizontalStepper({ steps, communityName }) {
  const [activeStep, setActiveStep] = useState(0);
  const listOfSteps = steps(handleNext, communityName);
  const validSteps = Boolean(listOfSteps?.length);

  function handleNext() {
    const newActiveStep = activeStep + 1;
    if (listOfSteps.length <= 1) {
      setActiveStep(activeStep);
      return
    }
    setActiveStep(newActiveStep);
  }

  function handleStep(step) {
    return () => {
      setActiveStep(step);
    };
  }
  return (
    <CustomStepper activeStep={activeStep} handleStep={handleStep} steps={listOfSteps}>
      {validSteps && objectAccessor(listOfSteps, activeStep).component}
    </CustomStepper>
  );
}

HorizontalStepper.defaultProps = {
  steps: () => null,
};

HorizontalStepper.propTypes = {
  steps: PropTypes.func,
  communityName: PropTypes.string.isRequired,
};
