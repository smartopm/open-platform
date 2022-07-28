import React, { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useQuery } from 'react-apollo';
import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import AmenityItem from './AmenityItem';
import AmenityForm from './AmenityForm';
import AmenitiesQuery from '../graphql/amenity_queries';
import { Spinner } from '../../../shared/Loading';
import PageWrapper from '../../../shared/PageWrapper';
import CenteredContent from '../../../shared/CenteredContent';
import useFetchMoreRecords from '../../../shared/hooks/useFetchMoreRecords';
import useMutationWrapper from '../../../shared/hooks/useMutationWrapper';
import { AmenityDeleteMutation } from '../graphql/amenity_mutations';
import { ActionDialog } from '../../../components/Dialog';
import AmenityStatus from '../constants';
import { Context } from '../../../containers/Provider/AuthStateProvider';

export default function AmenityList() {
  const [dialog, setOpenDialog] = useState({ isOpen: false, type: null });
  const [amenityData, setAmenityData] = useState(null);
  const authState = useContext(Context)
  const { refetch, data, loading, fetchMore } = useQuery(AmenitiesQuery, {
    variables: { offset: 0 },
    fetchPolicy: 'network-only',
  });
  const { t } = useTranslation(['common', 'amenity', 'form', 'search']);
  const variables = { offset: data?.amenities?.length };
  const { loadMore, hasMoreRecord } = useFetchMoreRecords(fetchMore, 'amenities', variables);
  const [deleteAmenity, isDeleting] = useMutationWrapper(
    AmenityDeleteMutation,
    reset,
    t('amenity:misc.amenity_deleted')
  );
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  function handleEditAmenity(amenity, type) {
    setAmenityData(amenity);
    setOpenDialog({ isOpen: true, type });
  }

  function handleClose() {
    setOpenDialog({ isOpen: true, type: null });
  }

  function reset() {
    refetch();
    handleClose();
  }

  function handleAddAmenity() {
    setAmenityData(null);
    setOpenDialog({ isOpen: true, type: 'edit' });
  }

  const rightPanelObj = [
    {
      mainElement: (
        <Button
          onClick={handleAddAmenity}
          startIcon={!matches ? <AddIcon /> : undefined}
          variant="contained"
          color="primary"
          style={matches ? { color: '#FFFFFF', margin: '0 5px 0 8px' } : { color: '#FFFFFF' }}
          data-testid="create_amenity_btn"
          disableElevation
        >
          {matches ? <AddIcon /> : t('common:misc.add_new')}
        </Button>
      ),
      key: 1,
    },
  ];

  return (
    <PageWrapper pageTitle={t('common:misc.amenity_plural')} rightPanelObj={rightPanelObj}>
      <ActionDialog
        open={dialog.isOpen && dialog.type === 'delete'}
        type="warning"
        message={t('amenity:misc.delete_warning')}
        handleClose={handleClose}
        disableActionBtn={isDeleting}
        handleOnSave={() => deleteAmenity({ id: amenityData.id, status: AmenityStatus.delete })}
      />
      <AmenityForm
        isOpen={dialog.isOpen && dialog.type === 'edit'}
        handleClose={handleClose}
        refetch={refetch}
        amenityData={amenityData}
        t={t}
      />
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
                    userPermissions={authState.user?.permissions}
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
      <br />
      {data?.amenities.length ? (
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
      ) : (
        <CenteredContent>
          <Typography>{t('amenity:misc.no_amenity_added')}</Typography>
        </CenteredContent>
      )}
    </PageWrapper>
  );
}
