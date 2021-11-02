import React from 'react'
import { startOfToday, startOfWeek, startOfYesterday } from 'date-fns'
import EventTimeLine from '../app/javascript/src/shared/TimeLine'

export default {
  title: 'Components/EventTimeLine',
  component: EventTimeLine
}

const TimeLineTemplate = args => <EventTimeLine {...args} />

export const TimeLine = TimeLineTemplate.bind({})
const data = [
  {
    sentence: 'Profile for user 2 updated',
    createdAt: startOfToday(),
    id: "234234sdfs"
  },
  {
    sentence: 'User2 invited another user',
    createdAt: startOfYesterday(),
    id: "2342sdsdf34sdfs"
  },
  {
    sentence: 'User got created',
    createdAt: startOfWeek(new Date()),
    id: "234s934sdfs"
  }
]

TimeLine.args = { data }

export const EmptyTimeLine = TimeLineTemplate.bind({})

EmptyTimeLine.args = {
  data: []
}
