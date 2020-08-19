import React from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'

export default function AnalyticsCard({ count, title, filterTasks }) {
  const isNotClickable = title === 'Tasks with no due date'
  return (
    <Card className={css(styles.root)} onClick={filterTasks}
      style={{
        backgroundColor: isNotClickable && '#b7d4d9',
        cursor: isNotClickable ? 'not-allowed' : 'pointer',
      }}
    >
      <CardContent>
            <Typography align="center" color="textSecondary" gutterBottom variant="body1">
              {title}
            </Typography>
            <Typography align="center" color="textPrimary" variant="h5">
              {count}
            </Typography>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
  root: {
    // height: '120px',
    // width: '120px'
  },
})
  