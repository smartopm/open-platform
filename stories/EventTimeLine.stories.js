import React from 'react'
import { startOfToday, startOfWeek, startOfYesterday } from 'date-fns'
import EventTimeLine from '../app/javascript/src/components/TimeLine'

export default {
  title: 'Components/EventTimeLine',
  component: EventTimeLine
}

const TimeLineTemplate = args => <EventTimeLine {...args} />

export const TimeLine = TimeLineTemplate.bind({})
const data = [
  {
    sentence: 'Profile for user 2 updated',
    createdAt: startOfToday()
  },
  {
    sentence: 'User2 invited another user',
    createdAt: startOfYesterday()
  },
  {
    sentence: 'User got created',
    createdAt: startOfWeek()
  }
]

TimeLine.args = { data }

export const EmptyTimeLine = TimeLineTemplate.bind({})

EmptyTimeLine.args = {
  data: []
}
