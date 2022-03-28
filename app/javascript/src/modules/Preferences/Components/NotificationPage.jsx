import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel
} from '@mui/material'
import PropTypes from 'prop-types'
import CenteredContent from '../../../components/CenteredContent'

export default function NotificationPage({
  handleChange,
  checkedState,
  handleSave,
  loading
}) {
  const { smsChecked, emailChecked, weeklyEmailReminderChecked } = checkedState
  return (
    <Box style={{ height: 100, margin: 10 }}>
      <Box
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          display: 'flex',
          margin: 10
        }}
      >
        <Typography variant="h5" data-testid="notification-header">
          Notification Settings
        </Typography>
      </Box>
      <Divider />
      <br />
      <Grid container alignItems="center" justifyContent="center" spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" data-testid="notification-description">
            News and Updates: Receive the latest news and updates on Nkwashi and
            your account. Types of content include newsletters, community
            interviews, construction progress, and account updates.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="top"
                data-testid="sms-checkbox"
                control={(
                  <Checkbox
                    checked={smsChecked}
                    name="smsChecked"
                    color="primary"
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                )}
                label="SMS"
              />
              <FormControlLabel
                value="top"
                data-testid="email-checkbox"
                control={(
                  <Checkbox
                    checked={emailChecked}
                    name="emailChecked"
                    color="primary"
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                )}
                label="Email"
              />
            </FormGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1" data-testid="points-and-rewards-description">
            Points and Rewards: Get weekly reminders to collect and view the
            points on your account. Points are a great way to engage with the
            community and are sometimes used to grant awards and rewards to our
            community members.
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="top"
                data-testid="weekly-email-reminder-checkbox"
                control={(
                  <Checkbox
                    checked={weeklyEmailReminderChecked}
                    name="weeklyEmailReminderChecked"
                    color="primary"
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                )}
                label="Email"
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      <br />
      <CenteredContent>
        <Button
          data-testid="preferences-save-button"
          color="primary"
          variant="contained"
          onClick={handleSave}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </CenteredContent>
    </Box>
  );
}

NotificationPage.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  checkedState: PropTypes.shape({
    smsChecked: PropTypes.bool,
    emailChecked: PropTypes.bool,
    weeklyEmailReminderChecked: PropTypes.bool
  }).isRequired
}
