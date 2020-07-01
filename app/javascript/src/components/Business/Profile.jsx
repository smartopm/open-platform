import React, { useState } from 'react'

import { Typography, withStyles, Tab, TextField, Box, Avatar } from '@material-ui/core'
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
                <div className="col-4 d-flex justify-content-end align-items-center">
                    <Avatar style={{ height: 80, width: 80 }}>
                        A
                    </Avatar>
                </div>
                <div className="col-8 justify-content-around">
                    <Typography variant="h6">
                        <strong>Company Name</strong>
                    </Typography>
                    <Typography variant="subtitle2">
                        Phone Number
                    </Typography >
                    <Typography variant="subtitle2">
                        Email Address
                    </Typography >
                    <Typography variant="subtitle2">
                        Address
                    </Typography >
                    <Box style={{ width: '50%', marginTop: 5 }}><Status label={'verified'} /></Box>

                </div>
            </div>

            <br />
            <div>
                <StyledTabs
                    value={tabValue}
                    onChange={handleChange}
                    aria-label="request tabs"
                    centered
                >
                    <StyledTab label="Profile" value={'Profile'} />
                    <StyledTab label="Operating Hours" value={'Operating Hours'} />
                    {/* <StyledTab label="Plots" value={'Relevant Posts'} /> */}
                </StyledTabs>
                <TabPanel value={tabValue} index={'Profile'}>

                    <Typography variant="h6">Description</Typography>
                    <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                        </Typography>

                </TabPanel>
                <TabPanel value={tabValue} index={'Operating Hours'}>
                  
                    <div className='d-flex  justify-content-center'>
                        <p>
                        <Typography variant="h6">
                            Operating Hours
                        </Typography>
                            <br />
                            Monday - Friday: <b>8:00 - 16:00</b> <br />
                            Saturday: <b>8:00 - 12:00</b> <br />
                        </p>
                    </div>
                </TabPanel>
            </div>
        </div>
    )
}
