/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
import React from "react"
import { useTranslation } from 'react-i18next';
import { dateToString, dateTimeToString } from "../../../components/DateContainer";
import PageWrapper from "../../../shared/PageWrapper";


export default function UserLog({
    data,
    router,
    nextPage,
    previousPage,
    offset,
    limit
  }) {
    const { t } = useTranslation('common')
    function routeToAction(eventLog) {
      if (eventLog.refType === "Logs::EntryRequest") {
        return router.push(`/request/${eventLog.refId}`);
      // eslint-disable-next-line no-else-return
      } else if (eventLog.refType === "Users::User") {
        return router.push(`/user/${eventLog.refId}`);
      }
    }
    function logs(eventLogs) {
      if (!eventLogs) {
        return <tr><td>No logs found</td></tr>;
      }
      return eventLogs.map(event => {
        return (
          <tr
            key={event.id}
            onClick={() => routeToAction(event)}
            style={{
              cursor: "pointer"
            }}
            data-testid="log_title"
          >
            <td>{dateToString(event.createdAt)}</td>
            <td>{dateTimeToString(event.createdAt)}</td>
            <td>{event.sentence}</td>
          </tr>
        );
      });
    }

    return (
      <PageWrapper pageTitle={t('menu.user_logs')}>
        <div className="col-10 col-sm-10 col-md-12 table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>{logs(data.result)}</tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul className="pagination">
              <li className={`page-item ${offset < limit && "disabled"}`}>
                <a className="page-link" onClick={previousPage} href="#">
                  Previous
                </a>
              </li>
              <li
                className={`page-item ${data.result?.length < limit &&
                    "disabled"}`}
              >
                <a className="page-link" onClick={nextPage} href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </PageWrapper>
    );
  }