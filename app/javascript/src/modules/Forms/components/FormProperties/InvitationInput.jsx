import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function InvitationInput({ properties }) {
  return (
    <>
      <Typography variant="caption">{properties.fieldName}</Typography>
      <br />
      <Typography variant="body2">{properties.longDesc}</Typography>
    </>
  );
}

InvitationInput.propTypes = {
  properties: PropTypes.shape({
    fieldName: PropTypes.string,
    longDesc: PropTypes.string,
  }).isRequired,
};
