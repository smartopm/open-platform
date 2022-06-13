import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-apollo';
import { CustomizedDialogs } from '../../../components/Dialog';
import MessageAlert from '../../../components/MessageAlert';
import DatePickerDialog from '../../../components/DatePickerDialog';
import { UserJourneyUpdateMutation } from '../../../graphql/mutations/user_journey';
import { formatError } from '../../../utils/helpers';

export default function UserJourneyDialog({ open, handleModalClose, refetch, log }) {
  const { t } = useTranslation('users')
  const [state, setState] = useState({
    isError: false,
    message: '',
    isOpen: false,
    isLoading: false
  });
  const [startDate, setDates] = useState(log.startDate);
  const [updateUserJourney] = useMutation(UserJourneyUpdateMutation);

  // force startDate to update when we pick a different log
  useEffect(() => {
    setDates(log.startDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit() {
    setState({ ...state, isLoading: true });
    updateUserJourney({
      variables: {
        id: log.id,
        userId: log.userId,
        startDate,
      }
    })
      .then(() => {
        setState({ ...state, isLoading: false, message: t("users.user_success"), isOpen: true });
        refetch();
      })
      .catch(error => {
        setState({
          ...state,
          isLoading: false,
          message: formatError(error.message),
          isOpen: true,
          isError: true
        });
      });
  }
  return (
    <>
      <MessageAlert
        type={!state.isError ? 'success' : 'error'}
        message={state.message}
        open={state.isOpen}
        handleClose={() => setState({ ...state, isOpen: false })}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleModalClose}
        dialogHeader={t("users.user_step")}
        handleBatchFilter={handleSubmit}
        cancelAction={t("common:form_actions.cancel")}
        saveAction={state.isLoading ? t("common:form_actions.saving") : t("common:form_actions.save")}
      >
        <DatePickerDialog
          key="start_date"
          selectedDate={startDate}
          label={t("users.journey_start")}
          handleDateChange={date => setDates(date)}
          maxDate={log.stopDate || undefined}
        />
      </CustomizedDialogs>
    </>
  );
}

UserJourneyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  log: PropTypes.shape({
    id: PropTypes.string,
    userId: PropTypes.string,
    stopDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    previousStatus: PropTypes.string
  }).isRequired,
  refetch: PropTypes.func.isRequired
};
