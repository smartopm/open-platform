import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import PropTypes from 'prop-types';
import {
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Checkbox,
  FormControlLabel,
  FormLabel
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { CustomizedDialogs } from '../../../../components/Dialog';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import { paymentPlanStatus, paymentPlanFrequency } from '../../../../utils/constants';
import { PaymentPlanCreateMutation } from '../../../../graphql/mutations/land_parcel';
import { dateToString } from '../../../../components/DateContainer';
import { capitalize, formatError } from '../../../../utils/helpers';

const initialPlanState = {
  status: 0,
  planType: 'lease',
  startDate: new Date(),
  amount: '',
  totalAmount: 0,
  duration: ''
};

export default function PaymentPlanModal({
  open,
  handleModalClose,
  userId,
  userData,
  currency,
  paymentPlansRefetch,
  landParcelsData,
  setMessage,
  openAlertMessage
}) {
  const [landParcelId, setLandParcelId] = useState('');
  const { t } = useTranslation(['payment', 'common']);
  const [landParcel, setLandParcel] = useState(null);
  const [frequency, setFrequency] = useState(2);
  const coOwnersIds = [];
  const [createPaymentPlan] = useMutation(PaymentPlanCreateMutation);
  const [inputValue, setInputValues] = useState(initialPlanState);
  const [isError, setIsError] = useState(false);

  function handleInputChange(event) {
    const { name, value } = event.target;
    const fields = { ...inputValue };
    fields[String(name)] = value;
    setInputValues(fields);
  }

  function handleLandParcelSelect(event) {
    setLandParcel(event.target.value);
    setLandParcelId(event.target.value.id);
  }

  function handleCoOwners(accountUserId) {
    const index = coOwnersIds.indexOf(accountUserId);
    if (index === -1) {
      coOwnersIds.push(accountUserId);
    } else {
      coOwnersIds.splice(index, 1);
    }
  }

  function handleFrequency(event, frequencyValue) {
    setFrequency(frequencyValue);
  }

  function getCalendarDuration() {
    let calendarDuration = 'months';
    switch (frequency) {
      case 0: {
        calendarDuration = 'days';
        break;
      }
      case 1: {
        calendarDuration = 'weeks';
        break;
      }
      case 2: {
        calendarDuration = 'months';
        break;
      }
      case 3: {
        calendarDuration = 'quarters';
        break;
      }
      default: {
        calendarDuration = 'months';
        break;
      }
    }
    return calendarDuration;
  }

  function getEndDate() {
    const endDate = new Date(inputValue.startDate);
    const duration = parseInt(inputValue.duration, 10);
    switch (frequency) {
      case 0: {
        endDate.setDate(endDate.getDate() + duration);
        break;
      }
      case 1: {
        endDate.setDate(endDate.getDate() + duration * 7);
        break;
      }
      case 2: {
        endDate.setMonth(endDate.getMonth() + duration);
        break;
      }
      case 3: {
        endDate.setMonth(endDate.getMonth() + duration * 3);
        break;
      }
      default: {
        endDate.setMonth(endDate.getMonth() + duration);
        break;
      }
    }
    return endDate;
  }

  function cleanModal() {
    setInputValues(initialPlanState);
    setFrequency(2);
  }

  function confirmSubmission(event) {
    event.preventDefault();
    if (!inputValue.installmentAmount || !inputValue.duration || !landParcelId) {
      setIsError(true);
      return;
    }

    handleSubmit();
  }

  function handleSubmit() {
    createPaymentPlan({
      variables: {
        userId,
        landParcelId,
        coOwnersIds,
        status: inputValue.status,
        planType: inputValue.planType,
        startDate: inputValue.startDate,
        installmentAmount: parseFloat(inputValue.installmentAmount),
        totalAmount: parseFloat(inputValue.installmentAmount) * parseInt(inputValue.duration, 10),
        duration: parseInt(inputValue.duration, 10),
        frequency
      }
    })
      .then(() => {
        cleanModal();
        paymentPlansRefetch();
        setMessage({ isError: false, detail: 'Successfuly created payment plan' });
        openAlertMessage();
        handleModalClose();
      })
      .catch(err => {
        setMessage({ isError: true, detail: formatError(err.message) });
        openAlertMessage();
      });
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handleModalClose}
      dialogHeader={t('misc.create_a_plan')}
      subHeader={t('misc.create_a_payment_plan')}
      handleBatchFilter={confirmSubmission}
    >
      <>
        <TextField
          id="owner"
          aria-label="owner"
          label={t('table_headers.owner')}
          defaultValue={userData.name}
          name="owner"
          style={{ width: '100%' }}
          disabled
        />
        <DatePickerDialog
          selectedDate={inputValue.startDate}
          handleDateChange={date =>
            handleInputChange({ target: { name: 'startDate', value: date } })
          }
          label={t('common:table_headers.start_date')}
          required
        />
        <FrequencyButton
          frequency={frequency}
          handleFrequency={handleFrequency}
          data={paymentPlanFrequency}
        />
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <TextField
            margin="normal"
            id="duration"
            label={t('table_headers.plan_duration')}
            aria-label="duration"
            value={inputValue.duration}
            onChange={handleInputChange}
            name="duration"
            style={{ marginRight: '15px' }}
            type="number"
            required
            InputProps={{
              inputProps: {
                min: 1
              },
              endAdornment: <InputAdornment position="end">{getCalendarDuration()}</InputAdornment>
            }}
            error={isError && !inputValue.duration}
            helperText={isError && !inputValue.duration && t('errors.duration_requied')}
          />
          <TextField
            margin="normal"
            id="installment-amount"
            label={t('common:table_headers.amount')}
            aria-label="installment-amount"
            value={inputValue.installmentAmount}
            onChange={handleInputChange}
            name="installmentAmount"
            type="number"
            required
            InputProps={{
              inputProps: {
                min: 1
              },
              startAdornment: <InputAdornment position="start">{currency}</InputAdornment>
            }}
            error={isError && !inputValue.installmentAmount}
            helperText={isError && !inputValue.installmentAmount && t('errors.amount_required')}
          />
        </div>
        {inputValue.duration && (
          <Typography variant="subtitle1" color="textPrimary">
            {`Your plan ends on ${dateToString(getEndDate())}`}
          </Typography>
        )}
        <TextField
          autoFocus
          margin="normal"
          id="status"
          aria-label="status"
          label={t('common:table_headers.status')}
          value={inputValue.status}
          onChange={handleInputChange}
          name="status"
          style={{ width: '100%' }}
          required
          select
          error={isError && !Number.isInteger(inputValue.status)}
          helperText={isError && inputValue.status === '' && t('errors.status_required')}
        >
          {Object.entries(paymentPlanStatus)?.map(([key, val]) => (
            <MenuItem key={key} value={Number(key)}>
              {val}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          autoFocus
          margin="normal"
          id="purchase_plan"
          aria-label="purchase_plan"
          label={t('table_headers.plan_type')}
          value={inputValue.planType}
          onChange={handleInputChange}
          name="planType"
          style={{ width: '100%' }}
          required
          select
        >
          <MenuItem key="lease_" value="lease">
            {t('misc.lease')}
          </MenuItem>
          <MenuItem key="other" value="other">
            {t('misc.other')}
          </MenuItem>
        </TextField>
        <TextField
          autoFocus
          margin="normal"
          id="plot"
          aria-label="plot"
          label={t('table_headers.select_plot')}
          onChange={event => handleLandParcelSelect(event)}
          name="plot"
          style={{ width: '100%' }}
          required
          select
          error={isError && !landParcelId}
          helperText={isError && !landParcelId && t('errors.property_required')}
        >
          {landParcelsData?.userLandParcels?.map(parcel => (
            <MenuItem key={parcel.id} value={parcel}>
              {parcel.parcelNumber}
            </MenuItem>
          ))}
        </TextField>
        {landParcelsData?.userLandParcels.length === 0 && (
          <Typography color="textSecondary" style={{ marginBottom: '10px' }}>
            {t('errors.no_plot')}
          </Typography>
        )}
        {landParcel?.accounts?.length && (
          <CoOwners landParcel={landParcel} userId={userId} handleCoOwners={handleCoOwners} />
        )}
        {inputValue.duration && inputValue.installmentAmount && (
          <>
            <Typography variant="subtitle1" color="textSecondary">
              {t('table_headers.total_value')}
            </Typography>
            <Typography variant="h5" color="primary">
              {`${currency} `}
              {inputValue.duration * inputValue.installmentAmount}
            </Typography>
          </>
        )}
        <Typography color="textPrimary">
          {t('errors.all_bills')}
        </Typography>
      </>
    </CustomizedDialogs>
  );
}

export function CoOwners({ landParcel, userId, handleCoOwners }) {
  return (
    <>
      <div>
        <FormLabel>Select co-owners you would like to add to this plan</FormLabel>
      </div>
      <div>
        {landParcel?.accounts?.map(
          account =>
            account.userId !== userId && (
              <FormControlLabel
                control={(
                  <Checkbox
                    name="coOwner"
                    color="primary"
                    value={account.userId}
                    onChange={() => handleCoOwners(account.userId)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  >
                    {account.fullName}
                  </Checkbox>
                )}
                label={account.fullName}
              />
            )
        )}
      </div>
    </>
  );
}

export function FrequencyButton({ frequency, handleFrequency, data }) {
  return (
    <ToggleButtonGroup
      value={frequency}
      exclusive
      onChange={handleFrequency}
      aria-label="toggle different frequncies"
      style={{ marginTop: '10px' }}
    >
      {Object.entries(data).map(([key, val]) => (
        <ToggleButton
          value={Number(key)}
          key={key}
          style={{ background: '#bdf2ec', marginRight: '10px' }}
          aria-label={val}
        >
          {capitalize(val)}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

PaymentPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  currency: PropTypes.string.isRequired,
  paymentPlansRefetch: PropTypes.func.isRequired,
  landParcelsData: PropTypes.shape({
    userLandParcels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        parcelNumber: PropTypes.string.isRequired,
        accounts: PropTypes.arrayOf(
          PropTypes.shape({
            userId: PropTypes.string.isRequired,
            fullName: PropTypes.string.isRequired
          })
        )
      })
    ).isRequired
  }).isRequired,
  setMessage: PropTypes.func.isRequired,
  openAlertMessage: PropTypes.func.isRequired
};

CoOwners.propTypes = {
  landParcel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    parcelNumber: PropTypes.string.isRequired,
    accounts: PropTypes.arrayOf(
      PropTypes.shape({
        userId: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  userId: PropTypes.string.isRequired,
  handleCoOwners: PropTypes.func.isRequired
};

FrequencyButton.propTypes = {
  frequency: PropTypes.number.isRequired,
  handleFrequency: PropTypes.func.isRequired,
  data: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired
};
