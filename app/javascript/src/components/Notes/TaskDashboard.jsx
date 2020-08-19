import React from 'react'
import TaskStatCard from './TaskStatCard'
import { useQuery } from 'react-apollo'
import { TaskStatsQuery } from '../../graphql/queries'
import { Grid, Typography } from '@material-ui/core'

const tiles = {
  completedTasks: 'Tasks Completed',
  tasksDueIn10Days: 'Tasks due in 10 days',
  tasksDueIn30Days: 'Tasks due in 30 days',
  tasksOpen: 'Tasks Open',
  tasksOpenAndOverdue: 'Overdue Tasks',
  tasksWithNoDueDate: 'Tasks with no due date',
  myOpenTasks: 'My Tasks',
  totalCallsOpen: 'Total Calls Open'
}

// data.taskStasts
export default function TaskDashboard({ filterTasks }) {
  const { loading, data, error } = useQuery(TaskStatsQuery)

  if (loading || error) {
    return (
      <Typography
        align="center"
        color="textSecondary"
        gutterBottom
        variant="h6"
      >
        Loading
      </Typography>
    )
  }
  // lg={2} sm={4} xl={2} xs={4}
  return Object.entries(tiles).map(([key, val]) => (
    <Grid item xs={6} sm={4} lg={3} key={key}>
      <TaskStatCard filterTasks={evt => filterTasks(evt, key)} title={val} count={data?.taskStats[key]} />
    </Grid>
  ))
}
