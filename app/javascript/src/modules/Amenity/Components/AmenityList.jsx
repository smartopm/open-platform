import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useQuery } from 'react-apollo';
import AmenityItem from './AmenityItem';
import SpeedDialButton from '../../../shared/buttons/SpeedDial';
import AmenityForm from './AmenityForm';
import { AmenitiesQuery } from '../graphql/amenity_queries';
import { Spinner } from '../../../shared/Loading';

export default function AmenityList() {
  const [open, setOpen] = useState(false);
  const { refetch, data, loading } = useQuery(AmenitiesQuery);

  return (
    <>
      <AmenityForm isOpen={open} setOpen={setOpen} refetch={refetch} />
      <Container maxWidth="lg">
        <Grid container direction="row">
          <Grid item xs={11}>
            <Grid container spacing={3} direction="row">
              {loading && !data ? (
                <Spinner />
              ) : (
                data?.amenities.map(amenity => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={amenity.id}>
                    <AmenityItem amenity={amenity} />
                  </Grid>
                ))
              )}
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <SpeedDialButton handleAction={() => setOpen(!open)} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
