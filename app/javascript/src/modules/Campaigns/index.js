import React from 'react'
import Campaigns from './containers/Campaigns';
import AccessCheck from '../Permissions/Components/AccessCheck';

const campaignPermissions = ['can_access_campaign'];

const campaign = { module: 'campaign' }

function RenderCampaign() {
  return (
    <AccessCheck module={campaign.module} allowedPermissions={campaignPermissions}>
      <Campaigns />
    </AccessCheck>
  )
}

export default {
  routeProps: {
    path: '/campaigns',
    component: RenderCampaign
  },
  styleProps: {},
  name: t => t('misc.campaigns'),
  featureName: 'Campaigns',
  moduleName: "campaign",
  accessibleBy: []
};
