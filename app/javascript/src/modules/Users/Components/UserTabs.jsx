import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo'
import { withStyles, Tab } from '@material-ui/core'
import { StyledTabs } from "../../../components/Tabs"
import { UserActivePlanQuery } from '../../../graphql/queries/user'
import { Spinner } from '../../../shared/Loading'
import CenteredContent from '../../../components/CenteredContent'
import { formatError } from '../../../utils/helpers'

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit'
  }
})(props => <Tab {...props} />)

export default function UserStyledTabs({ tabValue, handleChange, userType }) {
  // Make sure other tabs can show while the query is fetching unless there is an error
  const { data, loading, error } = useQuery(UserActivePlanQuery)
  const { t } = useTranslation('users')
  if(error) return <CenteredContent>{formatError(error.message)}</CenteredContent>
  return (
    <StyledTabs
      value={tabValue}
      onChange={handleChange}
      aria-label="request tabs"
      centered
    >
      <StyledTab label={t("common:misc.contact")} value="Contacts" data-testid="tabs" />
      {['admin'].includes(userType) && (
        <StyledTab label={t("common:misc.notes")} value="Notes" data-testid="tabs" />
      )}
      {['admin'].includes(userType) && (
        <StyledTab label={t("common:misc.communication")} value="Communication" data-testid="tabs" />
      )}
      {
        !['security_guard', 'custodian'].includes(userType) &&
        <StyledTab label={t("common:misc.plots")} value="Plots" data-testid="tabs" />
      }
      {
        !['security_guard', 'custodian'].includes(userType) &&
        <StyledTab label={t("common:misc.forms")} value="Forms" data-testid="tabs" />
      }

      {loading ? <Spinner /> : null}
      {
        !loading && userType === 'admin' || data?.userActivePlan 
        ? <StyledTab label={t("common:misc.payments")} value="Payments" data-testid="tabs" />
        : null        
      }
      {['admin'].includes(userType) && (
      <StyledTab label={t("common:menu.customer_journey")} value="CustomerJourney" data-testid="tabs" />
      )}
    </StyledTabs>
  )
}

UserStyledTabs.propTypes = {
  tabValue: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired, 
  userType: PropTypes.string.isRequired
}