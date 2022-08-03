import React from 'react';
import PaymentsIcon from '@mui/icons-material/Payments';
import PaymentSummary from './PaymentSummary';
import Payments from './Components/Payments';
import AccessCheck from '../Permissions/Components/AccessCheck';

const paymentsPermissions = ['can_access_all_payments', 'can_see_menu_item'];
const currentModule = 'plan_payment';

function RenderPaymentsList() {
  return (
    <AccessCheck module={currentModule} allowedPermissions={paymentsPermissions}>
      <Payments />
    </AccessCheck>
  );
}

export default {
  routeProps: {
    path: '/payments',
    component: RenderPaymentsList
  },
  styleProps: {
    icon: <PaymentsIcon />
  },
  name: t => t('menu.plan_plural'),
  featureName: 'Payments',
  accessibleBy: [],
  moduleName: currentModule
};

export { PaymentSummary };
