import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import CardWrapper from '../../../shared/CardWrapper';

export default function AmenityItem({ amenity, translate }) {
  function handleReserve(reserveLink) {
     // eslint-disable-next-line security/detect-non-literal-fs-filename
     return window.open(reserveLink, '_blank');
  }
  return (
    <CardWrapper
      title={amenity.name}
      displayButton={!!amenity.invitationLink}
      handleButton={() => handleReserve(amenity.invitationLink)}
      buttonName={translate('amenity:misc.reserve')}
      cardStyles={{ height: 315 }}
    >
      <div style={{ height: 80 }}>
        <Typography data-testid="amenity_description" component="p">
          {`${translate('amenity:fields.amenity_description')}: ${amenity.description}`}
        </Typography>
      </div>
      <br />
      <div style={{ marginTop: 21 }}>
        <Typography data-testid="amenity_location" component="p">
          {`${translate('amenity:fields.amenity_location')}: ${amenity.location}`}
        </Typography>
        <Typography data-testid="amenity_hours" component="p">
          {`${translate('amenity:fields.amenity_hours')}: ${amenity.hours}`}
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
  }).isRequired,
  translate: PropTypes.func.isRequired
};