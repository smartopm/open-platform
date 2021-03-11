/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery, useMutation } from 'react-apollo';
import { Grid, Typography, Container, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import { makeStyles } from '@material-ui/core/styles';
import RoomIcon from '@material-ui/icons/Room';
import { ParcelsQuery, LandParcel, LandParcelGeoData } from '../../graphql/queries';
import Loading, { Spinner } from '../../shared/Loading';
import ErrorPage from '../Error';
import ParcelItem from './LandParcelItem';
import CreateLandParcel from './CreateLandParcel';
import CreatePointOfInterest from './CreatePointOfInterest';
import LandParcelModal from './LandParcelModal';
import { UpdateProperty } from '../../graphql/mutations';
import { MergeProperty } from '../../graphql/mutations/land_parcel';
import MessageAlert from '../MessageAlert';
import { formatError, propAccessor } from '../../utils/helpers';
import SearchInput from '../../shared/search/SearchInput';
import Toggler from '../Campaign/ToggleButton'
import LandParcelMap from './LandParcelMap'
import useDebounce from '../../utils/useDebounce';
import QueryBuilder from '../QueryBuilder';

export default function LandParcelList() {
  const limit = 20;
  const [offset, setOffset] = useState(0);
  const [open, setDetailsModalOpen] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [selectedLandParcel, setSelectedLandParcel] = useState({});
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 500);
  const [showFilter, setShowFilter] = useState(false)
  const history = useHistory();
  const [type, setType] = useState('plots')
  const [viewResultsOnMap, setViewResultsOnMap] = useState(false);
  const [confirmMergeOpen, setConfirmMergeOpen] = useState(false);
  const [conflictingParcelNumber, setConflictingParcelNumber] = useState('');

  const { loading, error, data, refetch } = useQuery(ParcelsQuery, {
    variables: { query: debouncedValue, limit, offset }
  });

  const { data: geoData } = useQuery(LandParcelGeoData, {
    fetchPolicy: 'cache-and-network'
  })

  const [updateProperty] = useMutation(UpdateProperty);
  const [mergeProperty] = useMutation(MergeProperty);

  const [
    loadParcel,
    { loading: parcelDataLoading, error: parcelDataError, data: parcelData }
  ] = useLazyQuery(LandParcel, {
    fetchPolicy: 'cache-and-network'
  });

  const [
    fetchConflictingLandParcel, { data: conflictingParcelData }
  ] = useLazyQuery(ParcelsQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { query: conflictingParcelNumber }
  });

  const handleType = (_event, value) => {
    setType(value)
  }

  function toggleFilter(){
    setShowFilter(!showFilter)
  }

  useEffect(() => {
    const pathName = window.location.pathname;
    const paths = pathName.match(/^\/land_parcels\/((?!new)(?!new_poi)\w+)/);
    if (paths) {
      const urlInfo = pathName.split('/');
      loadParcel({ variables: { id: urlInfo[urlInfo.length - 1] } });
      setSelectedLandParcel(parcelData?.landParcel || {});
      setDetailsModalOpen(true);
    }

    setViewResultsOnMap(!!debouncedValue)

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
    history.push(`/land_parcels/${landParcel.id}`);
    setDetailsModalOpen(true);
  }

  function onViewResultsOnMapClick(){
    setViewResultsOnMap(true);
    setType('map')
  }

  function canViewSearchResultsOnMap(){
    return (
      debouncedValue && !loading && data?.fetchLandParcel.some(({ geom }) => geom)
    )
  }

  function handleDetailsModalClose() {
    history.push('/land_parcels');
    setDetailsModalOpen(false);
    setConfirmMergeOpen(false)
  }

  function handleSubmit(variables) {
    const variableUpdates = variables;
    variableUpdates.id = selectedLandParcel.id;
    updateProperty({ variables: variableUpdates })
      .then(() => {
        setMessageAlert('Property updated successfully');
        setIsSuccessAlert(true);
        handleDetailsModalClose();
        refetch();
      })
      .catch(err => {
        const triggerMergeRegex = /parcel number has already been taken/gi
        if(triggerMergeRegex.test(err.message)){
          // fetch all landParcels & trigger prompt for merge routine
          setConflictingParcelNumber(variables.parcelNumber)
          fetchConflictingLandParcel()
          setConfirmMergeOpen(true)
        }
        setMessageAlert(formatError(err.message));
        setIsSuccessAlert(false);
      });
  }

  function handleMergeLandParcel(variables){
    mergeProperty({ variables })
      .then(() => {
        setMessageAlert('Merge successful');
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
  const filterFields = {
    owner: 'owner',
    ownerAddress: 'owner',
    parcelType: 'parcel_type',
    plotNumber: 'parcel_number',
    parcelAddress: 'address1',
  };

  function handleQueryOnChange(selectedOptions) {
    if (selectedOptions) {
      const andConjugate = selectedOptions.logic?.and;
      const orConjugate = selectedOptions.logic?.or;
      const availableConjugate = andConjugate || orConjugate;

      if (availableConjugate) {
        const conjugate = andConjugate ? 'AND' : 'OR';
        let property = '';
        let value = null;
        const queryText = availableConjugate
          .map(option => {
            const operator = Object.keys(option)[0];
            const [inputFilterProperty, inputFilterValue] = propAccessor(option, operator);

            property = filterFields[inputFilterProperty.var];
            value = inputFilterValue;
            return `${property}:'${value}'`;
          })
          .join(` ${conjugate} `);
        setSearchValue(queryText);
      }
    }
  }

  const InitialConfig = MaterialConfig;
  const queryBuilderConfig = {
    ...InitialConfig,
    fields: {
      owner: {
        label: 'Owner\'s Name',
        type: 'text',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      },
      ownerAddress: {
        label: 'Owner\'s Address',
        type: 'text',
        valueSources: ['value'],
        excludeOperators: ['not_equal']
      },
      parcelType: {
        label: 'Property Type',
        type: 'text',
        valueSources: ['value']
      },
      plotNumber: {
        label: 'Plot Number',
        type: 'text',
        valueSources: ['value']
      },
      parcelAddress: {
        label: 'Property Address',
        type: 'text',
        valueSources: ['value']
      },
    }
  };

  const queryBuilderInitialValue = {
    // Just any random UUID
    id: '76a8a9ba-0123-3344-c56d-b16e532c8cd0',
    type: 'group',
    children1: {
      '98a8a9ba-0123-4456-b89a-b16e721c8cd0': {
        type: 'rule',
        properties: {
          field: 'owner',
          operator: 'select_equals',
          value: ['owner'],
          valueSrc: ['value'],
          valueType: ['text']
        }
      }
    }
  };

  if (parcelDataLoading) return <Loading />;

  if (error) {
    return <ErrorPage title={error.message} />;
  }

  if (parcelDataError) {
    return <ErrorPage title={parcelDataError.message} />;
  }

  return (
    <>
      <Container>
        <LandParcelModal
          open={open}
          handleClose={handleDetailsModalClose}
          modalType="details"
          landParcel={selectedLandParcel}
          handleSubmit={handleSubmit}
          landParcels={conflictingParcelData?.fetchLandParcel}
          confirmMergeOpen={confirmMergeOpen}
          handleSubmitMerge={handleMergeLandParcel}
        />
        <MessageAlert
          type={isSuccessAlert ? 'success' : 'error'}
          message={messageAlert}
          open={!!messageAlert}
          handleClose={handleMessageAlertClose}
        />
        <br />
        <br />
        <SearchInput 
          title='Plot Properties' 
          searchValue={searchValue} 
          handleSearch={event => setSearchValue(event.target.value)} 
          handleFilter={toggleFilter}
          handleClear={() => setSearchValue('')}
        />
        {
          showFilter && (
            <Grid
              container
              justify="flex-end"
              style={{
                width: '100%',
                position: 'absolute',
                zIndex: 1,
                marginTop: 4,
                marginLeft: '-7.5%'
              }}
            >
              <QueryBuilder
                handleOnChange={handleQueryOnChange}
                builderConfig={queryBuilderConfig}
                initialQueryValue={queryBuilderInitialValue}
                addRuleLabel="Add filter"
              />
            </Grid>
          )
        }

        <br />
        <br />
        <Toggler
          type={type}
          handleType={handleType}
          data={{
          type: 'plots',
          antiType: 'map'
        }}
        />

        {type === 'plots' ? 
        (
          <>
            <Grid container spacing={0}>
              <Grid xs={6} item>
                {canViewSearchResultsOnMap() && (
                  <Typography>
                    <RoomIcon size="small" />
                    <Link 
                      component="button"
                      variant="body2"
                      onClick={onViewResultsOnMapClick}
                    >
                      View results on map
                    </Link>
                  </Typography>
                )}
              </Grid>
              <Grid xs={6} item><CreateLandParcel refetch={refetch} /></Grid>
            </Grid>
            <ParcelPageTitle />
            <br />
            { loading && <Spinner /> }
            {!loading && data?.fetchLandParcel.map(parcel => (
              <ParcelItem key={parcel.id} parcel={parcel} onParcelClick={onParcelClick} />
          ))}
            <div className="d-flex justify-content-center">
              <nav aria-label="center Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${offset < limit && 'disabled'}`}>
                    <a className="page-link" onClick={handlePreviousPage} href="#">
                      Previous
                    </a>
                  </li>
                  <li className={`page-item ${data?.fetchLandParcel.length < limit && 'disabled'}`}>
                    <a className="page-link" onClick={handleNextPage} href="#">
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        ):(
          <>
            <Grid container spacing={0}>
              <Grid xs={6} item />
              <Grid xs={6} item>
                <CreatePointOfInterest refetch={refetch} />
              </Grid>
            </Grid>
            {viewResultsOnMap ? (
              <LandParcelMap
                handlePlotClick={onParcelClick}
                geoData={data?.fetchLandParcel}
              />
            ) : (
              <LandParcelMap
                handlePlotClick={onParcelClick}
                geoData={geoData?.landParcelGeoData}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}

export function ParcelPageTitle() {
  const classes = useStyles();
  return (
    <Grid container spacing={0} className={classes.labelTitle}>
      <Grid xs={2} item>
        <Typography variant="subtitle2" data-testid="label-name" className={classes.label}>
          Property Number
        </Typography>
      </Grid>
      <Grid xs={2} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingLeft: '30px' }}>
          Address1
        </Typography>
      </Grid>
      <Grid xs={2} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingLeft: '30px' }}>
          Address2
        </Typography>
      </Grid>
      <Grid xs={2} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingLeft: '15px' }}>
          city
        </Typography>
      </Grid>
      <Grid xs={1} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingRight: '15px' }}>
          Postal Code
        </Typography>
      </Grid>
      <Grid xs={1} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingRight: '15px' }}>
          State Province
        </Typography>
      </Grid>
      <Grid xs={1} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingLeft: '10px' }}>
          Country
        </Typography>
      </Grid>
      <Grid xs={1} item>
        <Typography variant="subtitle2" data-testid="label-name" style={{ paddingRight: '15px' }}>
          Property Type
        </Typography>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles(() => ({
  labelTitle: {
    marginTop: '5%'
  }
}));
