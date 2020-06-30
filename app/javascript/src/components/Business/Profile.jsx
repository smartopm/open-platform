import React, { useState } from 'react'
import Avatar from '../Avatar'
import { Typography, withStyles, Tab, TextField, Box } from '@material-ui/core'
import { StyledTabs, TabPanel } from '../../components/Tabs'
import Status from '../../components/StatusBadge'


export const StyledTab = withStyles({
    root: {
        textTransform: 'none',
        color: 'inherit'
    }
})(props => <Tab {...props} />)
export default function Profile() {
    const [tabValue, setValue] = useState('Profile')

    function handleChange(_event, newValue) {
        setValue(newValue)
    }
    return (
        <div className="container">
            <div className="row d-flex justify-content-between">
                <div className="col-4 d-flex justify-content-end">
                    <Avatar />
                </div>
                <div className="col-8">
                    <Typography variant="h6">
                        <strong>Company Name</strong>
                    </Typography>
                    <Typography variant="subtitle1">
                        Link
                    </Typography >
                    <Box style={{ width: '20%' }}><Status label={'verified'} /></Box>

                </div>
            </div>
            <div>
                <StyledTabs
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="request tabs"
                    centered
                >
                    <StyledTab label="Profile" value={'Profile'} />
                    <StyledTab label="Contact" value={'Contact'} />
                    {/* <StyledTab label="Plots" value={'Relevant Posts'} /> */}
                </StyledTabs>
                <TabPanel value={tabValue} index={'Profile'}>
                
                        <Typography variant="h6">Description</Typography>
                        <Typography variant="body1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </Typography>
                    
                </TabPanel>
                <TabPanel value={tabValue} index={'Contact'}>
                  
                        <form  >
                            <TextField
                                id="standard-full-width"
                                disabled
                                label="Company Name"
                                style={{ margin: 8 }}
                                placeholder="Company Name"
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                id="standard-full-width"
                                disabled
                                style={{ margin: 8 }}
                                placeholder="Phone Number"
                                fullWidth
                                margin="normal"
                                label="Phone Number"
                            />
                            <TextField
                                id="standard-full-width"
                                disabled
                                style={{ margin: 8 }}
                                placeholder="Email Address"
                                fullWidth
                                margin="normal"
                                label="Email Address"
                            />
                            <TextField
                                id="standard-full-width"
                                disabled
                                style={{ margin: 8 }}
                                placeholder="Address"
                                fullWidth
                                margin="normal"
                                label="Address"
                                
                            />
                            <TextField
                                id="standard-full-width"
                                disabled
                                style={{ margin: 8 }}
                                placeholder="Operating Hours"
                                fullWidth
                                label="Operating Hours"
                                margin="normal"
                            />
                        </form>
                    
                </TabPanel>
            </div>
        </div>
    )
}
