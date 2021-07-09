import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import CenteredContent from '../../../components/CenteredContent';

export default function FormTitle({ name, description }) {
  return (
    <>
      <CenteredContent>
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
      </CenteredContent>
      <CenteredContent>
        <Typography variant="body1" gutterBottom>
          {description}
        </Typography>
      </CenteredContent>
    </>
  );
}

FormTitle.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
