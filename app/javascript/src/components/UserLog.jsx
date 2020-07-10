import React from "react"
import { dateToString, dateTimeToString } from "./DateContainer";


export default function UserLog({
    data,
    router,
    nextPage,
    previousPage,
    offset,
    limit
  }) {
    function routeToAction(eventLog) {
      if (eventLog.refType === "EntryRequest") {
        return router.push(`/request/${eventLog.refId}`);
      } else if (eventLog.refType === "User") {
        return router.push(`/user/${eventLog.refId}`);
      }
    }
    function logs(eventLogs) {
      if (!eventLogs) {
        return;
      }
      return eventLogs.map(event => {
        return (
          <tr
            key={event.id}
            onClick={() => routeToAction(event)}
            style={{
              cursor: "pointer"
            }}
          >
            <td>{dateToString(event.createdAt)}</td>
            <td>{dateTimeToString(new Date(event.createdAt))}</td>
            <td>{event.sentence}</td>
          </tr>
        );
      });
    }
   
    return (
      <div>
        <div
          style={{
            backgroundColor: "#25c0b0"
          }}
        >
         
        </div>
        <div className="row justify-content-center">
          <div className="col-10 col-sm-10 col-md-6 table-responsive">
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
        </div>
      </div>
    );
  }