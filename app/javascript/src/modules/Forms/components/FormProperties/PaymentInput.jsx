import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function PaymentInput({ properties, communityCurrency }) {
  return (
    <>
      <Typography variant="caption">{properties.fieldName}</Typography>
      <Typography variant="h5">{`${communityCurrency}  ${properties.shortDesc} `}</Typography>
      <br />
      <Typography variant="body2">{properties.longDesc}</Typography>
    </>
  );
}

PaymentInput.propTypes = {
  communityCurrency: PropTypes.string.isRequired,
  properties: PropTypes.shape({
    fieldName: PropTypes.string,
    shortDesc: PropTypes.string,
    longDesc: PropTypes.string,
  }).isRequired,
};
