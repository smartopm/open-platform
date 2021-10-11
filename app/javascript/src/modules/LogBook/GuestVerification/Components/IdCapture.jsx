import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types'

export default function IDCapture({ handleNext }) {
  return (
    <p>
      ID Capture Component 
      {' '}
      <Button onClick={handleNext}>continue</Button>
    </p>
  );
}

IDCapture.propTypes = {
  /**
   * This if invoked in the Horizontal stepper, it will move to next step
   * This component is a placeholder
   */
  handleNext: PropTypes.func.isRequired
}