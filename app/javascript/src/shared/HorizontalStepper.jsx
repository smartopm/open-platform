import React, { useContext, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import PropTypes from 'prop-types';
import { objectAccessor } from '../utils/helpers';
import { Context } from '../containers/Provider/AuthStateProvider';

export default function HorizontalStepper({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const authState = useContext(Context)
  const communityName = authState.user.community.name
  const listOfSteps = steps(handleNext, communityName);
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
      <Stepper nonLinear activeStep={activeStep} data-testid="stepper_container">
        {listOfSteps?.length > 1 &&
          listOfSteps.map((step, index) => (
            <Step key={step.title}>
              <StepButton onClick={handleStep(index)} data-testid="step_button" />
            </Step>
          ))}
      </Stepper>
      {validSteps && objectAccessor(steps(handleNext, communityName), activeStep).component}
    </div>
  );
}

HorizontalStepper.defaultProps = {
  steps: () => null,
};

HorizontalStepper.propTypes = {
  steps: PropTypes.func,
};
