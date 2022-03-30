import React, { useState } from 'react';
import { Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { useLazyQuery } from 'react-apollo';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { Download } from '@mui/icons-material';
import { Spinner } from '../../../shared/Loading';
import { logbookEventLogsQuery } from '../graphql/guestbook_queries';
import LogsReportView from './LogsReportView';
import { dateToString } from '../../../components/DateContainer';
import { formatCsvData } from '../utils';
import MessageAlert from '../../../components/MessageAlert';
import { formatError } from '../../../utils/helpers';

export default function GateFlowReport() {
  const [reportingDates, setReportingDates] = useState({ startDate: null, endDate: null });
  const theme = useTheme();
  const { t } = useTranslation(['common', 'logbook']);
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [message, setMessage] = useState({ isError: false, detail: '' });

  const [loadData, { loading, data, called }] = useLazyQuery(logbookEventLogsQuery, {
    variables: { ...reportingDates },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    onCompleted: () =>
      setMessage({
        ...message,
        detail: data?.logbookEventLogs.length
          ? t('logbook:guest_book.export_data_successfully')
          : t('logbook:guest_book.export_no_data'),
        isError: !data?.logbookEventLogs.length
      }),
    onError: error => setMessage({ ...message, detail: formatError(error.message), isError: true })
  });

  function handleChangeReportingDates(event) {
    const { name, value } = event.target;
    setReportingDates({ ...reportingDates, [name]: value });
  }

  const csvHeaders = [
    { label: t('logbook:csv.date'), key: 'logDate' },
    { label: t('logbook:csv.type'), key: 'type' },
    { label: t('logbook:log_title.guard'), key: 'guard' },
    { label: t('logbook:log_title.host'), key: 'host' },
    { label: t('logbook:csv.guest'), key: 'guest' },
    { label: t('logbook:csv.extra_note'), key: 'extraNote' },
    { label: t('logbook:csv.reason'), key: 'reason' }
  ];

  const subjects = {
    user_entry: t('logbook:csv.user_entry'),
    visitor_entry: t('logbook:csv.visitor_entry'),
    observation_log: t('logbook:csv.user_entry')
  };

  return (
    <>
      <MessageAlert
        type={message.isError ? 'error' : 'success'}
        message={message.detail}
        open={!!message.detail}
        handleClose={() => setMessage({ ...message, detail: '' })}
      />
      <LogsReportView
        startDate={reportingDates.startDate}
        endDate={reportingDates.endDate}
        handleChange={handleChangeReportingDates}
      >
        {!data?.logbookEventLogs.length > 0 && (
          <Button
            variant="outlined"
            color="primary"
            onClick={loadData}
            data-testid="export_data"
            disabled={!reportingDates.startDate || !reportingDates.endDate}
            startIcon={loading && <Spinner />}
          >
            {isSmall ? <Download color="primary" /> : t('misc.export_data')}
          </Button>
      )}

        {called && data?.logbookEventLogs.length > 0 && (
          <CSVLink
            data={formatCsvData(data?.logbookEventLogs || [], subjects)}
            style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
            headers={csvHeaders}
            filename={`logbook_events-data-${dateToString(new Date(), 'MM-DD-YYYY-HH:mm')}.csv`}
          >
            <Button variant="outlined" color="primary">
              {t('misc.download')}
            </Button>
          </CSVLink>
      )}
      </LogsReportView>
    </>

  );
}
