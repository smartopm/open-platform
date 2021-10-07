import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'

function getSteps(handleNext) {
  return [
    {
      title: 'Guest Form',
      component: <GuestForm handleNext={handleNext} />,
      completed: true,
    },
    {
      title: 'ID',
      component: <IDCapture handleNext={handleNext} />,
      completed: false,
    },
    {
      title: 'Face',
      component: <VideoCapture />,
      completed: false,
    },
    {
      title: 'Wild',
      component: <p>Some other weird component</p>,
      completed: true,
    },
  ];
}

function GuestForm({ handleNext }) {
  return (
    <p>
      I am a guest <Button onClick={handleNext}>continue</Button>
    </p>
  );
}

function IDCapture({ handleNext }) {
  return (
    <p>
      Capture my ID <Button onClick={handleNext}>continue</Button>
    </p>
  );
}
function VideoCapture() {
  return <p>Capture my face with a video</p>;
}

export default function HStepper(){
  return <HorizontalStepper />
}
export function HorizontalStepper({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const listOfSteps = steps(handleNext);
  const validSteps = Boolean(listOfSteps?.length)

  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  return (
    <div>
      <Stepper nonLinear activeStep={activeStep}>
        {validSteps && listOfSteps.map((step, index) => (
          <Step key={step.title}>
            <StepButton
              onClick={handleStep(index)}
              completed={step.completed}
            />
          </Step>
        ))}
      </Stepper>
      <br />
      {validSteps && steps(handleNext)[activeStep].component}
    </div>
  );
}


HorizontalStepper.defaultProps = {
  steps: () => null
}

HorizontalStepper.propTypes = {
  steps: PropTypes.func,
}