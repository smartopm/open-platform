import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Typography, withStyles, Tab, Button, Box, Avatar, ListItem, List } from '@material-ui/core'
import { StyledTabs, TabPanel } from '../../components/Tabs'
import Status from '../../components/StatusBadge'
import { Context as ThemeContext } from '../../../Themes/Nkwashi/ThemeProvider'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider.js'
import { useHistory } from 'react-router-dom'


export const StyledTab = withStyles({
    root: {
        textTransform: 'none',
        color: 'inherit'
    }
})(props => <Tab {...props} />)



export default function Profile({ profileData }) {
    const [tabValue, setValue] = useState('Profile')
    const history = useHistory()
    const authState = useContext(AuthStateContext)
    const theme = useContext(ThemeContext)
    const CSMNumber = '260974624243'

    function handleButtonClick() {
        history.push({
            pathname: `/message/${authState.user.id}`,
            state: {
                clientName: authState.user.name,
                clientNumber: CSMNumber,
                from: 'Business Directory'
            }
        })
    }
    function handleChange(_event, newValue) {
        setValue(newValue)
    }
    return (
        <div className="container">
            <div className="row d-flex justify-content-between">
                <div className="col-4 d-flex justify-content-end align-items-center">
                    <Avatar style={{ height: 80, width: 80, fontSize: 20 }}>
                        {profileData.name.charAt(0)}
                    </Avatar>
                </div>
                <div className="col-8 justify-content-around" data-testid="details-holder">
                    <Typography variant="h6" arial-label='pf-company-name'>
                        {profileData.name}
                    </Typography>
                    <Typography variant="subtitle2" data-testid="pf-number" arial-label='pf-phone-number'>
                        {profileData.phoneNumber}
                    </Typography >
                    <Typography variant="subtitle2" arial-label='pf-email-address'>
                        {profileData.email}
                    </Typography >
                    <Typography variant="subtitle2" arial-label='pf-address'>
                        {profileData.address}
                    </Typography >
                    <Typography variant="subtitle2">

                        {profileData.homeUrl ? <Link to={profileData.homeUrl}>{profileData.homeUrl}</Link> : null}
                    </Typography >
                    <Box style={{ width: '50%', marginTop: 5 }}><Status label={'notVerified'} /></Box>
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
                    <StyledTab label="Relevant Posts" value={'Relevant Posts'} />
                </StyledTabs>
                <TabPanel value={tabValue} index={'Profile'}>

                    <Typography variant="h6">Description</Typography>
                    <Typography variant="body1" arial-label='pf-description'>
                        {profileData.description || 'No Description'}
                    </Typography>

                </TabPanel>
                <TabPanel value={tabValue} index={'Operating Hours'}>
                    <div className='d-flex  justify-content-center'>
                        <div>
                            <Typography variant="h6">
                                Operating Hours
                            </Typography>
                            <br />
                            <p>
                                {profileData.operationHours}
                            </p>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={tabValue} index={'Relevant Posts'}>
                    <div>
                        <Typography variant="h6">Links</Typography>
                        <List>
                            {profileData.links ? (Object.entries(profileData.links).map((k, v) => (
                                <ListItem key={k}>
                                    <Link>
                                        {v}
                                    </Link>
                                </ListItem>
                            ))): ''}
                        </List>
                    </div>
                </TabPanel>

                <div className='container d-flex justify-content-center'>
                    <Button onClick={handleButtonClick} style={{ backgroundColor: theme.primaryColor, color: 'white' }}>Ask about business</Button>
                </div>
            </div>
        </div>
    )
}
