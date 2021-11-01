import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { objectAccessor } from '../utils/helpers';
import CustomStepper from './CustomStepper';

export default function HorizontalStepper({ steps, communityName }) {
  const [activeStep, setActiveStep] = useState(0);
  const history = useHistory()
  const listOfSteps = steps(handleNext, handleGotoStep, communityName);
  const validSteps = Boolean(listOfSteps?.length);

  function handleNext(isGuest=false) {
    const newActiveStep = activeStep + 1;

    if (listOfSteps.length <= 1 && isGuest) {
      history.push('/entry_logs?tab=2&offset=0')
      return
    }
    setActiveStep(newActiveStep);
  }

  function handleGotoStep(stepNumber) {
    setActiveStep(stepNumber);
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
