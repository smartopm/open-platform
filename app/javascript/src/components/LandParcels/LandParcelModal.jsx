import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from 'react-apollo';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { CustomizedDialogs } from '../Dialog';
import { StyledTabs, StyledTab, TabPanel } from '../Tabs';
import DatePickerDialog from '../DatePickerDialog';
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider';
import { currencies } from '../../utils/constants';
import { UsersLiteQuery } from '../../graphql/queries';
import AddMoreButton from '../../shared/buttons/AddMoreButton';
import Text from '../../shared/Text';
import PaymentPlanForm from './PaymentPlanForm';
import { LandPaymentPlanQuery } from '../../graphql/queries/landparcel';
import PaymentPlan from './PaymentPlan';
import useDebounce from '../../utils/useDebounce';

export default function LandParcelModal({
  open,
  handleClose,
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
  const [ownershipFields, setOwnershipFields] = useState(['']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const debouncedValue = useDebounce(ownershipFields[Number(currentIndex)]?.name, 500);
  const authState = useContext(AuthStateContext);
  const currency = currencies[authState.user?.community.currency] || '';
  const isFormReadOnly = modalType === 'details' && !isEditing;

  useEffect(() => {
    setDetailsFields(landParcel);
    if (open) {
      fetchPaymentPlan()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [searchUser, { data }] = useLazyQuery(UsersLiteQuery, {
    variables: { query: debouncedValue, limit: 10 },
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  const [fetchPaymentPlan, {data: paymentPlanData, called, refetch}] = useLazyQuery(LandPaymentPlanQuery, {
    variables: { landParcelId:  landParcel?.id}
  })

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
    fields[Number(index)] = { ...fields[Number(index)], name: selected?.name, userId: selected?.id };
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
    setTabValue('Details');
    setValuationFields([]);
    setOwnershipFields([]);
    setIsEditing(false);
  }

  function cleanUpOnModalClosing(){
    setIsEditing(false);
    setShowPaymentPlan(false);
    handleClose()
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

  function filteredOwnerList(users) {
    if (!users) return [];
    const currentOwners = (landParcel?.accounts.map((account) => account.user.Id) || []).concat(ownershipFields.map((field) => field.userId))
    return users.filter((user) => !currentOwners?.includes(user.id))
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={cleanUpOnModalClosing}
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
              <div key={owner.id} className={classes.parcelForm}>
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
          <div key={index} style={{ display: 'flex', marginBottom: '30px' }}>
            <div style={{ width: "100%" }}>
              <Autocomplete
                data-testid="owner"
                style={{ width: "100%" }}
                id="address-input"
                options={filteredOwnerList(data?.usersLite)}
                getOptionLabel={option => option?.name}
                getOptionSelected={(option, value) => option.name === value.name}
                value={ownershipFields[Number(index)]}
                onChange={(_event, newValue) => handleOwnershipChange(newValue, index)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Add owner"
                    style={{ width: "100%" }}
                    name="name"
                    onChange={event => onChangeOwnershipField(event, index)}
                      // eslint-disable-next-line no-unused-vars
                    onKeyDown={(_e) => userSearch(index)}
                  />
                  )}
              />
              <TextField
                focused
                id={`user-search-${index}`}
                value={ownershipFields[Number(index)].address}
                label="Address"
                onChange={event => onChangeOwnershipField(event, index)}
                name="address"
                className={classes.textField}
                style={{ marginBottom: '15px' }}
              />
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
          <>
            <AddMoreButton title="New Owner" handleAdd={addOwnership} />
          </>
        )}
        <br />
        {
          (called && paymentPlanData?.landParcelPaymentPlan) && (
            <PaymentPlan
              percentage={paymentPlanData?.landParcelPaymentPlan.percentage}
              type={paymentPlanData?.landParcelPaymentPlan.planType}
            />
          )
        }
        {showPaymentPlan && !paymentPlanData?.landParcelPaymentPlan && (
          <>
            <br />
            <Text content="Purchase Plan" />
            <PaymentPlanForm landParcel={landParcel} refetch={refetch} />
          </>
        )}
        {
        /*
          Only show add purchase plan button when:
            - landparcel has owner
            - landparcel doesn't have an existing payment plan
        */
        }
        {Boolean(landParcel?.accounts?.length &&
          isEditing) &&
          (called && !paymentPlanData?.landParcelPaymentPlan) && (
            <AddMoreButton
              title={`${showPaymentPlan ? 'Hide Payment Plan Form' : 'Add Purchase Plan'}`}
              handleAdd={() => setShowPaymentPlan(!showPaymentPlan)}
            />
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
          <AddMoreButton title="Add Valuation" handleAdd={addValuation} />
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
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  modalType: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  landParcel: PropTypes.object
};
