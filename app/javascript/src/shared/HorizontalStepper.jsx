import React, { useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import PropTypes from 'prop-types';

export default function HorizontalStepper({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const listOfSteps = steps(handleNext);
  const validSteps = Boolean(listOfSteps?.length);

  function handleNext() {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  }

  function handleStep(step) {
    return () => {
      setActiveStep(step);
    };
  }

  return (
    <div>
      <Stepper nonLinear activeStep={activeStep}>
        {validSteps &&
          listOfSteps.map((step, index) => (
            <Step key={step.title}>
              <StepButton onClick={handleStep(index)} />
            </Step>
          ))}
      </Stepper>
      <br />
      {validSteps && steps(handleNext)[Number(activeStep)].component}
    </div>
  );
}

HorizontalStepper.defaultProps = {
  steps: () => null,
};

HorizontalStepper.propTypes = {
  steps: PropTypes.func,
};
