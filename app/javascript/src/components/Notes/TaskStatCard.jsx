import React from 'react'
import {
  Card,
  CardContent,
  Grid,
  Typography,
  colors
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'

export default function AnalyticsCard({ count, title, filterTasks }) {
  return (
    <Card className={css(styles.root)} onClick={filterTasks}>
      <CardContent>
        <Grid container justify="space-between" spacing={3}>
          <Grid item>
            <Typography align="center" color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography align="center" color="textPrimary" variant="h3">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const styles = StyleSheet.create({
    root: {
    height: '100%',
    ":hover": {
        cursor: 'pointer'
      }
      },
      avatar: {
        backgroundColor: colors.red[600],
        height: 56,
        width: 56
      },
      differenceIcon: {
        color: colors.red[900]
      },
      differenceValue: {
        color: colors.red[900],
        marginRight: 1
      }
  })
  