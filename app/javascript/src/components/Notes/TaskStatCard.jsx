import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'

export default function AnalyticsCard({ count, title, filterTasks }) {
  const isNotClickable = title === 'Tasks with no due date'
  return (
    <Card
      onClick={filterTasks}
      style={{
        backgroundColor: isNotClickable && '#b7d4d9',
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
        <Typography align="center" color="textPrimary" variant="h5">
          {count}
        </Typography>
      </CardContent>
    </Card>
  )
}
  