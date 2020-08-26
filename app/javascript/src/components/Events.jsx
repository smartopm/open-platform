/* eslint-disable */
import React from "react";
import GetAppIcon from '@material-ui/icons/GetApp';
import Fab from "@material-ui/core/Fab";
import { dateToString, dateTimeToString } from "./DateContainer.jsx";


export default function Events({
    data,
    nextPage,
    previousPage,
    offset,
    userToken
  }) {
    const limit = 30;
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
          <td>{entry.subject === 'user_entry' && entry.data.digital !== null ? `${entry.data.digital ? 'Digital' : 'Print'} Scan` : 'N/A'}</td>
          <td>{entry.subject === 'user_entry' && entry.data.timestamp
            ? `${entry.data.timestamp && `${dateToString(new Date(Number(entry.data.timestamp)))} 
              ${dateTimeToString(new Date(Number(entry.data.timestamp)))}`} ` : 'N/A'}</td>
          <td>{entry.data ? entry.data.type : 'Entry Request'}</td>
        </tr>
      ));
    }
    return (
      <div>
        <div
          style={{
            backgroundColor: "#69ABA4"
          }}
        >
        </div>
        <div className="row justify-content-center">
          <div className="col-11 col-sm-11 table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Subject</th>
                  <th scope="col">Description</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Scan Type</th>
                  <th scope="col">QR Timestamp</th>
                  <th scope="col">User Type</th>
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
                  className={`page-item ${data.result.length < limit &&
                    "disabled"}`}
                >
                  <a className="page-link" onClick={nextPage} href="#">
                    Next
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
            {' '}Download
        </Fab>
        </div>
      </div >
    );
  }