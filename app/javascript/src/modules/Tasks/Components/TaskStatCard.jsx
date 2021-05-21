import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import colors from '../../../themes/nkwashi/colors'

export default function AnalyticsCard({ count, title, filter, isCurrent }) {
  const { t } = useTranslation('task')

  const { lightGray, jungleMist } = colors
  const isNotClickable = title === t('task.tasks_with_no_due_date')
  let backgroundColor = isNotClickable && lightGray
  if (isCurrent) { backgroundColor = jungleMist }

  return (
    <Card
      onClick={filter}
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