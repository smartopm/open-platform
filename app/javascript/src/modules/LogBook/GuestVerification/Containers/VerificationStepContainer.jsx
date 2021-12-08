// Manage steps here
import React, { useContext } from 'react';
import steps from '../Components';
import HorizontalStepper from '../../../../shared/HorizontalStepper';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import { EntryRequestContext } from '../Context';

export default function VerificationStepContainer() {
  const authState = useContext(Context);
  const requestContext = useContext(EntryRequestContext);
  const communityFeatures = authState.user.community.features;
  return (
    <HorizontalStepper
      steps={steps}
      request={requestContext.request}
      communityFeatures={communityFeatures}
    />
  );
}
