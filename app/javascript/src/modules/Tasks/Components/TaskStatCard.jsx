import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import colors from '../../../themes/nkwashi/colors';

export default function AnalyticsCard({ count, title, filter, isCurrent }) {
  const { jungleMist } = colors;
  let backgroundColor = '';
  if (isCurrent) { backgroundColor = jungleMist }

  return (
    <Card
      onClick={filter}
      style={{
        backgroundColor,
        cursor: 'pointer'
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
          {count || 0}
        </Typography>
      </CardContent>
    </Card>
  )
}

AnalyticsCard.defaultProps = {
  count: 0,
}

AnalyticsCard.propTypes = {
  count: PropTypes.number,
  title: PropTypes.string.isRequired,
  filter: PropTypes.func.isRequired,
  isCurrent: PropTypes.bool.isRequired,
}