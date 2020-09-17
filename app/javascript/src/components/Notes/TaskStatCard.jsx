/* eslint-disable */
import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import colors from '../../themes/nkwashi/colors'

export default function AnalyticsCard({ count, title, filterTasks, isCurrent }) {
  const { lightGray, jungleMist } = colors
  const isNotClickable = title === 'Tasks with no due date'
  let backgroundColor = isNotClickable && lightGray
  if (isCurrent) { backgroundColor = jungleMist }

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
