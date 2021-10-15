import React, { useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Context } from '../../../../containers/Provider/AuthStateProvider';
import HorizontalStepper from '../../../../shared/HorizontalStepper';
import { useParamsQuery } from '../../../../utils/helpers';
import steps from '../Components';
import EntryRequestContextProvider from '../Context';

export default function GuestValidate() {
  const authState = useContext(Context)
  const query = useParamsQuery();
  const { pathname } = useLocation()
  const { id } = useParams()
  const requestType = query.get('type');
  const isNewGuestRequest = pathname.includes('visit_request') && requestType === 'guest' || !id
  const communityName = authState.user.community.name
  return (
    <EntryRequestContextProvider>
      <HorizontalStepper
        steps={steps}
        communityName={communityName}
        isNewGuestRequest={isNewGuestRequest}
      />
    </EntryRequestContextProvider>
  )
}
