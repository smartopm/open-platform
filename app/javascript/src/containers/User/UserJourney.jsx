import React from 'react';
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography';
import { dateFormatter } from "../../components/DateContainer"
import { userSubStatus } from '../../utils/constants';


export default function UserJourney({ data }) {

  function getInitialSubStatusContent({ startDate, newStatus }){
    return (
      <>
        {' '}
        changed status to 
        {' '}
        <b>{userSubStatus[String(newStatus)]}</b>
        {' '}
        at
        {startDate}
      </>
    )
  }

  function getSubStatusChangeContent({ startDate, stopDate, previousStatus, newStatus }){
    return (
      <>
        {' '}
        changed status from 
        {' '}
        <b>{userSubStatus[String(previousStatus)]}</b>
        {' '}
        to
        {' '}
        <b>{userSubStatus[String(newStatus)]}</b>
        {' '}
        between
        {' '}
        {startDate}
        {' '}
        and
        {' '}
        {stopDate}
      </>
    )
  }

  function subsStatusLogsFormatter(subStatusLogs){
    /* 
    Sort by startDate. Don't mutate object
    Time lapse = startDate[index + 1] to startDate[index]
    For initial sub-status, change message content.
    */
    const sortedLogsDescending = [...subStatusLogs].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    return (sortedLogsDescending.map((log, index) => {
        if(index === (sortedLogsDescending.length - 1)){
          const content = getInitialSubStatusContent(
            { 
              startDate: dateFormatter(log.startDate),
              newStatus: log.newStatus,
            }
          )

          return {id: log.id, content }
        }

        const startDate = dateFormatter(sortedLogsDescending[Number(index + 1)].startDate)
        const stopDate = dateFormatter(sortedLogsDescending[Number(index)].startDate)
        const previousStatus = sortedLogsDescending[Number(index + 1)].newStatus
        const {newStatus} = sortedLogsDescending[Number(index)]

        const content = getSubStatusChangeContent({ startDate, stopDate, previousStatus, newStatus })

        return { id: log.id, content }
      })
    )
  }

  const formattedSubStatusLogs = subsStatusLogsFormatter(data.user?.substatusLogs)

  return (
    <>
      {formattedSubStatusLogs.map(({ id, content }) => (
        <Typography variant="body2" style={{marginTop: '10px', marginLeft: '12px'}} key={id}>
          <b>{data.user.name}</b>
          {content}
        </Typography>
      ))}
    </>
  );
}

const User = PropTypes.shape({
  name: PropTypes.string,
  substatusLogs: PropTypes.arrayOf(PropTypes.object)
})
UserJourney.propTypes = {
  data: PropTypes.shape({ user: User }).isRequired,
}
