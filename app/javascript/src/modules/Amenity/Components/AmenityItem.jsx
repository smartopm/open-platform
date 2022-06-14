import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import CardWrapper from '../../../shared/CardWrapper';
import { truncateString } from '../../../utils/helpers';

export default function AmenityItem({ amenity }) {
  return (
    <CardWrapper
      title={amenity.name}
      displayButton
      buttonName="Reserve"
      cardStyles={{ height: 315 }}
      // buttonStyles={{ marginTop: '64%' }}
    >
      <Typography data-testid="amenity_description" component="p">
        {`Description: ${truncateString(amenity.description, 100)}`}
      </Typography>
      <br />
      <Typography data-testid="amenity_location" component="p">
        {`Location: ${amenity.location}`}
      </Typography>
      <Typography data-testid="amenity_hours" component="p">{`Hours: ${amenity.hours}`}</Typography>
    </CardWrapper>
  );
}

AmenityItem.propTypes = {
  amenity: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    hours: PropTypes.string
  }).isRequired
};
