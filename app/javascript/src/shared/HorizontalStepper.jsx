import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { objectAccessor, useParamsQuery } from '../utils/helpers';
import CustomStepper from './CustomStepper';

export default function HorizontalStepper({ steps, communityFeatures, request }) {
  const params = useParamsQuery();
  const currentStep = parseInt(params.get('step'), 10) || 0;
  const history = useHistory();
  const listOfSteps = steps(handleNext, handleGotoStep, communityFeatures, request);
  const validSteps = Boolean(listOfSteps?.length);

  /**
   * Goes to the next step in the current stepper
   * @param {Boolean} isGuest
   * @param {String} to
   * @returns
   */
  function handleNext(isGuest = false, to = '') {
    const newActiveStep = currentStep + 1;

    if (listOfSteps.length <= 1 && isGuest) {
      history.push(to);
      return;
    }
    history.push({ search: `?step=${newActiveStep}` });
  }

  function handleGotoStep(stepNumber) {
    history.push({ search: `?step=${stepNumber}` });
  }

  function handleStep(step) {
    return () => {
      history.push({ search: `?step=${step}` });
    };
  }
  return (
    <CustomStepper activeStep={currentStep} handleStep={handleStep} steps={listOfSteps}>
      {validSteps && objectAccessor(listOfSteps, currentStep).component}
    </CustomStepper>
  );
}

HorizontalStepper.defaultProps = {
  steps: () => null,
  communityFeatures: {}
};

HorizontalStepper.propTypes = {
  steps: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  communityFeatures: PropTypes.object,
  // This can be renamed to a more reusable name that helps with step completion
  request: PropTypes.shape({ id: PropTypes.string }).isRequired
};
