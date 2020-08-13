import React from 'react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors
} from '@material-ui/core'
import { StyleSheet, css } from 'aphrodite'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import MoneyIcon from '@material-ui/icons/Money'

export default function AnalyticsCard({ title, number }) {
  return (
    
      <Card className={css(styles.root)}>
        <CardContent>
          <Grid container justify="space-between" spacing={2}>
            <Grid item>
              <Typography color="textSecondary" gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography color="textPrimary" variant="h3">
                {number}
              </Typography>
            </Grid>
            {/* <Grid item>
            <Avatar className={css(styles.avatar)}>
              <MoneyIcon />
            </Avatar>
          </Grid> */}
          </Grid>
          {/* <Box mt={2} display="flex" alignItems="center">
          <ArrowDownwardIcon className={css(styles.differenceIcon)} />
          <Typography className={css(styles.differenceValue)} variant="body2">
            12%
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Total calls open
          </Typography>
        </Box> */}
        </CardContent>
      </Card>
  )
}

const styles = StyleSheet.create({
  root: {
    height: '100%'
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
