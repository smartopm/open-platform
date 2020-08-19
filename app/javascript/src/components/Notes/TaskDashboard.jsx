import React from 'react'
import TaskStatCard from './TaskStatCard'
import { useQuery } from 'react-apollo'
import { TaskStatsQuery } from '../../graphql/queries'
import { Grid, Typography } from '@material-ui/core'
// My Tasks, Due in 10 days, Due in 30 days, Overdue, No Due Date, 
// Open Calls, All Open Tasks, Completed Tasks
const tiles = {
  myOpenTasks: 'My Tasks',
  tasksDueIn10Days: 'Tasks due in 10 days',
  tasksDueIn30Days: 'Tasks due in 30 days',
  tasksOpenAndOverdue: 'Overdue Tasks',
  tasksWithNoDueDate: 'Tasks with no due date',
  totalCallsOpen: 'Total Calls Open',
  tasksOpen: 'Tasks Open',
  completedTasks: 'Tasks Completed',
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
