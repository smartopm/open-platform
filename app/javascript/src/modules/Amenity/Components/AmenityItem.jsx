import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import CardWrapper from '../../../shared/CardWrapper';

export default function AmenityItem({ amenity }) {
  function handleReserve() {}
  return (
    <CardWrapper
      title={amenity.name}
      displayButton={!!amenity.invitationLink}
      handleButton={handleReserve}
      buttonName="Reserve"
      cardStyles={{ height: 315 }}
    >
      <div style={{ height: 80 }}>
        <Typography data-testid="amenity_description" component="p">
          {`Description: ${amenity.description}`}
        </Typography>
      </div>
      <br />
      <div style={{ marginTop: 21 }}>
        <Typography data-testid="amenity_location" component="p">
          {`Location: ${amenity.location}`}
        </Typography>
        <Typography data-testid="amenity_hours" component="p">
          {`Hours: ${amenity.hours}`}
        </Typography>
      </div>
    </CardWrapper>
  );
}

AmenityItem.propTypes = {
  amenity: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    hours: PropTypes.string,
    invitationLink: PropTypes.string
  }).isRequired
};
