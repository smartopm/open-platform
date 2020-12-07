import React from 'react'
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import CreateIcon from '@material-ui/icons/Create';
import { Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { dateFormatter } from './DateContainer'

export default function FormTimeline({ data }) {
  return (
    <Timeline style={{ marginLeft: '-99%' }}>
      {data.map(item => (
        <TimelineItem key={item.id}>
          <TimelineSeparator>
            <TimelineDot>
              <CreateIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="subtitle1" component="p">
              {item.sentence}
            </Typography>
            <Typography variant="body2">{dateFormatter(item.createdAt)}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

FormTimeline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    sentence: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  })).isRequired
}
