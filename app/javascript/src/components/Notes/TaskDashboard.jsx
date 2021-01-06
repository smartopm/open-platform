import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import TaskStatCard from './TaskStatCard'
import CenteredContent from '../CenteredContent'

const tiles = {
  myOpenTasks: 'My Tasks',
  tasksDueIn10Days: 'Tasks due in 10 days',
  tasksDueIn30Days: 'Tasks due in 30 days',
  tasksOpenAndOverdue: 'Overdue Tasks',
  tasksWithNoDueDate: 'Tasks with no due date',
  totalCallsOpen: 'Total Calls Open',
  totalFormsOpen: 'Total Forms Open',
  tasksOpen: 'Tasks Open',
  completedTasks: 'Tasks Completed'
}

export default function TaskDashboard({ taskData, filterTasks, currentTile }) {
  if (taskData.loading || taskData.error) {
    return (
      <CenteredContent>
        <Typography
          align="center"
          color="textSecondary"
          gutterBottom
          variant="h6"
        >
          Loading
        </Typography>
      </CenteredContent>
    )
  }
  // use extra white space
  return Object.entries(tiles).map(([key, val]) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
      <TaskStatCard
        filter={evt => filterTasks(evt, key)}
        title={val}
        count={taskData.data?.taskStats[key]}
        isCurrent={key === currentTile}
      />
    </Grid>
  ))
}

TaskDashboard.propTypes = {
  taskData: PropTypes.shape({
    data: PropTypes.shape({
      taskStats: PropTypes.shape({
        myOpenTasks: PropTypes.number,
        tasksDueIn10Days: PropTypes.number,
        tasksDueIn30Days: PropTypes.number,
        tasksOpenAndOverdue: PropTypes.number,
        tasksWithNoDueDate: PropTypes.number,
        totalCallsOpen: PropTypes.number,
        totalFormsOpen: PropTypes.number,
        tasksOpen: PropTypes.number,
        completedTasks: PropTypes.number
      })
    })
  }).isRequired,
  filterTasks: PropTypes.func.isRequired,
  currentTile: PropTypes.string.isRequired
}
