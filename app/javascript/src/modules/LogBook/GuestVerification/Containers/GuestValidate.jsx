import React from 'react';
import HorizontalStepper from '../../../../shared/HorizontalStepper';
import steps from '../Components';
import EntryRequestContextProvider from '../Context';

export default function GuestValidate() {
  return (
    <EntryRequestContextProvider>
      <HorizontalStepper steps={steps} />
    </EntryRequestContextProvider>
  )
}
