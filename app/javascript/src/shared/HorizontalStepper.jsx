import React, { useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { objectAccessor } from '../utils/helpers';
import CenteredContent from '../components/CenteredContent';

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
    <div>
      <Stepper nonLinear activeStep={activeStep} data-testid="stepper_container">
        {listOfSteps?.length > 1 &&
          listOfSteps.map((step, index) => (
            <Step key={step.title}>
              <StepButton onClick={handleStep(index)} data-testid="step_button" />
            </Step>
          ))}
      </Stepper>
      {validSteps && objectAccessor(listOfSteps, activeStep).component}
      <CenteredContent>
        <Button>Next</Button>
      </CenteredContent>
    </div>
  );
}

HorizontalStepper.defaultProps = {
  steps: () => null,
};

HorizontalStepper.propTypes = {
  steps: PropTypes.func,
  communityName: PropTypes.string.isRequired,
};
