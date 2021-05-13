/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React from "react";
import GetAppIcon from '@material-ui/icons/GetApp';
import Fab from "@material-ui/core/Fab";
import { useTranslation } from "react-i18next";
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
          <td>{dateTimeToString(new Date(entry.createdAt))}</td>
          <td>{entry.subject === 'user_entry' && entry.data.digital !== null ? `${entry.data.digital ? t('logbook.digital_scan') : t('logbook.digital_scan')} ` : 'N/A'}</td>
          <td>
            {entry.subject === 'user_entry' && entry.data.timestamp
            ? `${entry.data.timestamp && `${dateToString(new Date(Number(entry.data.timestamp)))} 
              ${dateTimeToString(new Date(Number(entry.data.timestamp)))}`} ` : 'N/A'}
          </td>
          <td>{entry.data?.type ? t(`common:user_types.${entry.data?.type}`) : t('logbook.entry_request')}</td>
        </tr>
      ));
    }
    return (
      <div>
        <div
          style={{
            backgroundColor: "#69ABA4"
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
                  <a className="page-link" onClick={previousPage} href="#">
                    {t('common:misc.previous')}
                  </a>
                </li>
                <li
                  className={`page-item ${data.result.length < limit &&
                    "disabled"}`}
                >
                  <a className="page-link" onClick={nextPage} href="#">
                    {t('common:misc.next')}
                  </a>
                </li>
              </ul>
            </nav>
  
          </div>
          <Fab
            variant="extended"
            style={{
              position: 'fixed',
              bottom: 24,
              right: 57,
              backgroundColor: 'rgb(37, 192, 176)',
              color: '#FFFFFF'
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