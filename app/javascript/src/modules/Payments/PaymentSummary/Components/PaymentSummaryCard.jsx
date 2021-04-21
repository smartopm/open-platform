import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import colors from '../../../../themes/nkwashi/colors'

export default function PaymentSummaryCard({ value, title, handleClick, }){
  const { lightGray } = colors
  const isNotClickable = value === 0
  const backgroundColor = isNotClickable && lightGray
  return (
    <div>
      <Card
        onClick={handleClick}
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
            {value}
          </Typography>
          <Typography align="center" color="textPrimary" variant="h5" data-testid="task_count">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}