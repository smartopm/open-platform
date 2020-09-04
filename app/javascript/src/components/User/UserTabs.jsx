/* eslint-disable */
import React from 'react'
import { withStyles, Tab } from '@material-ui/core'
import { StyledTabs } from './../Tabs'

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit'
  }
})(props => <Tab {...props} />)

export default function UserStyledTabs({ tabValue, handleChange, userType }) {
  return (
    <StyledTabs
      value={tabValue}
      onChange={handleChange}
      aria-label="request tabs"
      centered
    >
      <StyledTab label="Contact" value={'Contacts'} />
      {['admin'].includes(userType) && (
        <StyledTab label="Notes" value={'Notes'} />
      )}
      {['admin'].includes(userType) && (
        <StyledTab label="Communication" value={'Communication'} />
      )}
      <StyledTab label="Plots" value={'Plots'} />
      <StyledTab label="Payments" value={'Payments'} />
    </StyledTabs>
  )
}
