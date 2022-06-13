import React from 'react';
import PropTypes from 'prop-types';
import CardWrapper from '../../../shared/CardWrapper';

export default function AmenityItem({ amenity }) {
  return (
    <CardWrapper title={amenity.name} displayButton={false}>
      {`Description: ${amenity.description}`}
      {`Location: ${amenity.location}`}
      <br />
      {`Hours: ${amenity.hours}`}
      <br />
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
