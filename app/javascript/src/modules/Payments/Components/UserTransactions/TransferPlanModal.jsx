import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MessageAlert from '../../../../components/MessageAlert';
import { Spinner } from '../../../../shared/Loading';
import { UserLandParcel } from '../../../../graphql/queries';
import { TransferPaymentPlanMutation } from '../../graphql/payment_plan_mutations';
import { formatError } from '../../../../utils/helpers';

export default function sTransferPlanModal({
  open,
  handleModalClose,
  planData,
  userId,
  paymentPlanId,
  refetch,
  balanceRefetch
}) {
  const [isSuccessAlert, setIsSuccessAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [acceptanceCheckbox, setAcceptanceCheckbox] = useState(false);
  const [landParcelId, setLandParcelId] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [transferPaymentPlan] = useMutation(TransferPaymentPlanMutation);
  const classes = useStyles();
  const { t } = useTranslation('common');
  const [loadLandParcel, { loading, data } ] = useLazyQuery(UserLandParcel,{
    variables: { userId },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })

  function handleMessageAlertClose(_event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    setMessageAlert('');
  }

  function handleRadioChange(event) {
    setLandParcelId(event.target.value);
  }

  function handleAcceptanceCheckChange() {
    setAcceptanceCheckbox(!acceptanceCheckbox);
  }

  function handleSubmit(e) {
    e.preventDefault();
    transferPaymentPlan({
      variables: { paymentPlanId, landParcelId }
    }).then(res => {
      const resLandParcel = res.data?.transferPaymentPlan?.paymentPlan?.landParcel;
      const landParcelName = `${resLandParcel.parcelType} ${resLandParcel.parcelNumber}`;
      handleModalClose();
      setMessageAlert(t('common:misc.plan_transferred_successfully', { landParcelName }));
      setIsSuccessAlert(true);
      refetch();
      balanceRefetch();
    }).catch(err => {
      handleModalClose();
      setMessageAlert(formatError(err.message));
      setIsSuccessAlert(false);
    })
  }

  useEffect(() => {
    if (open) {
      loadLandParcel({variables: { userId },
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'})
    } else {
      setAcceptanceCheckbox(false);
      setLandParcelId('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (landParcelId.length !== 0 && acceptanceCheckbox) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [landParcelId, acceptanceCheckbox])

  if (loading) return <Spinner />

  return (
    <>
      <MessageAlert
        type={isSuccessAlert ? 'success' : 'error'}
        message={messageAlert}
        open={!!messageAlert}
        handleClose={handleMessageAlertClose}
      />
      <Dialog fullWidth open={open} onClose={handleModalClose} aria-labelledby="entry-dialog-title" data-testid="entry-dialog">
        <DialogTitle id="entry-dialog-title" className={classes.title} data-testid="entry-dialog-title">
          {t('common:menu.transfer_plan')}
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            <Typography paragraph variant="h6" color="textPrimary" display='body'>
              Select the Plot you want to migrate this plan to?
            </Typography>
            <Typography className={classes.content} paragraph variant="body1" color="textPrimary" display='body'>
              {
                (data?.userLandParcel.length > 1) ?
                  (
                    <LandParcelForTransferPlan
                      data={data}
                      landParcelId={landParcelId}
                      planLandParcelId={planData?.landParcel?.id}
                      handleRadioChange={handleRadioChange}
                    />
                  ) : (
                    <Typography className={classes.content} paragraph variant="body1" color="secondary" display='body'>
                      {t('common:misc.no_property_found_for_plan_transfer')}
                    </Typography>
                  )
              }
            </Typography>
            <Typography className={classes.footer} paragraph variant="body1" color="textPrimary" display='body'>
              { (data?.userLandParcel.length > 1) &&
                (
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        (
                          <Checkbox
                            checked={acceptanceCheckbox}
                            onChange={handleAcceptanceCheckChange}
                            name="acceptanceCheckbox"
                          />
                        )
                      }
                      label={t('common:misc.transfer_plan_acceptance')}
                      labelPlacement="end"
                    />
                  </FormGroup>
                )
              }
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleModalClose}
            color="default"
            variant="outlined"
            data-testid="cancel"
          >
            {t('common:misc.close')}
          </Button>
          <Button
            onClick={handleSubmit}
            color="secondary"
            variant="contained"
            data-testid="save"
            style={{ color: 'white' }}
            autoFocus
            disabled={!canSubmit}
          >
            {t('common:menu.transfer_plan').toUpperCase()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function LandParcelForTransferPlan({data, landParcelId, planLandParcelId, handleRadioChange}) {
  const filteredLandParcels = data?.userLandParcel.filter(land => land.id !== planLandParcelId)

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="landParcelId"
        name="landParcelId"
        value={landParcelId}
        onChange={handleRadioChange}
      >
        {
          filteredLandParcels.map(land => (
            <FormControlLabel
              key={land.id}
              checked={landParcelId === land?.id}
              value={land?.id}
              control={<Radio />}
              label={`${land.parcelType} ${land.parcelNumber}`}
            />
          ))
        }
      </RadioGroup>
    </FormControl>
  )
}

TransferPlanModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  planData: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  paymentPlanId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
  balanceRefetch: PropTypes.func.isRequired,
}

LandParcelForTransferPlan.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object.isRequired,
  landParcelId: PropTypes.string.isRequired,
  planLandParcelId: PropTypes.string.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
}

const useStyles = makeStyles(() => ({
  title: {
    color: '#cf5628',
    borderBottom: `1px #cf5628 solid`
  },
  content: {
    marginTop: '5%'
  },
  footer: {
    marginTop: '25%'
  }
}));