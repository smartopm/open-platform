import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo';
import { Tab } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { StyledTabs } from '../../../components/Tabs';
import { UserActivePlanQuery } from '../../../graphql/queries/user';
import { Spinner } from '../../../shared/Loading';
import CenteredContent from '../../../shared/CenteredContent';
import { checkAllowedCommunityFeatures, formatError } from '../../../utils/helpers';

export const StyledTab = withStyles({
  root: {
    textTransform: 'none',
    color: 'inherit',
    width: '5%'
  }
})(props => <Tab {...props} />);

// Unfortunately we couldn't use the FeatureCheck here because the Tab expects specific children otherwise it doesn't properly forward props to underlying component
export default function UserStyledTabs({ tabValue, handleChange, user }) {
  // Make sure other tabs can show while the query is fetching unless there is an error
  const { data, loading, error } = useQuery(UserActivePlanQuery);
  const { t } = useTranslation('users');
  if (error) return <CenteredContent>{formatError(error.message)}</CenteredContent>;
  return (
    <StyledTabs value={tabValue} onChange={handleChange} aria-label="request tabs" centered>
      <StyledTab label={t('common:misc.contact')} value="Contacts" data-testid="tabs" />
      {['admin'].includes(user.userType) &&
        checkAllowedCommunityFeatures(user.community.features, 'Tasks') && (
          <StyledTab label={t('common:misc.notes')} value="Notes" data-testid="tabs" />
        )}
      {['admin'].includes(user.userType) &&
        checkAllowedCommunityFeatures(user.community.features, 'Messages') && (
          <StyledTab
            label={t('common:misc.communication')}
            value="Communication"
            data-testid="tabs"
          />
        )}
      {!['security_guard', 'custodian'].includes(user.userType) &&
        checkAllowedCommunityFeatures(user.community.features, 'Properties') && (
          <StyledTab label={t('common:misc.plots')} value="Plots" data-testid="tabs" />
        )}
      {!['security_guard', 'custodian'].includes(user.userType) &&
        checkAllowedCommunityFeatures(user.community.features, 'Forms') && (
          <StyledTab label={t('common:misc.forms')} value="Forms" data-testid="tabs" />
        )}

      {loading ? <Spinner /> : null}
      {((!loading && user.userType === 'admin') || data?.userActivePlan) &&
      checkAllowedCommunityFeatures(user.community.features, 'Payments') ? (
        <StyledTab label={t('common:misc.payments')} value="Payments" data-testid="tabs" />
      ) : null}
      {((!loading && user.userType === 'admin') || data?.userActivePlan) &&
      checkAllowedCommunityFeatures(user.community.features, 'Payments') ? (
        <StyledTab label={t('common:misc.plans')} value="Plans" data-testid="tabs" />
      ) : null}
      {['admin'].includes(user.userType) &&
        checkAllowedCommunityFeatures(user.community.features, 'Customer Journey') && (
          <StyledTab
            label={t('common:menu.customer_journey')}
            value="CustomerJourney"
            data-testid="tabs"
          />
        )}
    </StyledTabs>
  );
}

UserStyledTabs.defaultProps = {
  tabValue: 'Contacts'
};
UserStyledTabs.propTypes = {
  tabValue: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object.isRequired
};
