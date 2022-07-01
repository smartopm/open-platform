import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import AmenityItem from './AmenityItem';
import SpeedDialButton from '../../../shared/buttons/SpeedDial';
import AmenityForm from './AmenityForm';
import { AmenitiesQuery } from '../graphql/amenity_queries';
import { Spinner } from '../../../shared/Loading';
import PageWrapper from '../../../shared/PageWrapper';
import CenteredContent from '../../../shared/CenteredContent';
import useFetchMoreRecords from '../../../shared/hooks/useFetchMoreRecords';
import useMutationWrapper from '../../../shared/hooks/useMutationWrapper';
import { AmenityUpdateMutation } from '../graphql/amenity_mutations';
import { ActionDialog } from '../../../components/Dialog';

export default function AmenityList() {
  const [open, setOpen] = useState(false);
  const [dialog, setOpenDialog] = useState({ isOpen: false, type: null })
  const [amenityData, setAmenityData] = useState(null)
  const { refetch, data, loading, fetchMore } = useQuery(AmenitiesQuery, {
    variables: { offset: 0 },
    fetchPolicy: 'cache-and-network'
  });
  const { t } = useTranslation(['common', 'amenity', 'form', 'search']);
  const variables = { offset: data?.amenities?.length };
  const { loadMore, hasMoreRecord } = useFetchMoreRecords(fetchMore, 'amenities', variables);
  const [deleteAmenity, isDeleting] = useMutationWrapper(AmenityUpdateMutation, reset, t('amenity:misc.amenity_deleted'));

  function handleEditAmenity(amenity, type) {
    setAmenityData(amenity)
    setOpenDialog({ isOpen: true, type })
    // setOpen(true)
  }

  function handleClose() {
    setOpenDialog({ isOpen: true, type: null });
  }
  function reset() {

  }

  function handleAddAmenity() {
    setAmenityData(null);
    //  setOpen(true);
     setOpenDialog({ isOpen: true, type: 'edit' });
  }

  return (
    <PageWrapper pageTitle={t('common:misc.amenity_plural')}>
      <ActionDialog
        open={dialog.isOpen && dialog.type === 'delete'}
        type="warning"
        message={t('amenity:misc.delete_warning')}
        handleClose={handleClose}
        disableActionBtn={isDeleting}
        handleOnSave={() => deleteAmenity({ id: amenityData.id, status: 'delete' })}
      />
      <AmenityForm
        isOpen={dialog.isOpen && dialog.type === 'edit'}
        setOpen={setOpen}
        refetch={refetch}
        amenityData={amenityData}
        t={t}
      />
      <Grid container direction="row">
        <Grid item xs={10} />
        <Grid item xs={2} style={{ marginTop: -45 }}>
          <SpeedDialButton handleAction={handleAddAmenity} />
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
                  <AmenityItem
                    amenity={amenity}
                    translate={t}
                    handleEditAmenity={handleEditAmenity}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
      <br />
      {data?.amenities.length && (
        <CenteredContent>
          <Button
            variant="outlined"
            onClick={loadMore}
            startIcon={loading && <Spinner />}
            disabled={loading || !hasMoreRecord}
          >
            {t('search:search.load_more')}
          </Button>
        </CenteredContent>
      )}
    </PageWrapper>
  );
}
