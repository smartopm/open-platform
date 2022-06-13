import React from 'react'
import { useTranslation } from 'react-i18next';
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import CreateIcon from '@mui/icons-material/Create'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { dateFormatter } from '../components/DateContainer'

export default function EventTimeLine({ data }) {
  const { t } = useTranslation('common')
  if (!data || !data.length) {
    return <span>{t("common:errors.no_changes")}</span>
  }
  return (
    <Timeline style={{ marginLeft: '-95%' }}>
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
            <Typography variant="body2" data-testid="date">
              {dateFormatter(item.createdAt)}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

EventTimeLine.propTypes = {
  /**
   * Array of events that has a sentence and a createdAt
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      /**
       * could be event name or title, in this case a sentence for what happened
       */
      sentence: PropTypes.string.isRequired,
      /**
       * The date when the event was created(important)
       */
      createdAt: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date)
      ])
    })
  ).isRequired
}
