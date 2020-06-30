import React, { useState } from 'react'
import Avatar from '../Avatar'
import { Typography, withStyles, Tab } from '@material-ui/core'
import { StyledTabs, TabPanel } from '../../components/Tabs'


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
                    <div className="col-4">
                        <Avatar />
                    </div>
                    <div className="col-8">
                        <Typography>
                            <strong>Hello</strong>
                        </Typography>
                        <Typography>
                            <strong>Hello</strong>
                        </Typography>
                        <Typography>Hello</Typography>
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

                    </TabPanel>
                    <TabPanel value={tabValue} index={'Contact'}>

                    </TabPanel>
             

            </div>

        </div>
    )
}
