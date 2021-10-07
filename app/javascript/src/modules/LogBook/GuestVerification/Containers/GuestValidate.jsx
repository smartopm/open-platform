import React from 'react';
import HorizontalStepper from '../../../../shared/HorizontalStepper';
import steps from '../Components';

export default function GuestValidate() {
  return (
    <>
      <HorizontalStepper steps={steps} />
    </>
  );
}
