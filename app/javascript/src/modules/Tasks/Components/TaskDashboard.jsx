import React from 'react'
import {
  Grid,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import TaskStatCard from './TaskStatCard'
import CenteredContent from '../../../components/CenteredContent'
import { objectAccessor } from '../../../utils/helpers'

export default function TaskDashboard({ taskData, filterTasks, currentTile }) {
  const { t } = useTranslation('task')

  const tiles = Object.freeze({
    myOpenTasks: t('task.my_tasks'),
    tasksDueIn10Days: t('task.tasks_due_in_10_days'),
    tasksDueIn30Days: t('task.tasks_due_in_30_days'),
    tasksOpenAndOverdue: t('task.overdue_tasks'),
    tasksWithNoDueDate: t('task.tasks_with_no_due_date'),
    totalCallsOpen: t('task.total_calls_open'),
    processes: t('task.total_forms_open'),
    tasksOpen: t('task.tasks_open'),
    completedTasks: t('task.tasks_completed')
  });

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
        count={objectAccessor(taskData.data?.taskStats, key)}
        isCurrent={key === currentTile}
      />
    </Grid>
  ))
}

TaskDashboard.propTypes = {
  taskData: PropTypes.shape({
    loading: PropTypes.boolean,
    error: PropTypes.string,
    data: PropTypes.shape({
      taskStats: PropTypes.shape({
        myOpenTasks: PropTypes.number,
        tasksDueIn10Days: PropTypes.number,
        tasksDueIn30Days: PropTypes.number,
        tasksOpenAndOverdue: PropTypes.number,
        tasksWithNoDueDate: PropTypes.number,
        totalCallsOpen: PropTypes.number,
        processes: PropTypes.number,
        tasksOpen: PropTypes.number,
        completedTasks: PropTypes.number
      })
    })
  }).isRequired,
  filterTasks: PropTypes.func.isRequired,
  currentTile: PropTypes.string.isRequired
}
