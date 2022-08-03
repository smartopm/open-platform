import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation, Link } from 'react-router-dom';
import { useLazyQuery } from 'react-apollo';
import {
  TextField,
  IconButton,
  Typography,
  Grid,
  Divider,
  Select,
  useMediaQuery,
  MenuItem,
  InputLabel
} from '@mui/material';
import { DeleteOutline, Room } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { CustomizedDialogs, ActionDialog } from '../Dialog';
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import { currencies, PropertyStatus } from '../../utils/constants';
import { UsersLiteQuery } from '../../graphql/queries';
import AddMoreButton from '../../shared/buttons/AddMoreButton';
import LandParcelEditCoordinate from './LandParcelEditCoordinate';
import LandParcelMergeModal from './LandParcelMergeModal';
import useDebounce from '../../utils/useDebounce';
import UserAutoResult from '../../shared/UserAutoResult';
import { dateToString } from '../DateContainer';
import { capitalize, titleize, objectAccessor, ifNotTest } from '../../utils/helpers';

export default function LandParcelModal({
  open,
  handleClose,
  handleSubmit,
  modalType,
  landParcel,
  landParcels,
  confirmMergeOpen,
  handleSubmitMerge,
  propertyUpdateLoading
}) {
  const classes = useStyles();
  const location = useLocation();
  const [parcelNumber, setParcelNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [parcelType, setParcelType] = useState('');
  const [country, setCountry] = useState('');
  const [longX, setLongX] = useState(null);
  const [latY, setLatY] = useState(null);
  const [geom, setGeom] = useState(null);
  const [status, setStatus] = useState('');
  const [objectType, setObjectType] = useState('');
  const [tabValue, setTabValue] = useState('Details');
  const [ownershipFields, setOwnershipFields] = useState(['']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const debouncedValue = useDebounce(objectAccessor(ownershipFields, currentIndex)?.name, 500);
  const authState = useContext(AuthStateContext);
  const currency = objectAccessor(currencies, authState.user?.community.currency) || '';
  const isFormReadOnly = modalType === 'details' && !isEditing;
  const [editCoordinates, setEditCoordinates] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [mergeData, setMergeData] = useState(null);
  const { t } = useTranslation(['common', 'property']);
  const matches = useMediaQuery('(max-width:800px)');
  useEffect(() => {
    setDetailsFields(landParcel);
    if (modalType === 'new' && location?.state?.from === 'users') {
      setOwnershipFields([
        { name: location?.state?.user?.userName, userId: location?.state?.user?.userId }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue, limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  function addOwnership() {
    setOwnershipFields([...ownershipFields, { name: '', address: '' }]);
  }

  function onChangeOwnershipField(event, index) {
    updateOwnershipField(event.target.name, event.target.value, index);
  }

  function updateOwnershipField(name, value, index) {
    const fields = [...ownershipFields];
    fields[Number(index)] = { ...objectAccessor(fields, index), [name]: value };
    setOwnershipFields(fields);
  }

  function userSearch(index) {
    setCurrentIndex(Number(index));
    searchUser();
  }

  function removeOwnership(index) {
    const ownershipOptions = ownershipFields;
    ownershipOptions.splice(index, 1);
    setOwnershipFields([...ownershipOptions]);
  }

  const handleOwnershipChange = (selected, index) => {
    const fields = [...ownershipFields];
    fields[Number(index)] = {
      ...objectAccessor(fields, index),
      name: selected?.name,
      userId: selected?.id
    };
    setOwnershipFields(fields);
  };

  // Todo: Put this in a single state
  function setDetailsFields(parcel) {
    setParcelNumber(parcel?.parcelNumber || '');
    setAddress1(parcel?.address1 || '');
    setAddress2(parcel?.address2 || '');
    setCity(parcel?.city || '');
    setPostalCode(parcel?.postalCode || '');
    setStateProvince(parcel?.stateProvince || '');
    setParcelType(parcel?.parcelType || '');
    setCountry(parcel?.country || '');
    setLongX(parcel?.longX || 0);
    setLatY(parcel?.latY || 0);
    setGeom(parcel?.geom || null);
    setStatus(parcel?.status || '');
    setObjectType(parcel?.objectType || '');
    setTabValue('Details');
    setOwnershipFields([]);
    setIsEditing(false);
  }

  function cleanUpOnModalClosing() {
    setIsEditing(false);
    setMergeModalOpen(false);
    handleClose();
  }

  function handleParcelSubmit() {
    if (modalType === 'details' && !isEditing) {
      setIsEditing(true);
      setOwnershipFields(landParcelOwners(landParcel));
      return;
    }

    let variables = {
      parcelNumber,
      address1,
      address2,
      city,
      postalCode,
      stateProvince,
      parcelType,
      country,
      longX,
      latY,
      geom,
      ownershipFields
    };

    if (modalType === 'new_house') {
      variables = {
        ...variables,
        status: status || 'planned',
        objectType: objectType || 'house'
      };
    }

    handleSubmit({
      ...variables
    });
  }

  function handleTriggerMergeRoutine() {
    // eslint-disable-next-line react/prop-types
    const existingPlot = landParcels.find(p => p.parcelNumber === parcelNumber);

    // skip merge when both properties have accounts or payments
    if (
      checkPlotAccountsAndPayments({ plot: existingPlot }) &&
      checkPlotAccountsAndPayments({ plot: landParcel })
    ) {
      return cleanUpOnModalClosing();
    }

    // skip merge when both plots have geo-coordinates
    if (landParcel.geom && existingPlot.geom) {
      return cleanUpOnModalClosing();
    }

    const { plotToMerge, plotToRemove } = getPlotsToMerge({
      existingPlot,
      selectedPlot: landParcel
    });

    setMergeData({
      plotToMerge,
      plotToRemove,
      selectedPlot: { ...landParcel },
      existingPlot
    });
    return setMergeModalOpen(true);
  }

  function getPlotsToMerge({ existingPlot, selectedPlot }) {
    // transfer geo-coordinates to plots with account and no geom
    if (
      checkPlotAccountsAndPayments({ plot: selectedPlot }) &&
      !selectedPlot.geom &&
      !checkPlotAccountsAndPayments({ plot: existingPlot }) &&
      existingPlot.geom
    ) {
      return {
        plotToMerge: { ...selectedPlot, geom: existingPlot.geom },
        plotToRemove: { ...existingPlot, parcelNumber: getBadPlotName(existingPlot.parcelNumber) }
      };
    }

    if (
      checkPlotAccountsAndPayments({ plot: existingPlot }) &&
      !existingPlot.geom &&
      !checkPlotAccountsAndPayments({ plot: selectedPlot }) &&
      selectedPlot.geom
    ) {
      return {
        plotToMerge: { ...existingPlot, geom: selectedPlot.geom },
        plotToRemove: { ...selectedPlot, parcelNumber: getBadPlotName(selectedPlot.parcelNumber) }
      };
    }

    // keep plot with accounts, payments, or geo-coordinates
    if (selectedPlot.geom || checkPlotAccountsAndPayments({ plot: selectedPlot })) {
      return {
        plotToMerge: { ...selectedPlot },
        plotToRemove: { ...existingPlot, parcelNumber: getBadPlotName(existingPlot.parcelNumber) }
      };
    }

    return {
      plotToMerge: { ...existingPlot },
      plotToRemove: { ...selectedPlot, parcelNumber: getBadPlotName(selectedPlot.parcelNumber) }
    };
  }

  function getBadPlotName(parcelNo) {
    return `BAD-PLOT-${parcelNo}`;
  }

  function checkPlotAccountsAndPayments({ plot }) {
    return plot?.accounts.length > 0;
  }

  function handleMergeAndSave() {
    setMergeModalOpen(false);
    const { plotToMerge, plotToRemove } = mergeData;

    handleMerge(plotToMerge);
    setTimeout(() => {
      handleMerge(plotToRemove);
    }, 500);
  }

  function handleMerge(plot) {
    handleSubmitMerge({
      id: plot.id,
      parcelNumber: plot.parcelNumber,
      geom: plot.geom
    });
  }

  function landParcelOwners(parcel) {
    return parcel.accounts.map(owner => ({
      name: owner.fullName,
      address: owner.address1,
      userId: owner.user.id
    }));
  }

  function handleChange(_event, newValue) {
    setTabValue(newValue);
  }

  function totalPlanPayments(payments) {
    let totalAmount = 0;
    payments.forEach(payment => {
      if (payment.status === 'paid') {
        totalAmount += payment.amount;
      }
    });
    return totalAmount;
  }

  function saveActionText() {
    if (modalType === 'details') {
      if (isEditing) {
        return t('common:form_actions.save_changes');
      }
      return t('property:form_actions.edit_property');
    }
    return t('common:form_actions.save');
  }

  function filteredOwnerList(users) {
    if (!users) return [];
    const currentOwners = (landParcel?.accounts.map(account => account.user.Id) || []).concat(
      ownershipFields.map(field => field.userId)
    );
    return users.filter(user => !currentOwners?.includes(user.id));
  }

  function handleEditCoordinatesOpen() {
    setEditCoordinates(true);
  }

  function handleEditCoordinatesClose() {
    setEditCoordinates(false);
  }

  function handleSaveMapEdit({ feature }) {
    setEditCoordinates(false);

    const { long_x: longitudeX, lat_y: latitudeY } = feature.properties;

    setLongX(longitudeX);
    setLatY(latitudeY);
    setGeom(JSON.stringify(feature));

    handleParcelSubmit();
  }

  return (
    <>
      <ActionDialog
        open={confirmMergeOpen}
        type="confirm"
        message={t('property:messages.parcel_number_exists')}
        handleClose={cleanUpOnModalClosing}
        handleOnSave={handleTriggerMergeRoutine}
      />
      <CustomizedDialogs
        open={open}
        handleModal={cleanUpOnModalClosing}
        // eslint-disable-next-line no-nested-ternary
        dialogHeader={
          modalType === 'new'
            ? t('property:dialog_headers.new_property')
            : modalType === 'new_house'
            ? t('property:dialog_headers.new_house')
            : t('property:dialog_headers.property', { parcelNumber: landParcel.parcelNumber })
        }
        handleBatchFilter={handleParcelSubmit}
        saveAction={saveActionText()}
        actionLoading={propertyUpdateLoading}
        cancelAction={tabValue === 'Plan History' ? 'Close' : 'Cancel'}
        displaySaveButton={tabValue !== 'Plan History'}
      >
        <StyledTabs value={tabValue} onChange={handleChange} aria-label="land parcel tabs">
          <StyledTab label={t('property:dialog_headers.details')} value="Details" />
          <StyledTab label={t('property:dialog_headers.ownership')} value="Ownership" />
          <StyledTab label={t('property:dialog_headers.plan_history')} value="Plan History" />
        </StyledTabs>
        <TabPanel value={tabValue} index="Details">
          <div className={classes.parcelForm}>
            <TextField
              autoFocus={ifNotTest()}
              margin="dense"
              id="parcel-number"
              inputProps={{
                'data-testid': 'parcel-number',
                readOnly: isFormReadOnly
              }}
              label={t('property:form_fields.property_number')}
              type="text"
              value={parcelNumber}
              onChange={e => setParcelNumber(e.target.value)}
              required
              className="property-parcel-number-txt-input"
            />
            <TextField
              margin="dense"
              id="address1"
              label={t('property:form_fields.address_1')}
              inputProps={{ 'data-testid': 'address1', readOnly: isFormReadOnly }}
              type="text"
              value={address1}
              onChange={e => setAddress1(e.target.value)}
              className="property-address1-txt-input"
            />
            <TextField
              margin="dense"
              id="address2"
              label={t('property:form_fields.address_2')}
              inputProps={{ 'data-testid': 'address2', readOnly: isFormReadOnly }}
              type="text"
              value={address2}
              onChange={e => setAddress2(e.target.value)}
              className="property-address2-txt-input"
            />
            <TextField
              margin="dense"
              id="city"
              label={t('property:form_fields.city')}
              inputProps={{ 'data-testid': 'city', readOnly: isFormReadOnly }}
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              className="property-city-txt-input"
            />
            <TextField
              margin="dense"
              id="state-province"
              label={t('property:form_fields.state_province')}
              inputProps={{
                'data-testid': 'state-province',
                readOnly: isFormReadOnly
              }}
              type="text"
              value={stateProvince}
              onChange={e => setStateProvince(e.target.value)}
            />
            <TextField
              margin="dense"
              id="country"
              label={t('property:form_fields.country')}
              type="text"
              inputProps={{ 'data-testid': 'country', readOnly: isFormReadOnly }}
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="property-country-txt-input"
            />
            <TextField
              margin="dense"
              id="parcel-type"
              label={t('property:form_fields.property_type')}
              inputProps={{
                'data-testid': 'parcel-type',
                readOnly: isFormReadOnly
              }}
              type="text"
              value={parcelType}
              onChange={e => setParcelType(e.target.value)}
              className="property-parcel-type-txt-input"
            />
            <TextField
              margin="dense"
              id="postal-code"
              label={t('property:form_fields.postal_code')}
              inputProps={{
                'data-testid': 'postal-code',
                readOnly: isFormReadOnly
              }}
              type="number"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              className="property-postal-code-txt-input"
            />
            {modalType === 'new_house' && (
              <>
                <br />
                <InputLabel id="status">Status</InputLabel>
                <Select
                  id="status"
                  value={status}
                  name="status"
                  onChange={e => setStatus(e.target.value)}
                  fullWidth
                  inputProps={{
                    'data-testid': 'status',
                    readOnly: isFormReadOnly
                  }}
                >
                  {PropertyStatus.house.map(v => (
                    <MenuItem key={v} value={v}>
                      {titleize(v)}
                    </MenuItem>
                  ))}
                </Select>
                <br />
                <InputLabel id="object_type">Category</InputLabel>
                <Select
                  value={objectType}
                  name="object_type"
                  onChange={e => setObjectType(e.target.value)}
                  fullWidth
                  inputProps={{
                    'data-testid': 'object-type',
                    readOnly: isFormReadOnly
                  }}
                >
                  <MenuItem key="house" value="house">
                    House
                  </MenuItem>
                </Select>
              </>
            )}
            <br />
            <br />
            {!landParcel?.geom &&
              !['new', 'new_house'].includes(modalType) &&
              !(landParcel?.objectType === 'house') && (
                <IconButton
                  onClick={handleEditCoordinatesOpen}
                  aria-label="edit-coordinate"
                  size="large"
                >
                  <Room />
                  {' '}
                  <Typography>{t('property:buttons.edit_coordinates')}</Typography>
                </IconButton>
              )}
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index="Ownership">
          {modalType === 'details' &&
            !isEditing &&
            (landParcel?.accounts?.length ? (
              landParcel?.accounts.map(owner => (
                <div key={owner.id} className={classes.parcelForm}>
                  <TextField
                    id={`user-search-${owner.fullName || owner.user.name}`}
                    focused
                    value={owner.fullName || owner.user.name || ''}
                    label={t('property:form_fields.owner')}
                    name="name"
                    className={classes.textField}
                    style={{ marginBottom: '15px' }}
                    inputProps={{
                      readOnly: isFormReadOnly
                    }}
                  />
                  <TextField
                    id={`user-search-${owner.address1}`}
                    focused
                    value={owner.address1 || ''}
                    label={t('property:form_fields.address')}
                    name="address"
                    className={classes.textField}
                    inputProps={{
                      readOnly: isFormReadOnly
                    }}
                  />
                </div>
              ))
            ) : (
              <div>{t('property:messages.no_owner_yet')}</div>
            ))}
          {ownershipFields?.map((_field, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} style={{ display: 'flex', marginBottom: '30px' }}>
              <div style={{ width: '100%' }}>
                <Autocomplete
                  style={{ width: matches ? 300 : '100%', marginLeft: matches && -30 }}
                  id="address-input"
                  options={filteredOwnerList(data?.usersLite)}
                  getOptionLabel={option => option?.name}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  value={objectAccessor(ownershipFields, index)}
                  onChange={(_event, newValue) => handleOwnershipChange(newValue, index)}
                  classes={{
                    option: classes.autocompleteOption,
                    listbox: classes.autocompleteOption
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <UserAutoResult user={option} t={t} />
                    </li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={t('property:form_fields.add_owner')}
                      style={{ width: '100%' }}
                      name="name"
                      onChange={event => onChangeOwnershipField(event, index)}
                      // eslint-disable-next-line no-unused-vars
                      onKeyDown={_e => userSearch(index)}
                      className={`property-owner-name-txt-input-${index}`}
                    />
                  )}
                />
                <TextField
                  id="user-search-"
                  inputProps={{
                    'data-testid': 'owner-address'
                  }}
                  value={objectAccessor(ownershipFields, index).address}
                  label={t('property:form_fields.address')}
                  onChange={event => onChangeOwnershipField(event, index)}
                  name="address"
                  style={{ marginBottom: '15px' }}
                  className={`property-owner-address-txt-input-${index} ${classes.textField}`}
                />
              </div>
              <div className={classes.removeIcon}>
                <IconButton
                  style={{ marginTop: 13 }}
                  onClick={() => removeOwnership(index)}
                  aria-label="remove"
                  size="large"
                >
                  <DeleteOutline />
                </IconButton>
              </div>
            </div>
          ))}
          {(modalType === 'new' || isEditing) && (
            <>
              <AddMoreButton title={t('property:buttons.new_owner')} handleAdd={addOwnership} />
            </>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index="Plan History">
          {landParcel?.paymentPlans?.length ? (
            landParcel?.paymentPlans
              ?.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map(paymentPlan => (
                <>
                  <div key={paymentPlan.id} className={classes.planContainer}>
                    <Grid container spacing={1} data-testid="start-date">
                      <Grid item xs={6}>
                        <Typography variant="h6" color="primary">
                          {paymentPlan?.user?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} className={classes.rightContent}>
                        {'Start date '}
                        {dateToString(paymentPlan?.startDate)}
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>
                          {t('property:misc.total_payments')}
                          {' '}
                          {currency}
                          {' '}
                          {totalPlanPayments(paymentPlan?.planPayments)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} className={classes.rightContent}>
                        {t('property:misc.end_date')}
                        {' '}
                        {dateToString(paymentPlan?.endDate)}
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          {capitalize(paymentPlan?.planType)}
                          {' '}
                          {t('property:misc.plan')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Link to={`/user/${paymentPlan?.userId}?tab=Plans`}>
                          <Typography>{t('property:misc.view_plan')}</Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={6} />
                    </Grid>
                  </div>
                  <div>
                    <Divider />
                  </div>
                </>
              ))
          ) : (
            <div>{t('property:misc.no_payment_plans')}</div>
          )}
        </TabPanel>
      </CustomizedDialogs>
      <LandParcelEditCoordinate
        landParcel={landParcel}
        open={editCoordinates}
        handleClose={handleEditCoordinatesClose}
        handleSaveMapEdit={handleSaveMapEdit}
      />
      <LandParcelMergeModal
        open={mergeModalOpen}
        handleClose={cleanUpOnModalClosing}
        handleSubmit={handleMergeAndSave}
        mergeData={mergeData}
      />
    </>
  );
}

const useStyles = makeStyles(() => ({
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    marginBottom: '30px'
  },
  removeIcon: {
    marginTop: '25px',
    marginLeft: '10px'
  },
  textField: {
    width: '450px'
  },
  autocompleteOption: {
    padding: '0px'
  },
  rightContent: {
    textAlign: 'right'
  },
  planContainer: {
    marginBottom: '10px',
    marginTop: '10px'
  },
  divEnd: {
    borderBottom: '1px solid black'
  }
}));

LandParcelModal.defaultProps = {
  handleSubmit: () => {},
  landParcel: null,
  landParcels: [],
  confirmMergeOpen: false,
  handleSubmitMerge: () => {},
  propertyUpdateLoading: false
};

LandParcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  modalType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object,
  landParcels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      parcelNumber: PropTypes.string,
      address1: PropTypes.string,
      address2: PropTypes.string,
      city: PropTypes.string,
      postalCode: PropTypes.string,
      stateProvince: PropTypes.string,
      country: PropTypes.string,
      parcelType: PropTypes.string
    })
  ),
  confirmMergeOpen: PropTypes.bool,
  handleSubmitMerge: PropTypes.func,
  propertyUpdateLoading: PropTypes.bool
};
