/* eslint-disable */
import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

export default function AnalyticsCard({ count, title, filterTasks, isCurrent }) {
  const isNotClickable = title === 'Tasks with no due date'
  let backgroundColor = isNotClickable && '#f0f0f0'
  if (isCurrent) { backgroundColor = '#b7d4d9' }

  return (
    <Card
      onClick={filterTasks}
      style={{
        backgroundColor,
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
