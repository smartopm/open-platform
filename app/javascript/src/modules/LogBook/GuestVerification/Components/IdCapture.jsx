import React from 'react';
import Button from '@material-ui/core/Button';

export default function IDCapture({ handleNext }) {
  return (
    <p>
      I am a id capture <Button onClick={handleNext}>continue</Button>
    </p>
  );
}
