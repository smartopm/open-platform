/* eslint-disable */
import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

export default function AnalyticsCard({ count, title, filterTasks }) {
  const isNotClickable = title === 'Tasks with no due date'
  return (
    <Card
      onClick={filterTasks}
      style={{
        backgroundColor: isNotClickable && '#f0f0f0',
        cursor: isNotClickable ? 'not-allowed' : 'pointer'
      }}
    >
      <CardContent>
        <Typography
          align="center"
          color="textSecondary"
          gutterBottom
          variant="body1"
        >
          {title}
        </Typography>
        <Typography align="center" color="textPrimary" variant="h5" data-testid="task_count">
          {count}
        </Typography>
      </CardContent>
    </Card>
  )
}
