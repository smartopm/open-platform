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
        <CardContent style={{textAlign: 'center'}}>
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {value}
          </Typography>
          <Typography color="textSecondary" variant="caption" data-testid="summary-card">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}