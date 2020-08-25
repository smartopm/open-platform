eslint-disable
import React from 'react'
import { Box, Grid, Typography, Button, Divider, Checkbox, FormControl, FormGroup, FormControlLabel } from '@material-ui/core'
import CenteredContent from './CenteredContent';

export default function NotificationPage({ handleChange, checkedState, handleSave, loading}) {
    const { smsChecked, emailChecked } = checkedState
    return (
        <Box style={{ height: 100, margin: 10 }}>
            <Box style={{ flexDirection: 'row', justifyContent: 'space-between', display: 'flex', margin: 10 }}>
                <Typography variant="h5" data-testid="notification-header">
                    Notification Settings
                </Typography>
            </Box>
            <Divider />
            <br />
            <Grid container alignItems="center" justify="center" spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1" data-testid="notification-description" >
                        We use notifications to share the latest news and updates on Nkwashi
                        and your account. Types of content include newsletters, community interviews,
                        construction progress, and account updates.
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                        <FormGroup aria-label="position" row>
                            <FormControlLabel
                                value="top"
                                data-testid="sms-checkbox"
                                control={<Checkbox
                                checked={smsChecked}
                                name="smsChecked"
                                color="primary"
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                />}
                                label="SMS"
                            />
                            <FormControlLabel
                                value="top"
                                data-testid="email-checkbox"
                                control={<Checkbox
                                checked={emailChecked}
                                name="emailChecked"
                                color="primary"
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                />}
                                label="Email"
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <br/>
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
    )
}
