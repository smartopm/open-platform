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
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { CustomizedDialogs } from '../../../../components/Dialog';
import DatePickerDialog from '../../../../components/DatePickerDialog';
import { paymentPlanStatus, paymentPlanFrequency, subscriptionPlanType } from '../../../../utils/constants';
import { PaymentPlanCreateMutation } from '../../../../graphql/mutations/land_parcel';
import { dateToString } from '../../../../components/DateContainer';
import { capitalize, formatError, ifNotTest, titleize } from '../../../../utils/helpers';
import SwitchInput from '../../../Forms/components/FormProperties/SwitchInput';

const initialPlanState = {
  status: 0,
  planType: '',
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
  showSnackbar,
  messageType,
  balanceRefetch,
  genRefetch
}) {
  const [landParcelId, setLandParcelId] = useState('');
  const { t } = useTranslation(['payment', 'common']);
  const [landParcel, setLandParcel] = useState("");
  const [frequency, setFrequency] = useState(2);
  const [coOwnersIds, setCoOwnersIds] = useState([]);
  const [createPaymentPlan] = useMutation(PaymentPlanCreateMutation);
  const [inputValue, setInputValues] = useState(initialPlanState);
  const [isError, setIsError] = useState(false);
  const [renewable, setRenewable] = useState(true);
  const [mutationLoading, setMutationLoading] = useState(false);

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
      setCoOwnersIds([...coOwnersIds, accountUserId]);
    } else {
      setCoOwnersIds([...coOwnersIds.slice(0, index), ...coOwnersIds.slice(index + 1)]);
    }
  }

  function handleFrequency(event, frequencyValue) {
    setFrequency(frequencyValue);
  }

  function getCalendarDuration() {
    let calendarDuration = '';
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
        calendarDuration = '';
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
    setRenewable(true);
    setMutationLoading(false);
  }

  function confirmSubmission(event) {
    event.preventDefault();
    if (!inputValue.installmentAmount || !inputValue.duration || !landParcelId || frequency === null || !inputValue.planType) {
      setIsError(true);
      return;
    }

    handleSubmit();
  }

  function handleSubmit() {
    setMutationLoading(true);
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
        frequency,
        renewable
      }
    })
      .then(() => {
        cleanModal();
        genRefetch();
        paymentPlansRefetch();
        showSnackbar({ type: messageType.success, message: 'Successfuly created payment plan' });
        handleModalClose();
        balanceRefetch();
      })
      .catch(err => {
        showSnackbar({ type: messageType.error, message: formatError(err.message) });
      });
  }

  return (
    <CustomizedDialogs
      open={open}
      handleModal={handleModalClose}
      dialogHeader={t('misc.create_a_plan')}
      subHeader={t('misc.create_a_payment_plan')}
      handleBatchFilter={confirmSubmission}
      disableActionBtn={mutationLoading}
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
          t={t}
        />
        <div>
          <TextField
            autoFocus={ifNotTest()}
            margin="normal"
            id="frequency"
            aria-label="frequency"
            label={t('common:misc.plan_frequency')}
            value=""
            disabled
            name="frequency"
            style={{ width: '100%' }}
            error={isError && frequency === null}
            helperText={isError && frequency === null && t("common:misc.select_frequency")}
          />
        </div>
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
            className='plan-duration-txt-input'
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
            className='plan-amount-txt-input'
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
          autoFocus={ifNotTest()}
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
          autoFocus={ifNotTest()}
          margin="normal"
          id="purchase_plan"
          aria-label="purchase_plan"
          label={t('table_headers.plan_type')}
          value={inputValue.planType}
          onChange={handleInputChange}
          name="planType"
          style={{ width: '100%' }}
          InputProps={{
            className: 'plan-type-select-input'
          }}
          required
          select
          error={isError && !inputValue.planType}
          helperText={isError && inputValue.planType === '' && t('errors.plan_type_required')}
        >
          {Object.entries(subscriptionPlanType)?.map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {titleize(value)}
            </MenuItem>
          ))}
        </TextField>
        <div className="MuiFormLabel-root" style={{marginLeft : '-15px', marginTop: '10px'}}>
          <SwitchInput
            name="renewable"
            label={t('misc.renewable')}
            value={renewable}
            handleChange={event => {setRenewable(event.target.checked)}}
          />
        </div>
        <TextField
          autoFocus={ifNotTest()}
          margin="normal"
          id="plot"
          aria-label="plot"
          label={t('table_headers.select_plot')}
          onChange={event => handleLandParcelSelect(event)}
          name="plot"
          style={{ width: '100%' }}
          required
          value={landParcel}
          InputProps={{
            className: 'plan-plot-select-input'
          }}
          select={landParcelsData?.userLandParcels?.length > 0}
          error={isError && !landParcelId}
          helperText={isError && !landParcelId && t('errors.property_required')}
        >
          {landParcelsData?.userLandParcels?.map(parcel => (
            <MenuItem key={parcel.id} value={parcel}>
              {`${titleize(parcel.objectType) || 'Land'}: ${parcel.parcelNumber}`}
            </MenuItem>
          ))}
        </TextField>
        {landParcelsData?.userLandParcels?.length === 0 && (
          <Typography color="textSecondary" style={{ marginBottom: '10px' }}>
            {t('errors.no_plot')}
          </Typography>
        )}
        {landParcel?.accounts?.length > 1 && (
          <CoOwners
            landParcel={landParcel}
            userId={userId}
            handleCoOwners={handleCoOwners}
            coOwnersIds={coOwnersIds}
          />
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

export function CoOwners({ landParcel, userId, handleCoOwners, coOwnersIds }) {
  const { t } = useTranslation('common');
  return (
    <>
      <div>
        <FormLabel data-testid="form-label">{t('common:form_placeholders.select_co_owners')}</FormLabel>
      </div>
      <div>
        {landParcel?.accounts?.map(
          account =>
            account.userId !== userId && (
              <div key={account.userId}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      name="coOwner"
                      color="primary"
                      checked={coOwnersIds.includes(account.userId)}
                      value={account.userId}
                      onChange={() => handleCoOwners(account.userId)}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    >
                      {account.fullName}
                    </Checkbox>
                )}
                  label={account.fullName}
                />
              </div>
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

PaymentPlanModal.defaultProps = {
  landParcelsData: {
    userLandParcels: []
  },
  genRefetch: () => {},
  balanceRefetch: () => {},
  paymentPlansRefetch: () => {}
}

FrequencyButton.defaultProps = {
  data: {
    key: ''
  }
}

PaymentPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
  userData: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  currency: PropTypes.string.isRequired,
  paymentPlansRefetch: PropTypes.func,
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
    )
  }),
  showSnackbar: PropTypes.func.isRequired,
  messageType: PropTypes.shape({
    success: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  balanceRefetch: PropTypes.func,
  genRefetch: PropTypes.func
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
  handleCoOwners: PropTypes.func.isRequired,
  coOwnersIds: PropTypes.arrayOf(PropTypes.string).isRequired
};

FrequencyButton.propTypes = {
  frequency: PropTypes.number.isRequired,
  handleFrequency: PropTypes.func.isRequired,
  data: PropTypes.shape({
    key: PropTypes.string
  })
};
