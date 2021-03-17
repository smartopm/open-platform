import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomizedDialogs } from '../Dialog';
import MessageAlert from '../MessageAlert';
import DatePickerDialog from '../DatePickerDialog';

export default function UserJourneyDialog({ open, handleModalClose, refetch, logId }) {
  const [messageAlert, setMessageAlert] = useState({ isError: false, message: '', isOpen: false });
  const [dates, setDates] = useState({ startDate: new Date(), endDate: new Date() });
  function handleSubmit() {
    refetch();
    console.log(logId);
  }
  return (
    <>
      <MessageAlert
        type={!messageAlert.isError ? 'success' : 'error'}
        message={messageAlert.message}
        open={messageAlert.isOpen}
        handleClose={() => setMessageAlert({ ...messageAlert, isOpen: false })}
      />
      <CustomizedDialogs
        open={open}
        handleModal={handleModalClose}
        dialogHeader="Edit Start and End Date"
        handleBatchFilter={handleSubmit}
      >
        <DatePickerDialog
          key="start_date"
          selectedDate={dates.startDate}
          label="Customer Journey Start Date"
          handleDateChange={date => setDates({ ...dates, startDate: date })}
        />
        <DatePickerDialog
          key="end_date"
          selectedDate={dates.endDate}
          label="Customer Journey End Date"
          handleDateChange={date => setDates({ ...dates, endDate: date })}
        />
      </CustomizedDialogs>
    </>
  );
}

UserJourneyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  logId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired
};
