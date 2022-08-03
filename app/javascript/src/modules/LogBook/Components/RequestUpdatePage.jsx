import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParamsQuery } from '../../../utils/helpers';
import RequestUpdate from './RequestUpdate';

export default function RequestUpdatePage({ handleNext }) {
  const { id, logs } = useParams();
  const { state } = useLocation();
  const query = useParamsQuery();
  const requestType = query.get('type');
  const isGuestRequest = requestType === 'guest';
  const isScannedRequest = requestType === 'scan';
  const tabValue = query.get('tab');
  const previousRoute = state?.from || logs;

  return (
    <RequestUpdate
      id={id}
      previousRoute={previousRoute}
      tabValue={tabValue}
      isGuestRequest={isGuestRequest}
      isScannedRequest={isScannedRequest}
      handleNext={handleNext}
    />
  );
}


RequestUpdatePage.defaultProps = {
  handleNext: () => {}
}

RequestUpdatePage.propTypes = {
  handleNext: PropTypes.func,
}