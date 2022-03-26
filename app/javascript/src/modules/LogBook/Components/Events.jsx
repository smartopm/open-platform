/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React from "react";
import GetAppIcon from '@mui/icons-material/GetApp';
import Fab from "@mui/material/Fab";
import { useTranslation } from "react-i18next";
import { Link } from "@mui/material";
import { useTheme } from "@mui/styles";
import { dateToString, dateTimeToString } from "../../../components/DateContainer";


export default function Events({
    data,
    nextPage,
    previousPage,
    offset,
    userToken
  }) {
    const limit = 30;
    const { t } = useTranslation(['logbook', 'common'])
    const theme = useTheme()
    function logs(eventLogs) {
      if (!eventLogs) {
        return;
      }
      return eventLogs.map(entry => (
        <tr key={entry.id}>
          <td>{entry.subject}</td>
          <td>
            {
              entry.subject === 'user_feedback' ? `${entry.sentence} ${entry.data.note}` : entry.sentence
            }
          </td>
          <td>{dateToString(entry.createdAt)}</td>
          <td>{dateTimeToString(entry.createdAt)}</td>
          <td>{entry.subject === 'user_entry' && entry.data.digital !== null ? `${entry.data.digital ? t('logbook.digital_scan') : t('logbook.print_scan')} ` : 'N/A'}</td>
          <td>
            {entry.subject === 'user_entry' && entry.data.timestamp
            ? `${entry.data.timestamp && `${dateToString(new Date(Number(entry.data.timestamp)))}
              ${dateTimeToString(Number(entry.data.timestamp))}`} ` : 'N/A'}
          </td>
          <td>{entry.data?.type ? t(`common:user_types.${entry.data?.type}`) : t('logbook.entry_request')}</td>
        </tr>
      ));
    }
    return (
      <div>
        <div
          style={{
            backgroundColor: theme.palette.primary.main
          }}
        />
        <div className="row justify-content-center">
          <div className="col-11 col-sm-11 table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t('log_title.subject')}</th>
                  <th scope="col">{t('log_title.description')}</th>
                  <th scope="col">{t('log_title.date')}</th>
                  <th scope="col">{t('log_title.time')}</th>
                  <th scope="col">{t('log_title.scan_type')}</th>
                  <th scope="col">{t('log_title.qr_timestamp')}</th>
                  <th scope="col">{t('common:form_fields.user_type')}</th>
                </tr>
              </thead>
              <tbody>{logs(data.result)}</tbody>
            </table>
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${offset < limit && "disabled"}`}>
                  <Link className="page-link" onClick={previousPage} href="#" underline="hover">
                    {t('common:misc.previous')}
                  </Link>
                </li>
                <li
                  className={`page-item ${data.result.length < limit &&
                    "disabled"}`}
                >
                  <Link className="page-link" href="#" onClick={nextPage} underline="hover">
                    {t('common:misc.next')}
                  </Link>
                </li>
              </ul>
            </nav>

          </div>
          <Fab
            variant="extended"
            color="primary"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 57,
            }}
            href={`/csv_export/event_logs?token=${userToken}`}
          >
            <GetAppIcon />
            {' '}
            {t('common:misc.download')}
          </Fab>
        </div>
      </div>
    );
  }