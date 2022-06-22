import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import AmenityItem from './AmenityItem';
import SpeedDialButton from '../../../shared/buttons/SpeedDial';
import AmenityForm from './AmenityForm';
import { AmenitiesQuery } from '../graphql/amenity_queries';
import { Spinner } from '../../../shared/Loading';
import PageWrapper from '../../../shared/PageWrapper';

export default function AmenityList() {
  const [open, setOpen] = useState(false);
  const { refetch, data, loading } = useQuery(AmenitiesQuery);
  const { t } = useTranslation(['common', 'amenity', 'form']);

  return (
    <PageWrapper pageTitle={t('common:misc.amenity_plural')}>
      <AmenityForm isOpen={open} setOpen={setOpen} refetch={refetch} t={t} />
      <Grid container direction="row">
        <Grid item md={11} xs={10} />
        <Grid item md={1} xs={2}>
          <SpeedDialButton handleAction={() => setOpen(!open)} />
        </Grid>
      </Grid>
      <br />
      <Grid container direction="row">
        <Grid item xs={11}>
          <Grid container spacing={3} direction="row">
            {loading && !data ? (
              <Spinner />
            ) : (
              data?.amenities.map(amenity => (
                <Grid item xs={12} sm={6} md={4} key={amenity.id}>
                  <AmenityItem amenity={amenity} translate={t} />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
