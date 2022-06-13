/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Typography, Tab, Button, Box, ListItem, List } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { useTranslation } from 'react-i18next'
import { StyledTabs, TabPanel } from '../../../components/Tabs'
import Status from '../../../components/StatusBadge'
import { Context as AuthStateContext } from '../../../containers/Provider/AuthStateProvider'
import Avatar from '../../../components/Avatar'

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
  const { t } = useTranslation(['common', 'business'])

  function handleButtonClick() {
    history.push({
      pathname: `/message/${authState.user.id}`,
      state: {
        clientName: authState.user.name,
        clientNumber: authState.user.community.supportNumber[0].phone_number,
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
          <Avatar user={profileData} style={profileData.imageUrl ? 'big' : 'medium'} />
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
              role="link"
              tabIndex={0}
              data-testid="home_url"
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
          data-testid="business_tabs"
          centered
        >
          <StyledTab label={t('misc.profile')} value="Profile" />
          <StyledTab label={t('form_fields.operating_hours')} value="Operating Hours" />
          <StyledTab label={t('misc.relevant_posts')} value="Relevant Posts" />
        </StyledTabs>
        <TabPanel value={tabValue} index="Profile">

          <Typography variant="h6">{t('table_headers.description')}</Typography>
          <Typography variant="body1" data-testid="pf-description">
            {profileData.description || t('misc.no_description')}
          </Typography>

        </TabPanel>
        <TabPanel value={tabValue} index="Operating Hours">
          <div className="d-flex  justify-content-center">
            <div>
              <Typography variant="h6" data-testid="operating_hrs">
                {t('form_fields.operating_hours')} 
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
            <Typography variant="h6">
              {t('misc.links')}
              {' '}
            </Typography>
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
          <Button onClick={handleButtonClick} color="primary" data-testid="inquire_btn">
            {t('business:business.ask_about_business')}
            {' '}
          </Button>
        </div>
      </div>
    </div>
  )
}
