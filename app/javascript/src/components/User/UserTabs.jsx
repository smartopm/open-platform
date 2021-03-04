import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { withStyles, Tab } from '@material-ui/core'
import { StyledTabs } from "../Tabs"
import { UserActivePlanQuery } from '../../graphql/queries/user'
import { Spinner } from '../../shared/Loading'
import CenteredContent from '../CenteredContent'
import { formatError } from '../../utils/helpers'

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit'
  }
})(props => <Tab {...props} />)

export default function UserStyledTabs({ tabValue, handleChange, userType }) {
  // Make sure other tabs can show while the query is fetching unless there is an error
  const { data, loading, error } = useQuery(UserActivePlanQuery, {
    errorPolicy: 'all'
  })
  if(error) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  return (
    <StyledTabs
      value={tabValue}
      onChange={handleChange}
      aria-label="request tabs"
      centered
    >
      <StyledTab label="Contact" value="Contacts" />
      {['admin'].includes(userType) && (
        <StyledTab label="Notes" value="Notes" />
      )}
      {['admin'].includes(userType) && (
        <StyledTab label="Communication" value="Communication" />
      )}
      {
        !['security_guard', 'custodian'].includes(userType) &&
        <StyledTab label="Plots" value="Plots" />
      }
      {
        !['security_guard', 'custodian'].includes(userType) &&
        <StyledTab label="Forms" value="Forms" />
      }

      {loading ? <Spinner /> : null}
      {
        !loading && userType === 'admin' || data?.userActivePlan 
        ? <StyledTab label='Payments' value="Payments" />
        : null        
      }
      {['admin'].includes(userType) && (
      <StyledTab label="Customer Journey" value="CustomerJourney" />
      )}
    </StyledTabs>
  )
}

UserStyledTabs.propTypes = {
  tabValue: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired, 
  userType: PropTypes.string.isRequired
}
