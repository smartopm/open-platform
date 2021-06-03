import React from 'react';
import { shape } from 'prop-types';
import authStateProps from '../../../shared/types/authState';
import PaymentList from './PaymentList';
import { currencies } from '../../../utils/constants';

export default function TabbedPayments({ authState }) {
  const currency = currencies[authState.user?.community.currency] || '';
  const currencyData = {currency, locale: authState.user?.community.locale }

  return (
    <>
      <PaymentList currencyData={currencyData} />
    </>
  );
}

TabbedPayments.propTypes = {
  authState: shape({ ...authStateProps }).isRequired
};
