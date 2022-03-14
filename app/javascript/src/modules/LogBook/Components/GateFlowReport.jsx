import { Button, useTheme } from '@material-ui/core';
import React, { useState } from 'react';
import { useLazyQuery } from 'react-apollo';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../shared/Loading';
import { logbookEventLogsQuery } from '../graphql/guestbook_queries';
import LogsReportView from './LogsReportView';
import { dateToString } from '../../../components/DateContainer'
import { objectAccessor } from '../../../utils/helpers';

const csvHeaders = [
  { label: 'Date', key: 'logDate' },
  { label: 'Type', key: 'type' },
  { label: 'Acting User', key: 'actingUser.name' },
  { label: 'Guest', key: 'guest' },
  { label: 'Extra Note', key: 'extraNote' },
  { label: 'Reason', key: 'reason' },
];

export default function GateFlowReport() {
  const [reportingDates, setReportingDates] = useState({ startDate: null, endDate: null });
  const theme = useTheme();
  const { t } = useTranslation('common');

  const [loadData, { loading, data, called }] = useLazyQuery(logbookEventLogsQuery, {
    variables: { ...reportingDates },
    fetchPolicy: 'cache-and-network'
  });



  function handleChangeReportingDates(event) {
    const { name, value } = event.target;
    setReportingDates({ ...reportingDates, [name]: value });
  }

  const subjects = {
    user_entry: 'Scanned Entry',
    visitor_entry: 'Granted Access',
    observation_log: 'Observation',
  }

  function formatCsvData(csvData) {
    return csvData.map(val => ({
        ...val,
      logDate: dateToString(val.createdAt, 'MM-DD-YYYY HH:mm'),
      guest: val.entryRequest?.name || val.data.ref_name || val.data.visitor_name || val.data.name,
      type: objectAccessor(subjects, val.subject),
      extraNote: val.data.note || '-',
      reason: val.entryRequest?.reason
    }));
  }

  return (
    <LogsReportView
      startDate={reportingDates.startDate}
      endDate={reportingDates.endDate}
      handleChange={handleChangeReportingDates}
    >
      {!called && (
        <Button variant="outlined" color="primary" onClick={loadData}>
          {loading ? <Spinner /> : t('actions.export_data')}
        </Button>
      )}
      {data?.logbookEventLogs.length > 0 && (
        <CSVLink
          data={formatCsvData(data?.logbookEventLogs || [])}
          style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
          headers={csvHeaders}
        //   TODO: Rename later
          filename="logbook_events-data.csv"
        >
          {t('misc.download')}
        </CSVLink>
      )}
    </LogsReportView>
  );
}
