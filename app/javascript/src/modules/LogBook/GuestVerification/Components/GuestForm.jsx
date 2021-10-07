import React from 'react';
import Button from '@material-ui/core/Button';

export default function GuestForm({ handleNext }) {
  return (
    <p>
      I am a guest <Button onClick={handleNext}>continue</Button>
    </p>
  );
}
