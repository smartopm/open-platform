import React from 'react';
import PropTypes from 'prop-types';
import RequestUpdatePage from '../../Components/RequestUpdatePage';

export default function GuestForm({ handleNext }) {
  return <RequestUpdatePage handleNext={handleNext} />
}

GuestForm.propTypes = {
  handleNext: PropTypes.func.isRequired
}