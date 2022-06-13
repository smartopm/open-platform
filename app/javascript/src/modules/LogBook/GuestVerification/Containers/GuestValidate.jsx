import React from 'react';
import ObservationDialog from '../Components/ObservationDialog';
import EntryRequestContextProvider from '../Context';
import VerificationStepContainer from './VerificationStepContainer';

export default function GuestValidate() {
  return (
    <EntryRequestContextProvider>
      <ObservationDialog />
      <VerificationStepContainer />
    </EntryRequestContextProvider>
  )
}
