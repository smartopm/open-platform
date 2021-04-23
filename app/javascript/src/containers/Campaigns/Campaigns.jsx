import React, { useContext } from 'react';
import { Context as AuthStateContext } from '../Provider/AuthStateProvider';
import CampaignList from '../../components/CampaignList';

export default function Campaigns() {
  const authState = useContext(AuthStateContext);
  return <CampaignList authState={authState} />;
}
