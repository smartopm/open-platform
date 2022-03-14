import { Button, useTheme } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { useLazyQuery } from 'react-apollo';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { Spinner } from '../../../shared/Loading';
import { logbookEventLogsQuery } from '../graphql/guestbook_queries';
import LogsReportView from './LogsReportView';

const csvHeaders = [
  { label: 'Type', key: 'subject' },
  { label: 'Guard Name', key: 'actingUser.name' },
  { label: 'Date', key: 'createdAt' },
  { label: 'Guest', key: 'user.name' }
];

export default function GateFlowReport() {
  const [reportingDates, setReportingDates] = useState({ startDate: null, endDate: null });
  const theme = useTheme();
  const { t } = useTranslation('common');
  const ref = useRef();

  const [loadData, { loading, data, called }] = useLazyQuery(logbookEventLogsQuery, {
    variables: { ...reportingDates },
    fetchPolicy: 'cache-and-network'
  });

  function handleChangeReportingDates(event) {
    const { name, value } = event.target;
    setReportingDates({ ...reportingDates, [name]: value });
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
          data={data?.logbookEventLogs || []}
          style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
          headers={csvHeaders}
        //   TODO: Rename later
          filename="logbook_events-data.csv"
          ref={ref}
        >
          {t('misc.download')}
        </CSVLink>
      )}
    </LogsReportView>
  );
}
