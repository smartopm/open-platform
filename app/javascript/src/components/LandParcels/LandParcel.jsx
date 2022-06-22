/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from 'react-apollo';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useHistory, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import RoomIcon from '@mui/icons-material/Room';
import { useTranslation } from 'react-i18next';
import { ParcelsQuery, LandParcel, LandParcelGeoData, HouseQuery } from '../../graphql/queries';
import { Spinner } from '../../shared/Loading';
import ErrorPage from '../Error';
import ParcelItem from './LandParcelItem';
import CreateLandParcel from './CreateLandParcel';
import CreatePointOfInterest from './CreatePointOfInterest';
import LandParcelModal from './LandParcelModal';
import { UpdateProperty } from '../../graphql/mutations';
import { MergeProperty } from '../../graphql/mutations/land_parcel';
import MessageAlert from '../MessageAlert';
import { formatError, handleQueryOnChange, useParamsQuery } from '../../utils/helpers';
import SearchInput from '../../shared/search/SearchInput';
import { MultipleToggler } from '../../modules/Campaigns/components/ToggleButton';
import LandParcelMap from './LandParcelMap';
import useDebounce from '../../utils/useDebounce';
import QueryBuilder from '../QueryBuilder';
import {
  propertyQueryBuilderConfig,
  propertyQueryBuilderInitialValue,
  propertyFilterFields
} from '../../utils/constants';
import ListHeader from '../../shared/list/ListHeader';
import PageWrapper from '../../shared/PageWrapper';

const parcelHeaders = [
  { title: 'Property Number/Type', col: 2 },
  { title: 'Address1/Address2', col: 3 },
  { title: 'Postal Code', col: 3 },
  { title: 'City', col: 3 },
  { title: 'State Province/Country', col: 4 },
  { title: 'Menu', col: 1 }
];

export default function LandParcelList() {
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [open, setDetailsModalOpen] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [propertyUpdateLoading, setPropertyUpdateLoading] = useState(false);
  const [selectedLandParcel, setSelectedLandParcel] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const [showFilter, setShowFilter] = useState(false);
  const history = useHistory();
  const [type, setType] = useState('plots');
  const [viewResultsOnMap, setViewResultsOnMap] = useState(false);
  const [confirmMergeOpen, setConfirmMergeOpen] = useState(false);
  const [conflictingParcelNumber, setConflictingParcelNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const location = useLocation();
  const { t } = useTranslation(['common', 'property']);

  const path = useParamsQuery('');
  const plot = path.get('plot');
  const subaction = path.get('subaction');

  const { loading, error, data, refetch } = useQuery(ParcelsQuery, {
    variables: { query: debouncedValue || searchQuery, limit, offset }
  });

  const { loading: loadingHouseData, data: houseData, refetch: refetchHouseData } = useQuery(
    HouseQuery,
    {
      variables: { query: debouncedValue || searchQuery, limit, offset }
    }
  );

  const { data: geoData, refetch: refetchGeoData } = useQuery(LandParcelGeoData, {
    fetchPolicy: 'cache-and-network'
  });

  const [updateProperty] = useMutation(UpdateProperty);
  const [mergeProperty] = useMutation(MergeProperty);

  const [
    loadParcel,
    { loading: parcelDataLoading, error: parcelDataError, data: parcelData }
  ] = useLazyQuery(LandParcel, {
    fetchPolicy: 'cache-and-network'
  });

  const [fetchConflictingLandParcel, { data: conflictingParcelData }] = useLazyQuery(ParcelsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { query: conflictingParcelNumber }
  });

  const handleType = (_event, value) => {
    setType(value);
  };

  function toggleFilter() {
    setShowFilter(!showFilter);
  }

  useEffect(() => {
    if (plot) {
      loadParcel({ variables: { id: plot } });
      setSelectedLandParcel(parcelData?.landParcel || {});
      setDetailsModalOpen(true);
    }

    setViewResultsOnMap(!!debouncedValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, parcelData, debouncedValue]);

  function handleNextPage() {
    setOffset(offset + limit);
  }

  function handlePreviousPage() {
    if (offset < limit) {
      return;
    }
    setOffset(offset - limit);
  }

  function onParcelClick(landParcel) {
    setSelectedLandParcel(landParcel);
    history.push(`/land_parcels?plot=${landParcel.id}`);
    setDetailsModalOpen(true);
  }

  function onAddHouseClick(landParcel) {
    setSelectedLandParcel(landParcel);
    history.push(`/land_parcels?subaction=new_house`);
  }

  function onViewResultsOnMapClick() {
    setViewResultsOnMap(true);
    setType('map');
  }

  function canViewSearchResultsOnMap() {
    return debouncedValue && !loading && data?.fetchLandParcel.some(({ geom }) => geom);
  }

  function handleDetailsModalClose() {
    history.push('/land_parcels');
    setDetailsModalOpen(false);
    setConfirmMergeOpen(false);
    setPropertyUpdateLoading(false);
  }

  function handleSubmit(variables) {
    setPropertyUpdateLoading(true);
    const variableUpdates = variables;
    variableUpdates.id = selectedLandParcel.id;
    updateProperty({ variables: variableUpdates })
      .then(() => {
        setMessageAlert(t('property:messages.property_updated'));
        setIsSuccessAlert(true);
        handleDetailsModalClose();
        if (location?.state?.from === 'users') {
          history.push(`user/${location?.state?.userId}?tab=Plots`);
        }
        refetch();
        refetchHouseData();
        refetchGeoData();
      })
      .catch(err => {
        const triggerMergeRegex = /parcel number has already been taken/gi;
        if (triggerMergeRegex.test(err.message)) {
          // fetch all landParcels & trigger prompt for merge routine
          setConflictingParcelNumber(variables.parcelNumber);
          fetchConflictingLandParcel();
          setConfirmMergeOpen(true);
        }
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
        setPropertyUpdateLoading(false);
      });
  }

  function handleMergeLandParcel(variables) {
    mergeProperty({ variables })
      .then(() => {
        setMessageAlert(t('property:messages.merge_successful'));
        setIsSuccessAlert(true);
        handleDetailsModalClose();
        refetch();
      })
      .catch(err => {
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
        handleDetailsModalClose();
      });
  }

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function queryOnChange(selectedOptions) {
    setSearchQuery(handleQueryOnChange(selectedOptions, propertyFilterFields));
  }

  if (parcelDataLoading) return <Spinner />;

  if (error) {
    return <ErrorPage title={error.message} />;
  }

  if (parcelDataError) {
    return <ErrorPage title={parcelDataError.message} />;
  }

  return (
    <PageWrapper pageTitle={t('misc.properties')}>
      <Grid
        container
        style={{ padding: '20px 0 20px 20px' }}
        direction="row"
        justifyContent="space-between"
      >
        <Grid item xs={12} sm={8} md={10}>
          <SearchInput
            title={t('property:misc.plot_properties')}
            searchValue={searchValue}
            handleSearch={event => setSearchValue(event.target.value)}
            handleFilter={toggleFilter}
            handleClear={() => setSearchValue('')}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2}>
          {type === 'plots' && (
            <CreateLandParcel
              refetch={refetch}
              selectedLandParcel={selectedLandParcel}
              newHouse={subaction === 'new_house'}
              refetchHouseData={refetchHouseData}
            />
          )}
          {type === 'map' && <CreatePointOfInterest refetch={refetch} />}
        </Grid>
      </Grid>
      <LandParcelModal
        open={open}
        handleClose={handleDetailsModalClose}
        modalType={subaction === 'new_house' ? subaction : 'details'}
        landParcel={selectedLandParcel}
        handleSubmit={handleSubmit}
        landParcels={conflictingParcelData?.fetchLandParcel}
        confirmMergeOpen={confirmMergeOpen}
        handleSubmitMerge={handleMergeLandParcel}
        propertyUpdateLoading={propertyUpdateLoading}
      />
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      {showFilter && (
        <Grid
          container
          justifyContent="flex-end"
          style={{
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            marginTop: '-2px',
            marginLeft: '-7.5%'
          }}
        >
          <QueryBuilder
            handleOnChange={queryOnChange}
            builderConfig={propertyQueryBuilderConfig}
            initialQueryValue={propertyQueryBuilderInitialValue}
            addRuleLabel={t('common:misc.add_filter')}
          />
        </Grid>
      )}

      <Grid item xs={12} sm={12} style={{ margin: '0 0 10px 20px' }}>
        <MultipleToggler type={type} handleType={handleType} options={['plots', 'houses', 'map']} />
      </Grid>

      {type === 'plots' && (
        <>
          <Grid container spacing={0}>
            <Grid xs={6} item>
              {canViewSearchResultsOnMap() && (
                <Typography>
                  <RoomIcon size="small" />
                  <Link component="button" variant="body2" onClick={onViewResultsOnMapClick}>
                    {t('property:misc.view_results_on_map')}
                  </Link>
                </Typography>
              )}
            </Grid>
          </Grid>
          {loading && <Spinner />}
          <div style={{ margin: '0 20px' }}>
            {!loading && data?.fetchLandParcel.length > 0 && matches && (
              <ListHeader headers={parcelHeaders} />
            )}
            {!loading &&
              data?.fetchLandParcel.map(parcel => (
                <ParcelItem
                  key={parcel.id}
                  parcel={parcel}
                  onParcelClick={onParcelClick}
                  onAddHouseClick={onAddHouseClick}
                />
              ))}
          </div>
          <div className="d-flex justify-content-center">
            <nav aria-label="center Page navigation">
              <ul className="pagination">
                <li className={`page-item ${offset < limit && 'disabled'}`}>
                  <a className="page-link" onClick={handlePreviousPage} href="#">
                    {t('property:misc.previous')}
                  </a>
                </li>
                <li className={`page-item ${data?.fetchLandParcel.length < limit && 'disabled'}`}>
                  <a className="page-link" onClick={handleNextPage} href="#">
                    {t('property:misc.next')}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
      {type === 'map' && (
        <div style={{ margin: '0 20px' }}>
          {viewResultsOnMap ? (
            <LandParcelMap
              handlePlotClick={onParcelClick}
              geoData={data?.fetchLandParcel}
              refetch={refetch}
            />
          ) : (
            <LandParcelMap
              handlePlotClick={onParcelClick}
              geoData={geoData?.landParcelGeoData}
              refetch={refetchGeoData}
            />
          )}
        </div>
      )}
      {type === 'houses' && (
        <>
          {loadingHouseData && <Spinner />}
          <div style={{ margin: '0 20px' }}>
            {!loadingHouseData && houseData?.fetchHouse.length > 0 && matches && (
              <ListHeader headers={parcelHeaders} />
            )}
            {!loadingHouseData &&
              houseData?.fetchHouse.map(house => (
                <ParcelItem
                  key={house.id}
                  parcel={house}
                  onParcelClick={onParcelClick}
                  onAddHouseClick={onAddHouseClick}
                />
              ))}
          </div>
          <div className="d-flex justify-content-center">
            <nav aria-label="center Page navigation">
              <ul className="pagination">
                <li className={`page-item ${offset < limit && 'disabled'}`}>
                  <a className="page-link" onClick={handlePreviousPage} href="#">
                    {t('property:misc.previous')}
                  </a>
                </li>
                <li className={`page-item ${houseData?.fetchHouse.length < limit && 'disabled'}`}>
                  <a className="page-link" onClick={handleNextPage} href="#">
                    {t('property:misc.next')}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </PageWrapper>
  );
}
