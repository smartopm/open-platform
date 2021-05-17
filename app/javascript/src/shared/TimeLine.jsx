import React from 'react'
import { useTranslation } from 'react-i18next';
import Timeline from '@material-ui/lab/Timeline'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import CreateIcon from '@material-ui/icons/Create'
import { Typography } from '@material-ui/core'
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
