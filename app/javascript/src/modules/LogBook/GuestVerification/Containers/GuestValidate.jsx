import React, { useContext } from 'react';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import HorizontalStepper from '../../../../shared/HorizontalStepper';
import steps from '../Components';
import ObservationDialog from '../Components/ObservationDialog';
import EntryRequestContextProvider from '../Context';

export default function GuestValidate() {
  const authState = useContext(Context)
  const communityName = authState.user.community.name
  return (
    <EntryRequestContextProvider>
      <ObservationDialog />
      <HorizontalStepper
        steps={steps}
        communityName={communityName}
      />
    </EntryRequestContextProvider>
  )
}
