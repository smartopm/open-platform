import React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import PropTypes from 'prop-types';

export default function CustomStepper({ activeStep, steps, handleStep, children }) {
  return (
    <>
      <Stepper nonLinear activeStep={activeStep} data-testid="stepper_container">
        {steps?.length > 1 &&
        steps.map((step, index) => (
          <Step key={step.title} completed={step.isCompleted}>
            <StepButton onClick={handleStep(index)} data-testid="step_button" />
          </Step>
        ))}
      </Stepper>
      {children}
    </>
  );
}

CustomStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      isCompleted: PropTypes.bool // this will be used to mark the step as completed
    }).isRequired
  ).isRequired,
  handleStep: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};
