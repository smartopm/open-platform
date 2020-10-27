/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Typography, withStyles, Tab, Button, Box, ListItem, List
} from '@material-ui/core'
import { StyledTabs, TabPanel } from '../Tabs'
import Status from '../StatusBadge'
import { Context as AuthStateContext } from '../../containers/Provider/AuthStateProvider'
import Avatar from '../Avatar'

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit'
  }
})((props) => <Tab {...props} />)

export default function BusinessProfile({ profileData }) {
  const [tabValue, setValue] = useState('Profile')
  const history = useHistory()
  const authState = useContext(AuthStateContext)
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
  function openLink(link) {
    const lk = /^https?:\/\//i;
    if (!lk.test(link)) {
      return window.open(`http://${link}`, '_blank')
    }
    return window.open(link, '_blank')
  }
  function handleChange(_event, newValue) {
    setValue(newValue)
  }
  return (
    <div className="container">
      <div className="row d-flex justify-content-between">
        <div className="col-4 d-flex justify-content-end align-items-center">
          {
                // eslint-disable-next-line
                }<Avatar user={profileData} style={profileData.imageUrl ? 'big' : 'medium'} />
        </div>
        <div className="col-8 justify-content-around" data-testid="details-holder">
          <Typography variant="h6" arial-label="pf-company-name">
            {profileData.name}
          </Typography>
          <Typography variant="subtitle2" data-testid="pf-number" arial-label="pf-phone-number">
            {profileData.phoneNumber}
          </Typography>
          <Typography variant="subtitle2" arial-label="pf-email-address">
            {profileData.email}
          </Typography>
          <Typography variant="subtitle2" arial-label="pf-address">
            {profileData.address}
          </Typography>
          <Typography variant="subtitle2">

            <span
              onClick={() => openLink(profileData.homeUrl)}
              onKeyPress={() => openLink(profileData.homeUrl)}
              role="link"
              tabIndex={0}
            >
              {profileData.homeUrl}
            </span>
          </Typography>
          <Box style={{ width: '50%', marginTop: 5 }}><Status label={profileData.status || ''} /></Box>
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
          <StyledTab label="Profile" value="Profile" />
          <StyledTab label="Operating Hours" value="Operating Hours" />
          <StyledTab label="Relevant Posts" value="Relevant Posts" />
        </StyledTabs>
        <TabPanel value={tabValue} index="Profile">

          <Typography variant="h6">Description</Typography>
          <Typography variant="body1" arial-label="pf-description">
            {profileData.description || 'No Description'}
          </Typography>

        </TabPanel>
        <TabPanel value={tabValue} index="Operating Hours">
          <div className="d-flex  justify-content-center">
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
        <TabPanel value={tabValue} index="Relevant Posts">
          <div>
            <Typography variant="h6">Links</Typography>
            {/* TODO: refactor this */}
            <List>
              {profileData?.links ? (Object.entries(profileData.links).map((k, v) => (
                <ListItem key={k}>
                  <span>
                    {v}
                  </span>
                </ListItem>
              ))) : ''}
            </List>
          </div>
        </TabPanel>

        <div className="container d-flex justify-content-center">
          <Button onClick={handleButtonClick} color="primary">Ask about business</Button>
        </div>
      </div>
    </div>
  )
}
