/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from 'react-apollo';
import {
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel
} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { DeleteOutline } from '@material-ui/icons';
import { CustomizedDialogs } from '../Dialog';
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import DatePickerDialog from '../DatePickerDialog';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import { currencies } from '../../utils/constants';
import { UsersLiteQuery } from '../../graphql/queries';

export default function LandParcelModal({
  open,
  handelClose,
  handleSubmit,
  modalType,
  landParcel
}) {
  const classes = useStyles();
  const [parcelNumber, setParcelNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [stateProvince, setStateProvince] = useState('');
  const [parcelType, setParcelType] = useState('');
  const [country, setCountry] = useState('');
  const [tabValue, setTabValue] = useState('Details');
  const [valuationFields, setValuationFields] = useState([]);
  const [search, setSearch] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [ownershipFields, setOwnershipFields] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const authState = useContext(AuthStateContext);
  const currency = currencies[authState.user?.community.currency] || '';
  const isFormReadOnly = modalType === 'details' && !isEditing;

  useEffect(() => {
    setDetailsFields(landParcel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: ownershipFields[Number(currentIndex)]?.name },
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
    fields[Number(index)] = { ...fields[Number(index)], [name]: value };
    setOwnershipFields(fields);
  }

  function userSearch(e, index) {
    if (e.keyCode === 13) {
      setCurrentIndex(Number(index));
      setSearch(true);
      searchUser();
    }
  }

  function removeOwnership(index) {
    const ownershipOptions = ownershipFields;
    ownershipOptions.splice(index, 1);
    setOwnershipFields([...ownershipOptions]);
  }

  const handleOwnershipChange = (event, index) => {
    const fields = [...ownershipFields];
    fields[Number(index)] = {
      name: data?.usersLite[event.target.value].name,
      address: data?.usersLite[event.target.value].address,
      userId: data?.usersLite[event.target.value].id
    };
    setOwnershipFields(fields);
    setSearch(false);
    setShowAddress(true);
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
    setTabValue('Details');
    setValuationFields([]);
    setOwnershipFields([]);
    setIsEditing(false);
  }

  function handleParcelSubmit() {
    if (modalType === 'details' && !isEditing) {
      setIsEditing(true);
      setValuationFields(landParcelValuations(landParcel));
      setOwnershipFields(landParcelOwners(landParcel));
      return;
    }

    handleSubmit({
      parcelNumber,
      address1,
      address2,
      city,
      postalCode,
      stateProvince,
      parcelType,
      country,
      valuationFields,
      ownershipFields
    });
  }

  function landParcelValuations(parcel) {
    return parcel.valuations.map(val => {
      return { amount: val.amount, startDate: val.startDate };
    });
  }

  function landParcelOwners(parcel) {
    return parcel.accounts.map(owner => {
      return { name: owner.fullName, address: owner.address1, userId: owner.user.id };
    });
  }

  function handleChange(_event, newValue) {
    setTabValue(newValue);
  }

  function onChangeValuationField(event, index) {
    updateValuationField(event.target.name, event.target.value, index);
  }

  function onChangeValuationDateField(date, index) {
    updateValuationField('startDate', date, index);
  }

  function updateValuationField(name, value, index) {
    const fields = [...valuationFields];
    fields[Number(index)] = { ...fields[Number(index)], [name]: value };
    setValuationFields(fields);
  }

  function addValuation() {
    setValuationFields([...valuationFields, { amount: '', startDate: new Date() }]);
  }

  function removeValuation(index) {
    const valuationOptions = valuationFields;
    valuationOptions.splice(index, 1);
    setValuationFields([...valuationOptions]);
  }

  function saveActionText() {
    if (modalType === 'details') {
      if (isEditing) {
        return 'Save Changes';
      }
      return 'Edit Parcel';
    }
    return 'Save';
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handelClose}
      dialogHeader={modalType === 'new' ? 'New Property' : `Parcel ${landParcel.parcelNumber}`}
      handleBatchFilter={handleParcelSubmit}
      saveAction={saveActionText()}
    >
      <StyledTabs value={tabValue} onChange={handleChange} aria-label="land parcel tabs">
        <StyledTab label="Details" value="Details" />
        <StyledTab label="Ownership" value="Ownership" />
        <StyledTab label="Valuation History" value="Valuation History" />
      </StyledTabs>
      <TabPanel value={tabValue} index="Details">
        <div className={classes.parcelForm}>
          <TextField
            autoFocus
            margin="dense"
            id="parcel-number"
            inputProps={{
              'data-testid': 'parcel-number',
              readOnly: isFormReadOnly
            }}
            label="Parcel Number"
            type="text"
            value={parcelNumber}
            onChange={e => setParcelNumber(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            id="address1"
            label="Address1"
            inputProps={{ 'data-testid': 'address1', readOnly: isFormReadOnly }}
            type="text"
            value={address1}
            onChange={e => setAddress1(e.target.value)}
          />
          <TextField
            margin="dense"
            id="address2"
            label="Address2"
            inputProps={{ 'data-testid': 'address2', readOnly: isFormReadOnly }}
            type="text"
            value={address2}
            onChange={e => setAddress2(e.target.value)}
          />
          <TextField
            margin="dense"
            id="city"
            label="city"
            inputProps={{ 'data-testid': 'city', readOnly: isFormReadOnly }}
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <TextField
            margin="dense"
            id="state-province"
            label="State Province"
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
            label="Country"
            type="text"
            inputProps={{ 'data-testid': 'country', readOnly: isFormReadOnly }}
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          <TextField
            margin="dense"
            id="parcel-type"
            label="Parcel Type"
            inputProps={{
              'data-testid': 'parcel-type',
              readOnly: isFormReadOnly
            }}
            type="text"
            value={parcelType}
            onChange={e => setParcelType(e.target.value)}
          />
          <TextField
            margin="dense"
            id="postal-code"
            label="Postal Code"
            inputProps={{
              'data-testid': 'postal-code',
              readOnly: isFormReadOnly
            }}
            type="number"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabValue} index="Ownership">
        {modalType === 'details' &&
          !isEditing &&
          (landParcel?.accounts?.length ? (
            landParcel?.accounts.map(owner => (
              <div key={owner.id}>
                <TextField
                  id={`user-search-${owner.name}`}
                  focused
                  value={owner.fullName || ''}
                  label="Owner"
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
                  label="Address"
                  name="address"
                  className={classes.textField}
                  inputProps={{
                    readOnly: isFormReadOnly
                  }}
                />
              </div>
            ))
          ) : (
            <div>No owner yet</div>
          ))}
        {ownershipFields?.map((_field, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} style={{ display: 'flex' }}>
            <div>
              <TextField
                id={`user-search-${index}`}
                helperText="Enter name of the user and Press enter to search"
                autoFocus
                value={ownershipFields[Number(index)].name}
                label="Owner"
                onChange={event => onChangeOwnershipField(event, index)}
                onKeyDown={e => userSearch(e, index)}
                name="name"
                className={classes.textField}
                inputProps={{
                  'data-testid': 'owner'
                }}
              />
              {showAddress && (
                <TextField
                  focused
                  id={`user-search-${index}`}
                  value={ownershipFields[Number(index)].address}
                  label="Address"
                  onChange={event => onChangeOwnershipField(event, index)}
                  onKeyDown={userSearch}
                  name="address"
                  className={classes.textField}
                  style={{ marginBottom: '15px' }}
                />
              )}
              {search && data && currentIndex === index && (
                <RadioGroup
                  aria-label="user"
                  name="user"
                  onChange={event => handleOwnershipChange(event, index)}
                >
                  {data?.usersLite.map((user, i) => (
                    <FormControlLabel
                      value={i}
                      control={<Radio />}
                      label={user.name}
                      key={user.id}
                    />
                  ))}
                </RadioGroup>
              )}
            </div>
            <div className={classes.removeIcon}>
              <IconButton
                style={{ marginTop: 13 }}
                onClick={() => removeOwnership(index)}
                aria-label="remove"
              >
                <DeleteOutline />
              </IconButton>
            </div>
          </div>
        ))}

        {(modalType === 'new' || isEditing) && (
          <div className={classes.addIcon} role="button" onClick={addOwnership}>
            <AddCircleOutlineIcon />
            <div style={{ marginLeft: '6px', color: 'secondary' }}>
              <Typography align="center" variant="caption">
                New Owner
              </Typography>
            </div>
          </div>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index="Valuation History">
        {modalType === 'details' &&
          !isEditing &&
          (landParcel?.valuations?.length ? (
            landParcel?.valuations.map(valuation => (
              <div className={classes.parcelForm} key={valuation.id}>
                <TextField
                  autoFocus
                  margin="dense"
                  InputProps={{
                    readOnly: isFormReadOnly,
                    startAdornment: <InputAdornment position="start">{currency}</InputAdornment>
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  inputProps={{ style: { paddingTop: '6px' } }}
                  label="Amount"
                  type="number"
                  defaultValue={valuation.amount}
                  required
                />
                <DatePickerDialog
                  label="Start Date"
                  selectedDate={valuation.startDate}
                  handleDateChange={() => {}}
                  inputProps={{ readOnly: isFormReadOnly }}
                  required
                />
              </div>
            ))
          ) : (
            <div>No Valuations Yet</div>
          ))}
        {(modalType === 'new' || isEditing) &&
          valuationFields.map((_field, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div style={{ display: 'flex' }} key={index}>
              <div className={classes.parcelForm}>
                <TextField
                  autoFocus
                  margin="dense"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{currency}</InputAdornment>
                  }}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  inputProps={{
                    'data-testid': 'valuation-amount',
                    style: { paddingTop: '6px' }
                  }}
                  label="Amount"
                  name="amount"
                  type="number"
                  value={valuationFields[Number(index)].amount}
                  onChange={e => onChangeValuationField(e, index)}
                  required
                />
                <DatePickerDialog
                  label="Start Date"
                  selectedDate={valuationFields[Number(index)].startDate}
                  handleDateChange={date => onChangeValuationDateField(date, index)}
                  disablePastDate
                  required
                />
              </div>
              <div className={classes.removeIcon}>
                <IconButton
                  style={{ marginTop: 13 }}
                  onClick={() => removeValuation(index)}
                  aria-label="remove"
                >
                  <DeleteOutline />
                </IconButton>
              </div>
            </div>
          ))}
        {(modalType === 'new' || isEditing) && (
          <div className={classes.addIcon} role="button" onClick={addValuation}>
            <AddCircleOutlineIcon />
            <div style={{ marginLeft: '6px', color: 'secondary' }}>
              <Typography align="center" variant="caption">
                Add Valuation
              </Typography>
            </div>
          </div>
        )}
      </TabPanel>
    </CustomizedDialogs>
  );
}

const useStyles = makeStyles(() => ({
  parcelForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    marginBottom: '30px'
  },
  addIcon: {
    display: 'flex',
    marginTop: '20px',
    color: '#6CAA9F',
    cursor: 'pointer'
  },
  removeIcon: {
    marginTop: '25px',
    marginLeft: '10px'
  },
  textField: {
    width: '450px'
  }
}));

LandParcelModal.defaultProps = {
  handleSubmit: () => {},
  landParcel: null
};

LandParcelModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handelClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  modalType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object
};